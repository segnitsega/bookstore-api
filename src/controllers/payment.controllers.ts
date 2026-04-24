import type { Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/apiError";
import prisma from "../lib/prisma";
import { getStripe } from "../lib/stripe";

const CLIENT_URL =
  process.env.CLIENT_URL?.replace(/\/$/, "") ?? "http://localhost:5173";

export const createCheckoutSession = catchAsync(
  async (req: any, res: Response, _next: NextFunction) => {
    const userId = req.user?.id as string | undefined;
    if (!userId) throw new ApiError(401, "Unauthorized");

    const stripe = getStripe();

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { book: true },
    });

    if (cartItems.length === 0) {
      throw new ApiError(400, "Your cart is empty");
    }

    const total = cartItems.reduce((sum, row) => sum + row.book.price, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "pending",
        orderItem: {
          create: cartItems.map((row) => ({
            bookId: row.bookId,
            quantity: 1,
            price: row.book.price,
          })),
        },
      },
    });

    const lineItems = cartItems.map((row) => ({
      price_data: {
        currency: "usd" as const,
        unit_amount: Math.round(row.book.price * 100),
        product_data: {
          name: row.book.title,
          description: row.book.author,
        },
      },
      quantity: 1,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${CLIENT_URL}/cart`,
        metadata: {
          orderId: order.id,
          userId,
        },
        client_reference_id: order.id,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

      res.status(200).json({
        url: session.url,
        sessionId: session.id,
        orderId: order.id,
      });
    } catch (err) {
      await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
      await prisma.order.delete({ where: { id: order.id } });
      throw err;
    }
  }
);

/**
 * Raw body + Stripe signature verification (register in server before express.json).
 */
export async function handleStripeWebhook(req: any, res: Response) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(500).send("STRIPE_WEBHOOK_SECRET is not configured");
    return;
  }

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    res.status(400).send("Missing stripe-signature header");
    return;
  }

  let event: ReturnType<ReturnType<typeof getStripe>["webhooks"]["constructEvent"]>;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).send(`Webhook signature verification failed: ${message}`);
    return;
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId =
        session.metadata?.orderId ?? session.client_reference_id ?? undefined;
      const userId = session.metadata?.userId;

      if (!orderId) {
        console.error("checkout.session.completed missing orderId metadata");
        res.status(200).json({ received: true });
        return;
      }

      await prisma.order.updateMany({
        where: { id: orderId, status: "pending" },
        data: { status: "paid" },
      });

      if (userId) {
        await prisma.cartItem.deleteMany({ where: { userId } });
      }
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error("Webhook handler error:", e);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}
