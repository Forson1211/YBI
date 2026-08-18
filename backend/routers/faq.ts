import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { listFaqItems, removeFaqItem, saveFaqItem } from "../db";

const faqInput = z.object({
  id: z.number().int().positive().optional(),
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(5000),
  category: z.string().trim().min(2).max(80).default("General"),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  isPublished: z.boolean().default(true),
});

export const faqAdminRouter = router({
  list: adminProcedure.query(async () => {
    return listFaqItems(true);
  }),

  save: adminProcedure.input(faqInput).mutation(async ({ input }) => {
    return saveFaqItem(input);
  }),

  remove: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return removeFaqItem(input.id);
    }),
});

export const faqPublicRouter = router({
  list: publicProcedure.query(async () => {
    return listFaqItems(false);
  }),
});

export const faqRouter = faqPublicRouter;

