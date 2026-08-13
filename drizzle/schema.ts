import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const galleryPhotos = mysqlTable("galleryPhotos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  altText: varchar("altText", { length: 240 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const programs = mysqlTable("programs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  summary: text("summary").notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const updates = mysqlTable("updates", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const siteContent = mysqlTable("siteContent", {
  id: int("id").autoincrement().primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 140 }).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  actionLabel: varchar("actionLabel", { length: 100 }),
  actionHref: varchar("actionHref", { length: 300 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const communityInquiries = mysqlTable("communityInquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  interest: varchar("interest", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "in_progress", "responded", "closed"]).default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const programSessions = mysqlTable("programSessions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  focusArea: varchar("focusArea", { length: 100 }).notNull(),
  details: text("details").notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  venue: varchar("venue", { length: 180 }).notNull(),
  capacity: int("capacity"),
  status: mysqlEnum("status", ["draft", "published", "complete"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  commitment: varchar("commitment", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["draft", "published", "closed"]).default("draft").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const impactMetrics = mysqlTable("impactMetrics", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  focusArea: varchar("focusArea", { length: 100 }).notNull(),
  description: text("description").notNull(),
  currentValue: int("currentValue").default(0).notNull(),
  targetValue: int("targetValue"),
  unit: varchar("unit", { length: 60 }).notNull(),
  period: varchar("period", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["active", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Update = typeof updates.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type CommunityInquiry = typeof communityInquiries.$inferSelect;
export type ProgramSession = typeof programSessions.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type ImpactMetric = typeof impactMetrics.$inferSelect;
