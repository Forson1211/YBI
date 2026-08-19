import { describe, expect, it } from "vitest";
import {
  appendHashSuffix,
  getStorageBucket,
  getSupabaseClient,
  normalizeKey,
  storageDelete,
  storageGet,
  storagePut,
} from "./storage";

describe("Supabase Storage Service", () => {
  it("normalizes storage keys and strips leading slashes or backslashes", () => {
    expect(normalizeKey("/gallery/photo.jpg")).toBe("gallery/photo.jpg");
    expect(normalizeKey("///site-images/hero.webp")).toBe("site-images/hero.webp");
    expect(normalizeKey("team\\portrait.png")).toBe("team/portrait.png");
  });

  it("appends an 8-character unique hash suffix while preserving extension", () => {
    const key = appendHashSuffix("gallery/test-image.jpg");
    expect(key).toMatch(/^gallery\/test-image_[a-f0-9]{8}\.jpg$/);

    const noExtKey = appendHashSuffix("documents/file");
    expect(noExtKey).toMatch(/^documents\/file_[a-f0-9]{8}$/);
  });

  it("retrieves the configured Supabase bucket name", () => {
    const bucket = getStorageBucket();
    expect(bucket).toBeDefined();
    expect(typeof bucket).toBe("string");
    expect(bucket.length).toBeGreaterThan(0);
  });

  it("uploads a buffer/base64 via storagePut and returns a valid key and URL", async () => {
    const testData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const result = await storagePut("test/pixel.png", testData, "image/png");

    expect(result).toBeDefined();
    expect(result.key).toContain("test/pixel_");
    expect(result.url).toBeDefined();
    expect(result.url.length).toBeGreaterThan(0);

    // Clean up
    await storageDelete(result.key);
  });

  it("retrieves storage URL via storageGet", async () => {
    const res = await storageGet("gallery/demo.jpg");
    expect(res.key).toBe("gallery/demo.jpg");
    expect(res.url).toBeDefined();
  });
});
