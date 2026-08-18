import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  SITE_IMAGE_SLOTS,
  extractSlotKeyFromContentKey,
  formatImageContentKey,
} from "@shared/siteImages";
import {
  createCommunityInquiry,
  getDashboardOverview,
  getTeamMemberBySlug,
  getSiteContent,
  listCommunityInquiries,
  listGalleryPhotos,
  listImpactMetrics,
  listNewsletterSubscribers,
  listOpportunities,
  listPrograms,
  listProgramSessions,
  listSiteContent,
  listTeamMembers,
  listUpdates,
  addNewsletterSubscriber,
  removeCommunityInquiry,
  removeGalleryPhoto,
  removeImpactMetric,
  removeNewsletterSubscriber,
  removeOpportunity,
  removeProgram,
  removeProgramSession,
  removeSiteContent,
  removeTeamMember,
  removeUpdate,
  saveImpactMetric,
  saveGalleryPhoto,
  saveOpportunity,
  saveProgram,
  saveProgramSession,
  saveTeamMember,
  saveUpdate,
  updateCommunityInquiry,
  upsertSiteContent,
} from "../db";
import { storagePut } from "../storage";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { QUICK_QUESTIONS_CONTENT_KEY, quickQuestionsInput, readQuickQuestions, visitorAssistantRouter } from "./assistant";
import { eventsAdminRouter, eventsPublicRouter } from "./events";
import { blogAdminRouter, blogPublicRouter } from "./blog";
import { donationsAdminRouter, donationsPublicRouter } from "./donations";
import { faqAdminRouter, faqPublicRouter } from "./faq";
import { smsAdminRouter } from "./sms";
import { paymentsRouter } from "./payments";

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

const communityInquiryInput = z.object({
  name: z.string().trim().min(2).max(140),
  email: z.string().trim().email().max(320),
  interest: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(5000),
});

const inquiryUpdateInput = z.object({
  id: z.number().int().positive(),
  status: z.enum(["new", "in_progress", "responded", "closed"]),
  adminNotes: z.string().trim().max(5000).nullable().optional(),
});

const sessionInput = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().trim().min(2).max(180),
  focusArea: z.string().trim().min(2).max(100),
  details: z.string().trim().min(10).max(5000),
  scheduledFor: z.string().datetime(),
  venue: z.string().trim().min(2).max(180),
  capacity: z.number().int().min(1).max(100000).nullable().optional(),
  status: z.enum(["draft", "published", "complete"]),
});

const opportunityInput = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(100),
  summary: z.string().trim().min(10).max(5000),
  commitment: z.string().trim().min(2).max(160),
  status: z.enum(["draft", "published", "closed"]),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

const impactMetricInput = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().trim().min(2).max(160),
  focusArea: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(5000),
  currentValue: z.number().int().min(0).max(10000000),
  targetValue: z.number().int().min(0).max(10000000).nullable().optional(),
  unit: z.string().trim().min(1).max(60),
  period: z.string().trim().min(2).max(100),
  status: z.enum(["active", "archived"]),
});

const siteImageInput = z.object({
  slotKey: z.string().trim().min(2).max(100),
  imageUrl: z.string().trim().min(2),
  altText: z.string().trim().max(300).optional(),
});

const siteImageUploadInput = z.object({
  slotKey: z.string().trim().min(2).max(100),
  fileName: z.string().trim().min(1).max(220),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]),
  base64: z.string().min(10),
  altText: z.string().trim().max(300).optional(),
});

const teamMemberInput = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(2).max(140),
  role: z.string().trim().min(2).max(100),
  bio: z.string().trim().min(10).max(3000),
  imageUrl: z.string().trim().max(600).default(""),
  email: z.string().trim().email().max(320).optional().or(z.literal("")),
  linkedIn: z.string().trim().max(300).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  isPublished: z.boolean().default(true),
});

const teamPortraitUploadInput = z.object({
  fileName: z.string().trim().min(1).max(220),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  base64: z.string().min(10),
});

const newsletterSubscriberInput = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().max(140).default(""),
});

const SOCIAL_LINKS_KEY = "settings:social-links";
const ANNOUNCEMENT_KEY = "settings:announcement";
const DONATION_KEY = "settings:donation-tracker";
const ADMIN_PASSWORD_KEY = "settings:admin-password";

