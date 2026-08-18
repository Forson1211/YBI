import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createEventRegistration,
  getEventById,
  getEventBySlug,
  listEventRegistrations,
  listEvents,
  removeEvent,
  saveEvent,
} from "../db";
import { initiatePaystackPayment } from "../shared/paystackProvider";
import { sendSms } from "../shared/smsProvider";

const eventStatus = z.enum(["draft", "published", "cancelled"]);

const eventInput = z.object({
  id: z.number().int().positive().optional(),
  slug: z.string().trim().min(2).max(200),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().min(10).max(10000),
  imageUrl: z.string().trim().max(25000000).nullable().optional(),
  scheduledFor: z.string().datetime(),
  location: z.string().trim().min(2).max(240),
  capacity: z.number().int().min(1).max(100000).nullable().optional(),
  isFree: z.boolean().default(true),
  priceGhs: z.number().int().min(0).default(0), // in pesewas
  status: eventStatus,
});

const registrationInput = z.object({
  eventId: z.number().int().positive(),
  name: z.string().trim().min(2).max(140),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(30),
  smsOptIn: z.boolean().default(false),
  callbackUrl: z.string().url().optional(),
});

export const eventsAdminRouter = router({
  list: adminProcedure.query(async () => {
    return listEvents(true);
  }),

  save: adminProcedure.input(eventInput).mutation(async ({ input }) => {
    return saveEvent({
      ...input,
      scheduledFor: new Date(input.scheduledFor),
    });
  }),

  remove: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return removeEvent(input.id);
    }),

  registrations: adminProcedure
    .input(z.object({ eventId: z.number().int().positive().optional() }))
    .query(async ({ input }) => {
      return listEventRegistrations(input.eventId);
    }),

  exportRegistrations: adminProcedure
    .input(z.object({ eventId: z.number().int().positive().optional() }))
    .query(async ({ input }) => {
      const items = await listEventRegistrations(input.eventId);
      const allEvents = await listEvents(true);
      const eventMap = new Map(allEvents.map((e) => [e.id, e.title]));

      return items.map((r) => ({
        id: r.id,
        event: eventMap.get(r.eventId) || `Event #${r.eventId}`,
        name: r.name,
        email: r.email,
        phone: r.phone,
        smsOptIn: r.smsOptIn ? "Yes" : "No",
        paymentStatus: r.paymentStatus,
        isWaitlist: r.isWaitlist ? "Yes" : "No",
        date: new Date(r.createdAt).toISOString().slice(0, 10),
      }));
    }),
});

export const eventsPublicRouter = router({
  list: publicProcedure.query(async () => {
    return listEvents(false);
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const event = await getEventBySlug(input.slug);
      if (!event || event.status !== "published") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found." });
      }
      const registrations = await listEventRegistrations(event.id);
      const confirmedCount = registrations.filter(
        (r) => r.paymentStatus === "success" || r.paymentStatus === "free"
      ).length;
      const isSoldOut = event.capacity ? confirmedCount >= event.capacity : false;

      return {
        ...event,
        confirmedCount,
        isSoldOut,
      };
    }),

  register: publicProcedure
    .input(registrationInput)
    .mutation(async ({ input }) => {
      const event = await getEventById(input.eventId);
      if (!event || event.status !== "published") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found or registration closed." });
      }

      const registrations = await listEventRegistrations(event.id);
      const confirmedCount = registrations.filter(
        (r) => r.paymentStatus === "success" || r.paymentStatus === "free"
      ).length;
      const isSoldOut = event.capacity ? confirmedCount >= event.capacity : false;

      // If event is free or sold out (waitlist)
      if (event.isFree || isSoldOut) {
        const regId = await createEventRegistration({
          eventId: event.id,
          name: input.name,
          email: input.email,
          phone: input.phone,
          smsOptIn: input.smsOptIn,
          paymentStatus: event.isFree ? "free" : "pending",
          isWaitlist: isSoldOut,
          confirmedAt: event.isFree && !isSoldOut ? new Date() : null,
        });

        if (input.smsOptIn && input.phone) {
          const msg = isSoldOut
            ? `Hello ${input.name}, you have been added to the waitlist for "${event.title}". We will notify you if a slot opens up. - YBI`
            : `Hello ${input.name}, your registration for "${event.title}" on ${new Date(event.scheduledFor).toLocaleDateString()} is confirmed! Venue: ${event.location}. - YBI`;
          sendSms(input.phone, msg).catch(console.error);
        }

        return {
          success: true,
          isWaitlist: isSoldOut,
          registrationId: regId,
          checkoutUrl: null,
        };
      }

      // Paid event -> Initiate Paystack checkout
      const paystackRef = `ybi_evt_${event.id}_${Date.now()}_${nanoid(6)}`;
      await createEventRegistration({
        eventId: event.id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        smsOptIn: input.smsOptIn,
        paystackRef,
        paymentStatus: "pending",
        isWaitlist: false,
      });

      const callbackUrl =
        input.callbackUrl ||
        (process.env.APP_URL
          ? `${process.env.APP_URL}/events/${event.slug}?ref=${paystackRef}`
          : `http://localhost:3000/events/${event.slug}?ref=${paystackRef}`);

      const paystackRes = await initiatePaystackPayment({
        email: input.email,
        amountPesewas: event.priceGhs,
        reference: paystackRef,
        callbackUrl,
        metadata: {
          type: "event_registration",
          eventId: event.id,
          eventTitle: event.title,
          name: input.name,
          phone: input.phone,
          smsOptIn: input.smsOptIn,
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
        isWaitlist: false,
        checkoutUrl: paystackRes.checkoutUrl,
        reference: paystackRef,
      };
    }),
});

export const eventsRouter = eventsPublicRouter;

