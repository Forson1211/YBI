import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  createSmsLog,
  listEventRegistrations,
  listNewsletterSubscribers,
  listSmsLogs,
} from "../db";
import { formatGhanaPhoneNumber, sendSmsBroadcast } from "../shared/smsProvider";

const broadcastTarget = z.enum(["newsletter", "events", "all", "custom"]);

const broadcastInput = z.object({
  message: z.string().trim().min(5).max(480), // up to 3 SMS segments
  target: broadcastTarget,
  customPhones: z.array(z.string().trim().min(7).max(30)).optional(),
});

export const smsAdminRouter = router({
  getLogs: adminProcedure.query(async () => {
    return listSmsLogs();
  }),

  sendBroadcast: adminProcedure
    .input(broadcastInput)
    .mutation(async ({ input }) => {
      let recipientPhones: string[] = [];

      if (input.target === "custom") {
        recipientPhones = (input.customPhones || []).map(formatGhanaPhoneNumber);
      } else if (input.target === "newsletter") {
        const subscribers = await listNewsletterSubscribers();
        recipientPhones = subscribers
          .filter((s) => s.smsOptIn && s.phone && s.phone.trim().length >= 7)
          .map((s) => formatGhanaPhoneNumber(s.phone!.trim()));
      } else if (input.target === "events") {
        const registrations = await listEventRegistrations();
        recipientPhones = registrations
          .filter((r) => r.smsOptIn && r.phone && r.phone.trim().length >= 7)
          .map((r) => formatGhanaPhoneNumber(r.phone.trim()));
      }
 else if (input.target === "all") {
        const [subscribers, registrations] = await Promise.all([
          listNewsletterSubscribers(),
          listEventRegistrations(),
        ]);
        const phones = new Set<string>();
        subscribers.forEach((s) => {
          if (s.smsOptIn && s.phone && s.phone.trim().length >= 7) {
            phones.add(s.phone.trim());
          }
        });
        registrations.forEach((r) => {
          if (r.smsOptIn && r.phone && r.phone.trim().length >= 7) {
            phones.add(r.phone.trim());
          }
        });
        recipientPhones = Array.from(phones);
      }

      // Deduplicate
      const uniquePhones = Array.from(new Set(recipientPhones.filter(Boolean)));

      if (uniquePhones.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No valid recipient phone numbers found for the selected target group.",
        });
      }

      const result = await sendSmsBroadcast(uniquePhones, input.message);

      // Record logs for recipients
      await Promise.all(
        uniquePhones.map((phone) =>
          createSmsLog({
            recipientPhone: phone,
            message: input.message,
            provider: "africastalking",
            status: result.failed > 0 && result.sent === 0 ? "failed" : "sent",
          })
        )
      );

      return {
        recipientsCount: uniquePhones.length,
        sent: result.sent,
        failed: result.failed,
      };
    }),
});

export const smsRouter = router({
  admin: smsAdminRouter,
});

