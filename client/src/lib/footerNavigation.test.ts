import { describe, expect, it } from "vitest";
import { footerImpactActions, footerNavigation } from "./footerNavigation";

describe("footer navigation", () => {
  it("offers distinct navigation groups with usable destinations", () => {
    expect(footerNavigation.map((group) => group.title)).toEqual(["Explore", "Get involved", "Discover"]);

    for (const group of footerNavigation) {
      expect(group.links.length).toBeGreaterThan(0);
      for (const link of group.links) {
        expect(link.label).toBeTruthy();
        expect(link.href).toMatch(/^(\/|#|mailto:)/);
      }
    }

    expect(footerImpactActions).toHaveLength(2);
  });
});
