/**
 * High-performance client-side cache for YBI public site data.
 * Eliminates flashes of default/seeded assets on page refresh
 * by instantly hydrating state from localStorage before TRPC queries resolve.
 */

export function getClientCache<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`ybi_cache_${key}`);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function setClientCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`ybi_cache_${key}`, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent("ybi_cache_updated", { detail: { key, data } })
    );
  } catch {}
}

/**
 * Compresses an image file to an optimized WebP Data URL client-side.
 * Ensures fast uploads, low bandwidth, and zero network bottlenecks.
 */
export async function compressImageToWebP(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const webpDataUrl = canvas.toDataURL("image/webp", quality);
          resolve(webpDataUrl);
        } catch {
          // Fallback to standard jpeg if webp canvas export is unsupported
          const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(jpegDataUrl);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image file for compression"));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file from device"));
    reader.readAsDataURL(file);
  });
}
