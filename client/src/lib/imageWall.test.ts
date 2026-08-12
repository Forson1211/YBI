import { describe, expect, it } from "vitest";
import { createImageWallRows } from "./imageWall";

const photos = [
  { src: "/one.jpg", alt: "One" },
  { src: "/two.jpg", alt: "Two" },
  { src: "/three.jpg", alt: "Three" },
];

describe("createImageWallRows", () => {
  it("creates three duplicated marquee rows from a short gallery collection", () => {
    const rows = createImageWallRows(photos);

    expect(rows).toHaveLength(3);
    expect(rows.every((row) => row.length === 16)).toBe(true);
    expect(rows[0].slice(0, 8)).toEqual(rows[0].slice(8));
    expect(rows[1][0]).toEqual(photos[2]);
  });

  it("returns no rows when no gallery images are available", () => {
    expect(createImageWallRows([])).toEqual([]);
  });
});
