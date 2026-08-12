export type ImageWallPhoto = {
  src: string;
  alt: string;
};

const MINIMUM_ROW_ITEMS = 8;
const ROW_OFFSETS = [0, 2, 4] as const;

export function createImageWallRows(photos: ImageWallPhoto[]) {
  const uniquePhotos = photos.filter((photo, index, collection) => (
    collection.findIndex((candidate) => candidate.src === photo.src) === index
  ));

  if (uniquePhotos.length === 0) return [];

  const normalized = Array.from(
    { length: Math.max(MINIMUM_ROW_ITEMS, uniquePhotos.length) },
    (_, index) => uniquePhotos[index % uniquePhotos.length],
  );

  return ROW_OFFSETS.map((offset) => {
    const startingPoint = offset % normalized.length;
    const shifted = [...normalized.slice(startingPoint), ...normalized.slice(0, startingPoint)];
    return [...shifted, ...shifted];
  });
}
