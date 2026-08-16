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

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Update = typeof updates.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type CommunityInquiry = typeof communityInquiries.$inferSelect;
export type ProgramSession = typeof programSessions.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type ImpactMetric = typeof impactMetrics.$inferSelect;
