import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { formatGhanaPhoneNumber } from "./shared/smsProvider";

describe("SMS Gateway & Broadcast Hub", () => {
  const adminCaller = appRouter.createCaller({
    user: { openId: "admin-1", role: "admin", name: "Admin" },
  } as any);

  it("normalizes Ghanaian phone numbers into international E.164 format", () => {
    expect(formatGhanaPhoneNumber("0241234567")).toBe("+233241234567");
    expect(formatGhanaPhoneNumber("233501234567")).toBe("+233501234567");
    expect(formatGhanaPhoneNumber("+233 24 123 4567")).toBe("+233241234567");
    expect(formatGhanaPhoneNumber("055-123-4567")).toBe("+233551234567");
  });

  it("sends broadcast to custom recipient numbers and writes delivery logs", async () => {
    const broadcastResult = await adminCaller.admin.sms.sendBroadcast({
      message: "YBI Announcement: Join us for this Saturday's Intergenerational Circle!",
      target: "custom",
      customPhones: ["0241234567", "0509876543"],
    });

    expect(broadcastResult).toBeDefined();
    expect(broadcastResult.recipientsCount).toBe(2);
    expect(broadcastResult.sent).toBe(2);
    expect(broadcastResult.failed).toBe(0);

    const logs = await adminCaller.admin.sms.getLogs();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThanOrEqual(2);

    const customLogs = logs.filter((l) =>
      l.recipientPhone === "+233241234567" || l.recipientPhone === "+233509876543"
    );
    expect(customLogs.length).toBe(2);
    expect(customLogs[0].status).toBe("sent");

  });
});
