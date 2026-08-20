import type { Express, Request, Response } from "express";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getEventById,
  listEventRegistrations,
  updateDonationPayment,
  updateEventRegistrationPayment,
} from "../db";
import {
  verifyPaystackPayment,
  verifyPaystackWebhookSignature,
} from "../shared/paystackProvider";
import { sendSms } from "../shared/smsProvider";

export function registerPaystackWebhook(app: Express) {
  const webhookHandler = async (req: Request, res: Response) => {
    const signature = (req.headers["x-paystack-signature"] as string) || "";
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const isValid = verifyPaystackWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[Paystack Webhook] Invalid signature rejected");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const payload = req.body;
    const eventType = payload?.event;
    const data = payload?.data;

    if (eventType === "charge.success" && data) {
      const reference = data.reference;
      const metadata = data.metadata || {};
      const amountGhs = data.amount ? Math.round(data.amount / 100) : 0;

      console.log(`[Paystack Webhook] Processing successful charge ${reference} (${amountGhs} GHS)`);

      // Event registration payment
      if (metadata.type === "event_registration" || reference?.startsWith("ybi_evt_")) {
        await updateEventRegistrationPayment(reference, "success");

        if (metadata.phone && metadata.smsOptIn) {
          const eventTitle = metadata.eventTitle || "the YBI event";
          const name = metadata.name || "friend";
          const msg = `Hello ${name}, your payment of GHS ${amountGhs} for "${eventTitle}" is confirmed! Thank you. - YBI`;
          sendSms(metadata.phone, msg).catch((err) =>
            console.error("[Paystack Webhook] SMS error:", err)
          );
        }
      }

      // Donation payment
      if (metadata.type === "donation" || reference?.startsWith("ybi_don_")) {
        await updateDonationPayment(reference, "success");

        if (metadata.phone) {
          const name = metadata.name || "Supporter";
          const msg = `Hello ${name}, thank you for your generous donation of GHS ${amountGhs} to Young Beginners Inspiration! - YBI`;
          sendSms(metadata.phone, msg).catch((err) =>
            console.error("[Paystack Webhook] SMS error:", err)
          );
        }
      }
    }

    return res.status(200).json({ status: true });
  };

  app.post("/api/webhooks/paystack", webhookHandler);
  app.post("/webhooks/paystack", webhookHandler);
}

export const paymentsRouter = router({
  verifyPayment: publicProcedure
    .input(z.object({ reference: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const verification = await verifyPaystackPayment(input.reference);
      if (!verification.success) {
        return {
          success: false,
          error: verification.error || "Payment could not be verified by Paystack.",
        };
      }

      const ref = input.reference;
      if (ref.startsWith("ybi_evt_")) {
        await updateEventRegistrationPayment(ref, "success");
        return {
          success: true,
          type: "event_registration",
          message: "Event registration payment successfully confirmed!",
        };
      }

      if (ref.startsWith("ybi_don_")) {
        await updateDonationPayment(ref, "success");
        return {
          success: true,
          type: "donation",
          message: "Donation successfully confirmed! Thank you for your support.",
        };
      }

      // Default: try to update both
      await Promise.all([
        updateEventRegistrationPayment(ref, "success"),
        updateDonationPayment(ref, "success"),
      ]);

      return {
        success: true,
        type: "unknown",
        message: "Payment successfully verified and recorded!",
      };
    }),
});
