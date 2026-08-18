// Preconfigured storage helpers for Manus WebDev templates with Local Storage Fallback
import fs from "fs";
import path from "path";
import { ENV } from "./_core/env";

function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    return null;
  }

  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const key = appendHashSuffix(normalizeKey(relKey));
  const forgeConfig = getForgeConfig();

  if (forgeConfig) {
    try {
      const { forgeUrl, forgeKey } = forgeConfig;
      // 1. Get presigned PUT URL from Forge
      const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
      presignUrl.searchParams.set("path", key);

      const presignResp = await fetch(presignUrl, {
        headers: { Authorization: `Bearer ${forgeKey}` },
      });

      if (presignResp.ok) {
        const { url: s3Url } = (await presignResp.json()) as { url: string };
        if (s3Url) {
          // 2. PUT file directly to S3
          const blob =
            typeof data === "string"
              ? new Blob([data], { type: contentType })
              : new Blob([data as any], { type: contentType });

          const uploadResp = await fetch(s3Url, {
            method: "PUT",
            headers: { "Content-Type": contentType },
            body: blob,
          });

          if (uploadResp.ok) {
            return { key, url: `/manus-storage/${key}` };
          }
        }
      }
    } catch (e) {
      console.warn("Forge S3 upload failed, falling back to local file storage:", e);
    }
  }

  // Calculate base64 data URL for 100% cross-environment persistence
  const b64 =
    typeof data === "string"
      ? (data.startsWith("data:") ? data : Buffer.from(data).toString("base64"))
      : Buffer.isBuffer(data)
      ? data.toString("base64")
      : Buffer.from(data).toString("base64");
  const dataUrl = b64.startsWith("data:") ? b64 : `data:${contentType};base64,${b64}`;

  // If local development, also write to disk as backup
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    try {
      const buffer =
        typeof data === "string"
          ? Buffer.from(data)
          : Buffer.isBuffer(data)
          ? data
          : Buffer.from(data);

      const localUploadsDir = path.resolve(process.cwd(), "uploads");
      const targetPath = path.join(localUploadsDir, key);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, buffer);

      const frontendPublicUploads = path.resolve(process.cwd(), "frontend", "public", "uploads");
      try {
        const fePath = path.join(frontendPublicUploads, key);
        fs.mkdirSync(path.dirname(fePath), { recursive: true });
        fs.writeFileSync(fePath, buffer);
      } catch (e) {}
    } catch (e) {}
  }

  return { key, url: dataUrl };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const forgeConfig = getForgeConfig();
  if (forgeConfig) {
    return { key, url: `/manus-storage/${key}` };
  }
  return { key, url: `/uploads/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const forgeConfig = getForgeConfig();
  const key = normalizeKey(relKey);

  if (forgeConfig) {
    try {
      const { forgeUrl, forgeKey } = forgeConfig;
      const getUrl = new URL("v1/storage/presign/get", forgeUrl + "/");
      getUrl.searchParams.set("path", key);

      const resp = await fetch(getUrl, {
        headers: { Authorization: `Bearer ${forgeKey}` },
      });

      if (resp.ok) {
        const { url } = (await resp.json()) as { url: string };
        if (url) return url;
      }
    } catch (e) {}
  }

  return `/uploads/${key}`;
}
