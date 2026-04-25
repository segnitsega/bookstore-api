import type { Request, Response, NextFunction } from "express";
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

    for (const row of cartItems) {
      if (row.book.stock <= 0) {
        throw new ApiError(
          400,
          `"${row.book.title}" is out of stock. Please remove it from your cart.`
        );
      }
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
        expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
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
 * Lookup an order by Stripe Checkout session id (for the success page).
 * Public read by session id is acceptable here because session ids are unguessable
 * Stripe-issued tokens, but we still scope it to the authenticated user.
 */
export const getOrderBySessionId = catchAsync(
  async (req: any, res: Response, _next: NextFunction) => {
    const userId = req.user?.id as string | undefined;
    const sessionId = req.params.sessionId as string;

    if (!userId) throw new ApiError(401, "Unauthorized");
    if (!sessionId) throw new ApiError(400, "Missing session id");

    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        orderItem: { include: { book: true } },
      },
    });

    if (!order || order.userId !== userId) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json({ order });
  }
);

/* ------------------------- Webhook ------------------------- */

type StripeEvent = ReturnType<
  ReturnType<typeof getStripe>["webhooks"]["constructEvent"]
>;

async function markOrderPaid(orderId: string, userId?: string) {
  await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id: orderId, status: "pending" },
      data: { status: "paid" },
    });

    if (updated.count === 0) {
      // Already paid (or not pending): skip side effects to stay idempotent.
      return;
    }

    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      await tx.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (userId) {
      await tx.cartItem.deleteMany({ where: { userId } });
    }
  });
}

async function markOrderExpired(orderId: string) {
  await prisma.order.updateMany({
    where: { id: orderId, status: "pending" },
    data: { status: "expired" },
  });
}

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    res.status(500).send("STRIPE_WEBHOOK_SECRET is not configured");
    return;
  }

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    res.status(400).send("Missing stripe-signature header");
    return;
  }

  let event: StripeEvent;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature failed:", message);
    res.status(400).send(`Webhook signature verification failed: ${message}`);
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId =
          session.metadata?.orderId ??
          session.client_reference_id ??
          undefined;
        const userId = session.metadata?.userId ?? undefined;

        if (!orderId) {
          console.error("checkout.session.completed missing orderId metadata");
          break;
        }

        // Stripe sends async payments via this event with payment_status === "paid".
        // For card flows (sync), payment_status is "paid" by the time we get here.
        if (session.payment_status === "paid") {
          await markOrderPaid(orderId, userId);
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const orderId =
          session.metadata?.orderId ??
          session.client_reference_id ??
          undefined;
        const userId = session.metadata?.userId ?? undefined;
        if (orderId) await markOrderPaid(orderId, userId);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId =
          session.metadata?.orderId ??
          session.client_reference_id ??
          undefined;
        if (orderId) await markOrderExpired(orderId);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const orderId =
          session.metadata?.orderId ??
          session.client_reference_id ??
          undefined;
        if (orderId) {
          await prisma.order.updateMany({
            where: { id: orderId, status: "pending" },
            data: { status: "failed" },
          });
        }
        break;
      }

      default:
        // Unhandled event types are fine; just acknowledge so Stripe stops retrying.
        break;
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error("Webhook handler error:", e);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};
