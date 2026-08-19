// Preconfigured storage service connected directly to Supabase Storage
import fs from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

let _supabaseClient: SupabaseClient | null = null;
let _bucketChecked = false;

/**
 * Lazily returns an initialized Supabase Client if SUPABASE_URL and key are available.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = (process.env.SUPABASE_URL || ENV.supabaseUrl || "").trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ENV.supabaseServiceRoleKey ||
    process.env.SUPABASE_ANON_KEY ||
    ENV.supabaseAnonKey ||
    ""
  ).trim();

  if (!url || !key) {
    return null;
  }

  if (!_supabaseClient || (_supabaseClient as any)._key !== key) {
    _supabaseClient = createClient(url, key, {
      auth: { persistSession: false },
    });
    (_supabaseClient as any)._key = key;
  }

  return _supabaseClient;
}

/**
 * Returns the configured Supabase Storage bucket name (defaults to "ybi-storage").
 */
export function getStorageBucket(): string {
  return (ENV.supabaseBucket || process.env.SUPABASE_STORAGE_BUCKET || "ybi-storage").trim();
}

/**
 * Ensures the target public storage bucket exists in Supabase.
 */
export async function ensureSupabaseBucket(
  client: SupabaseClient,
  bucketName: string
): Promise<boolean> {
  if (_bucketChecked) return true;
  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (error) {
      // Listing buckets may require admin/service_role permissions.
      // If anon key is used, assume bucket exists and proceed.
      _bucketChecked = true;
      return true;
    }

    const exists = buckets?.some((b) => b.name === bucketName);
    if (!exists) {
      const { error: createErr } = await client.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 15 * 1024 * 1024, // 15MB
      });
      if (createErr && !createErr.message?.toLowerCase().includes("already exists")) {
        console.warn(`[Supabase Storage] Notice creating bucket "${bucketName}":`, createErr.message);
      } else {
        console.log(`[Supabase Storage] Verified/Created public bucket "${bucketName}" ✓`);
      }
    }
    _bucketChecked = true;
    return true;
  } catch {
    _bucketChecked = true;
    return true;
  }
}

export function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "").replace(/\\+/g, "/");
}

export function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

/**
 * Uploads a file (Buffer, Uint8Array, or base64 data string) to Supabase Storage.
 * Falls back to local/base64 URL if Supabase Storage credentials are not provided.
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  const bucket = getStorageBucket();
  const supabase = getSupabaseClient();

  // 1. Resolve binary buffer and content type
  let buffer: Buffer;
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

  // 2. Upload to Supabase Storage
  if (supabase) {
    await ensureSupabaseBucket(supabase, bucket);

    const { data: uploadResult, error } = await supabase.storage
      .from(bucket)
      .upload(key, buffer, {
        contentType: resolvedContentType,
        upsert: true,
      });

    if (error) {
      console.error("[Supabase Storage] Upload error:", error.message);
      throw new Error(`Supabase Storage Upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(key);

    if (publicUrlData?.publicUrl) {
      console.log(`[Supabase Storage] Successfully uploaded to: ${publicUrlData.publicUrl}`);
      return { key, url: publicUrlData.publicUrl };
    }
  }

  throw new Error("Supabase Storage is not configured properly.");
}

/**
 * Gets the public URL of a file from Supabase Storage.
 */
export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
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

/**
 * Generates a signed download URL for private or temporary files in Supabase Storage.
 */
export async function storageGetSignedUrl(relKey: string, expiresIn = 3600): Promise<string> {
  const key = normalizeKey(relKey);
  const supabase = getSupabaseClient();
  const bucket = getStorageBucket();

  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(key, expiresIn);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch {}
  }

  return `/uploads/${key}`;
}

/**
 * Removes a file from Supabase Storage and local disk.
 */
export async function storageDelete(relKey: string): Promise<boolean> {
  const key = normalizeKey(relKey);
  const supabase = getSupabaseClient();
  const bucket = getStorageBucket();

  let removed = true;
  if (supabase) {
    try {
      const { error } = await supabase.storage.from(bucket).remove([key]);
      if (error) {
        console.warn("[Supabase Storage] Delete error:", error.message);
        removed = false;
      }
    } catch {
      removed = false;
    }
  }

  try {
    const localPath = path.resolve(process.cwd(), "uploads", key);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  } catch {}

  return removed;
}
