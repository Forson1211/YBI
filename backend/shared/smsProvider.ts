/**
 * Africa's Talking SMS Provider
 * Docs: https://developers.africastalking.com/docs/sms/sending
 *
 * To use: set AT_API_KEY and AT_USERNAME in .env
 * In sandbox mode set AT_USERNAME=sandbox and use the AT sandbox API key.
 */

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const AT_API_KEY = process.env.AT_API_KEY ?? "";
const AT_USERNAME = process.env.AT_USERNAME ?? "sandbox";
const AT_SENDER_ID = process.env.AT_SENDER_ID ?? "YBI";

const AT_BASE_URL =
  AT_USERNAME === "sandbox"
    ? "https://api.sandbox.africastalking.com/version1"
    : "https://api.africastalking.com/version1";

/**
 * Send a single SMS via Africa's Talking.
 */
export async function sendSms(to: string, message: string): Promise<SmsResult> {
  if (
    !AT_API_KEY ||
    AT_API_KEY.includes("mock") ||
    AT_API_KEY.includes("placeholder") ||
    process.env.NODE_ENV === "test"
  ) {
    return { success: true, messageId: "mock-" + Date.now() };
  }


  try {
    const body = new URLSearchParams({
      username: AT_USERNAME,
      to,
      message,
      from: AT_SENDER_ID,
    });

    const res = await fetch(`${AT_BASE_URL}/messaging`, {
      method: "POST",
      headers: {
        apiKey: AT_API_KEY,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[SMS] Africa's Talking error:", text);
      return { success: false, error: text };
    }

    const data = (await res.json()) as {
      SMSMessageData?: { Recipients?: { messageId: string; statusCode: number }[] };
    };
    const recipient = data?.SMSMessageData?.Recipients?.[0];
    if (recipient && recipient.statusCode === 101) {
      return { success: true, messageId: recipient.messageId };
    }
    return { success: false, error: JSON.stringify(data) };
  } catch (err) {
    console.error("[SMS] Unexpected error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send SMS to multiple recipients (batched — AT allows comma-separated `to`).
 */
export async function sendSmsBroadcast(
  phones: string[],
  message: string
): Promise<{ sent: number; failed: number }> {
  if (phones.length === 0) return { sent: 0, failed: 0 };

  // AT accepts up to ~100 numbers per request; chunk if needed
  const chunks: string[][] = [];
  for (let i = 0; i < phones.length; i += 100) {
    chunks.push(phones.slice(i, i + 100));
  }

  let sent = 0;
  let failed = 0;
  for (const chunk of chunks) {
    const result = await sendSms(chunk.join(","), message);
    if (result.success) sent += chunk.length;
    else failed += chunk.length;
  }
  return { sent, failed };
}

/**
 * Format a phone number into international E.164 format (+233 for Ghana).
 */
export function formatGhanaPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("233")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+233${cleaned.slice(1)}`;
  return `+233${cleaned}`;
}

