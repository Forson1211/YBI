import * as dotenv from "dotenv";
import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  communityInquiries,
  galleryPhotos,
  impactMetrics,
  InsertUser,
  opportunities,
  programs,
  programSessions,
  siteContent,
  updates,
  users,
} from "./drizzle/schema";
import * as schema from "./drizzle/schema";
import { ENV } from './_core/env';

// Load .env for local development
dotenv.config();

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

// Lazily create the drizzle (postgres) instance — falls back to in-memory if no DATABASE_URL.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const postgres = (await import("postgres")).default;
      const client = postgres(process.env.DATABASE_URL, {
        max: 5,
        ssl: "require",
        idle_timeout: 20,
        connect_timeout: 10,
      });
      _db = drizzle(client, { schema });
      console.log("[Database] Connected to Supabase PostgreSQL ✓");
    } catch (error) {
      console.warn("[Database] Failed to connect to Supabase:", error);
      _db = null;
    }
  }
  return _db;
}

// In-memory mock store for standalone / local operation without external MySQL
const memoryStore = {
  users: new Map<string, any>(),
  galleryPhotos: [
    { id: 1, title: "Robotics Workshop in Action", altText: "Students collaborating on robotic kits", imageUrl: "/ybi-assets/gallery/workshop-1.jpg", storageKey: "workshop-1.jpg", isPublished: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: "Mentorship Circle", altText: "Young people in guided discussion", imageUrl: "/ybi-assets/gallery/mentorship-1.jpg", storageKey: "mentorship-1.jpg", isPublished: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  programs: [
    { id: 1, title: "Creative Tech & Robotics Lab", category: "Technology & STEAM", summary: "Hands-on engineering, problem-solving, and coding foundations for young innovators.", status: "published" as const, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: "Purposeful Leadership & Mentoring", category: "Leadership & Mindset", summary: "Guiding emerging voices to discover their strengths, build resilience, and lead with empathy.", status: "published" as const, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: "Community Innovation Studio", category: "Civic Impact", summary: "Connecting curiosity with community action to design practical solutions for real local challenges.", status: "published" as const, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  updates: [
    { id: 1, title: "YBI Expands Hands-on Tech Spaces for 2026", excerpt: "New kits and creative problem-solving modules launched across community centres.", body: "Young Beginners Inspiration is expanding its experiential learning spaces to provide more young learners with early access to creative technology, mentoring circles, and values-led leadership development.", status: "published" as const, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  siteContent: new Map<string, any>(),
  communityInquiries: [
    { id: 1, name: "Ama Serwaa", email: "ama@example.org", interest: "Mentorship & Volunteering", message: "Hello YBI team, I would love to volunteer as a mentor in the upcoming tech cohort.", status: "new" as const, adminNotes: null, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  programSessions: [
    { id: 1, title: "Design Sprint & Prototyping", focusArea: "STEAM & Engineering", details: "Collaborative session building physical prototypes.", scheduledFor: new Date(Date.now() + 86400000 * 7), venue: "YBI Innovation Hub, Accra", capacity: 25, status: "published" as const, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  opportunities: [
    { id: 1, title: "Youth STEAM Mentor", category: "Mentorship", summary: "Guide youth through coding, robotics, and creative problem-solving.", commitment: "2 hours / week", status: "published" as const, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  impactMetrics: [
    { id: 1, title: "Young Learners Reached", focusArea: "STEAM Education", description: "Students actively participating in YBI learning workshops.", currentValue: 1250, targetValue: 2500, unit: "Learners", period: "2026", status: "active" as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: "Mentorship Hours Completed", focusArea: "Leadership", description: "One-on-one and small group mentorship sessions delivered.", currentValue: 480, targetValue: 1000, unit: "Hours", period: "2026", status: "active" as const, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  teamMembers: [
    { id: 1, name: "Dr. Abena Mensah", role: "Executive Director", bio: "Visionary leader with 15 years of youth development experience across West Africa.", imageUrl: "/ybi-assets/team/director.jpg", email: "", linkedIn: "", sortOrder: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  newsletterSubscribers: [] as any[],
  autoId: 100,
};

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    const existing = memoryStore.users.get(user.openId) || {};
    memoryStore.users.set(user.openId, { ...existing, ...user, lastSignedIn: user.lastSignedIn || new Date() });
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    try {
      await db.insert(users).values(values).onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
    } catch (dbErr) {
      console.warn("[Database] Live DB query failed, falling back to memoryStore:", dbErr);
      const existing = memoryStore.users.get(user.openId) || {};
      memoryStore.users.set(user.openId, { ...existing, ...values, id: existing.id || 1, createdAt: existing.createdAt || new Date(), updatedAt: new Date() });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
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

export async function getDashboardOverview() {
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
    };
  }
  const [gallery, programCount, updateCount, contentCount, inquiryCount, sessionCount, opportunityCount, metricCount] = await Promise.all([
    db.select({ value: count() }).from(galleryPhotos),
    db.select({ value: count() }).from(programs),
    db.select({ value: count() }).from(updates),
    db.select({ value: count() }).from(siteContent),
    db.select({ value: count() }).from(communityInquiries),
    db.select({ value: count() }).from(programSessions),
    db.select({ value: count() }).from(opportunities),
    db.select({ value: count() }).from(impactMetrics),
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
    teamMembers: 0,
    subscribers: 0,
  };
}

export async function createCommunityInquiry(input: {
  name: string;
  email: string;
  interest: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.communityInquiries.unshift({ id, ...input, status: "new", adminNotes: null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const result = await db.insert(communityInquiries).values(input).returning({ id: communityInquiries.id });
  return Number(result[0].id);
}

export async function listCommunityInquiries() {
  const db = await getDb();
  if (!db) return memoryStore.communityInquiries;
  return db.select().from(communityInquiries).orderBy(desc(communityInquiries.createdAt));
}

export async function updateCommunityInquiry(input: {
  id: number;
  status: "new" | "in_progress" | "responded" | "closed";
  adminNotes?: string | null;
}) {
  const db = await getDb();
  if (!db) {
    const item = memoryStore.communityInquiries.find(i => i.id === input.id);
    if (item) {
      item.status = input.status;
      if (input.adminNotes !== undefined) item.adminNotes = input.adminNotes;
      item.updatedAt = new Date();
    }
    return;
  }
  await db.update(communityInquiries).set({
    status: input.status,
    adminNotes: input.adminNotes ?? null,
    updatedAt: new Date(),
  }).where(eq(communityInquiries.id, input.id));
}

export async function removeCommunityInquiry(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.communityInquiries.findIndex(i => i.id === id);
    if (index !== -1) memoryStore.communityInquiries.splice(index, 1);
    return;
  }
  await db.delete(communityInquiries).where(eq(communityInquiries.id, id));
}

export async function listProgramSessions() {
  const db = await getDb();
  if (!db) return memoryStore.programSessions;
  return db.select().from(programSessions).orderBy(programSessions.scheduledFor, desc(programSessions.createdAt));
}

export async function saveProgramSession(input: {
  id?: number;
  title: string;
  focusArea: string;
  details: string;
  scheduledFor: Date;
  venue: string;
  capacity?: number | null;
  status: "draft" | "published" | "complete";
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.programSessions.findIndex(s => s.id === input.id);
      if (index !== -1) {
        memoryStore.programSessions[index] = { ...memoryStore.programSessions[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.programSessions.push({ id, ...input, capacity: input.capacity ?? null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { ...input, id: undefined, updatedAt: new Date() };
  if (input.id) {
    const { id, ...updateValues } = values;
    await db.update(programSessions).set(updateValues).where(eq(programSessions.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(programSessions).values(insertValues).returning({ id: programSessions.id });
  return Number(result[0].id);
}

export async function removeProgramSession(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.programSessions.findIndex(s => s.id === id);
    if (index !== -1) memoryStore.programSessions.splice(index, 1);
    return;
  }
  await db.delete(programSessions).where(eq(programSessions.id, id));
}

export async function listOpportunities() {
  const db = await getDb();
  if (!db) return memoryStore.opportunities;
  return db.select().from(opportunities).orderBy(opportunities.sortOrder, desc(opportunities.createdAt));
}

export async function saveOpportunity(input: {
  id?: number;
  title: string;
  category: string;
  summary: string;
  commitment: string;
  status: "draft" | "published" | "closed";
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.opportunities.findIndex(o => o.id === input.id);
      if (index !== -1) {
        memoryStore.opportunities[index] = { ...memoryStore.opportunities[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.opportunities.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { ...input, id: undefined, updatedAt: new Date() };
  if (input.id) {
    const { id, ...updateValues } = values;
    await db.update(opportunities).set(updateValues).where(eq(opportunities.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(opportunities).values(insertValues).returning({ id: opportunities.id });
  return Number(result[0].id);
}

export async function removeOpportunity(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.opportunities.findIndex(o => o.id === id);
    if (index !== -1) memoryStore.opportunities.splice(index, 1);
    return;
  }
  await db.delete(opportunities).where(eq(opportunities.id, id));
}

export async function listImpactMetrics() {
  const db = await getDb();
  if (!db) return memoryStore.impactMetrics;
  return db.select().from(impactMetrics).orderBy(impactMetrics.status, impactMetrics.focusArea, impactMetrics.title);
}

export async function saveImpactMetric(input: {
  id?: number;
  title: string;
  focusArea: string;
  description: string;
  currentValue: number;
  targetValue?: number | null;
  unit: string;
  period: string;
  status: "active" | "archived";
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.impactMetrics.findIndex(m => m.id === input.id);
      if (index !== -1) {
        memoryStore.impactMetrics[index] = { ...memoryStore.impactMetrics[index], ...input, targetValue: input.targetValue ?? null, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.impactMetrics.push({ id, ...input, targetValue: input.targetValue ?? null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { ...input, id: undefined, updatedAt: new Date() };
  if (input.id) {
    const { id, ...updateValues } = values;
    await db.update(impactMetrics).set(updateValues).where(eq(impactMetrics.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(impactMetrics).values(insertValues).returning({ id: impactMetrics.id });
  return Number(result[0].id);
}

export async function removeImpactMetric(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.impactMetrics.findIndex(m => m.id === id);
    if (index !== -1) memoryStore.impactMetrics.splice(index, 1);
    return;
  }
  await db.delete(impactMetrics).where(eq(impactMetrics.id, id));
}

export async function listGalleryPhotos(includeUnpublished = true) {
  const db = await getDb();
  if (!db) return includeUnpublished ? memoryStore.galleryPhotos : memoryStore.galleryPhotos.filter(p => p.isPublished);
  const rows = await db.select().from(galleryPhotos).orderBy(galleryPhotos.sortOrder, desc(galleryPhotos.createdAt));
  return includeUnpublished ? rows : rows.filter(photo => photo.isPublished);
}

export async function saveGalleryPhoto(input: {
  id?: number;
  title: string;
  altText: string;
  imageUrl?: string;
  storageKey?: string;
  isPublished: boolean;
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.galleryPhotos.findIndex(p => p.id === input.id);
      if (index !== -1) {
        memoryStore.galleryPhotos[index] = { ...memoryStore.galleryPhotos[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.galleryPhotos.push({
      id,
      title: input.title,
      altText: input.altText,
      imageUrl: input.imageUrl || "/ybi-assets/gallery/workshop-1.jpg",
      storageKey: input.storageKey || "sample.jpg",
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }
  if (input.id) {
    await db.update(galleryPhotos).set({
      title: input.title,
      altText: input.altText,
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
      updatedAt: new Date(),
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
    sortOrder: input.sortOrder,
  }).returning({ id: galleryPhotos.id });
  return Number(result[0].id);
}

export async function removeGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.galleryPhotos.findIndex(p => p.id === id);
    if (index !== -1) memoryStore.galleryPhotos.splice(index, 1);
    return;
  }
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

export async function listPrograms(includeDrafts = true) {
  const db = await getDb();
  if (!db) return includeDrafts ? memoryStore.programs : memoryStore.programs.filter(p => p.status === "published");
  const rows = await db.select().from(programs).orderBy(programs.sortOrder, desc(programs.createdAt));
  return includeDrafts ? rows : rows.filter(program => program.status === "published");
}

export async function saveProgram(input: {
  id?: number;
  title: string;
  category: string;
  summary: string;
  status: "draft" | "published";
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.programs.findIndex(p => p.id === input.id);
      if (index !== -1) {
        memoryStore.programs[index] = { ...memoryStore.programs[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.programs.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { title: input.title, category: input.category, summary: input.summary, status: input.status, sortOrder: input.sortOrder, updatedAt: new Date() };
  if (input.id) {
    await db.update(programs).set(values).where(eq(programs.id, input.id));
    return input.id;
  }
  const result = await db.insert(programs).values(values).returning({ id: programs.id });
  return Number(result[0].id);
}

export async function removeProgram(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.programs.findIndex(p => p.id === id);
    if (index !== -1) memoryStore.programs.splice(index, 1);
    return;
  }
  await db.delete(programs).where(eq(programs.id, id));
}

export async function listUpdates(includeDrafts = true) {
  const db = await getDb();
  if (!db) return includeDrafts ? memoryStore.updates : memoryStore.updates.filter(u => u.status === "published");
  const rows = await db.select().from(updates).orderBy(desc(updates.createdAt));
  return includeDrafts ? rows : rows.filter(update => update.status === "published");
}

export async function saveUpdate(input: {
  id?: number;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.updates.findIndex(u => u.id === input.id);
      if (index !== -1) {
        memoryStore.updates[index] = { ...memoryStore.updates[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.updates.push({ id, ...input, publishedAt: input.status === "published" ? new Date() : null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = {
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    status: input.status,
    publishedAt: input.status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
  if (input.id) {
    await db.update(updates).set(values).where(eq(updates.id, input.id));
    return input.id;
  }
  const result = await db.insert(updates).values(values).returning({ id: updates.id });
  return Number(result[0].id);
}

export async function removeUpdate(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.updates.findIndex(u => u.id === id);
    if (index !== -1) memoryStore.updates.splice(index, 1);
    return;
  }
  await db.delete(updates).where(eq(updates.id, id));
}

export async function listSiteContent() {
  const db = await getDb();
  if (!db) return Array.from(memoryStore.siteContent.values());
  try {
    return await db.select().from(siteContent).orderBy(siteContent.contentKey);
  } catch {
    return Array.from(memoryStore.siteContent.values());
  }
}

export async function getSiteContent(contentKey: string) {
  const db = await getDb();
  if (!db) return memoryStore.siteContent.get(contentKey) ?? null;
  try {
    const rows = await db.select().from(siteContent).where(eq(siteContent.contentKey, contentKey)).limit(1);
    return rows[0] ?? null;
  } catch {
    return memoryStore.siteContent.get(contentKey) ?? null;
  }
}

export async function upsertSiteContent(input: {
  contentKey: string;
  label: string;
  title: string;
  body: string;
  actionLabel?: string | null;
  actionHref?: string | null;
}) {
  const db = await getDb();
  if (!db) {
    memoryStore.siteContent.set(input.contentKey, { ...input, updatedAt: new Date() });
    return;
  }
  try {
    await db.insert(siteContent).values(input).onConflictDoUpdate({
      target: siteContent.contentKey,
      set: { ...input, updatedAt: new Date() },
    });
  } catch {
    memoryStore.siteContent.set(input.contentKey, { ...input, updatedAt: new Date() });
  }
}

export async function removeSiteContent(contentKey: string) {
  const db = await getDb();
  if (!db) {
    memoryStore.siteContent.delete(contentKey);
    return;
  }
  try {
    await db.delete(siteContent).where(eq(siteContent.contentKey, contentKey));
  } catch {
    memoryStore.siteContent.delete(contentKey);
  }
}

// ─── Team Members ────────────────────────────────────────────────────────────

export async function listTeamMembers() {
  return memoryStore.teamMembers.slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveTeamMember(input: {
  id?: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
  linkedIn?: string;
  sortOrder: number;
  isPublished: boolean;
}) {
  if (input.id) {
    const index = memoryStore.teamMembers.findIndex(m => m.id === input.id);
    if (index !== -1) {
      memoryStore.teamMembers[index] = { ...memoryStore.teamMembers[index], ...input, updatedAt: new Date() };
      return input.id;
    }
  }
  const id = ++memoryStore.autoId;
  memoryStore.teamMembers.push({ id, ...input, email: input.email || "", linkedIn: input.linkedIn || "", createdAt: new Date(), updatedAt: new Date() });
  return id;
}

export async function removeTeamMember(id: number) {
  const index = memoryStore.teamMembers.findIndex(m => m.id === id);
  if (index !== -1) memoryStore.teamMembers.splice(index, 1);
}

// ─── Newsletter Subscribers ───────────────────────────────────────────────────

export async function addNewsletterSubscriber(input: { email: string; name: string }) {
  const existing = memoryStore.newsletterSubscribers.find(s => s.email.toLowerCase() === input.email.toLowerCase());
  if (existing) return existing.id;
  const id = ++memoryStore.autoId;
  memoryStore.newsletterSubscribers.unshift({ id, ...input, createdAt: new Date() });
  return id;
}

export async function listNewsletterSubscribers() {
  return memoryStore.newsletterSubscribers;
}

export async function removeNewsletterSubscriber(id: number) {
  const index = memoryStore.newsletterSubscribers.findIndex(s => s.id === id);
  if (index !== -1) memoryStore.newsletterSubscribers.splice(index, 1);
}