export const publicSiteRouter = router({
  gallery: publicProcedure.query(() => listGalleryPhotos(false)),
  programs: publicProcedure.query(() => listPrograms(false)),
  updates: publicProcedure.query(() => listUpdates(false)),
  team: router({
    list: publicProcedure.query(() => listTeamMembers(false)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(180) })).query(({ input }) => getTeamMemberBySlug(input.slug, false)),
  }),
  content: publicProcedure.input(z.object({ contentKey: z.string().min(1).max(100) })).query(({ input }) => getSiteContent(input.contentKey)),
  events: eventsPublicRouter,
  blog: blogPublicRouter,
  donations: donationsPublicRouter,
  faq: faqPublicRouter,
  payments: paymentsRouter,
  siteImages: router({
    getAll: publicProcedure.query(async () => {
      const contentList = await listSiteContent();
      const overrides: Record<string, { src: string; alt: string }> = {};
      for (const item of contentList) {
        const slotKey = extractSlotKeyFromContentKey(item.contentKey);
        if (slotKey && item.body) {
          overrides[slotKey] = {
            src: item.body,
            alt: item.title || "",
          };
        }
      }
      return overrides;
    }),
  }),
  assistant: visitorAssistantRouter,
  contact: router({
    submit: publicProcedure.input(communityInquiryInput).mutation(({ input }) => createCommunityInquiry(input)),
  }),
  newsletter: router({
    subscribe: publicProcedure.input(newsletterSubscriberInput).mutation(({ input }) => addNewsletterSubscriber(input)),
  }),
  announcement: publicProcedure.query(async () => {
    const record = await getSiteContent(ANNOUNCEMENT_KEY);
    try { return record?.body ? JSON.parse(record.body) : null; } catch { return null; }
  }),
  donation: publicProcedure.query(async () => {
    const record = await getSiteContent(DONATION_KEY);
    try { return record?.body ? JSON.parse(record.body) : null; } catch { return null; }
  }),
  socialLinks: publicProcedure.query(async () => {
    const record = await getSiteContent(SOCIAL_LINKS_KEY);
    try { return record?.body ? JSON.parse(record.body) : {}; } catch { return {}; }
  }),
});

