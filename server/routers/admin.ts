import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getDashboardOverview,
  getSiteContent,
  listGalleryPhotos,
  listPrograms,
  listSiteContent,
  listUpdates,
  removeGalleryPhoto,
  removeProgram,
  removeUpdate,
  saveGalleryPhoto,
  saveProgram,
  saveUpdate,
  upsertSiteContent,
} from "../db";
import { storagePut } from "../storage";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const contentStatus = z.enum(["draft", "published"]);
const imageInput = z.object({
  title: z.string().trim().min(2).max(160),
  altText: z.string().trim().min(3).max(240),
  fileName: z.string().trim().min(1).max(220),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  base64: z.string().min(10),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

const programInput = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(80),
  summary: z.string().trim().min(10).max(3000),
  status: contentStatus,
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

const updateInput = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().trim().min(2).max(180),
  excerpt: z.string().trim().min(10).max(1200),
  body: z.string().trim().min(10).max(12000),
  status: contentStatus,
});

const siteContentInput = z.object({
  contentKey: z.string().trim().min(2).max(100),
  label: z.string().trim().min(2).max(140),
  title: z.string().trim().min(2).max(4000),
  body: z.string().trim().min(2).max(12000),
  actionLabel: z.string().trim().max(100).nullable().optional(),
  actionHref: z.string().trim().max(300).nullable().optional(),
});

export const publicSiteRouter = router({
  gallery: publicProcedure.query(() => listGalleryPhotos(false)),
  programs: publicProcedure.query(() => listPrograms(false)),
  updates: publicProcedure.query(() => listUpdates(false)),
  content: publicProcedure.input(z.object({ contentKey: z.string().min(1).max(100) })).query(({ input }) => getSiteContent(input.contentKey)),
});

export const adminRouter = router({
  overview: adminProcedure.query(() => getDashboardOverview()),
  gallery: router({
    list: adminProcedure.query(() => listGalleryPhotos(true)),
    upload: adminProcedure.input(imageInput).mutation(async ({ input }) => {
      const file = Buffer.from(input.base64, "base64");
      if (file.length > 5 * 1024 * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Images must be 5 MB or smaller." });
      }
      const { key, url } = await storagePut(`gallery/${Date.now()}-${input.fileName}`, file, input.mimeType);
      return saveGalleryPhoto({ ...input, imageUrl: url, storageKey: key });
    }),
    save: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      title: z.string().trim().min(2).max(160),
      altText: z.string().trim().min(3).max(240),
      isPublished: z.boolean(),
      sortOrder: z.number().int().min(0).max(9999),
    })).mutation(({ input }) => saveGalleryPhoto(input)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeGalleryPhoto(input.id)),
  }),
  programs: router({
    list: adminProcedure.query(() => listPrograms(true)),
    save: adminProcedure.input(programInput).mutation(({ input }) => saveProgram(input)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeProgram(input.id)),
  }),
  updates: router({
    list: adminProcedure.query(() => listUpdates(true)),
    save: adminProcedure.input(updateInput).mutation(({ input }) => saveUpdate(input)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeUpdate(input.id)),
  }),
  content: router({
    list: adminProcedure.query(() => listSiteContent()),
    save: adminProcedure.input(siteContentInput).mutation(({ input }) => upsertSiteContent(input)),
  }),
});
