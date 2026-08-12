import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  galleryPhotos,
  InsertUser,
  programs,
  siteContent,
  updates,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
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

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db;
}

export async function getDashboardOverview() {
  const db = await requireDb();
  const [gallery, programCount, updateCount, contentCount] = await Promise.all([
    db.select({ value: count() }).from(galleryPhotos),
    db.select({ value: count() }).from(programs),
    db.select({ value: count() }).from(updates),
    db.select({ value: count() }).from(siteContent),
  ]);
  return {
    gallery: gallery[0]?.value ?? 0,
    programs: programCount[0]?.value ?? 0,
    updates: updateCount[0]?.value ?? 0,
    content: contentCount[0]?.value ?? 0,
  };
}

export async function listGalleryPhotos(includeUnpublished = true) {
  const db = await requireDb();
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
  const db = await requireDb();
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
  });
  return Number(result[0].insertId);
}

export async function removeGalleryPhoto(id: number) {
  const db = await requireDb();
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

export async function listPrograms(includeDrafts = true) {
  const db = await requireDb();
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
  const db = await requireDb();
  const values = { title: input.title, category: input.category, summary: input.summary, status: input.status, sortOrder: input.sortOrder, updatedAt: new Date() };
  if (input.id) {
    await db.update(programs).set(values).where(eq(programs.id, input.id));
    return input.id;
  }
  const result = await db.insert(programs).values(values);
  return Number(result[0].insertId);
}

export async function removeProgram(id: number) {
  const db = await requireDb();
  await db.delete(programs).where(eq(programs.id, id));
}

export async function listUpdates(includeDrafts = true) {
  const db = await requireDb();
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
  const db = await requireDb();
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
  const result = await db.insert(updates).values(values);
  return Number(result[0].insertId);
}

export async function removeUpdate(id: number) {
  const db = await requireDb();
  await db.delete(updates).where(eq(updates.id, id));
}

export async function listSiteContent() {
  const db = await requireDb();
  return db.select().from(siteContent).orderBy(siteContent.contentKey);
}

export async function getSiteContent(contentKey: string) {
  const db = await requireDb();
  const rows = await db.select().from(siteContent).where(eq(siteContent.contentKey, contentKey)).limit(1);
  return rows[0] ?? null;
}

export async function upsertSiteContent(input: {
  contentKey: string;
  label: string;
  title: string;
  body: string;
  actionLabel?: string | null;
  actionHref?: string | null;
}) {
  const db = await requireDb();
  await db.insert(siteContent).values(input).onDuplicateKeyUpdate({
    set: { ...input, updatedAt: new Date() },
  });
}
