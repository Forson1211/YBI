import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createDonation,
  listDonations,
  updateDonationPayment,
} from "../db";
import {
  initiatePaystackPayment,
  verifyPaystackPayment,
} from "../shared/paystackProvider";
import { sendSms } from "../shared/smsProvider";

const donationInput = z.object({
  name: z.string().trim().min(2).max(140),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(30).optional(),
  amountGhs: z.number().int().min(1).max(500000), // amount in GHS
  message: z.string().trim().max(1000).optional(),
  callbackUrl: z.string().url().optional(),
});

export const donationsAdminRouter = router({
  list: adminProcedure.query(async () => {
    return listDonations();
  }),

  summary: adminProcedure.query(async () => {
    const all = await listDonations();
    const successful = all.filter((d) => d.paymentStatus === "success");
    const totalPesewas = successful.reduce((sum, d) => sum + d.amountGhs, 0);
    return {
      totalGhs: Math.round(totalPesewas / 100),
      donationCount: successful.length,
      pendingCount: all.filter((d) => d.paymentStatus === "pending").length,
    };
  }),

  export: adminProcedure.query(async () => {
    const all = await listDonations();
    return all.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone || "",
      amountGhs: (d.amountGhs / 100).toFixed(2),
      paymentStatus: d.paymentStatus,
      paystackRef: d.paystackRef || "",
      message: d.message || "",
      date: new Date(d.createdAt).toISOString().slice(0, 10),
    }));
  }),
});

export const donationsPublicRouter = router({
  initiate: publicProcedure
    .input(donationInput)
    .mutation(async ({ input }) => {
      const amountPesewas = input.amountGhs * 100;
      const paystackRef = `ybi_don_${Date.now()}_${nanoid(6)}`;

      await createDonation({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        amountGhs: amountPesewas,
        message: input.message || null,
        paystackRef,
        paymentStatus: "pending",
      });

      const baseUrl =
        process.env.APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
        "http://localhost:3000";

      const callbackUrl =
        input.callbackUrl ||
        `${baseUrl}/get-involved?don_ref=${paystackRef}`;

      const paystackRes = await initiatePaystackPayment({
        email: input.email,
        amountPesewas,
        reference: paystackRef,
        callbackUrl,
        metadata: {
          type: "donation",
          name: input.name,
          phone: input.phone,
          message: input.message,
          amountGhs: input.amountGhs,
        },
      });

      if ("error" in paystackRes) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Payment gateway error: ${paystackRes.error}`,
        });
      }

      return {
        success: true,
        checkoutUrl: paystackRes.checkoutUrl,
        reference: paystackRef,
      };
    }),

  verifyPayment: publicProcedure
    .input(z.object({ reference: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const verification = await verifyPaystackPayment(input.reference);
      if (verification.success) {
        await updateDonationPayment(input.reference, "success");
        return { success: true, message: "Donation successfully confirmed! Thank you." };
      }
      return { success: false, error: verification.error || "Payment verification failed." };
    }),
});

export const donationsRouter = donationsPublicRouter;

