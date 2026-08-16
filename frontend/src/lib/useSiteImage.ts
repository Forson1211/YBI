import { trpc } from "@/lib/trpc";
import { SITE_IMAGE_SLOTS } from "@shared/siteImages";
import { useMemo } from "react";

const defaultSlotsMap = new Map(
  SITE_IMAGE_SLOTS.map(slot => [slot.key, { src: slot.defaultSrc, alt: slot.defaultAlt }])
);

export function useSiteImages() {
  const query = trpc.publicSite.siteImages.getAll.useQuery(undefined, {
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const images = useMemo(() => {
    const overrides = query.data ?? {};
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
  }, [query.data]);

  return {
    images,
    isLoading: query.isLoading,
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
