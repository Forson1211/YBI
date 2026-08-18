import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const galleryPhotos = pgTable("galleryPhotos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  altText: varchar("altText", { length: 240 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const programStatusEnum = pgEnum("program_status", ["draft", "published"]);

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  summary: text("summary").notNull(),
  status: programStatusEnum("status").default("draft").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const contentStatusEnum = pgEnum("content_status", ["draft", "published"]);

export const updates = pgTable("updates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  status: contentStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const siteContent = pgTable("siteContent", {
  id: serial("id").primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 140 }).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  actionLabel: varchar("actionLabel", { length: 100 }),
  actionHref: varchar("actionHref", { length: 300 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "in_progress",
  "responded",
  "closed",
]);

export const communityInquiries = pgTable("communityInquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  interest: varchar("interest", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const sessionStatusEnum = pgEnum("session_status", [
  "draft",
  "published",
  "complete",
]);

export const programSessions = pgTable("programSessions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  focusArea: varchar("focusArea", { length: 100 }).notNull(),
  details: text("details").notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  venue: varchar("venue", { length: 180 }).notNull(),
  capacity: integer("capacity"),
  status: sessionStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "draft",
  "published",
  "closed",
]);

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  commitment: varchar("commitment", { length: 160 }).notNull(),
  status: opportunityStatusEnum("status").default("draft").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const impactStatusEnum = pgEnum("impact_status", ["active", "archived"]);

export const impactMetrics = pgTable("impactMetrics", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  focusArea: varchar("focusArea", { length: 100 }).notNull(),
  description: text("description").notNull(),
  currentValue: integer("currentValue").default(0).notNull(),
  targetValue: integer("targetValue"),
  unit: varchar("unit", { length: 60 }).notNull(),
  period: varchar("period", { length: 100 }).notNull(),
  status: impactStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Phase 2: Events & Registrations ──────────────────────────────────────

export const eventStatusEnum = pgEnum("event_status", ["draft", "published", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed", "free"]);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl"),
  scheduledFor: timestamp("scheduledFor").notNull(),
  location: varchar("location", { length: 240 }).notNull(),
  capacity: integer("capacity"),
  isFree: boolean("isFree").default(true).notNull(),
  priceGhs: integer("priceGhs").default(0).notNull(), // stored in pesewas (GHS × 100)
  status: eventStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const eventRegistrations = pgTable("eventRegistrations", {
  id: serial("id").primaryKey(),
  eventId: integer("eventId").notNull(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  smsOptIn: boolean("smsOptIn").default(false).notNull(),
  paystackRef: varchar("paystackRef", { length: 100 }),
  paymentStatus: paymentStatusEnum("paymentStatus").default("pending").notNull(),
  isWaitlist: boolean("isWaitlist").default(false).notNull(),
  confirmedAt: timestamp("confirmedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Phase 2: Blog Posts ───────────────────────────────────────────────────

export const blogStatusEnum = pgEnum("blog_status", ["draft", "published"]);

export const blogPosts = pgTable("blogPosts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  authorName: varchar("authorName", { length: 120 }).notNull(),
  coverImageUrl: text("coverImageUrl"),
  category: varchar("category", { length: 80 }).notNull(),
  status: blogStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Phase 2: Donations ────────────────────────────────────────────────────

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  amountGhs: integer("amountGhs").notNull(), // stored in pesewas
  message: text("message"),
  paystackRef: varchar("paystackRef", { length: 100 }),
  paymentStatus: paymentStatusEnum("paymentStatus").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Phase 2: FAQ ──────────────────────────────────────────────────────────

export const faqItems = pgTable("faqItems", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Phase 2: Newsletter Subscribers (with SMS opt-in) ────────────────────

export const newsletterSubscribers = pgTable("newsletterSubscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 140 }),
  phone: varchar("phone", { length: 30 }),
  smsOptIn: boolean("smsOptIn").default(false).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
});

// ─── Phase 2: SMS Logs ─────────────────────────────────────────────────────

export const smsLogs = pgTable("smsLogs", {
  id: serial("id").primaryKey(),
  recipientPhone: varchar("recipientPhone", { length: 30 }).notNull(),
  message: text("message").notNull(),
  provider: varchar("provider", { length: 40 }).default("africastalking").notNull(),
  status: varchar("status", { length: 40 }).default("queued").notNull(),
  providerRef: varchar("providerRef", { length: 100 }),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

// ─── Team Members ──────────────────────────────────────────────────────────

export const teamMembers = pgTable("teamMembers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("imageUrl").default("").notNull(),
  email: varchar("email", { length: 320 }),
  linkedIn: varchar("linkedIn", { length: 300 }),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Type exports ──────────────────────────────────────────────────────────

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Update = typeof updates.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type CommunityInquiry = typeof communityInquiries.$inferSelect;
export type ProgramSession = typeof programSessions.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type ImpactMetric = typeof impactMetrics.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;

export type Event = typeof events.$inferSelect;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type FaqItem = typeof faqItems.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type SmsLog = typeof smsLogs.$inferSelect;

