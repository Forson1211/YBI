import { trpc } from "@/lib/trpc";
import { SITE_IMAGE_SLOTS } from "@shared/siteImages";
import { useEffect, useMemo, useState } from "react";

const defaultSlotsMap = new Map(
  SITE_IMAGE_SLOTS.map(slot => [slot.key, { src: slot.defaultSrc, alt: slot.defaultAlt }])
);

export function useSiteImages() {
  const query = trpc.publicSite.siteImages.getAll.useQuery(undefined, {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const [cachedOverrides, setCachedOverrides] = useState<Record<string, { src?: string; alt?: string }>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem("ybi_site_images_overrides");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("ybi_site_images_overrides");
        if (saved) setCachedOverrides(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("ybi_site_images_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("ybi_site_images_updated", handleSync);
    };
  }, []);

  useEffect(() => {
    if (query.data !== undefined) {
      try {
        localStorage.setItem("ybi_site_images_overrides", JSON.stringify(query.data));
        setCachedOverrides(query.data);
      } catch {}
    }
  }, [query.data]);

  const images = useMemo(() => {
    const overrides = query.data ?? cachedOverrides ?? {};
    const result: Record<string, { src: string; alt: string }> = {};

    defaultSlotsMap.forEach((val, key) => {
      if (overrides[key]?.src) {
        result[key] = {
          src: overrides[key].src,
          alt: overrides[key].alt || val.alt,
        };
      } else {
        result[key] = val;
      }
    });

    return result;
  }, [query.data, cachedOverrides]);

  return {
    images,
    isLoading: query.isLoading && Object.keys(cachedOverrides).length === 0,
    getImage: (key: string, fallbackSrc?: string, fallbackAlt?: string) => {
      if (images[key]?.src) return images[key];
      const def = defaultSlotsMap.get(key);
      return {
        src: fallbackSrc || def?.src || "",
        alt: fallbackAlt || def?.alt || "",
      };
    },
  };
}

export function useSiteImage(key: string, fallbackSrc?: string, fallbackAlt?: string) {
  const { getImage } = useSiteImages();
  return getImage(key, fallbackSrc, fallbackAlt);
}
