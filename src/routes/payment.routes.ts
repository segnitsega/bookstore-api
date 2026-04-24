import express from "express";
import { createCheckoutSession } from "../controllers/payment.controllers";
import { verifyToken } from "../utils/verify-token";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  verifyToken,
  createCheckoutSession
);

export default paymentRouter;
