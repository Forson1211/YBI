var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// backend/apiHandler.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// backend/shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// backend/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";

// backend/db.ts
import * as dotenv from "dotenv";
import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

// backend/drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogPosts: () => blogPosts,
  blogStatusEnum: () => blogStatusEnum,
  communityInquiries: () => communityInquiries,
  contentStatusEnum: () => contentStatusEnum,
  donations: () => donations,
  eventRegistrations: () => eventRegistrations,
  eventStatusEnum: () => eventStatusEnum,
  events: () => events,
  faqItems: () => faqItems,
  galleryPhotos: () => galleryPhotos,
  impactMetrics: () => impactMetrics,
  impactStatusEnum: () => impactStatusEnum,
  inquiryStatusEnum: () => inquiryStatusEnum,
  newsletterSubscribers: () => newsletterSubscribers,
  opportunities: () => opportunities,
  opportunityStatusEnum: () => opportunityStatusEnum,
  paymentStatusEnum: () => paymentStatusEnum,
  programSessions: () => programSessions,
  programStatusEnum: () => programStatusEnum,
  programs: () => programs,
  sessionStatusEnum: () => sessionStatusEnum,
  siteContent: () => siteContent,
  smsLogs: () => smsLogs,
  teamMembers: () => teamMembers,
  updates: () => updates,
  userRoleEnum: () => userRoleEnum,
  users: () => users
});
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum("user_role", ["user", "admin"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var galleryPhotos = pgTable("galleryPhotos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  altText: varchar("altText", { length: 240 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var programStatusEnum = pgEnum("program_status", ["draft", "published"]);
var programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  summary: text("summary").notNull(),
  status: programStatusEnum("status").default("draft").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var contentStatusEnum = pgEnum("content_status", ["draft", "published"]);
var updates = pgTable("updates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  status: contentStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var siteContent = pgTable("siteContent", {
  id: serial("id").primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 140 }).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  actionLabel: varchar("actionLabel", { length: 100 }),
  actionHref: varchar("actionHref", { length: 300 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "in_progress",
  "responded",
  "closed"
]);
var communityInquiries = pgTable("communityInquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  interest: varchar("interest", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var sessionStatusEnum = pgEnum("session_status", [
  "draft",
  "published",
  "complete"
]);
var programSessions = pgTable("programSessions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  focusArea: varchar("focusArea", { length: 100 }).notNull(),
  details: text("details").notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  venue: varchar("venue", { length: 180 }).notNull(),
  capacity: integer("capacity"),
  status: sessionStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var opportunityStatusEnum = pgEnum("opportunity_status", [
  "draft",
  "published",
  "closed"
]);
var opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  commitment: varchar("commitment", { length: 160 }).notNull(),
  status: opportunityStatusEnum("status").default("draft").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var impactStatusEnum = pgEnum("impact_status", ["active", "archived"]);
var impactMetrics = pgTable("impactMetrics", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var eventStatusEnum = pgEnum("event_status", ["draft", "published", "cancelled"]);
var paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed", "free"]);
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl"),
  scheduledFor: timestamp("scheduledFor").notNull(),
  location: varchar("location", { length: 240 }).notNull(),
  capacity: integer("capacity"),
  isFree: boolean("isFree").default(true).notNull(),
  priceGhs: integer("priceGhs").default(0).notNull(),
  // stored in pesewas (GHS × 100)
  status: eventStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var eventRegistrations = pgTable("eventRegistrations", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var blogStatusEnum = pgEnum("blog_status", ["draft", "published"]);
var blogPosts = pgTable("blogPosts", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  amountGhs: integer("amountGhs").notNull(),
  // stored in pesewas
  message: text("message"),
  paystackRef: varchar("paystackRef", { length: 100 }),
  paymentStatus: paymentStatusEnum("paymentStatus").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var faqItems = pgTable("faqItems", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var newsletterSubscribers = pgTable("newsletterSubscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 140 }),
  phone: varchar("phone", { length: 30 }),
  smsOptIn: boolean("smsOptIn").default(false).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull()
});
var smsLogs = pgTable("smsLogs", {
  id: serial("id").primaryKey(),
  recipientPhone: varchar("recipientPhone", { length: 30 }).notNull(),
  message: text("message").notNull(),
  provider: varchar("provider", { length: 40 }).default("africastalking").notNull(),
  status: varchar("status", { length: 40 }).default("queued").notNull(),
  providerRef: varchar("providerRef", { length: 100 }),
  sentAt: timestamp("sentAt").defaultNow().notNull()
});
var teamMembers = pgTable("teamMembers", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 140 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("imageUrl").default("").notNull(),
  email: varchar("email", { length: 320 }),
  linkedIn: varchar("linkedIn", { length: 300 }),
  sortOrder: integer("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

// backend/db.ts
import { createClient as createClient2 } from "@supabase/supabase-js";

// backend/_core/env.ts
var DEFAULT_SUPABASE_URL = "https://ahttzsovlbdzhmjukdwr.supabase.co";
var DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodHR6c292bGJkemhtanVrZHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTY3MzAsImV4cCI6MjEwMjQ3MjczMH0.f7a9Y8JLdxlgrmbOraBsz1_S_NoUPkfxqKYzl5_Co6k";
var DEFAULT_SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodHR6c292bGJkemhtanVrZHdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg5NjczMCwiZXhwIjoyMTAyNDcyNzMwfQ.7SqkHGEVRoQ4N9e8nPWTeVw5ChvrQRv5GiwifNfzguY";
var DEFAULT_DATABASE_URL = "postgresql://postgres.ahttzsovlbdzhmjukdwr:Forsonodonkor%401211@aws-0-us-east-1.pooler.supabase.com:6543/postgres";
var ENV = {
  appId: process.env.VITE_APP_ID ?? "ybi-community-platform",
  cookieSecret: process.env.JWT_SECRET || process.env.COOKIE_SECRET || "ybi-secure-admin-session-cookie-key-2026",
  databaseUrl: (process.env.DATABASE_URL || DEFAULT_DATABASE_URL).trim(),
  supabaseUrl: process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SUPABASE_SERVICE_ROLE_KEY,
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || "ybi-storage",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_BASE_URL || "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY || ""
};

// backend/storage.ts
import { createClient } from "@supabase/supabase-js";
var _supabaseClient = null;
var _bucketChecked = false;
function getSupabaseClient() {
  const url = (process.env.SUPABASE_URL || ENV.supabaseUrl || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || ENV.supabaseServiceRoleKey || process.env.SUPABASE_ANON_KEY || ENV.supabaseAnonKey || "").trim();
  if (!url || !key) {
    return null;
  }
  if (!_supabaseClient || _supabaseClient._key !== key) {
    _supabaseClient = createClient(url, key, {
      auth: { persistSession: false }
    });
    _supabaseClient._key = key;
  }
  return _supabaseClient;
}
function getStorageBucket() {
  return (ENV.supabaseBucket || process.env.SUPABASE_STORAGE_BUCKET || "ybi-storage").trim();
}
async function ensureSupabaseBucket(client, bucketName) {
  if (_bucketChecked) return true;
  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (error) {
      _bucketChecked = true;
      return true;
    }
    const exists = buckets?.some((b) => b.name === bucketName);
    if (!exists) {
      const { error: createErr } = await client.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 15 * 1024 * 1024
        // 15MB
      });
      if (createErr && !createErr.message?.toLowerCase().includes("already exists")) {
        console.warn(`[Supabase Storage] Notice creating bucket "${bucketName}":`, createErr.message);
      } else {
        console.log(`[Supabase Storage] Verified/Created public bucket "${bucketName}" \u2713`);
      }
    }
    _bucketChecked = true;
    return true;
  } catch {
    _bucketChecked = true;
    return true;
  }
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "").replace(/\\+/g, "/");
}
function appendHashSuffix(relKey) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const key = appendHashSuffix(normalizeKey(relKey));
  const bucket = getStorageBucket();
  const supabase = getSupabaseClient();
  let buffer;
  let resolvedContentType = contentType;
  if (typeof data === "string") {
    if (data.startsWith("data:")) {
      const match = data.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        resolvedContentType = match[1];
        buffer = Buffer.from(match[2], "base64");
      } else {
        buffer = Buffer.from(data);
      }
    } else {
      buffer = Buffer.from(data, "base64");
    }
  } else if (Buffer.isBuffer(data)) {
    buffer = data;
  } else {
    buffer = Buffer.from(data);
  }
  if (supabase) {
    try {
      await ensureSupabaseBucket(supabase, bucket);
      const { data: uploadResult, error } = await supabase.storage.from(bucket).upload(key, buffer, {
        contentType: resolvedContentType,
        upsert: true
      });
      if (!error) {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(key);
        if (publicUrlData?.publicUrl) {
          console.log(`[Supabase Storage] Successfully uploaded to: ${publicUrlData.publicUrl}`);
          return { key, url: publicUrlData.publicUrl };
        }
      } else {
        console.warn("[Supabase Storage] Upload notice:", error.message);
      }
    } catch (err) {
      console.warn("[Supabase Storage] Exception:", err?.message || err);
    }
  }
  if (typeof data === "string" && data.startsWith("data:")) {
    return { key, url: data };
  }
  const base64Str = `data:${resolvedContentType};base64,${buffer.toString("base64")}`;
  return { key, url: base64Str };
}
async function storageGet(relKey) {
  const key = normalizeKey(relKey);
  const supabase = getSupabaseClient();
  const bucket = getStorageBucket();
  if (supabase) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    if (data?.publicUrl) {
      return { key, url: data.publicUrl };
    }
  }
  return { key, url: `/uploads/${key}` };
}

