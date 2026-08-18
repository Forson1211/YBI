import { describe, expect, it } from "vitest";
import crypto from "node:crypto";
import { verifyPaystackWebhookSignature } from "./shared/paystackProvider";
import { appRouter } from "./routers";

describe("Paystack Payment Integration & Webhook Verification", () => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_mock_paystack_secret_key";

  it("correctly verifies valid HMAC-SHA512 webhook signatures", () => {
    const rawPayload = JSON.stringify({
      event: "charge.success",
      data: {
        reference: "ybi_evt_test_12345",
        amount: 5000,
        currency: "GHS",
        status: "success",
        customer: { email: "attendee@example.com" },
        metadata: {
          type: "event_registration",
          registrationId: 101,
          eventId: 1,
        },
      },
    });

    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawPayload)
      .digest("hex");

    const isValid = verifyPaystackWebhookSignature(rawPayload, expectedSignature);
    expect(isValid).toBe(true);

    const isInvalid = verifyPaystackWebhookSignature(rawPayload, "invalid_signature_hex_code");
    expect(isInvalid).toBe(false);
  });

  it("allows verification of payments via paymentsRouter.verifyPayment", async () => {
    const publicCaller = appRouter.createCaller({ user: null } as any);
    const result = await publicCaller.publicSite.payments.verifyPayment({
      reference: "ybi_mock_ref_99999",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBeTruthy();
  });
});

