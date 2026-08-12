import { describe, expect, it } from "vitest";
import { footerImpactActions, footerNavigation } from "./footerNavigation";

describe("footer navigation", () => {
  it("offers distinct navigation groups with usable destinations", () => {
    expect(footerNavigation.map((group) => group.title)).toEqual(["Explore", "Get involved", "Discover"]);

    for (const group of footerNavigation) {
      expect(group.links.length).toBeGreaterThan(0);
      for (const link of group.links) {
        expect(link.label).toBeTruthy();
        expect(link.href).toMatch(/^\//);
      }
    }

    expect(footerImpactActions).toHaveLength(2);
    expect(footerNavigation[1].links.find((link) => link.label === "Contact us")?.href).toBe("/contact");

    const exactDestinations = [...footerNavigation.flatMap((group) => group.links), ...footerImpactActions].map((link) => link.href);
    expect(exactDestinations).toEqual([
      "/about",
      "/focus-areas",
      "/programs",
      "/join-us#volunteer",
      "/join-us#partner",
      "/contact",
      "/team",
      "/gallery",
      "/media#stories",
      "/media#newsletter",
      "/join-us#volunteer",
      "/programs",
    ]);
  });
});
