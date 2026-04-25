import express from "express";
import {
  createCheckoutSession,
  getOrderBySessionId,
} from "../controllers/payment.controllers";
import { verifyToken } from "../utils/verify-token";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  verifyToken,
  createCheckoutSession
);

paymentRouter.get("/session/:sessionId", verifyToken, getOrderBySessionId);

export default paymentRouter;
