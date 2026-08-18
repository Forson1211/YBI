import { describe, expect, it } from "vitest";
import { footerImpactActions, footerNavigation } from "./footerNavigation";

describe("footer navigation", () => {
  it("offers distinct navigation groups with usable destinations", () => {
    expect(footerNavigation.map((group) => group.title)).toEqual([
      "Organization",
      "Participation",
      "Support & Legal",
      "Connect",
      "Make an Impact",
    ]);

    for (const group of footerNavigation) {
      expect(group.links.length).toBeGreaterThan(0);
      for (const link of group.links) {
        expect(link.label).toBeTruthy();
        expect(link.href).toMatch(/^\//);
      }
    }

    expect(footerImpactActions).toHaveLength(3);
    expect(footerNavigation[2].links.find((link) => link.label === "Contact YBI")?.href).toBe("/contact");

    const exactDestinations = [...footerNavigation.flatMap((group) => group.links), ...footerImpactActions].map((link) => link.href);
    expect(exactDestinations).toEqual([
      "/about",
      "/team",
      "/focus-areas",
      "/programs",
      "/events",
      "/blog",
      "/get-involved#donate",
      "/get-involved#volunteer",
      "/faq",
      "/contact",
      "/privacy-policy",
      "/terms-of-use",
      "/contact",
      "/blog",
      "/events",
      "/gallery",
      "/get-involved#donate",
      "/get-involved#volunteer",
      "/events",
      "/get-involved#donate",
      "/get-involved#volunteer",
      "/events",
    ]);
  });
});


