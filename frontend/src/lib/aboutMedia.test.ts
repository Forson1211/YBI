import { describe, expect, it } from "vitest";
import { aboutMediaSlides } from "./aboutMedia";

describe("aboutMediaSlides", () => {
  it("keeps the community conversation image as the second enlarged Who We Are slide", () => {
    expect(aboutMediaSlides).toHaveLength(3);
    expect(aboutMediaSlides[1].src).toContain("ybi-community");
    expect(new Set(aboutMediaSlides.map((slide) => slide.src)).size).toBe(3);
    expect(aboutMediaSlides.every((slide) => slide.alt.length > 0)).toBe(true);
  });
});