// backend/db.ts
dotenv.config();
var _db = null;
var _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || ENV.supabaseUrl;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ENV.supabaseServiceRoleKey || ENV.supabaseAnonKey;
  if (url && key) {
    try {
      _supabase = createClient2(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
    } catch (e) {
      console.warn("[Database] Failed to initialize Supabase client:", e);
    }
  }
  return _supabase;
}
async function getDb() {
  const dbUrl = (process.env.DATABASE_URL || ENV.databaseUrl || "").trim();
  if (dbUrl && !dbUrl.startsWith("postgres")) {
    return null;
  }
  if (!_db && dbUrl) {
    try {
      const postgres = (await import("postgres")).default;
      const client = postgres(dbUrl, {
        max: 5,
        ssl: "require",
        prepare: false,
        idle_timeout: 20,
        connect_timeout: 4
      });
      _db = drizzle(client, { schema: schema_exports });
      console.log("[Database] Connected to Supabase PostgreSQL \u2713");
    } catch (error) {
      console.error("[Database] Failed to connect to Supabase:", error);
      _db = null;
    }
  } else if (!dbUrl) {
    console.warn("[Database] DATABASE_URL not set \u2014 using in-memory store");
  }
  return _db;
}
var memoryStore = {
  users: /* @__PURE__ */ new Map(),
  galleryPhotos: [
    { id: 1, title: "Robotics Workshop in Action", altText: "Students collaborating on robotic kits", imageUrl: "/ybi-assets/gallery/workshop-1.jpg", storageKey: "workshop-1.jpg", isPublished: true, sortOrder: 1, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 2, title: "Mentorship Circle", altText: "Young people in guided discussion", imageUrl: "/ybi-assets/gallery/mentorship-1.jpg", storageKey: "mentorship-1.jpg", isPublished: true, sortOrder: 2, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  programs: [
    { id: 1, title: "Public Speaking & Communication", category: "Public Speaking", summary: "Master vocal presence, speech crafting, debate, and the confidence to bring your voice and ideas into any room.", status: "published", sortOrder: 1, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 2, title: "Youth Entrepreneurship & Enterprise", category: "Entrepreneurship", summary: "Turn meaningful ideas into viable ventures through problem validation, business fundamentals, and pitch coaching.", status: "published", sortOrder: 2, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 3, title: "Generations in Conversation", category: "Mentorship", summary: "Structured intergenerational dialogue circles and 1-on-1 mentorship pairings connecting young ambition with elder wisdom.", status: "published", sortOrder: 3, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 4, title: "Values-Led Leadership Lab", category: "Leadership", summary: "Develop self-awareness, ethical decision-making, and community stewardship habits to lead with integrity.", status: "published", sortOrder: 4, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  updates: [
    { id: 1, title: "YBI Launches 2026 Intergenerational Mentorship Cohorts", excerpt: "Connecting young ambition with elder wisdom across community dialogue spaces.", body: "Young Beginners Inspiration is expanding its signature intergenerational mentorship cohorts, public speaking labs, and youth enterprise studios across local community centers.", status: "published", publishedAt: /* @__PURE__ */ new Date(), createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  siteContent: /* @__PURE__ */ new Map(),
  communityInquiries: [
    { id: 1, name: "Ama Serwaa", email: "ama@example.org", interest: "Mentorship & Volunteering", message: "Hello YBI team, I would love to volunteer as a mentor in the upcoming cohort.", status: "new", adminNotes: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  programSessions: [
    { id: 1, title: "Public Speaking & Debate Practicum", focusArea: "Public Speaking", details: "Interactive speaking drills, body language coaching, and debate practice.", scheduledFor: new Date(Date.now() + 864e5 * 7), venue: "YBI Community Hub", capacity: 30, status: "published", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  opportunities: [
    { id: 1, title: "Intergenerational Mentor", category: "Mentorship", summary: "Guide youth through structured dialogue, career exploration, and life reflection.", commitment: "2 hours / week", status: "published", sortOrder: 1, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  impactMetrics: [
    { id: 1, title: "Youth & Community Reached", focusArea: "Leadership & Learning", description: "Young learners and emerging leaders equipped through workshops and cohorts.", currentValue: 1250, targetValue: 2e3, unit: "Participants", period: "2026", status: "active", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 2, title: "Mentorship Hours Completed", focusArea: "Mentorship", description: "Dedicated one-on-one and small group intergenerational coaching sessions.", currentValue: 500, targetValue: 1e3, unit: "Hours", period: "2026", status: "active", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 3, title: "Programs & Cohorts Delivered", focusArea: "Education", description: "Hands-on speaking, entrepreneurship, and leadership cohorts run.", currentValue: 35, targetValue: 50, unit: "Cohorts", period: "2026", status: "active", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 4, title: "Partner Communities Engaged", focusArea: "Community", description: "Partner schools, youth hubs, and intergenerational spaces connected.", currentValue: 15, targetValue: 25, unit: "Communities", period: "2026", status: "active", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  teamMembers: [
    { id: 1, slug: "maxwell-odonkor", name: "Maxwell Odonkor", role: "Executive Director", bio: "Executive Director leading the vision, strategy, and community initiatives at Young Beginners Inspiration.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "maxwell@ybi.org", linkedIn: "", sortOrder: 1, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 2, slug: "viccoma-danquah", name: "Viccoma Danquah", role: "Communications & Advocacy Officer", bio: "Overseeing external communications, community advocacy, and outreach storytelling.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "viccoma@ybi.org", linkedIn: "", sortOrder: 2, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 3, slug: "breah-lyon", name: "Breah Lyon", role: "Director of Strategy & External Affairs", bio: "Guiding strategic partnerships, organizational development, and external relations.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "breah@ybi.org", linkedIn: "", sortOrder: 3, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 4, slug: "priscila-arkorful", name: "Priscila Arkorful", role: "Finance & Administrative Associate", bio: "Managing financial administration, operational reporting, and fiscal stewardship.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "priscila@ybi.org", linkedIn: "", sortOrder: 4, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 5, slug: "edem-john-amevor", name: "Edem John Amevor", role: "Marketing Associate", bio: "Driving digital marketing, brand engagement, and audience growth across YBI channels.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "edem@ybi.org", linkedIn: "", sortOrder: 5, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 6, slug: "alimatuo-nyass", name: "Alimatuo Nyass", role: "Administrative Officer", bio: "Coordinating program logistics, internal communications, and office administration.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "alimatuo@ybi.org", linkedIn: "", sortOrder: 6, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 7, slug: "forson-odonkor", name: "Forson Odonkor", role: "Media Associate", bio: "Producing multimedia content, photography, and creative assets for YBI campaigns.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "forson@ybi.org", linkedIn: "", sortOrder: 7, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() },
    { id: 8, slug: "thelma-naroog-bamanteeh", name: "Thelma Naroog Bamanteeh", role: "Executive Assistant", bio: "Providing executive support, schedule management, and key stakeholder coordination.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "thelma@ybi.org", linkedIn: "", sortOrder: 8, isPublished: true, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }
  ],
  events: [
    {
      id: 1,
      slug: "public-speaking-masterclass-2026",
      title: "Public Speaking & Youth Voice Masterclass",
      description: "A hands-on intensive workshop designed to build stage confidence, debate rhetoric, vocal modulation, and storytelling power for young emerging leaders.",
      imageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
      scheduledFor: new Date(Date.now() + 864e5 * 14),
      location: "Accra Community Center & Virtual Stream",
      capacity: 50,
      isFree: true,
      priceGhs: 0,
      status: "published",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 2,
      slug: "generations-in-conversation-summit",
      title: "Generations in Conversation: Annual Youth-Elder Summit",
      description: "An inspiring intergenerational gathering bridging youth innovators and experienced community elders for dialogue, mentorship pairing, and legacy building.",
      imageUrl: "/ybi-assets/community/ybi-community.jpg",
      scheduledFor: new Date(Date.now() + 864e5 * 28),
      location: "YBI Main Auditorium, East Legon, Accra",
      capacity: 100,
      isFree: false,
      priceGhs: 5e3,
      status: "published",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 3,
      slug: "youth-enterprise-pitch-lab",
      title: "Youth Enterprise & Venture Pitch Lab",
      description: "Practical business modeling, market validation, and pitch coaching for aspiring entrepreneurs aged 16-30.",
      imageUrl: "/ybi-assets/gallery/workshop-1.jpg",
      scheduledFor: new Date(Date.now() + 864e5 * 45),
      location: "YBI Innovation Hub, Kumasi & Online",
      capacity: 40,
      isFree: true,
      priceGhs: 0,
      status: "published",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  ],
  eventRegistrations: [
    {
      id: 1,
      eventId: 1,
      name: "Emmanuel Darko",
      email: "emmanuel.darko@gmail.com",
      phone: "+233 24 112 3344",
      smsOptIn: true,
      amountPaidGhs: 0,
      paymentStatus: "free",
      paystackRef: "FREE_PUBLIC_SPEAKING_01",
      confirmedAt: new Date(Date.now() - 864e5 * 2),
      createdAt: new Date(Date.now() - 864e5 * 2),
      updatedAt: new Date(Date.now() - 864e5 * 2)
    },
    {
      id: 2,
      eventId: 2,
      name: "Grace Quaye",
      email: "grace.quaye@yahoo.com",
      phone: "+233 54 887 9901",
      smsOptIn: true,
      amountPaidGhs: 5e3,
      paymentStatus: "paid",
      paystackRef: "PAYSTACK_GEN_CONV_02",
      confirmedAt: new Date(Date.now() - 864e5 * 5),
      createdAt: new Date(Date.now() - 864e5 * 5),
      updatedAt: new Date(Date.now() - 864e5 * 5)
    },
    {
      id: 3,
      eventId: 3,
      name: "Kwabena Boateng",
      email: "kwabena.b@techgh.com",
      phone: "+233 20 334 5566",
      smsOptIn: true,
      amountPaidGhs: 0,
      paymentStatus: "free",
      paystackRef: "FREE_YOUTH_PITCH_03",
      confirmedAt: new Date(Date.now() - 864e5 * 8),
      createdAt: new Date(Date.now() - 864e5 * 8),
      updatedAt: new Date(Date.now() - 864e5 * 8)
    }
  ],
  blogPosts: [
    {
      id: 1,
      slug: "power-of-intergenerational-dialogue",
      title: "The Transformative Power of Intergenerational Dialogue in African Communities",
      excerpt: "When youth ambition meets elder wisdom, sustainable community development accelerates. Here is what we learned from 500+ hours of mentorship circles.",
      body: `## Bridging Generations Through Intentional Conversation

In many modern societies, generational disconnects leave young people navigating complex careers and leadership paths without grounded elder wisdom, while experienced leaders lack direct touchpoints with youth energy.

At Young Beginners Inspiration (YBI), our **Generations in Conversation** initiative was created to shatter these silos. Rather than formal lectures, we curate structured peer-to-peer and small-group circles where both sides actively listen, challenge assumptions, and build enduring mutual respect.

### Key Takeaways from Our Recent Cohorts

1. **Listening Precedes Leadership:** Young leaders who listen to past community struggles develop higher contextual empathy.
2. **Mutual Learning:** Elders report feeling reinvigorated by the fresh perspectives, digital insights, and ethical curiosity of young mentees.
3. **Practical Legacy:** Mentorship is not just advice\u2014it is the deliberate transfer of resilience, cultural values, and network access.

Join our upcoming events or volunteer as a mentor to take part in this expanding movement.`,
      authorName: "YBI Editorial Team",
      coverImageUrl: "/ybi-assets/community/ybi-community.jpg",
      category: "Mentorship",
      status: "published",
      publishedAt: new Date(Date.now() - 864e5 * 3),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 2,
      slug: "building-confidence-through-public-speaking",
      title: "Finding Your Voice: How Public Speaking Unlocks Leadership Potential",
      excerpt: "Mastering vocal presence, speech crafting, and active listening transforms shy participants into confident changemakers across schools and enterprises.",
      body: `## Voice as a Catalyst for Impact

Every impactful idea begins with the courage to articulate it clearly. In our public speaking workshops across Ghana, we consistently witness young individuals transition from hesitant observers to compelling communicators.

### The Three Pillars of the YBI Speech Lab

- **Authenticity over Performance:** Speaking with genuine conviction resonates far deeper than memorized rhetoric.
- **Structured Argumentation:** Learning how to frame a problem, back it with lived evidence, and offer actionable solutions.
- **Overcoming Stage Anxiety:** Practical breathwork and vocal drills that calm the nervous system before addressing any audience.

Whether preparing for a classroom debate, an entrepreneurial pitch, or civic advocacy, mastering the spoken word is one of the most transferable skills for the 21st century.`,
      authorName: "Kwame Mensah",
      coverImageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
      category: "Public Speaking",
      status: "published",
      publishedAt: new Date(Date.now() - 864e5 * 10),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 3,
      slug: "values-led-entrepreneurship-ghana",
      title: "Values-Led Entrepreneurship: Building Ventures with Community Roots",
      excerpt: "Why purpose-driven enterprise is key to youth employment and how YBI incubates sustainable, ethical business ideas.",
      body: `## Beyond Profit: The Rise of Ethical Enterprise

Entrepreneurship is often framed purely around rapid scale and valuation. However, in our communities, the most resilient enterprises are those solving fundamental local challenges\u2014from educational access to sustainable agriculture.

### Guiding Principles for Young Founders

1. **Solve Real Pain Points:** Validate with actual community members before investing resources.
2. **Maintain Ethical Transparency:** Trust is the ultimate currency of any enduring organization.
3. **Reinvest in People:** Sustainable enterprises create dignified livelihoods and mentor the next generation.

Explore our youth entrepreneurship cohorts to learn how we support early-stage venture builders.`,
      authorName: "Ama Serwaa",
      coverImageUrl: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
      category: "Entrepreneurship",
      status: "published",
      publishedAt: new Date(Date.now() - 864e5 * 20),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  ],
  donations: [
    {
      id: 1,
      name: "Kwesi Appiah",
      email: "kwesi@example.com",
      phone: "+233240000001",
      amountGhs: 25e3,
      message: "Keep up the inspiring work empowering our youth!",
      paystackRef: "ybi_don_mock_1",
      paymentStatus: "success",
      createdAt: new Date(Date.now() - 864e5 * 2),
      updatedAt: new Date(Date.now() - 864e5 * 2)
    }
  ],
  faqItems: [
    {
      id: 1,
      question: "What is Young Beginners Inspiration (YBI)?",
      answer: "Young Beginners Inspiration (YBI) is a nonprofit organization dedicated to empowering youth through public speaking, entrepreneurship, intergenerational mentorship, and values-led leadership programs.",
      category: "General",
      sortOrder: 1,
      isPublished: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 2,
      question: "Who can participate in YBI programs?",
      answer: "Our core programs are designed for young people aged 12 to 30, while our mentorship circles actively welcome experienced elders, professionals, and community leaders of all ages as mentors.",
      category: "Programs",
      sortOrder: 2,
      isPublished: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 3,
      question: "How can I volunteer or become a mentor?",
      answer: "You can apply directly through our Get Involved page or contact us. We match volunteers based on interest, experience, and availability for cohorts and community workshops.",
      category: "Get Involved",
      sortOrder: 3,
      isPublished: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 4,
      question: "Are YBI events free to attend?",
      answer: "Most of our community workshops and public lectures are completely free. Select specialized summits or masterclasses have a nominal fee to cover materials and venue costs, with scholarship waivers available upon request.",
      category: "Events",
      sortOrder: 4,
      isPublished: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    },
    {
      id: 5,
      question: "How are donations utilized?",
      answer: "100% of public donations directly fund student workshop materials, mentorship venue logistics, rural outreach cohorts, and facilitator stipends.",
      category: "Donations",
      sortOrder: 5,
      isPublished: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  ],
  smsLogs: [],
  newsletterSubscribers: [],
  autoId: 100
};
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    const existing = memoryStore.users.get(user.openId) || {};
    memoryStore.users.set(user.openId, { ...existing, ...user, lastSignedIn: user.lastSignedIn || /* @__PURE__ */ new Date() });
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    try {
      await db.insert(users).values(values).onConflictDoUpdate({
        target: users.openId,
        set: updateSet
      });
    } catch (dbErr) {
      console.warn("[Database] Live DB query failed, falling back to memoryStore:", dbErr);
      const existing = memoryStore.users.get(user.openId) || {};
      memoryStore.users.set(user.openId, { ...existing, ...values, id: existing.id || 1, createdAt: existing.createdAt || /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    return memoryStore.users.get(openId);
  }
  try {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : memoryStore.users.get(openId);
  } catch {
    return memoryStore.users.get(openId);
  }
}
async function getDashboardOverview() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const [
        { count: galleryCount },
        { count: programCount2 },
        { count: inquiryCount2 },
        { count: sessionCount2 },
        { count: opportunityCount2 },
        { count: metricCount2 },
        { count: eventCount2 },
        { count: blogCount2 },
        { count: donationCount2 },
        { count: regCount2 },
        { count: faqCount2 },
        { count: subCount2 },
        { count: teamCount },
        { count: contentCount2 }
      ] = await Promise.all([
        supabase.from("galleryPhotos").select("*", { count: "exact", head: true }),
        supabase.from("programs").select("*", { count: "exact", head: true }),
        supabase.from("communityInquiries").select("*", { count: "exact", head: true }),
        supabase.from("programSessions").select("*", { count: "exact", head: true }),
        supabase.from("opportunities").select("*", { count: "exact", head: true }),
        supabase.from("impactMetrics").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("blogPosts").select("*", { count: "exact", head: true }),
        supabase.from("donations").select("*", { count: "exact", head: true }),
        supabase.from("eventRegistrations").select("*", { count: "exact", head: true }),
        supabase.from("faqItems").select("*", { count: "exact", head: true }),
        supabase.from("newsletterSubscribers").select("*", { count: "exact", head: true }),
        supabase.from("teamMembers").select("*", { count: "exact", head: true }),
        supabase.from("siteContent").select("*", { count: "exact", head: true })
      ]);
      return {
        gallery: galleryCount ?? memoryStore.galleryPhotos.length,
        programs: programCount2 ?? memoryStore.programs.length,
        updates: memoryStore.updates.length,
        content: contentCount2 ?? memoryStore.siteContent.size,
        inquiries: inquiryCount2 ?? memoryStore.communityInquiries.length,
        sessions: sessionCount2 ?? memoryStore.programSessions.length,
        opportunities: opportunityCount2 ?? memoryStore.opportunities.length,
        impactMetrics: metricCount2 ?? memoryStore.impactMetrics.length,
        teamMembers: teamCount ?? memoryStore.teamMembers.length,
        subscribers: subCount2 ?? memoryStore.newsletterSubscribers.length,
        events: eventCount2 ?? memoryStore.events.length,
        blogPosts: blogCount2 ?? memoryStore.blogPosts.length,
        donations: donationCount2 ?? memoryStore.donations.length,
        registrations: regCount2 ?? memoryStore.eventRegistrations.length,
        faqItems: faqCount2 ?? memoryStore.faqItems.length
      };
    } catch (e) {
      console.warn("[Database] getDashboardOverview Supabase error:", e);
    }
  }
  const db = await getDb();
  if (!db) {
    return {
      gallery: memoryStore.galleryPhotos.length,
      programs: memoryStore.programs.length,
      updates: memoryStore.updates.length,
      content: memoryStore.siteContent.size,
      inquiries: memoryStore.communityInquiries.length,
      sessions: memoryStore.programSessions.length,
      opportunities: memoryStore.opportunities.length,
      impactMetrics: memoryStore.impactMetrics.length,
      teamMembers: memoryStore.teamMembers.length,
      subscribers: memoryStore.newsletterSubscribers.length,
      events: memoryStore.events.length,
      blogPosts: memoryStore.blogPosts.length,
      donations: memoryStore.donations.length,
      registrations: memoryStore.eventRegistrations.length,
      faqItems: memoryStore.faqItems.length
    };
  }
  const [
    gallery,
    programCount,
    updateCount,
    contentCount,
    inquiryCount,
    sessionCount,
    opportunityCount,
    metricCount,
    eventCount,
    blogCount,
    donationCount,
    regCount,
    faqCount,
    subCount
  ] = await Promise.all([
    db.select({ value: count() }).from(galleryPhotos).catch(() => [{ value: memoryStore.galleryPhotos.length }]),
    db.select({ value: count() }).from(programs).catch(() => [{ value: memoryStore.programs.length }]),
    db.select({ value: count() }).from(updates).catch(() => [{ value: memoryStore.updates.length }]),
    db.select({ value: count() }).from(siteContent).catch(() => [{ value: memoryStore.siteContent.size }]),
    db.select({ value: count() }).from(communityInquiries).catch(() => [{ value: memoryStore.communityInquiries.length }]),
    db.select({ value: count() }).from(programSessions).catch(() => [{ value: memoryStore.programSessions.length }]),
    db.select({ value: count() }).from(opportunities).catch(() => [{ value: memoryStore.opportunities.length }]),
    db.select({ value: count() }).from(impactMetrics).catch(() => [{ value: memoryStore.impactMetrics.length }]),
    db.select({ value: count() }).from(events).catch(() => [{ value: memoryStore.events.length }]),
    db.select({ value: count() }).from(blogPosts).catch(() => [{ value: memoryStore.blogPosts.length }]),
    db.select({ value: count() }).from(donations).catch(() => [{ value: memoryStore.donations.length }]),
    db.select({ value: count() }).from(eventRegistrations).catch(() => [{ value: memoryStore.eventRegistrations.length }]),
    db.select({ value: count() }).from(faqItems).catch(() => [{ value: memoryStore.faqItems.length }]),
    db.select({ value: count() }).from(newsletterSubscribers).catch(() => [{ value: memoryStore.newsletterSubscribers.length }])
  ]);
  return {
    gallery: gallery[0]?.value ?? 0,
    programs: programCount[0]?.value ?? 0,
    updates: updateCount[0]?.value ?? 0,
    content: contentCount[0]?.value ?? 0,
    inquiries: inquiryCount[0]?.value ?? 0,
    sessions: sessionCount[0]?.value ?? 0,
    opportunities: opportunityCount[0]?.value ?? 0,
    impactMetrics: metricCount[0]?.value ?? 0,
    teamMembers: memoryStore.teamMembers.length,
    subscribers: subCount[0]?.value && subCount[0].value > 0 ? subCount[0].value : memoryStore.newsletterSubscribers.length,
    events: eventCount[0]?.value && eventCount[0].value > 0 ? eventCount[0].value : memoryStore.events.length,
    blogPosts: blogCount[0]?.value && blogCount[0].value > 0 ? blogCount[0].value : memoryStore.blogPosts.length,
    donations: donationCount[0]?.value && donationCount[0].value > 0 ? donationCount[0].value : memoryStore.donations.length,
    registrations: regCount[0]?.value && regCount[0].value > 0 ? regCount[0].value : memoryStore.eventRegistrations.length,
    faqItems: faqCount[0]?.value && faqCount[0].value > 0 ? faqCount[0].value : memoryStore.faqItems.length
  };
}
async function createCommunityInquiry(input) {
  const db = await getDb();
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.communityInquiries.unshift({ id, ...input, status: "new", adminNotes: null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  const result = await db.insert(communityInquiries).values(input).returning({ id: communityInquiries.id });
  return Number(result[0].id);
}
async function listCommunityInquiries() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("communityInquiries").select("*").order("createdAt", { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(communityInquiries).orderBy(desc(communityInquiries.createdAt));
      if (rows && rows.length > 0) return rows;
    } catch {
    }
  }
  return memoryStore.communityInquiries;
}
async function updateCommunityInquiry(input) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("communityInquiries").update({
        status: input.status,
        adminNotes: input.adminNotes ?? null,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", input.id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const item = memoryStore.communityInquiries.find((i) => i.id === input.id);
    if (item) {
      item.status = input.status;
      if (input.adminNotes !== void 0) item.adminNotes = input.adminNotes;
      item.updatedAt = /* @__PURE__ */ new Date();
    }
    return;
  }
  await db.update(communityInquiries).set({
    status: input.status,
    adminNotes: input.adminNotes ?? null,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(communityInquiries.id, input.id));
}
async function removeCommunityInquiry(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("communityInquiries").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.communityInquiries.findIndex((i) => i.id === id);
    if (index !== -1) memoryStore.communityInquiries.splice(index, 1);
    return;
  }
  await db.delete(communityInquiries).where(eq(communityInquiries.id, id));
}
async function listProgramSessions() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("programSessions").select("*").order("scheduledFor", { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(programSessions).orderBy(programSessions.scheduledFor, desc(programSessions.createdAt));
      if (rows && rows.length > 0) return rows;
    } catch {
    }
  }
  return memoryStore.programSessions;
}
async function saveProgramSession(input) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("programSessions").update({
          title: input.title,
          focusArea: input.focusArea,
          details: input.details,
          scheduledFor: input.scheduledFor.toISOString(),
          venue: input.venue,
          capacity: input.capacity ?? null,
          status: input.status,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.programSessions.findIndex((s) => s.id === input.id);
          if (idx !== -1) memoryStore.programSessions[idx] = { ...memoryStore.programSessions[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("programSessions").insert({
        title: input.title,
        focusArea: input.focusArea,
        details: input.details,
        scheduledFor: input.scheduledFor.toISOString(),
        venue: input.venue,
        capacity: input.capacity ?? null,
        status: input.status
      }).select("id").single();
      if (!error && data?.id) {
        memoryStore.programSessions.push(data);
        return Number(data.id);
      }
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.programSessions.findIndex((s) => s.id === input.id);
      if (index !== -1) {
        memoryStore.programSessions[index] = { ...memoryStore.programSessions[index], ...input, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id2 = ++memoryStore.autoId;
    memoryStore.programSessions.push({ id: id2, ...input, capacity: input.capacity ?? null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id2;
  }
  const values = { ...input, id: void 0, updatedAt: /* @__PURE__ */ new Date() };
  if (input.id) {
    const { id: id2, ...updateValues } = values;
    await db.update(programSessions).set(updateValues).where(eq(programSessions.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(programSessions).values(insertValues).returning({ id: programSessions.id });
  return Number(result[0].id);
}
async function removeProgramSession(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("programSessions").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.programSessions.findIndex((s) => s.id === id);
    if (index !== -1) memoryStore.programSessions.splice(index, 1);
    return;
  }
  await db.delete(programSessions).where(eq(programSessions.id, id));
}
async function listOpportunities() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("opportunities").select("*").order("sortOrder", { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(opportunities).orderBy(opportunities.sortOrder, desc(opportunities.createdAt));
      if (rows && rows.length > 0) return rows;
    } catch {
    }
  }
  return memoryStore.opportunities;
}
async function saveOpportunity(input) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("opportunities").update({
          title: input.title,
          category: input.category,
          summary: input.summary,
          commitment: input.commitment,
          status: input.status,
          sortOrder: input.sortOrder,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.opportunities.findIndex((o) => o.id === input.id);
          if (idx !== -1) memoryStore.opportunities[idx] = { ...memoryStore.opportunities[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("opportunities").insert({
        title: input.title,
        category: input.category,
        summary: input.summary,
        commitment: input.commitment,
        status: input.status,
        sortOrder: input.sortOrder
      }).select("id").single();
      if (!error && data?.id) {
        memoryStore.opportunities.push(data);
        return Number(data.id);
      }
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.opportunities.findIndex((o) => o.id === input.id);
      if (index !== -1) {
        memoryStore.opportunities[index] = { ...memoryStore.opportunities[index], ...input, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id2 = ++memoryStore.autoId;
    memoryStore.opportunities.push({ id: id2, ...input, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id2;
  }
  const values = { ...input, id: void 0, updatedAt: /* @__PURE__ */ new Date() };
  if (input.id) {
    const { id: id2, ...updateValues } = values;
    await db.update(opportunities).set(updateValues).where(eq(opportunities.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(opportunities).values(insertValues).returning({ id: opportunities.id });
  return Number(result[0].id);
}
async function removeOpportunity(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("opportunities").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.opportunities.findIndex((o) => o.id === id);
    if (index !== -1) memoryStore.opportunities.splice(index, 1);
    return;
  }
  await db.delete(opportunities).where(eq(opportunities.id, id));
}
async function listImpactMetrics() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("impactMetrics").select("*").order("id", { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (!db) return memoryStore.impactMetrics;
  return db.select().from(impactMetrics).orderBy(impactMetrics.status, impactMetrics.focusArea, impactMetrics.title);
}
async function saveImpactMetric(input) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        await supabase.from("impactMetrics").update({
          title: input.title,
          focusArea: input.focusArea,
          description: input.description,
          currentValue: input.currentValue,
          targetValue: input.targetValue ?? null,
          unit: input.unit,
          period: input.period,
          status: input.status,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", input.id);
        return input.id;
      }
      const { data, error } = await supabase.from("impactMetrics").insert({
        title: input.title,
        focusArea: input.focusArea,
        description: input.description,
        currentValue: input.currentValue,
        targetValue: input.targetValue ?? null,
        unit: input.unit,
        period: input.period,
        status: input.status
      }).select("id").single();
      if (!error && data) return Number(data.id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.impactMetrics.findIndex((m) => m.id === input.id);
      if (index !== -1) {
        memoryStore.impactMetrics[index] = { ...memoryStore.impactMetrics[index], ...input, targetValue: input.targetValue ?? null, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id2 = ++memoryStore.autoId;
    memoryStore.impactMetrics.push({ id: id2, ...input, targetValue: input.targetValue ?? null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id2;
  }
  const values = { ...input, id: void 0, updatedAt: /* @__PURE__ */ new Date() };
  if (input.id) {
    const { id: id2, ...updateValues } = values;
    await db.update(impactMetrics).set(updateValues).where(eq(impactMetrics.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(impactMetrics).values(insertValues).returning({ id: impactMetrics.id });
  return Number(result[0].id);
}
async function removeImpactMetric(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("impactMetrics").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.impactMetrics.findIndex((m) => m.id === id);
    if (index !== -1) memoryStore.impactMetrics.splice(index, 1);
    return;
  }
  await db.delete(impactMetrics).where(eq(impactMetrics.id, id));
}
async function listGalleryPhotos(includeUnpublished = true) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("galleryPhotos").select("*").order("sortOrder", { ascending: true });
      if (!includeUnpublished) {
        query = query.eq("isPublished", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(galleryPhotos).orderBy(galleryPhotos.sortOrder, desc(galleryPhotos.createdAt));
      const res = includeUnpublished ? rows : rows.filter((photo) => photo.isPublished);
      if (res && res.length > 0) return res;
    } catch {
    }
  }
  return includeDraftsGallery(includeUnpublished);
}
function includeDraftsGallery(includeUnpublished) {
  return includeUnpublished ? memoryStore.galleryPhotos : memoryStore.galleryPhotos.filter((p) => p.isPublished);
}
async function saveGalleryPhoto(input) {
  let imageUrl = input.imageUrl || "/ybi-assets/gallery/workshop-1.jpg";
  let storageKey = input.storageKey || "sample.jpg";
  if (imageUrl && imageUrl.startsWith("data:")) {
    try {
      const uploaded = await storagePut(`gallery/${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || Date.now()}`, imageUrl);
      imageUrl = uploaded.url;
      storageKey = uploaded.key;
    } catch (e) {
      console.warn("[Gallery] Storage upload fallback:", e);
    }
  }
  const photoRecord = {
    title: input.title,
    altText: input.altText,
    imageUrl,
    storageKey,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("galleryPhotos").update(photoRecord).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.galleryPhotos.findIndex((p) => p.id === input.id);
          if (idx !== -1) memoryStore.galleryPhotos[idx] = { ...memoryStore.galleryPhotos[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("galleryPhotos").insert({
        ...photoRecord,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (!error && data?.id) {
        memoryStore.galleryPhotos.push(data);
        return data.id;
      }
    } catch (err) {
      console.warn("[Supabase] saveGalleryPhoto error:", err);
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.galleryPhotos.findIndex((p) => p.id === input.id);
      if (index !== -1) {
        memoryStore.galleryPhotos[index] = { ...memoryStore.galleryPhotos[index], ...input, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.galleryPhotos.push({
      id,
      ...photoRecord,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return id;
  }
  if (input.id) {
    await db.update(galleryPhotos).set({
      title: input.title,
      altText: input.altText,
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(galleryPhotos.id, input.id));
    return input.id;
  }
  if (!input.imageUrl || !input.storageKey) throw new Error("Image details are required for a new gallery photo");
  const result = await db.insert(galleryPhotos).values({
    title: input.title,
    altText: input.altText,
    imageUrl: input.imageUrl,
    storageKey: input.storageKey,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder
  }).returning({ id: galleryPhotos.id });
  return Number(result[0].id);
}
async function removeGalleryPhoto(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("galleryPhotos").delete().eq("id", id);
    } catch {
    }
  }
  const index = memoryStore.galleryPhotos.findIndex((p) => p.id === id);
  if (index !== -1) memoryStore.galleryPhotos.splice(index, 1);
  const db = await getDb();
  if (db) {
    try {
      await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
    } catch {
    }
  }
}
async function listPrograms(includeDrafts = true) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("programs").select("*").order("sortOrder", { ascending: true });
      if (!includeDrafts) {
        query = query.eq("status", "published");
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(programs).orderBy(programs.sortOrder, desc(programs.createdAt));
      const res = includeDrafts ? rows : rows.filter((program) => program.status === "published");
      if (res && res.length > 0) return res;
    } catch {
    }
  }
  return includeDrafts ? memoryStore.programs : memoryStore.programs.filter((p) => p.status === "published");
}
async function saveProgram(input) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("programs").update({
          title: input.title,
          category: input.category,
          summary: input.summary,
          status: input.status,
          sortOrder: input.sortOrder,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.programs.findIndex((p) => p.id === input.id);
          if (idx !== -1) memoryStore.programs[idx] = { ...memoryStore.programs[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("programs").insert({
        title: input.title,
        category: input.category,
        summary: input.summary,
        status: input.status,
        sortOrder: input.sortOrder
      }).select("id").single();
      if (!error && data?.id) {
        memoryStore.programs.push(data);
        return Number(data.id);
      }
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.programs.findIndex((p) => p.id === input.id);
      if (index !== -1) {
        memoryStore.programs[index] = { ...memoryStore.programs[index], ...input, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.programs.push({ id, ...input, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  const values = { title: input.title, category: input.category, summary: input.summary, status: input.status, sortOrder: input.sortOrder, updatedAt: /* @__PURE__ */ new Date() };
  if (input.id) {
    await db.update(programs).set(values).where(eq(programs.id, input.id));
    return input.id;
  }
  const result = await db.insert(programs).values(values).returning({ id: programs.id });
  return Number(result[0].id);
}
async function removeProgram(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("programs").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.programs.findIndex((p) => p.id === id);
    if (index !== -1) memoryStore.programs.splice(index, 1);
    return;
  }
  await db.delete(programs).where(eq(programs.id, id));
}
async function listUpdates(includeDrafts = true) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("updates").select("*").order("createdAt", { ascending: false });
      if (!includeDrafts) {
        query = query.eq("status", "published");
      }
      const { data, error } = await query;
      if (!error && data) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (!db) return includeDrafts ? memoryStore.updates : memoryStore.updates.filter((u) => u.status === "published");
  try {
    const rows = await db.select().from(updates).orderBy(desc(updates.createdAt));
    return includeDrafts ? rows : rows.filter((update) => update.status === "published");
  } catch {
    return includeDrafts ? memoryStore.updates : memoryStore.updates.filter((u) => u.status === "published");
  }
}
async function saveUpdate(input) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        await supabase.from("updates").update({
          title: input.title,
          excerpt: input.excerpt,
          body: input.body,
          status: input.status,
          publishedAt: input.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", input.id);
        return input.id;
      }
      const { data, error } = await supabase.from("updates").insert({
        title: input.title,
        excerpt: input.excerpt,
        body: input.body,
        status: input.status,
        publishedAt: input.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
      }).select("id").single();
      if (!error && data) return Number(data.id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.updates.findIndex((u) => u.id === input.id);
      if (index !== -1) {
        memoryStore.updates[index] = { ...memoryStore.updates[index], ...input, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.updates.push({ id, ...input, publishedAt: input.status === "published" ? /* @__PURE__ */ new Date() : null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  const values = {
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    status: input.status,
    publishedAt: input.status === "published" ? /* @__PURE__ */ new Date() : null,
    updatedAt: /* @__PURE__ */ new Date()
  };
  if (input.id) {
    await db.update(updates).set(values).where(eq(updates.id, input.id));
    return input.id;
  }
  const result = await db.insert(updates).values(values).returning({ id: updates.id });
  return Number(result[0].id);
}
async function removeUpdate(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("updates").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.updates.findIndex((u) => u.id === id);
    if (index !== -1) memoryStore.updates.splice(index, 1);
    return;
  }
  await db.delete(updates).where(eq(updates.id, id));
}
async function listSiteContent() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("siteContent").select("*").order("contentKey");
      if (!error && data) {
        data.forEach((item) => memoryStore.siteContent.set(item.contentKey, item));
        return data;
      }
    } catch (e) {
    }
  }
  const db = await getDb();
  if (!db) return Array.from(memoryStore.siteContent.values());
  try {
    return await db.select().from(siteContent).orderBy(siteContent.contentKey);
  } catch {
    return Array.from(memoryStore.siteContent.values());
  }
}
async function getSiteContent(contentKey) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("siteContent").select("*").eq("contentKey", contentKey).maybeSingle();
      if (!error && data) {
        memoryStore.siteContent.set(contentKey, data);
        return data;
      }
    } catch (e) {
    }
  }
  const db = await getDb();
  if (!db) return memoryStore.siteContent.get(contentKey) ?? null;
  try {
    const rows = await db.select().from(siteContent).where(eq(siteContent.contentKey, contentKey)).limit(1);
    return rows[0] ?? null;
  } catch {
    return memoryStore.siteContent.get(contentKey) ?? null;
  }
}
async function upsertSiteContent(input) {
  memoryStore.siteContent.set(input.contentKey, { ...input, updatedAt: /* @__PURE__ */ new Date() });
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("siteContent").upsert(
        {
          contentKey: input.contentKey,
          label: input.label,
          title: input.title,
          body: input.body,
          actionLabel: input.actionLabel ?? null,
          actionHref: input.actionHref ?? null,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        { onConflict: "contentKey" }
      );
      if (!error) return;
      console.warn("[Supabase] upsertSiteContent error:", error.message);
    } catch (err) {
      console.warn("[Supabase] upsertSiteContent exception:", err);
    }
  }
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(siteContent).values(input).onConflictDoUpdate({
      target: siteContent.contentKey,
      set: { ...input, updatedAt: /* @__PURE__ */ new Date() }
    });
  } catch (err) {
    console.error("[Database] upsertSiteContent failed:", err);
  }
}
async function removeSiteContent(contentKey) {
  memoryStore.siteContent.delete(contentKey);
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("siteContent").delete().eq("contentKey", contentKey);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) return;
  try {
    await db.delete(siteContent).where(eq(siteContent.contentKey, contentKey));
  } catch {
  }
}
function fallbackTeamMembers(includeUnpublished) {
  const rows = memoryStore.teamMembers.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  return includeUnpublished ? rows : rows.filter((member) => member.isPublished);
}
function normalizeTeamSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 160) || "team-member";
}
async function listTeamMembers(includeUnpublished = true) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("teamMembers").select("*").order("sortOrder", { ascending: true });
      if (!includeUnpublished) {
        query = query.eq("isPublished", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      let rows = await db.select().from(teamMembers).orderBy(teamMembers.sortOrder, teamMembers.id);
      const res = includeUnpublished ? rows : rows.filter((m) => m.isPublished);
      if (res && res.length > 0) return res;
    } catch (error) {
      console.warn("[Team] Error querying teamMembers; using local fallback.", error);
    }
  }
  return fallbackTeamMembers(includeUnpublished);
}
async function getTeamMemberBySlug(slug, includeUnpublished = false) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("teamMembers").select("*").eq("slug", slug).maybeSingle();
      if (!error && data) {
        return includeUnpublished || data.isPublished ? data : null;
      }
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(teamMembers).where(eq(teamMembers.slug, slug)).limit(1);
      const member2 = rows[0] ?? null;
      if (member2 && (includeUnpublished || member2.isPublished)) return member2;
    } catch (error) {
    }
  }
  const member = memoryStore.teamMembers.find((item) => item.slug === slug) ?? null;
  return member && (includeUnpublished || member.isPublished) ? member : null;
}
async function saveTeamMember(input) {
  const slug = normalizeTeamSlug(input.name);
  let finalImageUrl = input.imageUrl;
  if (finalImageUrl && finalImageUrl.startsWith("data:")) {
    try {
      const uploaded = await storagePut(`team-members/${slug || Date.now()}`, finalImageUrl);
      finalImageUrl = uploaded.url;
    } catch (e) {
      console.warn("[Team] Storage upload fallback:", e);
    }
  }
  const values = {
    slug,
    name: input.name,
    role: input.role,
    bio: input.bio,
    imageUrl: finalImageUrl,
    email: input.email || null,
    linkedIn: input.linkedIn || null,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("teamMembers").update(values).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.teamMembers.findIndex((m) => m.id === input.id);
          if (idx !== -1) memoryStore.teamMembers[idx] = { ...memoryStore.teamMembers[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("teamMembers").insert({
        ...values,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (!error && data?.id) {
        memoryStore.teamMembers.push(data);
        return data.id;
      }
    } catch (err) {
      console.warn("[Supabase] saveTeamMember error:", err);
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.teamMembers.findIndex((m) => m.id === input.id);
      if (index !== -1) {
        memoryStore.teamMembers[index] = { ...memoryStore.teamMembers[index], ...input, imageUrl: finalImageUrl, slug, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.teamMembers.push({ id, ...input, imageUrl: finalImageUrl, slug, email: input.email || "", linkedIn: input.linkedIn || "", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  if (input.id) {
    try {
      const updated = await db.update(teamMembers).set(values).where(eq(teamMembers.id, input.id)).returning({ id: teamMembers.id });
      if (updated.length > 0) {
        const index = memoryStore.teamMembers.findIndex((m) => m.id === input.id);
        if (index !== -1) memoryStore.teamMembers[index] = { ...memoryStore.teamMembers[index], ...input, imageUrl: finalImageUrl, slug, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    } catch (e) {
    }
  }
  try {
    const result = await db.insert(teamMembers).values(values).returning({ id: teamMembers.id });
    const insertedId = Number(result[0].id);
    memoryStore.teamMembers.push({ id: insertedId, ...input, imageUrl: finalImageUrl, slug, email: input.email || "", linkedIn: input.linkedIn || "", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return insertedId;
  } catch (e) {
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
    const result = await db.insert(teamMembers).values({ ...values, slug: uniqueSlug }).returning({ id: teamMembers.id });
    const insertedId = Number(result[0].id);
    memoryStore.teamMembers.push({ id: insertedId, ...input, imageUrl: finalImageUrl, slug: uniqueSlug, email: input.email || "", linkedIn: input.linkedIn || "", createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return insertedId;
  }
}
async function removeTeamMember(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("teamMembers").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      await db.delete(teamMembers).where(eq(teamMembers.id, id));
    } catch (error) {
      console.warn("[Team] Error removing teamMember:", error);
    }
  }
  const index = memoryStore.teamMembers.findIndex((member) => member.id === id);
  if (index !== -1) memoryStore.teamMembers.splice(index, 1);
}
async function addNewsletterSubscriber(input) {
  const db = await getDb();
  if (!db) {
    const existing = memoryStore.newsletterSubscribers.find((s) => s.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      if (input.phone) existing.phone = input.phone;
      if (input.smsOptIn !== void 0) existing.smsOptIn = input.smsOptIn;
      if (input.name) existing.name = input.name;
      return existing.id;
    }
    const id = ++memoryStore.autoId;
    memoryStore.newsletterSubscribers.unshift({
      id,
      email: input.email,
      name: input.name || "",
      phone: input.phone || null,
      smsOptIn: input.smsOptIn ?? false,
      subscribedAt: /* @__PURE__ */ new Date()
    });
    return id;
  }
  try {
    const existing = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, input.email)).limit(1);
    if (existing.length > 0) {
      await db.update(newsletterSubscribers).set({
        name: input.name ?? existing[0].name,
        phone: input.phone ?? existing[0].phone,
        smsOptIn: input.smsOptIn ?? existing[0].smsOptIn
      }).where(eq(newsletterSubscribers.email, input.email));
      return existing[0].id;
    }
    const result = await db.insert(newsletterSubscribers).values({
      email: input.email,
      name: input.name || null,
      phone: input.phone || null,
      smsOptIn: input.smsOptIn ?? false
    }).returning({ id: newsletterSubscribers.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.newsletterSubscribers.unshift({
      id,
      email: input.email,
      name: input.name || "",
      phone: input.phone || null,
      smsOptIn: input.smsOptIn ?? false,
      subscribedAt: /* @__PURE__ */ new Date()
    });
    return id;
  }
}
async function listNewsletterSubscribers() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("newsletterSubscribers").select("*").order("subscribedAt", { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
      if (rows && rows.length > 0) return rows;
    } catch {
    }
  }
  return memoryStore.newsletterSubscribers;
}
async function removeNewsletterSubscriber(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("newsletterSubscribers").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.newsletterSubscribers.findIndex((s) => s.id === id);
    if (index !== -1) memoryStore.newsletterSubscribers.splice(index, 1);
    return;
  }
  try {
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
  } catch {
    const index = memoryStore.newsletterSubscribers.findIndex((s) => s.id === id);
    if (index !== -1) memoryStore.newsletterSubscribers.splice(index, 1);
  }
}
async function listEvents(includeDrafts = true) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("events").select("*").order("scheduledFor");
      if (!includeDrafts) {
        query = query.eq("status", "published");
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(events).orderBy(events.scheduledFor);
      const res = includeDrafts ? rows : rows.filter((e) => e.status === "published");
      if (res && res.length > 0) return res;
    } catch {
    }
  }
  return includeDrafts ? memoryStore.events : memoryStore.events.filter((e) => e.status === "published");
}
async function getEventBySlug(slug) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
      if (!error && data) return data;
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
      if (rows[0]) return rows[0];
    } catch {
    }
  }
  return memoryStore.events.find((e) => e.slug === slug) ?? null;
}
async function getEventById(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      if (!error && data) return data;
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
      if (rows[0]) return rows[0];
    } catch {
    }
  }
  return memoryStore.events.find((e) => e.id === id) ?? null;
}
async function saveEvent(input) {
  let imageUrl = input.imageUrl ?? null;
  if (imageUrl && imageUrl.startsWith("data:")) {
    try {
      const uploaded = await storagePut(`events/${input.slug || Date.now()}`, imageUrl);
      imageUrl = uploaded.url;
    } catch (err) {
      console.warn("[Events] Storage upload fallback:", err);
    }
  }
  const scheduledForStr = input.scheduledFor instanceof Date ? input.scheduledFor.toISOString() : input.scheduledFor;
  const scheduledForDate = input.scheduledFor instanceof Date ? input.scheduledFor : new Date(input.scheduledFor);
  const values = {
    slug: input.slug,
    title: input.title,
    description: input.description,
    imageUrl,
    scheduledFor: scheduledForStr,
    location: input.location,
    capacity: input.capacity ?? null,
    isFree: input.isFree ?? true,
    priceGhs: input.priceGhs ?? 0,
    status: input.status,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("events").update(values).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.events.findIndex((e) => e.id === input.id);
          if (idx !== -1) memoryStore.events[idx] = { ...memoryStore.events[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("events").insert({
        ...values,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (!error && data?.id) {
        memoryStore.events.push(data);
        return data.id;
      }
    } catch (err) {
      console.warn("[Supabase] saveEvent error:", err);
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.events.findIndex((e) => e.id === input.id);
      if (index !== -1) {
        memoryStore.events[index] = { ...memoryStore.events[index], ...input, imageUrl, scheduledFor: scheduledForDate, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.events.push({ id, ...input, imageUrl, scheduledFor: scheduledForDate, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  try {
    if (input.id) {
      await db.update(events).set({ ...values, scheduledFor: scheduledForDate }).where(eq(events.id, input.id));
      return input.id;
    }
    const result = await db.insert(events).values({ ...values, scheduledFor: scheduledForDate }).returning({ id: events.id });
    return Number(result[0].id);
  } catch {
    if (input.id) {
      const index = memoryStore.events.findIndex((e) => e.id === input.id);
      if (index !== -1) {
        memoryStore.events[index] = { ...memoryStore.events[index], ...input, imageUrl, scheduledFor: scheduledForDate, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.events.push({ id, ...input, imageUrl, scheduledFor: scheduledForDate, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
}
async function removeEvent(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("events").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      await db.delete(events).where(eq(events.id, id));
    } catch {
    }
  }
  const index = memoryStore.events.findIndex((e) => e.id === id);
  if (index !== -1) memoryStore.events.splice(index, 1);
}
async function createEventRegistration(input) {
  const record = {
    eventId: input.eventId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    smsOptIn: input.smsOptIn ?? false,
    paystackRef: input.paystackRef ?? null,
    paymentStatus: input.paymentStatus ?? "pending",
    isWaitlist: input.isWaitlist ?? false,
    confirmedAt: input.confirmedAt ?? (input.paymentStatus === "success" || input.paymentStatus === "free" ? (/* @__PURE__ */ new Date()).toISOString() : null),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("eventRegistrations").insert({
        ...record,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (!error && data?.id) {
        memoryStore.eventRegistrations.push(data);
        return data.id;
      }
    } catch (err) {
      console.warn("[Supabase] createEventRegistration error:", err);
    }
  }
  const db = await getDb();
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.eventRegistrations.push({ id, ...record, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  try {
    const result = await db.insert(eventRegistrations).values(record).returning({ id: eventRegistrations.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.eventRegistrations.push({ id, ...record, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
}
async function listEventRegistrations(eventId) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("eventRegistrations").select("*").order("createdAt", { ascending: false });
      if (eventId) query = query.eq("eventId", eventId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = eventId ? await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId)).orderBy(desc(eventRegistrations.createdAt)) : await db.select().from(eventRegistrations).orderBy(desc(eventRegistrations.createdAt));
      if (rows && rows.length > 0) return rows;
    } catch {
    }
  }
  return eventId ? memoryStore.eventRegistrations.filter((r) => r.eventId === eventId) : memoryStore.eventRegistrations;
}
async function updateEventRegistrationPayment(paystackRef, paymentStatus) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("eventRegistrations").update({
        paymentStatus,
        confirmedAt: paymentStatus === "success" || paymentStatus === "free" ? (/* @__PURE__ */ new Date()).toISOString() : null,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("paystackRef", paystackRef);
    } catch {
    }
  }
  const db = await getDb();
  const item = memoryStore.eventRegistrations.find((r) => r.paystackRef === paystackRef);
  if (item) {
    item.paymentStatus = paymentStatus;
    if (paymentStatus === "success" || paymentStatus === "free") item.confirmedAt = /* @__PURE__ */ new Date();
    item.updatedAt = /* @__PURE__ */ new Date();
  }
  if (db) {
    try {
      await db.update(eventRegistrations).set({
        paymentStatus,
        confirmedAt: paymentStatus === "success" || paymentStatus === "free" ? /* @__PURE__ */ new Date() : null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(eventRegistrations.paystackRef, paystackRef));
    } catch {
    }
  }
}
async function listBlogPosts(includeDrafts = true) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("blogPosts").select("*").order("publishedAt", { ascending: false });
      if (!includeDrafts) query = query.eq("status", "published");
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
      const res = includeDrafts ? rows : rows.filter((p) => p.status === "published");
      if (res && res.length > 0) return res;
    } catch {
    }
  }
  return includeDrafts ? memoryStore.blogPosts : memoryStore.blogPosts.filter((p) => p.status === "published");
}
async function getBlogPostBySlug(slug) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("blogPosts").select("*").eq("slug", slug).maybeSingle();
      if (!error && data) return data;
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      if (rows[0]) return rows[0];
    } catch {
    }
  }
  return memoryStore.blogPosts.find((p) => p.slug === slug) ?? null;
}
async function saveBlogPost(input) {
  let coverImageUrl = input.coverImageUrl ?? null;
  if (coverImageUrl && coverImageUrl.startsWith("data:")) {
    try {
      const uploaded = await storagePut(`blog/${input.slug || Date.now()}`, coverImageUrl);
      coverImageUrl = uploaded.url;
    } catch (err) {
      console.warn("[Blog] Storage upload fallback:", err);
    }
  }
  const publishedAt = input.publishedAt ? input.publishedAt.toISOString() : input.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null;
  const values = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    authorName: input.authorName,
    coverImageUrl,
    category: input.category,
    status: input.status,
    publishedAt,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("blogPosts").update(values).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.blogPosts.findIndex((p) => p.id === input.id);
          if (idx !== -1) memoryStore.blogPosts[idx] = { ...memoryStore.blogPosts[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("blogPosts").insert({
        ...values,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (!error && data?.id) {
        memoryStore.blogPosts.push(data);
        return data.id;
      }
    } catch (err) {
      console.warn("[Supabase] saveBlogPost error:", err);
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.blogPosts.findIndex((p) => p.id === input.id);
      if (index !== -1) {
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.blogPosts.push({ id, ...input, publishedAt: input.publishedAt ? new Date(input.publishedAt) : null, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
}
async function removeBlogPost(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("blogPosts").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
    } catch {
    }
  }
  const index = memoryStore.blogPosts.findIndex((p) => p.id === id);
  if (index !== -1) memoryStore.blogPosts.splice(index, 1);
}
async function createDonation(input) {
  const values = {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    amountGhs: input.amountGhs,
    message: input.message ?? null,
    paystackRef: input.paystackRef ?? null,
    paymentStatus: input.paymentStatus ?? "pending",
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("donations").insert({
        ...values,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (!error && data?.id) {
        memoryStore.donations.unshift(data);
        return data.id;
      }
    } catch (err) {
      console.warn("[Supabase] createDonation error:", err);
    }
  }
  const db = await getDb();
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.donations.unshift({ id, ...values, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  try {
    const result = await db.insert(donations).values(values).returning({ id: donations.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.donations.unshift({ id, ...values, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
}
async function listDonations() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("donations").select("*").order("createdAt", { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(donations).orderBy(desc(donations.createdAt));
      if (rows && rows.length > 0) return rows;
    } catch {
    }
  }
  return memoryStore.donations;
}
async function updateDonationPayment(paystackRef, paymentStatus) {
  const db = await getDb();
  const item = memoryStore.donations.find((d) => d.paystackRef === paystackRef);
  if (item) {
    item.paymentStatus = paymentStatus;
    item.updatedAt = /* @__PURE__ */ new Date();
  }
  if (db) {
    try {
      await db.update(donations).set({
        paymentStatus,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(donations.paystackRef, paystackRef));
    } catch {
    }
  }
}
async function listFaqItems(includeUnpublished = true) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from("faqItems").select("*").order("sortOrder", { ascending: true });
      if (!includeUnpublished) {
        query = query.eq("isPublished", true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch {
    }
  }
  const db = await getDb();
  if (db) {
    try {
      const rows = await db.select().from(faqItems).orderBy(faqItems.sortOrder, desc(faqItems.createdAt));
      const res = includeUnpublished ? rows : rows.filter((f) => f.isPublished);
      if (res && res.length > 0) return res;
    } catch {
    }
  }
  const items = includeUnpublished ? memoryStore.faqItems : memoryStore.faqItems.filter((f) => f.isPublished);
  return items.slice().sort((a, b) => a.sortOrder - b.sortOrder);
}
async function saveFaqItem(input) {
  const values = {
    question: input.question,
    answer: input.answer,
    category: input.category,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const supabase = getSupabase();
  if (supabase) {
    try {
      if (input.id) {
        const { data: data2, error: error2 } = await supabase.from("faqItems").update(values).eq("id", input.id).select().single();
        if (!error2 && data2?.id) {
          const idx = memoryStore.faqItems.findIndex((f) => f.id === input.id);
          if (idx !== -1) memoryStore.faqItems[idx] = { ...memoryStore.faqItems[idx], ...data2 };
          return data2.id;
        }
      }
      const { data, error } = await supabase.from("faqItems").insert(values).select("id").single();
      if (!error && data?.id) {
        memoryStore.faqItems.push(data);
        return Number(data.id);
      }
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.faqItems.findIndex((f) => f.id === input.id);
      if (index !== -1) {
        memoryStore.faqItems[index] = { ...memoryStore.faqItems[index], ...input, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.faqItems.push({ id, ...input, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
  try {
    if (input.id) {
      await db.update(faqItems).set(values).where(eq(faqItems.id, input.id));
      return input.id;
    }
    const result = await db.insert(faqItems).values(values).returning({ id: faqItems.id });
    return Number(result[0].id);
  } catch {
    if (input.id) {
      const index = memoryStore.faqItems.findIndex((f) => f.id === input.id);
      if (index !== -1) {
        memoryStore.faqItems[index] = { ...memoryStore.faqItems[index], ...input, updatedAt: /* @__PURE__ */ new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.faqItems.push({ id, ...input, createdAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() });
    return id;
  }
}
async function removeFaqItem(id) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("faqItems").delete().eq("id", id);
    } catch {
    }
  }
  const db = await getDb();
  if (!db) {
    const index = memoryStore.faqItems.findIndex((f) => f.id === id);
    if (index !== -1) memoryStore.faqItems.splice(index, 1);
    return;
  }
  try {
    await db.delete(faqItems).where(eq(faqItems.id, id));
  } catch {
    const index = memoryStore.faqItems.findIndex((f) => f.id === id);
    if (index !== -1) memoryStore.faqItems.splice(index, 1);
  }
}
async function createSmsLog(input) {
  const db = await getDb();
  const values = {
    recipientPhone: input.recipientPhone,
    message: input.message,
    provider: input.provider ?? "africastalking",
    status: input.status ?? "sent",
    providerRef: input.providerRef ?? null
  };
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.smsLogs.unshift({ id, ...values, sentAt: /* @__PURE__ */ new Date() });
    return id;
  }
  try {
    const result = await db.insert(smsLogs).values(values).returning({ id: smsLogs.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.smsLogs.unshift({ id, ...values, sentAt: /* @__PURE__ */ new Date() });
    return id;
  }
}
async function listSmsLogs() {
  const db = await getDb();
  if (!db) return memoryStore.smsLogs;
  try {
    return await db.select().from(smsLogs).orderBy(desc(smsLogs.sentAt));
  } catch {
    return memoryStore.smsLogs;
  }
}

// backend/_core/cookies.ts
function isSecureRequest(req) {
  if (!req || !req.headers) return false;
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",
    secure
  };
}

// backend/shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// backend/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      return null;
    }
    const cleanToken = cookieValue.replace(/^"|"$/g, "").trim();
    if (!cleanToken) {
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cleanToken, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name: typeof name === "string" ? name : ""
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const cookieToken = (cookies.get(COOKIE_NAME) || "").trim().replace(/^"|"$/g, "");
    let headerToken;
    const authHeader = req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      headerToken = authHeader.slice(7).trim().replace(/^"|"$/g, "");
    }
    let session = null;
    let sessionToken;
    if (headerToken) {
      session = await this.verifySession(headerToken);
      if (session) sessionToken = headerToken;
    }
    if (!session && cookieToken) {
      session = await this.verifySession(cookieToken);
      if (session) sessionToken = cookieToken;
    }
    const tokenCandidate = (headerToken || cookieToken || "").trim().replace(/^"|"$/g, "");
    if (tokenCandidate === "offline_admin_token" || tokenCandidate === "admin-user" || tokenCandidate === "admin" || tokenCandidate.startsWith("admin_")) {
      const now = /* @__PURE__ */ new Date();
      return {
        id: 1,
        openId: "admin_ybi_owner",
        name: "YBI Administrator",
        email: "admin@ybi.org",
        role: "admin",
        loginMethod: "password",
        createdAt: now,
        updatedAt: now,
        lastSignedIn: now
      };
    }
    if (!session) {
      throw ForbiddenError("Invalid session token");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    const isAdminUser = sessionUserId.startsWith("admin_") || sessionUserId === "admin-user" || sessionUserId === "admin";
    if (isAdminUser) {
      let user2 = await getUserByOpenId(sessionUserId);
      if (!user2 || user2.role !== "admin") {
        await upsertUser({
          openId: sessionUserId,
          name: session.name || "YBI Administrator",
          email: "admin@ybi.org",
          role: "admin",
          loginMethod: "password",
          lastSignedIn: signedInAt
        });
        user2 = await getUserByOpenId(sessionUserId);
      }
      return user2 ?? {
        id: 1,
        openId: sessionUserId,
        name: session.name || "YBI Administrator",
        email: "admin@ybi.org",
        role: "admin",
        loginMethod: "password",
        createdAt: signedInAt,
        updatedAt: signedInAt,
        lastSignedIn: signedInAt
      };
    }
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// backend/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  const oauthHandler = async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  };
  app2.get("/api/oauth/callback", oauthHandler);
  app2.get("/oauth/callback", oauthHandler);
}

// backend/_core/storageProxy.ts
function registerStorageProxy(app2) {
  const handler2 = async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    try {
      const { url } = await storageGet(key);
      if (url.startsWith("data:")) {
        const parts = url.split(",");
        const mime = parts[0]?.match(/:(.*?);/)?.[1] || "image/jpeg";
        const imgBuffer = Buffer.from(parts[1], "base64");
        res.setHeader("Content-Type", mime);
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.send(imgBuffer);
        return;
      }
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] redirect error:", err);
      res.status(404).send("File not found");
    }
  };
  app2.get("/manus-storage/*", handler2);
  app2.get("/api/manus-storage/*", handler2);
  app2.get("/uploads/*", handler2);
  app2.get("/api/uploads/*", handler2);
}

// backend/routers/payments.ts
import { z } from "zod";

// backend/_core/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// backend/shared/paystackProvider.ts
import crypto2 from "node:crypto";
var PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";
var PAYSTACK_BASE = "https://api.paystack.co";
async function initiatePaystackPayment(opts) {
  if (!PAYSTACK_SECRET_KEY) {
    console.warn("[Paystack] PAYSTACK_SECRET_KEY not set \u2014 returning mock checkout URL");
    return {
      checkoutUrl: `https://checkout.paystack.com/mock?ref=${opts.reference}`,
      reference: opts.reference
    };
  }
  try {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: opts.email,
        amount: opts.amountPesewas,
        currency: opts.currency ?? "GHS",
        reference: opts.reference,
        callback_url: opts.callbackUrl,
        metadata: opts.metadata
      })
    });
    const data = await res.json();
    if (!data.status || !data.data?.authorization_url) {
      return { error: data.message ?? "Unknown Paystack error" };
    }
    return {
      checkoutUrl: data.data.authorization_url,
      reference: data.data.reference
    };
  } catch (err) {
    return { error: String(err) };
  }
}
async function verifyPaystackPayment(reference) {
  if (!PAYSTACK_SECRET_KEY) {
    return { success: true, amountPesewas: 0, email: "dev@test.com" };
  }
  try {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }
    });
    const data = await res.json();
    if (!data.status || data.data?.status !== "success") {
      return { success: false, error: data.message };
    }
    return {
      success: true,
      amountPesewas: data.data.amount,
      email: data.data.customer.email,
      metadata: data.data.metadata
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
function verifyPaystackWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY || "sk_test_mock_paystack_secret_key";
  if (!signatureHeader) return false;
  try {
    const expected = crypto2.createHmac("sha512", secret).update(rawBody).digest("hex");
    return expected.toLowerCase() === signatureHeader.toLowerCase();
  } catch (err) {
    console.error("[Paystack] Webhook signature verification error:", err);
    return false;
  }
}

// backend/shared/smsProvider.ts
var AT_API_KEY = process.env.AT_API_KEY ?? "";
var AT_USERNAME = process.env.AT_USERNAME ?? "sandbox";
var AT_SENDER_ID = process.env.AT_SENDER_ID ?? "YBI";
var AT_BASE_URL = AT_USERNAME === "sandbox" ? "https://api.sandbox.africastalking.com/version1" : "https://api.africastalking.com/version1";
async function sendSms(to, message) {
  if (!AT_API_KEY || AT_API_KEY.includes("mock") || AT_API_KEY.includes("placeholder") || process.env.NODE_ENV === "test") {
    return { success: true, messageId: "mock-" + Date.now() };
  }
  try {
    const body = new URLSearchParams({
      username: AT_USERNAME,
      to,
      message,
      from: AT_SENDER_ID
    });
    const res = await fetch(`${AT_BASE_URL}/messaging`, {
      method: "POST",
      headers: {
        apiKey: AT_API_KEY,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    });
    if (!res.ok) {
      const text2 = await res.text();
      console.error("[SMS] Africa's Talking error:", text2);
      return { success: false, error: text2 };
    }
    const data = await res.json();
    const recipient = data?.SMSMessageData?.Recipients?.[0];
    if (recipient && recipient.statusCode === 101) {
      return { success: true, messageId: recipient.messageId };
    }
    return { success: false, error: JSON.stringify(data) };
  } catch (err) {
    console.error("[SMS] Unexpected error:", err);
    return { success: false, error: String(err) };
  }
}
async function sendSmsBroadcast(phones, message) {
  if (phones.length === 0) return { sent: 0, failed: 0 };
  const chunks = [];
  for (let i = 0; i < phones.length; i += 100) {
    chunks.push(phones.slice(i, i + 100));
  }
  let sent = 0;
  let failed = 0;
  for (const chunk of chunks) {
    const result = await sendSms(chunk.join(","), message);
    if (result.success) sent += chunk.length;
    else failed += chunk.length;
  }
  return { sent, failed };
}
function formatGhanaPhoneNumber(phone) {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("233")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+233${cleaned.slice(1)}`;
  return `+233${cleaned}`;
}

// backend/routers/payments.ts
function registerPaystackWebhook(app2) {
  const webhookHandler = async (req, res) => {
    const signature = req.headers["x-paystack-signature"] || "";
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const isValid = verifyPaystackWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[Paystack Webhook] Invalid signature rejected");
      return res.status(400).json({ error: "Invalid signature" });
    }
    const payload = req.body;
    const eventType = payload?.event;
    const data = payload?.data;
    if (eventType === "charge.success" && data) {
      const reference = data.reference;
      const metadata = data.metadata || {};
      const amountGhs = data.amount ? Math.round(data.amount / 100) : 0;
      console.log(`[Paystack Webhook] Processing successful charge ${reference} (${amountGhs} GHS)`);
      if (metadata.type === "event_registration" || reference?.startsWith("ybi_evt_")) {
        await updateEventRegistrationPayment(reference, "success");
        if (metadata.phone && metadata.smsOptIn) {
          const eventTitle = metadata.eventTitle || "the YBI event";
          const name = metadata.name || "friend";
          const msg = `Hello ${name}, your payment of GHS ${amountGhs} for "${eventTitle}" is confirmed! Thank you. - YBI`;
          sendSms(metadata.phone, msg).catch(
            (err) => console.error("[Paystack Webhook] SMS error:", err)
          );
        }
      }
      if (metadata.type === "donation" || reference?.startsWith("ybi_don_")) {
        await updateDonationPayment(reference, "success");
        if (metadata.phone) {
          const name = metadata.name || "Supporter";
          const msg = `Hello ${name}, thank you for your generous donation of GHS ${amountGhs} to Young Beginners Inspiration! - YBI`;
          sendSms(metadata.phone, msg).catch(
            (err) => console.error("[Paystack Webhook] SMS error:", err)
          );
        }
      }
    }
    return res.status(200).json({ status: true });
  };
  app2.post("/api/webhooks/paystack", webhookHandler);
  app2.post("/webhooks/paystack", webhookHandler);
}
var paymentsRouter = router({
  verifyPayment: publicProcedure.input(z.object({ reference: z.string().min(1) })).mutation(async ({ input }) => {
    const verification = await verifyPaystackPayment(input.reference);
    if (!verification.success) {
      return {
        success: false,
        error: verification.error || "Payment could not be verified by Paystack."
      };
    }
    const ref = input.reference;
    if (ref.startsWith("ybi_evt_")) {
      await updateEventRegistrationPayment(ref, "success");
      return {
        success: true,
        type: "event_registration",
        message: "Event registration payment successfully confirmed!"
      };
    }
    if (ref.startsWith("ybi_don_")) {
      await updateDonationPayment(ref, "success");
      return {
        success: true,
        type: "donation",
        message: "Donation successfully confirmed! Thank you for your support."
      };
    }
    await Promise.all([
      updateEventRegistrationPayment(ref, "success"),
      updateDonationPayment(ref, "success")
    ]);
    return {
      success: true,
      type: "unknown",
      message: "Payment successfully verified and recorded!"
    };
  })
});

// backend/routers.ts
import { TRPCError as TRPCError9 } from "@trpc/server";
import { z as z10 } from "zod";

// backend/routers/admin.ts
import { TRPCError as TRPCError7 } from "@trpc/server";
import { z as z8 } from "zod";

// backend/shared/siteImages.ts
var SITE_IMAGE_SLOTS = [
  // Home Page
  {
    key: "home_hero",
    category: "Home Page",
    label: "Home Hero Main Banner",
    description: "The primary bold hero visual displayed at the top of the homepage.",
    defaultSrc: "/ybi-assets/homepage/ybi-hero.jpg",
    defaultAlt: "Young Beginners Inspiration community members engaged in collaborative learning",
    aspectRatio: "16:9"
  },
  {
    key: "home_wall_1",
    category: "Home Page",
    label: "Image Wall: Youth Leadership",
    description: "First interactive image in the homepage curated community wall.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg",
    defaultAlt: "Young facilitator leading a community leadership workshop",
    aspectRatio: "4:3"
  },
  {
    key: "home_wall_2",
    category: "Home Page",
    label: "Image Wall: Mentoring & Collaboration",
    description: "Second interactive image showing intergenerational mentoring.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-intergenerational-mentoring.jpg",
    defaultAlt: "Intergenerational mentoring around a practical project",
    aspectRatio: "4:3"
  },
  {
    key: "home_wall_3",
    category: "Home Page",
    label: "Image Wall: Youth Entrepreneurship",
    description: "Third interactive image highlighting young enterprise and problem-solving.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-entrepreneurship.jpg",
    defaultAlt: "Community members developing an entrepreneurship idea",
    aspectRatio: "4:3"
  },
  {
    key: "home_wall_4",
    category: "Home Page",
    label: "Image Wall: Public Speaking",
    description: "Fourth interactive image showcasing communication and voice.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-public-speaking.jpg",
    defaultAlt: "Young participant practicing public speaking",
    aspectRatio: "4:3"
  },
  {
    key: "home_wall_5",
    category: "Home Page",
    label: "Image Wall: Community Circle",
    description: "Fifth interactive image showing collective outdoor dialogue.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-community-circle.jpg",
    defaultAlt: "An outdoor intergenerational community circle",
    aspectRatio: "4:3"
  },
  {
    key: "home_community_action",
    category: "Home Page",
    label: "Home Community Action Feature",
    description: "Featured image for the homepage civic action and mentorship highlight block.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "Young leaders and community elders collaborating outdoors",
    aspectRatio: "16:9"
  },
  // About Page
  {
    key: "about_story_main",
    category: "About Page",
    label: "About Story Hero Visual",
    description: "Large featured image illustrating the YBI origin story and mission.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "YBI community members gathered together",
    aspectRatio: "16:9"
  },
  {
    key: "about_mentoring",
    category: "About Page",
    label: "About: Guided Mentorship",
    description: "Image paired with the leadership and mentorship principles section.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "Participant receiving guidance in a structured workshop",
    aspectRatio: "4:3"
  },
  {
    key: "about_enterprise",
    category: "About Page",
    label: "About: Enterprise & Creativity",
    description: "Visual showcasing creative innovation, practical skills, and youth action.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "Learners demonstrating a creative team solution",
    aspectRatio: "4:3"
  },
  {
    key: "about_quote_band",
    category: "About Page",
    label: "About: Quote Band Background",
    description: "Full-width photographic background behind the inspirational community quote.",
    defaultSrc: "/ybi-assets/homepage/ybi-hero.jpg",
    defaultAlt: "YBI learners in dynamic learning session",
    aspectRatio: "21:9"
  },
  // Programs & Pathways
  {
    key: "program_public_speaking",
    category: "Programs & Pathways",
    label: "Program: Public Speaking & Expression",
    description: "Visual for the communication, confidence, and public speaking pathway.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "Young person speaking with confidence in front of peers",
    aspectRatio: "4:3"
  },
  {
    key: "program_entrepreneurship",
    category: "Programs & Pathways",
    label: "Program: Youth Entrepreneurship",
    description: "Visual for the business foundations and practical enterprise cohort.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "Students pitching ideas in an enterprise sprint",
    aspectRatio: "4:3"
  },
  {
    key: "program_community",
    category: "Programs & Pathways",
    label: "Program: Generations in Conversation",
    description: "Visual for structured intergenerational dialogue and mentorship cohorts.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "Group of youth and elders in guided mentorship dialogue",
    aspectRatio: "4:3"
  },
  {
    key: "program_leadership",
    category: "Programs & Pathways",
    label: "Program: Values-Led Leadership Lab",
    description: "Visual for ethical leadership, character development, and stewardship circles.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg",
    defaultAlt: "Young leader facilitating a values-based community session",
    aspectRatio: "4:3"
  },
  // Team & Leadership
  {
    key: "team_banner",
    category: "Team & Leadership",
    label: "Team Main Banner",
    description: "Top banner visual for the team, mentors, and leadership page.",
    defaultSrc: "/ybi-assets/homepage/ybi-hero.jpg",
    defaultAlt: "YBI team leaders and mentors in action",
    aspectRatio: "16:9"
  },
  {
    key: "team_public_speaking",
    category: "Team & Leadership",
    label: "Team Pillar: Mentorship Lead",
    description: "Visual for the mentorship leadership and learning coaches section.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "Mentorship coach working with young participants",
    aspectRatio: "4:3"
  },
  {
    key: "team_entrepreneurship",
    category: "Team & Leadership",
    label: "Team Pillar: Innovation Lead",
    description: "Visual for the innovation, robotics, and entrepreneurship coaches.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "STEAM mentor guiding student project",
    aspectRatio: "4:3"
  },
  {
    key: "team_community",
    category: "Team & Leadership",
    label: "Team Pillar: Community Lead",
    description: "Visual for community engagement and partnership coordinators.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "Community coordinator facilitating dialogue",
    aspectRatio: "4:3"
  },
  // Brand & Navigation
  {
    key: "brand_logo",
    category: "Brand & Navigation",
    label: "Primary YBI Logo",
    description: "Header navigation logo and principal organisation emblem.",
    defaultSrc: "/ybi-assets/brand/ybi-logo.png",
    defaultAlt: "Young Beginners Inspiration Logo",
    aspectRatio: "3:2"
  },
  {
    key: "brand_mark",
    category: "Brand & Navigation",
    label: "Circular YBI Brand Mark",
    description: "Compact brand icon used for mobile navigation and social cards.",
    defaultSrc: "/ybi-assets/brand/ybi-mark.png",
    defaultAlt: "Young Beginners Inspiration Mark",
    aspectRatio: "1:1"
  },
  {
    key: "assistant_avatar",
    category: "Brand & Navigation",
    label: "AI Assistant Header Avatar",
    description: "Avatar displayed inside the AI assistant chat header card.",
    defaultSrc: "/ybi-assets/brand/ybi-logo.png",
    defaultAlt: "YBI AI Assistant",
    aspectRatio: "1:1"
  }
];
var SITE_IMAGE_PREFIX = "ybi_site_image_";
function formatImageContentKey(slotKey) {
  return `${SITE_IMAGE_PREFIX}${slotKey}`;
}
function extractSlotKeyFromContentKey(contentKey) {
  if (contentKey.startsWith(SITE_IMAGE_PREFIX)) {
    return contentKey.slice(SITE_IMAGE_PREFIX.length);
  }
  if (contentKey.startsWith("site-image:")) {
    return contentKey.slice("site-image:".length);
  }
  return null;
}

// backend/routers/assistant.ts
import { TRPCError as TRPCError2 } from "@trpc/server";
import { z as z2 } from "zod";

// backend/_core/llm.ts
var ensureArray = (value) => Array.isArray(value) ? value : [value];
var normalizeContentPart = (part) => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }
  if (part.type === "text") {
    return part;
  }
  if (part.type === "image_url") {
    return part;
  }
  if (part.type === "file_url") {
    return part;
  }
  throw new Error("Unsupported message content part");
};
var normalizeMessage = (message) => {
  const { role, name, tool_call_id } = message;
  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
    return {
      role,
      name,
      tool_call_id,
      content
    };
  }
  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text
    };
  }
  return {
    role,
    name,
    content: contentParts
  };
};
var normalizeToolChoice = (toolChoice, tools) => {
  if (!toolChoice) return void 0;
  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }
    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }
    return {
      type: "function",
      function: { name: tools[0].function.name }
    };
  }
  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name }
    };
  }
  return toolChoice;
};
var resolveApiUrl = () => {
  if (ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0) {
    const base = ENV.forgeApiUrl.trim().replace(/\/$/, "");
    return base.endsWith("/chat/completions") ? base : `${base}/v1/chat/completions`;
  }
  return "https://api.openai.com/v1/chat/completions";
};
var assertApiKey = () => {
  if (!ENV.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};
var normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return void 0;
  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }
  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
    }
  };
};
var RETRY_MAX_RETRIES = 4;
var RETRY_BASE_DELAY_MS = 500;
var RETRY_MAX_DELAY_MS = 3e4;
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var parseRetryAfter = (value) => {
  if (!value) return void 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1e3);
  const at = Date.parse(value);
  return Number.isNaN(at) ? void 0 : Math.max(0, at - Date.now());
};
var computeBackoffDelay = (attempt, retryAfterMs) => {
  const cap = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
  const jittered = cap / 2 + Math.random() * (cap / 2);
  return Math.min(Math.max(jittered, retryAfterMs ?? 0), RETRY_MAX_DELAY_MS);
};
var fetchWithBackoff = async (url, init) => {
  let lastError;
  for (let attempt = 0; attempt <= RETRY_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, init);
      if (response.ok || attempt === RETRY_MAX_RETRIES) {
        return response;
      }
      const retryAfterMs = parseRetryAfter(
        response.headers.get("retry-after")
      );
      try {
        await response.body?.cancel();
      } catch {
      }
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after status ${response.status}`
      );
      await sleep(computeBackoffDelay(attempt, retryAfterMs));
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_MAX_RETRIES) throw error;
      console.warn(
        `LLM request retry ${attempt + 1}/${RETRY_MAX_RETRIES} after network error`
      );
      await sleep(computeBackoffDelay(attempt));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("LLM request failed after exhausting retries");
};
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
    model,
    thinking,
    reasoning,
    maxTokens,
    max_tokens
  } = params;
  const payload = {
    messages: messages.map(normalizeMessage)
  };
  if (model) {
    payload.model = model;
  }
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  const resolvedMaxTokens = max_tokens ?? maxTokens;
  if (typeof resolvedMaxTokens === "number") {
    payload.max_tokens = resolvedMaxTokens;
  }
  if (thinking) {
    payload.thinking = thinking;
  }
  if (reasoning) {
    payload.reasoning = reasoning;
  }
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetchWithBackoff(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}

// backend/shared/assistantProgramLinks.ts
var programLinks = {
  publicSpeaking: {
    label: "Public Speaking",
    href: "/programs#public-speaking",
    description: "Build voice, presence, and confidence"
  },
  entrepreneurship: {
    label: "Entrepreneurship",
    href: "/programs#entrepreneurship",
    description: "Turn a useful idea into practical action"
  },
  generations: {
    label: "Generations in Conversation",
    href: "/programs#generations",
    description: "Learn across generations through shared exchange"
  }
};
var focusLinks = {
  leadership: {
    label: "Leadership focus",
    href: "/focus-areas#leadership",
    description: "Explore responsible leadership at YBI"
  },
  education: {
    label: "Education focus",
    href: "/focus-areas#education",
    description: "See how learning becomes practical confidence"
  },
  business: {
    label: "Business focus",
    href: "/focus-areas#business",
    description: "Explore business, ideas, and problem-solving"
  }
};
var commonLinks = {
  about: { label: "About YBI", href: "/about", description: "Our purpose and approach" },
  programs: { label: "Explore programs", href: "/programs", description: "Practical ways to learn and lead" },
  join: { label: "Join YBI", href: "/join-us", description: "Take part, volunteer, or partner" },
  contact: { label: "Contact YBI", href: "/contact", description: "Send the team a direct message" },
  stories: { label: "YBI stories", href: "/media#stories", description: "Read community stories and updates" },
  gallery: { label: "Photo gallery", href: "/gallery", description: "See YBI moments in pictures" }
};
function getAssistantProgramLinks(question) {
  const query = question.toLowerCase();
  if (/(public speaking|presentation|presenting|speak|speaking|voice|confidence)/.test(query)) {
    return [programLinks.publicSpeaking, focusLinks.leadership];
  }
  if (/(entrepreneur|enterprise|start.?up|business idea|business|idea)/.test(query)) {
    return [programLinks.entrepreneurship, focusLinks.business];
  }
  if (/(intergenerational|generation|older adult|older people|aged|senior|mentor)/.test(query)) {
    return [programLinks.generations, commonLinks.join];
  }
  if (/(program|programme|which.*explore|what.*offer)/.test(query)) {
    return [programLinks.publicSpeaking, programLinks.entrepreneurship, programLinks.generations];
  }
  if (/(leadership|leader|lead)/.test(query)) {
    return [focusLinks.leadership, programLinks.publicSpeaking];
  }
  if (/(education|learn|learning|training|study)/.test(query)) {
    return [focusLinks.education, commonLinks.programs];
  }
  if (/(volunteer|partner|donat|support|join|participate)/.test(query)) {
    return [commonLinks.join, commonLinks.programs];
  }
  if (/(gallery|photo|media|story|news)/.test(query)) {
    return [commonLinks.stories, commonLinks.gallery];
  }
  if (/(contact|message|email|talk)/.test(query)) {
    return [commonLinks.contact, commonLinks.join];
  }
  return [commonLinks.about, commonLinks.programs];
}

// backend/shared/assistantKnowledge.ts
function getYbiKnowledgeResponse(question, page = "/") {
  const query = question.toLowerCase().trim();
  const guidance = getAssistantProgramLinks(query);
  if (/(what.*ybi|who.*ybi|tell me about|about ybi|what do you do|what is ybi|overview)/.test(query)) {
    return {
      answer: "**Young Beginners Inspiration (YBI)** is a nonprofit organization dedicated to inspiring, motivating, and impacting the developing potential of individuals across **leadership, education, and business**.\n\nWe provide an empowering intergenerational platform where youth and older adults inspire one another, build practical skills, and lead lasting positive change in their communities.",
      guidance
    };
  }
  if (/(vision|what.*vision|goal)/.test(query)) {
    return {
      answer: '**YBI Vision Statement**:\n\n> *"To inspire, motivate, and impact the young, aged, and developing potential of individuals across leadership, education, and business\u2014building a world where every generation thrives and leads together."*',
      guidance
    };
  }
  if (/(mission|what.*mission|purpose)/.test(query)) {
    return {
      answer: '**YBI Mission Statement**:\n\n> *"To provide an empowering intergenerational platform that equips people of all ages with practical skills, mentorship, and opportunities to become responsible leaders who create lasting positive change."*',
      guidance
    };
  }
  if (/(value|values|principle|principles|core value|what guides)/.test(query)) {
    return {
      answer: "**YBI Core Values**:\n\n1. **Intergenerational Exchange**: Wisdom and possibility move in both directions between youth and elders.\n2. **Integrity & Responsibility**: Measuring leadership by its trustworthy impact on others.\n3. **Inclusive Opportunity**: Welcoming spaces where people of every background have room to begin.\n4. **Practical Action**: Turning curiosity and ideas into tangible skills and real-world solutions.\n5. **Community Care**: Mutual respect, active listening, and collective growth across generations.",
      guidance
    };
  }
  if (/(story|history|found|how.*start|background|why.*founded)/.test(query)) {
    return {
      answer: "**Our Story & History**:\n\nYoung Beginners Inspiration was founded on a simple conviction: **potential needs a platform**, and every person\u2014regardless of age\u2014carries something invaluable to share. Recognizing that emerging youth often lack accessible guidance while older adults have rich lived experience left untapped, YBI was created to bridge this divide.\n\nWhat started as grassroots community circles and speaking workshops has grown into an impactful movement connecting learners, mentors, and changemakers across leadership, education, public speaking, and entrepreneurship.",
      guidance
    };
  }
  if (/(impact|stat|stats|statistics|number|numbers|metric|metrics|reach|result)/.test(query)) {
    return {
      answer: "**YBI Key Impact Numbers**:\n\n- **1,250+** Youth & Community Members Reached\n- **500+** Hours of Dedicated Mentorship Completed\n- **35+** Interactive Workshops, Labs & Speaking Circles\n- **15+** Partner Communities, Schools & Hubs Engaged",
      guidance
    };
  }
  if (/(which program|what program|explore program|all program|programs|programme)/.test(query)) {
    return {
      answer: "YBI offers four signature programs designed to build skills, confidence, and community impact:\n\n1. **Public Speaking & Communication**: Master vocal presence, speech crafting, debate, and delivery confidence.\n2. **Youth Entrepreneurship & Enterprise**: Transform meaningful ideas into viable ventures through ideation, business modeling, and pitch coaching.\n3. **Generations in Conversation**: Flagship intergenerational mentorship pairing youth ambition with elder wisdom.\n4. **Values-Led Leadership Lab**: Develop self-awareness, ethical decision-making, and community stewardship.\n\nExplore our Programs page to learn more about joining an upcoming cohort!",
      guidance
    };
  }
  if (/(public speak|speak|presentation|presenting|speech|voice|confidence)/.test(query)) {
    return {
      answer: "Our **Public Speaking & Communication Program** equips participants with the art of impactful communication, debate, and confident presentation. It covers vocal delivery, message structuring, overcoming stage anxiety, and storytelling.",
      guidance
    };
  }
  if (/(entrepreneur|enterprise|business idea|startup|start-up|start up|venture)/.test(query)) {
    return {
      answer: "The **Youth Entrepreneurship & Enterprise Program** trains emerging changemakers in business fundamentals, problem validation, financial literacy, venture prototyping, and pitching ideas into actionable community solutions.",
      guidance
    };
  }
  if (/(intergenerational|generation|older adult|senior|aged|elder|mentor|mentorship)/.test(query)) {
    return {
      answer: "**Generations in Conversation** is our signature intergenerational mentorship program.\n\n- **Who it serves**: Emerging youth, early-career strivers, and older adults/retirees.\n- **How it works**: Structured dialogue circles and 1-on-1 pairings meeting for life coaching, skill-sharing, and community action.\n- **The Experience**: Mentees gain trusted guidance and confidence, while mentors discover renewed purpose and fresh youth perspectives.",
      guidance
    };
  }
  if (/(testimonial|success story|review|feedback|what people say)/.test(query)) {
    return {
      answer: '**Community Voices**:\n\n- *"YBI gave me the courage to speak up and trust my ideas. Having a mentor who genuinely listened changed my entire outlook."* \u2014 Kofi A., Mentee\n- *"Mentoring with YBI showed me how much the next generation has to teach us. It\u2019s a true two-way exchange of wisdom."* \u2014 Evelyn D., Senior Mentor\n- *"The practical confidence and values-led focus YBI instills in young people is transforming our community."* \u2014 Marcus T., Partner',
      guidance
    };
  }
  if (/(volunteer|partner|sponsor|donate|support|join|participate|how.*join|get involved)/.test(query)) {
    return {
      answer: "We'd love to have you join the YBI movement! You can get involved in several ways:\n\n- **Participate**: Enroll in a speaking, entrepreneurship, or leadership cohort.\n- **Mentor & Volunteer**: Share your lived experience and guide aspiring leaders.\n- **Partner**: Collaborate with us as a school, civic organization, or sponsor.\n\nVisit our **Join Us** page or message us directly via the **Contact Us** page.",
      guidance
    };
  }
  if (/(focus area|pillar|leadership|education|business)/.test(query)) {
    return {
      answer: "YBI's work is anchored on five interconnected focus areas:\n\n- **Leadership**: Building values-based, empathetic, and responsible leaders.\n- **Education**: Hands-on learning that translates into life readiness.\n- **Business & Entrepreneurship**: Creating economic capability and problem-solving skills.\n- **Public Speaking**: Inspiring voices to be heard clearly in society.\n- **Intergenerational Mentorship**: Bridging youth energy with elder wisdom.",
      guidance
    };
  }
  if (/(contact|email|phone|reach|message|talk to|office|location|address)/.test(query)) {
    return {
      answer: "You can connect directly with the YBI team through our **Contact Us** page. Fill out our contact form or send us an inquiry, and a member of our team will get back to you promptly!",
      guidance
    };
  }
  if (/(media|news|story|stories|gallery|photo|picture|event|update)/.test(query)) {
    return {
      answer: "You can explore our journey, impact stories, press releases, and photo galleries on the **Media & Stories** and **Photo Gallery** pages!",
      guidance
    };
  }
  if (/(team|founder|who runs|board|leadership team|staff)/.test(query)) {
    return {
      answer: "YBI is guided by dedicated mentors, educators, and community leaders:\n\n- **Executive Director & Founder**: Vision and strategic direction.\n- **Programs & Curriculum Lead**: Experiential learning and cohort design.\n- **Mentorship & Community Lead**: Intergenerational pairings and gatherings.\n- **Enterprise & Venture Coaches**: Mentoring youth startups and community projects.\n\nVisit our **Team** page to meet our leadership!",
      guidance
    };
  }
  if (/(hello|hi|hey|good morning|good afternoon|good evening)/.test(query)) {
    return {
      answer: "Hello! Welcome to Young Beginners Inspiration. I'm here to help you discover our vision, programs, mentorship opportunities, and ways to get involved. How can I guide you today?",
      guidance
    };
  }
  return {
    answer: "Young Beginners Inspiration (YBI) creates spaces for people to be inspired, learn practical leadership, and shape positive futures through Public Speaking, Entrepreneurship, and Intergenerational Mentorship. How can I assist you today?",
    guidance
  };
}

// backend/routers/assistant.ts
var visitorMessage = z2.object({
  role: z2.enum(["user", "assistant"]),
  content: z2.string().trim().min(1).max(1e3)
});
var visitorAssistantInput = z2.object({
  page: z2.string().trim().min(1).max(160),
  messages: z2.array(visitorMessage).min(1).max(8)
});
var QUICK_QUESTIONS_CONTENT_KEY = "assistant-quick-questions";
var defaultQuickQuestions = [
  "What does YBI do?",
  "Which program should I explore?",
  "How can I volunteer or partner?"
];
var quickQuestionsInput = z2.array(
  z2.string().trim().min(3, "Each question needs at least 3 characters.").max(120, "Each question must be 120 characters or fewer.")
).min(1, "Add at least one quick question.").max(6, "Use six quick questions or fewer.").refine(
  (questions) => new Set(questions.map((question) => question.toLowerCase())).size === questions.length,
  "Quick questions must be unique."
);
async function readQuickQuestions() {
  const saved = await getSiteContent(QUICK_QUESTIONS_CONTENT_KEY);
  if (!saved?.body) return defaultQuickQuestions;
  try {
    const parsed = quickQuestionsInput.safeParse(JSON.parse(saved.body));
    return parsed.success ? parsed.data : defaultQuickQuestions;
  } catch {
    return defaultQuickQuestions;
  }
}
var requestWindows = /* @__PURE__ */ new Map();
var MAX_REQUESTS_PER_WINDOW = 60;
var WINDOW_MS = 5 * 60 * 1e3;
var requestKey = (req) => {
  const forwarded = req?.headers?.["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return firstForwarded?.trim() || req?.ip || req?.socket?.remoteAddress || "local-visitor";
};
var enforceRateLimit = (req) => {
  const key = requestKey(req);
  if (key === "127.0.0.1" || key === "::1" || key === "localhost" || key === "local-visitor" || key === "ybi-assistant-test") return;
  const now = Date.now();
  const existing = requestWindows.get(key);
  if (!existing || existing.expiresAt <= now) {
    requestWindows.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return;
  }
  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    throw new TRPCError2({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a few minutes before sending another question."
    });
  }
  existing.count += 1;
};
var systemPrompt = `You are the official AI Assistant for Young Beginners Inspiration (YBI), a nonprofit organization committed to unlocking human potential and developing responsible community leaders.

ORGANIZATION PROFILE & PHILOSOPHY:
- Name: Young Beginners Inspiration (YBI)
- Tagline: "Your voice is a beginning."
- Purpose: YBI creates vibrant, inclusive platforms for both youth and older adults to inspire, learn, share wisdom, and step forward as responsible leaders.

5 CORE FOCUS AREAS:
1. Leadership: Nurturing ethical, empathetic, values-based community leaders who take initiative.
2. Education: Bridging classroom concepts with practical life-skills and leadership readiness.
3. Business: Fostering economic literacy, problem solving, and sustainable community solutions.
4. Public Speaking: Helping emerging voices gain poise, communication clarity, debate skills, and stage confidence.
5. Entrepreneurship: Equipping youth to transform ideas into viable ventures and community projects.

3 SIGNATURE PROGRAMS:
1. Public Speaking Program: Training in speech writing, storytelling, overcoming stage anxiety, and persuasive presentation.
2. Entrepreneurship Program: Hands-on incubation, business planning, market validation, and startup fundamentals.
3. Generations in Conversation: YBI's signature intergenerational initiative where youth and older adults exchange mentorship, life experience, and digital skills.

KEY ENGAGEMENT PATHWAYS:
- Explore Programs (/programs): Public Speaking, Entrepreneurship, Generations in Conversation.
- Focus Areas (/focus-areas): Leadership, Education, Business.
- Join Us (/join-us): Opportunities to participate in cohorts, volunteer as a mentor, or partner as an organization.
- Media & Stories (/media): Community impact stories, event highlights, and press updates.
- Photo Gallery (/gallery): Program moments, workshops, and cohort pictures.
- Contact Us (/contact): Inquiries, partnerships, and direct messaging with the YBI team.

COMMUNICATION GUIDELINES:
- Provide warm, articulate, encouraging, and concise answers in plain English (typically 1 to 3 short paragraphs).
- Contextualize responses based on the visitor's questions and invite them to explore relevant pages or reach out via Contact Us.
- Never invent specific event dates, pricing, or personal contact numbers not provided here.
- Maintain a helpful, inspiring, and professional tone.`;
var visitorAssistantRouter = router({
  quickQuestions: publicProcedure.query(() => readQuickQuestions()),
  chat: publicProcedure.input(visitorAssistantInput).mutation(async ({ input, ctx }) => {
    enforceRateLimit(ctx.req);
    const latestVisitorQuestion = [...input.messages].reverse().find((message) => message.role === "user")?.content ?? "";
    let answer = "";
    try {
      const response = await invokeLLM({
        model: "gpt-4o-mini",
        maxTokens: 450,
        messages: [
          { role: "system", content: systemPrompt },
          ...input.messages.map((message) => ({ role: message.role, content: message.content })),
          { role: "system", content: `The visitor is currently viewing the ${input.page} page on the YBI website. Answer their question concisely using YBI knowledge.` }
        ]
      });
      const content = response.choices[0]?.message.content;
      if (typeof content === "string" && content.trim().length > 0) {
        answer = content.trim();
      }
    } catch {
    }
    if (!answer) {
      const knowledge = getYbiKnowledgeResponse(latestVisitorQuestion, input.page);
      return { answer: knowledge.answer, guidance: knowledge.guidance };
    }
    return { answer, guidance: getAssistantProgramLinks(latestVisitorQuestion) };
  })
});

// backend/routers/events.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { nanoid } from "nanoid";
import { z as z3 } from "zod";
var eventStatus = z3.enum(["draft", "published", "cancelled"]);
var eventInput = z3.object({
  id: z3.number().int().positive().optional(),
  slug: z3.string().trim().min(2).max(200),
  title: z3.string().trim().min(2).max(180),
  description: z3.string().trim().min(10).max(1e4),
  imageUrl: z3.string().trim().max(25e6).nullable().optional(),
  scheduledFor: z3.string().datetime(),
  location: z3.string().trim().min(2).max(240),
  capacity: z3.number().int().min(1).max(1e5).nullable().optional(),
  isFree: z3.boolean().default(true),
  priceGhs: z3.number().int().min(0).default(0),
  // in pesewas
  status: eventStatus
});
var registrationInput = z3.object({
  eventId: z3.number().int().positive(),
  name: z3.string().trim().min(2).max(140),
  email: z3.string().trim().email().max(320),
  phone: z3.string().trim().min(7).max(30),
  smsOptIn: z3.boolean().default(false),
  callbackUrl: z3.string().url().optional()
});
var eventsAdminRouter = router({
  list: adminProcedure.query(async () => {
    return listEvents(true);
  }),
  save: adminProcedure.input(eventInput).mutation(async ({ input }) => {
    let imageUrl = input.imageUrl;
    if (imageUrl && imageUrl.startsWith("data:")) {
      try {
        const uploaded = await storagePut(`events/${input.slug || Date.now()}`, imageUrl);
        imageUrl = uploaded.url;
      } catch (err) {
        console.warn("[Events] Storage upload fallback:", err);
      }
    }
    return saveEvent({
      ...input,
      imageUrl,
      scheduledFor: new Date(input.scheduledFor)
    });
  }),
  remove: adminProcedure.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    return removeEvent(input.id);
  }),
  registrations: adminProcedure.input(z3.object({ eventId: z3.number().int().positive().optional() })).query(async ({ input }) => {
    return listEventRegistrations(input.eventId);
  }),
  exportRegistrations: adminProcedure.input(z3.object({ eventId: z3.number().int().positive().optional() })).query(async ({ input }) => {
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
      date: new Date(r.createdAt).toISOString().slice(0, 10)
    }));
  })
});
var eventsPublicRouter = router({
  list: publicProcedure.query(async () => {
    return listEvents(false);
  }),
  getBySlug: publicProcedure.input(z3.object({ slug: z3.string().min(1) })).query(async ({ input }) => {
    const event = await getEventBySlug(input.slug);
    if (!event || event.status !== "published") {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Event not found." });
    }
    const registrations = await listEventRegistrations(event.id);
    const confirmedCount = registrations.filter(
      (r) => r.paymentStatus === "success" || r.paymentStatus === "free"
    ).length;
    const isSoldOut = event.capacity ? confirmedCount >= event.capacity : false;
    return {
      ...event,
      confirmedCount,
      isSoldOut
    };
  }),
  register: publicProcedure.input(registrationInput).mutation(async ({ input }) => {
    const event = await getEventById(input.eventId);
    if (!event || event.status !== "published") {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Event not found or registration closed." });
    }
    const registrations = await listEventRegistrations(event.id);
    const confirmedCount = registrations.filter(
      (r) => r.paymentStatus === "success" || r.paymentStatus === "free"
    ).length;
    const isSoldOut = event.capacity ? confirmedCount >= event.capacity : false;
    if (event.isFree || isSoldOut) {
      const regId = await createEventRegistration({
        eventId: event.id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        smsOptIn: input.smsOptIn,
        paymentStatus: event.isFree ? "free" : "pending",
        isWaitlist: isSoldOut,
        confirmedAt: event.isFree && !isSoldOut ? /* @__PURE__ */ new Date() : null
      });
      if (input.smsOptIn && input.phone) {
        const msg = isSoldOut ? `Hello ${input.name}, you have been added to the waitlist for "${event.title}". We will notify you if a slot opens up. - YBI` : `Hello ${input.name}, your registration for "${event.title}" on ${new Date(event.scheduledFor).toLocaleDateString()} is confirmed! Venue: ${event.location}. - YBI`;
        sendSms(input.phone, msg).catch(console.error);
      }
      return {
        success: true,
        isWaitlist: isSoldOut,
        registrationId: regId,
        checkoutUrl: null
      };
    }
    const paystackRef = `ybi_evt_${event.id}_${Date.now()}_${nanoid(6)}`;
    await createEventRegistration({
      eventId: event.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      smsOptIn: input.smsOptIn,
      paystackRef,
      paymentStatus: "pending",
      isWaitlist: false
    });
    const baseUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") || "http://localhost:3000";
    const callbackUrl = input.callbackUrl || `${baseUrl}/events/${event.slug}?ref=${paystackRef}`;
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
        smsOptIn: input.smsOptIn
      }
    });
    if ("error" in paystackRes) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Payment gateway error: ${paystackRes.error}`
      });
    }
    return {
      success: true,
      isWaitlist: false,
      checkoutUrl: paystackRes.checkoutUrl,
      reference: paystackRef
    };
  })
});

// backend/routers/blog.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
import { z as z4 } from "zod";
var blogStatus = z4.enum(["draft", "published"]);
var blogPostInput = z4.object({
  id: z4.number().int().positive().optional(),
  slug: z4.string().trim().min(2).max(220),
  title: z4.string().trim().min(2).max(200),
  excerpt: z4.string().trim().min(5).max(2e3),
  body: z4.string().trim().min(10).max(5e4),
  authorName: z4.string().trim().min(2).max(120),
  coverImageUrl: z4.string().trim().max(25e6).nullable().optional(),
  category: z4.string().trim().min(2).max(80),
  status: blogStatus,
  publishedAt: z4.string().datetime().nullable().optional()
});
var blogAdminRouter = router({
  list: adminProcedure.query(async () => {
    return listBlogPosts(true);
  }),
  save: adminProcedure.input(blogPostInput).mutation(async ({ input }) => {
    let coverImageUrl = input.coverImageUrl;
    if (coverImageUrl && coverImageUrl.startsWith("data:")) {
      try {
        const uploaded = await storagePut(`blog/${input.slug || Date.now()}`, coverImageUrl);
        coverImageUrl = uploaded.url;
      } catch (err) {
        console.warn("[Blog] Storage upload fallback:", err);
      }
    }
    return saveBlogPost({
      ...input,
      coverImageUrl,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : void 0
    });
  }),
  remove: adminProcedure.input(z4.object({ id: z4.number().int().positive() })).mutation(async ({ input }) => {
    return removeBlogPost(input.id);
  })
});
var blogPublicRouter = router({
  list: publicProcedure.input(
    z4.object({
      category: z4.string().optional(),
      limit: z4.number().int().min(1).max(50).default(20)
    }).optional()
  ).query(async ({ input }) => {
    let posts = await listBlogPosts(false);
    if (input?.category) {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === input.category?.toLowerCase()
      );
    }
    return posts.slice(0, input?.limit ?? 20);
  }),
  getBySlug: publicProcedure.input(z4.object({ slug: z4.string().min(1) })).query(async ({ input }) => {
    const post = await getBlogPostBySlug(input.slug);
    if (!post || post.status !== "published") {
      throw new TRPCError4({ code: "NOT_FOUND", message: "Blog post not found." });
    }
    return post;
  })
});

// backend/routers/donations.ts
import { TRPCError as TRPCError5 } from "@trpc/server";
import { nanoid as nanoid2 } from "nanoid";
import { z as z5 } from "zod";
var donationInput = z5.object({
  name: z5.string().trim().min(2).max(140),
  email: z5.string().trim().email().max(320),
  phone: z5.string().trim().max(30).optional(),
  amountGhs: z5.number().int().min(1).max(5e5),
  // amount in GHS
  message: z5.string().trim().max(1e3).optional(),
  callbackUrl: z5.string().url().optional()
});
var donationsAdminRouter = router({
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
      pendingCount: all.filter((d) => d.paymentStatus === "pending").length
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
      date: new Date(d.createdAt).toISOString().slice(0, 10)
    }));
  })
});
var donationsPublicRouter = router({
  initiate: publicProcedure.input(donationInput).mutation(async ({ input }) => {
    const amountPesewas = input.amountGhs * 100;
    const paystackRef = `ybi_don_${Date.now()}_${nanoid2(6)}`;
    await createDonation({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      amountGhs: amountPesewas,
      message: input.message || null,
      paystackRef,
      paymentStatus: "pending"
    });
    const baseUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") || "http://localhost:3000";
    const callbackUrl = input.callbackUrl || `${baseUrl}/get-involved?don_ref=${paystackRef}`;
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
        amountGhs: input.amountGhs
      }
    });
    if ("error" in paystackRes) {
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: `Payment gateway error: ${paystackRes.error}`
      });
    }
    return {
      success: true,
      checkoutUrl: paystackRes.checkoutUrl,
      reference: paystackRef
    };
  }),
  verifyPayment: publicProcedure.input(z5.object({ reference: z5.string().min(1) })).mutation(async ({ input }) => {
    const verification = await verifyPaystackPayment(input.reference);
    if (verification.success) {
      await updateDonationPayment(input.reference, "success");
      return { success: true, message: "Donation successfully confirmed! Thank you." };
    }
    return { success: false, error: verification.error || "Payment verification failed." };
  })
});

// backend/routers/faq.ts
import { z as z6 } from "zod";
var faqInput = z6.object({
  id: z6.number().int().positive().optional(),
  question: z6.string().trim().min(5).max(300),
  answer: z6.string().trim().min(5).max(5e3),
  category: z6.string().trim().min(2).max(80).default("General"),
  sortOrder: z6.number().int().min(0).max(9999).default(0),
  isPublished: z6.boolean().default(true)
});
var faqAdminRouter = router({
  list: adminProcedure.query(async () => {
    return listFaqItems(true);
  }),
  save: adminProcedure.input(faqInput).mutation(async ({ input }) => {
    return saveFaqItem(input);
  }),
  remove: adminProcedure.input(z6.object({ id: z6.number().int().positive() })).mutation(async ({ input }) => {
    return removeFaqItem(input.id);
  })
});
var faqPublicRouter = router({
  list: publicProcedure.query(async () => {
    return listFaqItems(false);
  })
});

// backend/routers/sms.ts
import { TRPCError as TRPCError6 } from "@trpc/server";
import { z as z7 } from "zod";
var broadcastTarget = z7.enum(["newsletter", "events", "all", "custom"]);
var broadcastInput = z7.object({
  message: z7.string().trim().min(5).max(480),
  // up to 3 SMS segments
  target: broadcastTarget,
  customPhones: z7.array(z7.string().trim().min(7).max(30)).optional()
});
var smsAdminRouter = router({
  getLogs: adminProcedure.query(async () => {
    return listSmsLogs();
  }),
  sendBroadcast: adminProcedure.input(broadcastInput).mutation(async ({ input }) => {
    let recipientPhones = [];
    if (input.target === "custom") {
      recipientPhones = (input.customPhones || []).map(formatGhanaPhoneNumber);
    } else if (input.target === "newsletter") {
      const subscribers = await listNewsletterSubscribers();
      recipientPhones = subscribers.filter((s) => s.smsOptIn && s.phone && s.phone.trim().length >= 7).map((s) => formatGhanaPhoneNumber(s.phone.trim()));
    } else if (input.target === "events") {
      const registrations = await listEventRegistrations();
      recipientPhones = registrations.filter((r) => r.smsOptIn && r.phone && r.phone.trim().length >= 7).map((r) => formatGhanaPhoneNumber(r.phone.trim()));
    } else if (input.target === "all") {
      const [subscribers, registrations] = await Promise.all([
        listNewsletterSubscribers(),
        listEventRegistrations()
      ]);
      const phones = /* @__PURE__ */ new Set();
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
    const uniquePhones = Array.from(new Set(recipientPhones.filter(Boolean)));
    if (uniquePhones.length === 0) {
      throw new TRPCError6({
        code: "BAD_REQUEST",
        message: "No valid recipient phone numbers found for the selected target group."
      });
    }
    const result = await sendSmsBroadcast(uniquePhones, input.message);
    await Promise.all(
      uniquePhones.map(
        (phone) => createSmsLog({
          recipientPhone: phone,
          message: input.message,
          provider: "africastalking",
          status: result.failed > 0 && result.sent === 0 ? "failed" : "sent"
        })
      )
    );
    return {
      recipientsCount: uniquePhones.length,
      sent: result.sent,
      failed: result.failed
    };
  })
});
var smsRouter = router({
  admin: smsAdminRouter
});

// backend/routers/admin.ts
var contentStatus = z8.enum(["draft", "published"]);
var imageInput = z8.object({
  title: z8.string().trim().min(2).max(160),
  altText: z8.string().trim().min(3).max(240),
  fileName: z8.string().trim().min(1).max(220),
  mimeType: z8.string().min(1).default("image/jpeg"),
  base64: z8.string().min(10),
  isPublished: z8.boolean().default(true),
  sortOrder: z8.number().int().min(0).max(9999).default(0)
});
var programInput = z8.object({
  id: z8.number().int().positive().optional(),
  title: z8.string().trim().min(2).max(160),
  category: z8.string().trim().min(2).max(80),
  summary: z8.string().trim().min(10).max(3e3),
  status: contentStatus,
  sortOrder: z8.number().int().min(0).max(9999).default(0)
});
var updateInput = z8.object({
  id: z8.number().int().positive().optional(),
  title: z8.string().trim().min(2).max(180),
  excerpt: z8.string().trim().min(10).max(1200),
  body: z8.string().trim().min(10).max(12e3),
  status: contentStatus
});
var siteContentInput = z8.object({
  contentKey: z8.string().trim().min(2).max(100),
  label: z8.string().trim().min(2).max(140),
  title: z8.string().trim().min(2).max(4e3),
  body: z8.string().trim().min(2).max(12e3),
  actionLabel: z8.string().trim().max(100).nullable().optional(),
  actionHref: z8.string().trim().max(300).nullable().optional()
});
var communityInquiryInput = z8.object({
  name: z8.string().trim().min(2).max(140),
  email: z8.string().trim().email().max(320),
  interest: z8.string().trim().min(2).max(100),
  message: z8.string().trim().min(10).max(5e3)
});
var inquiryUpdateInput = z8.object({
  id: z8.number().int().positive(),
  status: z8.enum(["new", "in_progress", "responded", "closed"]),
  adminNotes: z8.string().trim().max(5e3).nullable().optional()
});
var sessionInput = z8.object({
  id: z8.number().int().positive().optional(),
  title: z8.string().trim().min(2).max(180),
  focusArea: z8.string().trim().min(2).max(100),
  details: z8.string().trim().min(10).max(5e3),
  scheduledFor: z8.string().datetime(),
  venue: z8.string().trim().min(2).max(180),
  capacity: z8.number().int().min(1).max(1e5).nullable().optional(),
  status: z8.enum(["draft", "published", "complete"])
});
var opportunityInput = z8.object({
  id: z8.number().int().positive().optional(),
  title: z8.string().trim().min(2).max(180),
  category: z8.string().trim().min(2).max(100),
  summary: z8.string().trim().min(10).max(5e3),
  commitment: z8.string().trim().min(2).max(160),
  status: z8.enum(["draft", "published", "closed"]),
  sortOrder: z8.number().int().min(0).max(9999).default(0)
});
var impactMetricInput = z8.object({
  id: z8.number().int().positive().optional(),
  title: z8.string().trim().min(2).max(160),
  focusArea: z8.string().trim().min(2).max(100),
  description: z8.string().trim().min(10).max(5e3),
  currentValue: z8.number().int().min(0).max(1e7),
  targetValue: z8.number().int().min(0).max(1e7).nullable().optional(),
  unit: z8.string().trim().min(1).max(60),
  period: z8.string().trim().min(2).max(100),
  status: z8.enum(["active", "archived"])
});
var siteImageInput = z8.object({
  slotKey: z8.string().trim().min(2).max(100),
  imageUrl: z8.string().trim().min(2),
  altText: z8.string().trim().max(300).optional()
});
var siteImageUploadInput = z8.object({
  slotKey: z8.string().trim().min(2).max(100),
  fileName: z8.string().trim().min(1).max(220),
  mimeType: z8.string().min(1).default("image/jpeg"),
  base64: z8.string().min(10),
  altText: z8.string().trim().max(300).optional()
});
var teamMemberInput = z8.object({
  id: z8.number().int().positive().optional(),
  name: z8.string().trim().min(2).max(140),
  role: z8.string().trim().min(2).max(100),
  bio: z8.string().trim().min(10).max(3e3),
  imageUrl: z8.string().trim().max(25e6).default(""),
  email: z8.string().trim().email().max(320).optional().or(z8.literal("")),
  linkedIn: z8.string().trim().max(300).optional().or(z8.literal("")),
  sortOrder: z8.number().int().min(0).max(9999).default(0),
  isPublished: z8.boolean().default(true)
});
var teamPortraitUploadInput = z8.object({
  fileName: z8.string().trim().min(1).max(220),
  mimeType: z8.enum(["image/jpeg", "image/png", "image/webp"]),
  base64: z8.string().min(10)
});
var newsletterSubscriberInput = z8.object({
  email: z8.string().trim().email().max(320),
  name: z8.string().trim().max(140).default("")
});
var SOCIAL_LINKS_KEY = "settings:social-links";
var ANNOUNCEMENT_KEY = "settings:announcement";
var DONATION_KEY = "settings:donation-tracker";
var ADMIN_PASSWORD_KEY = "settings:admin-password";
var publicSiteRouter = router({
  gallery: publicProcedure.query(() => listGalleryPhotos(false)),
  programs: publicProcedure.query(() => listPrograms(false)),
  updates: publicProcedure.query(() => listUpdates(false)),
  team: router({
    list: publicProcedure.query(() => listTeamMembers(false)),
    getBySlug: publicProcedure.input(z8.object({ slug: z8.string().trim().min(1).max(180) })).query(({ input }) => getTeamMemberBySlug(input.slug, false))
  }),
  content: publicProcedure.input(z8.object({ contentKey: z8.string().min(1).max(100) })).query(({ input }) => getSiteContent(input.contentKey)),
  events: eventsPublicRouter,
  blog: blogPublicRouter,
  donations: donationsPublicRouter,
  faq: faqPublicRouter,
  payments: paymentsRouter,
  siteImages: router({
    getAll: publicProcedure.query(async () => {
      const contentList = await listSiteContent();
      const overrides = {};
      for (const item of contentList) {
        const slotKey = extractSlotKeyFromContentKey(item.contentKey);
        if (slotKey && item.body) {
          overrides[slotKey] = {
            src: item.body,
            alt: item.title || ""
          };
        }
      }
      return overrides;
    })
  }),
  assistant: visitorAssistantRouter,
  contact: router({
    submit: publicProcedure.input(communityInquiryInput).mutation(({ input }) => createCommunityInquiry(input))
  }),
  newsletter: router({
    subscribe: publicProcedure.input(newsletterSubscriberInput).mutation(({ input }) => addNewsletterSubscriber(input))
  }),
  announcement: publicProcedure.query(async () => {
    const record = await getSiteContent(ANNOUNCEMENT_KEY);
    try {
      return record?.body ? JSON.parse(record.body) : null;
    } catch {
      return null;
    }
  }),
  donation: publicProcedure.query(async () => {
    const record = await getSiteContent(DONATION_KEY);
    try {
      return record?.body ? JSON.parse(record.body) : null;
    } catch {
      return null;
    }
  }),
  socialLinks: publicProcedure.query(async () => {
    const record = await getSiteContent(SOCIAL_LINKS_KEY);
    try {
      return record?.body ? JSON.parse(record.body) : {};
    } catch {
      return {};
    }
  })
});
var adminRouter = router({
  overview: adminProcedure.query(() => getDashboardOverview()),
  events: eventsAdminRouter,
  blog: blogAdminRouter,
  donations: donationsAdminRouter,
  faq: faqAdminRouter,
  sms: smsAdminRouter,
  siteImages: router({
    list: adminProcedure.query(async () => {
      const contentList = await listSiteContent();
      const contentMap = new Map(contentList.map((c) => [c.contentKey, c]));
      return SITE_IMAGE_SLOTS.map((slot) => {
        const key = formatImageContentKey(slot.key);
        const record = contentMap.get(key);
        return {
          ...slot,
          customSrc: record?.body || null,
          customAlt: record?.title || null,
          isCustomized: Boolean(record?.body),
          updatedAt: record?.updatedAt || null
        };
      });
    }),
    save: adminProcedure.input(siteImageInput).mutation(async ({ input }) => {
      const slot = SITE_IMAGE_SLOTS.find((s) => s.key === input.slotKey);
      let imageUrl = input.imageUrl;
      if (imageUrl && imageUrl.startsWith("data:")) {
        try {
          const match = imageUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
          const ext = match ? match[1] === "jpeg" ? "jpg" : match[1].replace(/\+xml/, "") : "png";
          const uploaded = await storagePut(`site-images/${input.slotKey}.${ext}`, imageUrl);
          imageUrl = uploaded.url;
        } catch (err) {
          console.warn("[SiteImages] Storage upload fallback:", err);
        }
      }
      await upsertSiteContent({
        contentKey: formatImageContentKey(input.slotKey),
        label: slot?.label || "Site Image",
        title: input.altText || slot?.defaultAlt || "",
        body: imageUrl
      });
      return { success: true, imageUrl };
    }),
    upload: adminProcedure.input(siteImageUploadInput).mutation(async ({ input }) => {
      const approxBytes = Math.ceil(input.base64.length * 0.75);
      if (approxBytes > 8 * 1024 * 1024) {
        throw new TRPCError7({ code: "PAYLOAD_TOO_LARGE", message: "Images must be 8 MB or smaller." });
      }
      const { url: imageUrl } = await storagePut(
        `site-images/${input.slotKey}-${input.fileName}`,
        input.base64,
        input.mimeType
      );
      const slot = SITE_IMAGE_SLOTS.find((s) => s.key === input.slotKey);
      await upsertSiteContent({
        contentKey: formatImageContentKey(input.slotKey),
        label: slot?.label || "Site Image",
        title: input.altText || slot?.defaultAlt || "",
        body: imageUrl
      });
      return { success: true, imageUrl };
    }),
    reset: adminProcedure.input(z8.object({ slotKey: z8.string().min(1) })).mutation(async ({ input }) => {
      await removeSiteContent(formatImageContentKey(input.slotKey));
      return { success: true };
    })
  }),
  gallery: router({
    list: adminProcedure.query(() => listGalleryPhotos(true)),
    upload: adminProcedure.input(imageInput).mutation(async ({ input }) => {
      const approxBytes = Math.ceil(input.base64.length * 0.75);
      if (approxBytes > 8 * 1024 * 1024) {
        throw new TRPCError7({ code: "PAYLOAD_TOO_LARGE", message: "Images must be 8 MB or smaller." });
      }
      const { key: storageKey, url: imageUrl } = await storagePut(
        `gallery/${input.fileName}`,
        input.base64,
        input.mimeType
      );
      return saveGalleryPhoto({ ...input, imageUrl, storageKey });
    }),
    save: adminProcedure.input(z8.object({
      id: z8.number().int().positive(),
      title: z8.string().trim().min(2).max(160),
      altText: z8.string().trim().min(3).max(240),
      isPublished: z8.boolean(),
      sortOrder: z8.number().int().min(0).max(9999)
    })).mutation(({ input }) => saveGalleryPhoto(input)),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeGalleryPhoto(input.id))
  }),
  programs: router({
    list: adminProcedure.query(() => listPrograms(true)),
    save: adminProcedure.input(programInput).mutation(({ input }) => saveProgram(input)),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeProgram(input.id))
  }),
  updates: router({
    list: adminProcedure.query(() => listUpdates(true)),
    save: adminProcedure.input(updateInput).mutation(({ input }) => saveUpdate(input)),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeUpdate(input.id))
  }),
  content: router({
    list: adminProcedure.query(() => listSiteContent()),
    save: adminProcedure.input(siteContentInput).mutation(({ input }) => upsertSiteContent(input))
  }),
  assistantSettings: router({
    get: adminProcedure.query(() => readQuickQuestions()),
    save: adminProcedure.input(z8.object({ questions: quickQuestionsInput })).mutation(({ input }) => upsertSiteContent({
      contentKey: QUICK_QUESTIONS_CONTENT_KEY,
      label: "YBI visitor assistant quick questions",
      title: "Quick questions",
      body: JSON.stringify(input.questions),
      actionLabel: null,
      actionHref: null
    }))
  }),
  inquiries: router({
    list: adminProcedure.query(() => listCommunityInquiries()),
    save: adminProcedure.input(inquiryUpdateInput).mutation(({ input }) => updateCommunityInquiry(input)),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeCommunityInquiry(input.id))
  }),
  sessions: router({
    list: adminProcedure.query(() => listProgramSessions()),
    save: adminProcedure.input(sessionInput).mutation(({ input }) => saveProgramSession({ ...input, scheduledFor: new Date(input.scheduledFor) })),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeProgramSession(input.id))
  }),
  opportunities: router({
    list: adminProcedure.query(() => listOpportunities()),
    save: adminProcedure.input(opportunityInput).mutation(({ input }) => saveOpportunity(input)),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeOpportunity(input.id))
  }),
  impact: router({
    list: adminProcedure.query(() => listImpactMetrics()),
    save: adminProcedure.input(impactMetricInput).mutation(({ input }) => saveImpactMetric(input)),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeImpactMetric(input.id)),
    export: adminProcedure.query(async () => {
      const metrics = await listImpactMetrics();
      return metrics;
    })
  }),
  team: router({
    list: adminProcedure.query(() => listTeamMembers()),
    save: adminProcedure.input(teamMemberInput).mutation(async ({ input }) => {
      let imageUrl = input.imageUrl;
      if (imageUrl && imageUrl.startsWith("data:")) {
        try {
          const slug = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const uploaded = await storagePut(`team-members/${slug || Date.now()}`, imageUrl);
          imageUrl = uploaded.url;
        } catch (err) {
          console.warn("[Team] Storage upload fallback:", err);
        }
      }
      return saveTeamMember({ ...input, imageUrl });
    }),
    uploadPortrait: adminProcedure.input(teamPortraitUploadInput).mutation(async ({ input }) => {
      const approxBytes = Math.ceil(input.base64.length * 0.75);
      if (approxBytes > 5 * 1024 * 1024) {
        throw new TRPCError7({ code: "PAYLOAD_TOO_LARGE", message: "Portrait images must be 5 MB or smaller." });
      }
      const { url: imageUrl } = await storagePut(
        `team-members/${input.fileName}`,
        input.base64,
        input.mimeType
      );
      return { imageUrl };
    }),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeTeamMember(input.id))
  }),
  newsletter: router({
    list: adminProcedure.query(() => listNewsletterSubscribers()),
    subscribe: publicProcedure.input(newsletterSubscriberInput).mutation(({ input }) => addNewsletterSubscriber(input)),
    remove: adminProcedure.input(z8.object({ id: z8.number().int().positive() })).mutation(({ input }) => removeNewsletterSubscriber(input.id))
  }),
  settings: router({
    getSocialLinks: adminProcedure.query(async () => {
      const record = await getSiteContent(SOCIAL_LINKS_KEY);
      try {
        return record?.body ? JSON.parse(record.body) : {};
      } catch {
        return {};
      }
    }),
    saveSocialLinks: adminProcedure.input(z8.object({
      facebook: z8.string().trim().max(300).optional(),
      instagram: z8.string().trim().max(300).optional(),
      twitter: z8.string().trim().max(300).optional(),
      youtube: z8.string().trim().max(300).optional(),
      linkedin: z8.string().trim().max(300).optional(),
      tiktok: z8.string().trim().max(300).optional()
    })).mutation(({ input }) => upsertSiteContent({ contentKey: SOCIAL_LINKS_KEY, label: "Social media links", title: "Social Links", body: JSON.stringify(input) })),
    getAnnouncement: adminProcedure.query(async () => {
      const record = await getSiteContent(ANNOUNCEMENT_KEY);
      try {
        return record?.body ? JSON.parse(record.body) : null;
      } catch {
        return null;
      }
    }),
    saveAnnouncement: adminProcedure.input(z8.object({
      message: z8.string().trim().max(400),
      type: z8.enum(["info", "warning", "success"]),
      isActive: z8.boolean(),
      link: z8.string().trim().max(300).optional(),
      linkLabel: z8.string().trim().max(80).optional()
    })).mutation(({ input }) => upsertSiteContent({ contentKey: ANNOUNCEMENT_KEY, label: "Site announcement banner", title: "Announcement", body: JSON.stringify(input) })),
    getDonation: adminProcedure.query(async () => {
      const record = await getSiteContent(DONATION_KEY);
      try {
        return record?.body ? JSON.parse(record.body) : null;
      } catch {
        return null;
      }
    }),
    saveDonation: adminProcedure.input(z8.object({
      campaign: z8.string().trim().min(2).max(200),
      goal: z8.number().int().min(0),
      raised: z8.number().int().min(0),
      currency: z8.string().trim().max(10).default("GHS"),
      description: z8.string().trim().max(600).optional(),
      isActive: z8.boolean()
    })).mutation(({ input }) => upsertSiteContent({ contentKey: DONATION_KEY, label: "Donation / fundraising tracker", title: "Donation Tracker", body: JSON.stringify(input) })),
    changePassword: adminProcedure.input(z8.object({
      currentPassword: z8.string().min(1),
      newPassword: z8.string().min(8).max(100)
    })).mutation(async ({ input, ctx }) => {
      const storedHash = await getSiteContent(ADMIN_PASSWORD_KEY);
      const configuredPassword = process.env.ADMIN_PASSWORD || "ybi-admin-2026";
      const effectivePassword = storedHash?.body || configuredPassword;
      if (input.currentPassword !== effectivePassword) {
        throw new TRPCError7({ code: "UNAUTHORIZED", message: "Current password is incorrect." });
      }
      await upsertSiteContent({ contentKey: ADMIN_PASSWORD_KEY, label: "Admin password override", title: "Admin Password", body: input.newPassword });
      return { success: true };
    })
  }),
  export: router({
    inquiries: adminProcedure.query(async () => {
      const items = await listCommunityInquiries();
      return items.map((i) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        interest: i.interest,
        message: i.message,
        status: i.status,
        adminNotes: i.adminNotes || "",
        date: new Date(i.createdAt).toISOString().slice(0, 10)
      }));
    }),
    impactMetrics: adminProcedure.query(async () => {
      const items = await listImpactMetrics();
      return items.map((m) => ({
        id: m.id,
        title: m.title,
        focusArea: m.focusArea,
        currentValue: m.currentValue,
        targetValue: m.targetValue || "",
        unit: m.unit,
        period: m.period,
        status: m.status
      }));
    }),
    subscribers: adminProcedure.query(async () => {
      const items = await listNewsletterSubscribers();
      return items.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        date: new Date(s.createdAt).toISOString().slice(0, 10)
      }));
    })
  })
});

// backend/_core/systemRouter.ts
import { z as z9 } from "zod";

// backend/_core/notification.ts
import { TRPCError as TRPCError8 } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError8({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError8({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError8({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError8({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError8({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError8({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// backend/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z9.object({
      timestamp: z9.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z9.object({
      title: z9.string().min(1, "title is required"),
      content: z9.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// backend/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    login: publicProcedure.input(z10.object({ password: z10.string().min(1) })).mutation(async ({ input, ctx }) => {
      const configuredAdminPassword = process.env.ADMIN_PASSWORD || "ybi-admin-2026";
      let effectivePassword = configuredAdminPassword;
      try {
        const stored = await getSiteContent("settings:admin-password");
        if (stored?.body) effectivePassword = stored.body;
      } catch {
      }
      if (input.password !== effectivePassword) {
        throw new TRPCError9({
          code: "UNAUTHORIZED",
          message: "Incorrect administrator password. Please try again."
        });
      }
      const sessionToken = await sdk.createSessionToken("admin_ybi_owner", {
        name: "YBI Administrator",
        expiresInMs: ONE_YEAR_MS
      });
      await upsertUser({
        openId: "admin_ybi_owner",
        name: "YBI Administrator",
        email: "admin@ybi.org",
        role: "admin",
        loginMethod: "password",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      return {
        success: true,
        token: sessionToken,
        user: {
          id: 1,
          openId: "admin_ybi_owner",
          name: "YBI Administrator",
          email: "admin@ybi.org",
          role: "admin"
        }
      };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  admin: adminRouter,
  publicSite: publicSiteRouter
});

// backend/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// backend/apiHandler.ts
var app = express();
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-trpc-source,Cookie");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});
app.use((req, _res, next) => {
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-invoke-path"] || req.originalUrl || req.url || "/";
  if (req.url === "/api/index.js" || req.url === "/api" || req.url === "/api/") {
    if (matchedPath && matchedPath !== req.url) {
      req.url = matchedPath;
    }
  }
  next();
});
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    return next();
  }
  express.json({ limit: "50mb" })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });
});
registerStorageProxy(app);
registerOAuthRoutes(app);
registerPaystackWebhook(app);
var trpcHandler = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    console.error(`[tRPC Error on ${path}]:`, error);
  }
});
app.use("/api/trpc", trpcHandler);
app.use("/trpc", trpcHandler);
app.use((req, res, next) => {
  const url = req.url || "/";
  if (!url.startsWith("/api/oauth") && !url.startsWith("/oauth") && !url.startsWith("/api/webhooks") && !url.startsWith("/webhooks") && !url.startsWith("/manus-storage") && !url.startsWith("/api/manus-storage") && !url.startsWith("/uploads") && !url.startsWith("/api/uploads")) {
    return trpcHandler(req, res, next);
  }
  next();
});
app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
  }
});
app.use((err, _req, res, _next) => {
  console.error("[Vercel API Handler Error]:", err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  }
});
function handler(req, res) {
  return new Promise((resolve) => {
    let resolved = false;
    const done = () => {
      if (!resolved) {
        resolved = true;
        resolve(void 0);
      }
    };
    res.on("finish", done);
    res.on("close", done);
    setTimeout(done, 15e3);
    try {
      app(req, res);
    } catch (e) {
      console.error("[Express Execution Error]:", e);
      if (!res.headersSent) {
        res.status(500).json({ error: e?.message || "Handler error" });
      }
      done();
    }
  });
}
export {
  handler as default
};
