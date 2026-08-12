import { describe, expect, it } from "vitest";
import { homepageUpdates } from "./homeUpdates";

describe("homepageUpdates", () => {
  it("provides complete visual-news metadata for every homepage update card", () => {
    expect(homepageUpdates).toHaveLength(3);
    expect(new Set(homepageUpdates.map((update) => update.category)).size).toBe(homepageUpdates.length);

    for (const update of homepageUpdates) {
      expect(update.title).toBeTruthy();
      expect(update.source).toBeTruthy();
      expect(update.detail).toBeTruthy();
      expect(update.media).toHaveLength(3);
      expect(new Set(update.media.map((image) => image.src)).size).toBe(3);
      for (const image of update.media) {
        expect(image.src).toMatch(/^\/manus-storage\//);
        expect(image.alt).toBeTruthy();
      }
    }
  });
});
