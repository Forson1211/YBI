import crypto from "node:crypto";

/**
 * Paystack Payment Provider
 * Docs: https://paystack.com/docs/api
 *
 * To use: set PAYSTACK_SECRET_KEY in .env
 * Ghana (GHS) is natively supported.
 * Amounts are always in pesewas (GHS × 100).
 */


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";
const PAYSTACK_BASE = "https://api.paystack.co";

type PaystackInitResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number; // pesewas
    currency: string;
    customer: {
      email: string;
      phone?: string;
    };
    metadata?: Record<string, unknown>;
  };
};

/**
 * Initiate a Paystack payment. Returns the hosted checkout URL.
 */
export async function initiatePaystackPayment(opts: {
  email: string;
  amountPesewas: number;
  reference: string;
  currency?: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<{ checkoutUrl: string; reference: string } | { error: string }> {
  if (!PAYSTACK_SECRET_KEY) {
    console.warn("[Paystack] PAYSTACK_SECRET_KEY not set — returning mock checkout URL");
    return {
      checkoutUrl: `https://checkout.paystack.com/mock?ref=${opts.reference}`,
      reference: opts.reference,
    };
  }

  try {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: opts.email,
        amount: opts.amountPesewas,
        currency: opts.currency ?? "GHS",
        reference: opts.reference,
        callback_url: opts.callbackUrl,
        metadata: opts.metadata,
      }),
    });

    const data = (await res.json()) as PaystackInitResponse;
    if (!data.status || !data.data?.authorization_url) {
      return { error: data.message ?? "Unknown Paystack error" };
    }
    return {
      checkoutUrl: data.data.authorization_url,
      reference: data.data.reference,
    };
  } catch (err) {
    return { error: String(err) };
  }
}

/**
 * Verify a Paystack payment by reference.
 * Used in the webhook handler and on the return URL.
 */
export async function verifyPaystackPayment(reference: string): Promise<{
  success: boolean;
  amountPesewas?: number;
  email?: string;
  metadata?: Record<string, unknown>;
  error?: string;
}> {
  if (!PAYSTACK_SECRET_KEY) {
    // In dev / sandbox, always assume success
    return { success: true, amountPesewas: 0, email: "dev@test.com" };
  }

  try {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    const data = (await res.json()) as PaystackVerifyResponse;
    if (!data.status || data.data?.status !== "success") {
      return { success: false, error: data.message };
    }
    return {
      success: true,
      amountPesewas: data.data.amount,
      email: data.data.customer.email,
      metadata: data.data.metadata,
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Verify a Paystack webhook signature.
 * Call this first in the webhook handler to reject spoofed requests.
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY || "sk_test_mock_paystack_secret_key";
  if (!signatureHeader) return false;

  try {
    const expected = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");
    return expected.toLowerCase() === signatureHeader.toLowerCase();
  } catch (err) {
    console.error("[Paystack] Webhook signature verification error:", err);
    return false;
  }
}