export const adminRouter = router({
  overview: adminProcedure.query(() => getDashboardOverview()),
  events: eventsAdminRouter,
  blog: blogAdminRouter,
  donations: donationsAdminRouter,
  faq: faqAdminRouter,
  sms: smsAdminRouter,
  siteImages: router({

    list: adminProcedure.query(async () => {
      const contentList = await listSiteContent();
      const contentMap = new Map(contentList.map(c => [c.contentKey, c]));
      return SITE_IMAGE_SLOTS.map(slot => {
        const key = formatImageContentKey(slot.key);
        const record = contentMap.get(key);
        return {
          ...slot,
          customSrc: record?.body || null,
          customAlt: record?.title || null,
          isCustomized: Boolean(record?.body),
          updatedAt: record?.updatedAt || null,
        };
      });
    }),
    save: adminProcedure.input(siteImageInput).mutation(async ({ input }) => {
      const slot = SITE_IMAGE_SLOTS.find(s => s.key === input.slotKey);
      await upsertSiteContent({
        contentKey: formatImageContentKey(input.slotKey),
        label: slot?.label || "Site Image",
        title: input.altText || slot?.defaultAlt || "",
        body: input.imageUrl,
      });
      return { success: true };
    }),
    upload: adminProcedure.input(siteImageUploadInput).mutation(async ({ input }) => {
      const file = Buffer.from(input.base64, "base64");
      if (file.length > 8 * 1024 * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Images must be 8 MB or smaller." });
      }
      let imageUrl = "";
      try {
        const { url } = await storagePut(`site-images/${input.slotKey}-${Date.now()}-${input.fileName}`, file, input.mimeType);
        imageUrl = url;
      } catch {
        imageUrl = `data:${input.mimeType};base64,${input.base64}`;
      }
      const slot = SITE_IMAGE_SLOTS.find(s => s.key === input.slotKey);
      await upsertSiteContent({
        contentKey: formatImageContentKey(input.slotKey),
        label: slot?.label || "Site Image",
        title: input.altText || slot?.defaultAlt || "",
        body: imageUrl,
      });
      return { success: true, imageUrl };
    }),
    reset: adminProcedure.input(z.object({ slotKey: z.string().min(1) })).mutation(async ({ input }) => {
      await removeSiteContent(formatImageContentKey(input.slotKey));
      return { success: true };
    }),
  }),
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
  assistantSettings: router({
    get: adminProcedure.query(() => readQuickQuestions()),
    save: adminProcedure.input(z.object({ questions: quickQuestionsInput })).mutation(({ input }) => upsertSiteContent({
      contentKey: QUICK_QUESTIONS_CONTENT_KEY,
      label: "YBI visitor assistant quick questions",
      title: "Quick questions",
      body: JSON.stringify(input.questions),
      actionLabel: null,
      actionHref: null,
    })),
  }),
  inquiries: router({
    list: adminProcedure.query(() => listCommunityInquiries()),
    save: adminProcedure.input(inquiryUpdateInput).mutation(({ input }) => updateCommunityInquiry(input)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeCommunityInquiry(input.id)),
  }),
  sessions: router({
    list: adminProcedure.query(() => listProgramSessions()),
    save: adminProcedure.input(sessionInput).mutation(({ input }) => saveProgramSession({ ...input, scheduledFor: new Date(input.scheduledFor) })),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeProgramSession(input.id)),
  }),
  opportunities: router({
    list: adminProcedure.query(() => listOpportunities()),
    save: adminProcedure.input(opportunityInput).mutation(({ input }) => saveOpportunity(input)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeOpportunity(input.id)),
  }),
  impact: router({
    list: adminProcedure.query(() => listImpactMetrics()),
    save: adminProcedure.input(impactMetricInput).mutation(({ input }) => saveImpactMetric(input)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeImpactMetric(input.id)),
    export: adminProcedure.query(async () => {
      const metrics = await listImpactMetrics();
      return metrics;
    }),
  }),
  team: router({
    list: adminProcedure.query(() => listTeamMembers()),
    save: adminProcedure.input(teamMemberInput).mutation(({ input }) => saveTeamMember(input as any)),
    uploadPortrait: adminProcedure.input(teamPortraitUploadInput).mutation(async ({ input }) => {
      const file = Buffer.from(input.base64, "base64");
      if (file.length > 5 * 1024 * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Portrait images must be 5 MB or smaller." });
      }
      const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
      const { url } = await storagePut(`team-members/${Date.now()}-${safeFileName}`, file, input.mimeType);
      return { imageUrl: url };
    }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeTeamMember(input.id)),
  }),
  newsletter: router({
    list: adminProcedure.query(() => listNewsletterSubscribers()),
    subscribe: publicProcedure.input(newsletterSubscriberInput).mutation(({ input }) => addNewsletterSubscriber(input)),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => removeNewsletterSubscriber(input.id)),
  }),
  settings: router({
    getSocialLinks: adminProcedure.query(async () => {
      const record = await getSiteContent(SOCIAL_LINKS_KEY);
      try { return record?.body ? JSON.parse(record.body) : {}; } catch { return {}; }
    }),
    saveSocialLinks: adminProcedure.input(z.object({
      facebook: z.string().trim().max(300).optional(),
      instagram: z.string().trim().max(300).optional(),
      twitter: z.string().trim().max(300).optional(),
      youtube: z.string().trim().max(300).optional(),
      linkedin: z.string().trim().max(300).optional(),
      tiktok: z.string().trim().max(300).optional(),
    })).mutation(({ input }) => upsertSiteContent({ contentKey: SOCIAL_LINKS_KEY, label: "Social media links", title: "Social Links", body: JSON.stringify(input) })),
    getAnnouncement: adminProcedure.query(async () => {
      const record = await getSiteContent(ANNOUNCEMENT_KEY);
      try { return record?.body ? JSON.parse(record.body) : null; } catch { return null; }
    }),
    saveAnnouncement: adminProcedure.input(z.object({
      message: z.string().trim().max(400),
      type: z.enum(["info", "warning", "success"]),
      isActive: z.boolean(),
      link: z.string().trim().max(300).optional(),
      linkLabel: z.string().trim().max(80).optional(),
    })).mutation(({ input }) => upsertSiteContent({ contentKey: ANNOUNCEMENT_KEY, label: "Site announcement banner", title: "Announcement", body: JSON.stringify(input) })),
    getDonation: adminProcedure.query(async () => {
      const record = await getSiteContent(DONATION_KEY);
      try { return record?.body ? JSON.parse(record.body) : null; } catch { return null; }
    }),
    saveDonation: adminProcedure.input(z.object({
      campaign: z.string().trim().min(2).max(200),
      goal: z.number().int().min(0),
      raised: z.number().int().min(0),
      currency: z.string().trim().max(10).default("GHS"),
      description: z.string().trim().max(600).optional(),
      isActive: z.boolean(),
    })).mutation(({ input }) => upsertSiteContent({ contentKey: DONATION_KEY, label: "Donation / fundraising tracker", title: "Donation Tracker", body: JSON.stringify(input) })),
    changePassword: adminProcedure.input(z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).max(100),
    })).mutation(async ({ input, ctx }) => {
      const storedHash = await getSiteContent(ADMIN_PASSWORD_KEY);
      const configuredPassword = process.env.ADMIN_PASSWORD || "ybi-admin-2026";
      const effectivePassword = storedHash?.body || configuredPassword;
      if (input.currentPassword !== effectivePassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect." });
      }
      await upsertSiteContent({ contentKey: ADMIN_PASSWORD_KEY, label: "Admin password override", title: "Admin Password", body: input.newPassword });
      return { success: true };
    }),
  }),
  export: router({
    inquiries: adminProcedure.query(async () => {
      const items = await listCommunityInquiries();
      return items.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        interest: i.interest,
        message: i.message,
        status: i.status,
        adminNotes: i.adminNotes || "",
        date: new Date(i.createdAt).toISOString().slice(0, 10),
      }));
    }),
    impactMetrics: adminProcedure.query(async () => {
      const items = await listImpactMetrics();
      return items.map(m => ({
        id: m.id,
        title: m.title,
        focusArea: m.focusArea,
        currentValue: m.currentValue,
        targetValue: m.targetValue || "",
        unit: m.unit,
        period: m.period,
        status: m.status,
      }));
    }),
    subscribers: adminProcedure.query(async () => {
      const items = await listNewsletterSubscribers();
      return items.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        date: new Date(s.createdAt).toISOString().slice(0, 10),
      }));
    }),
  }),
});
