import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("shared public-page footer-blue treatment", () => {
  it("uses the footer blue token for the footer and representative public-page surfaces", () => {
    expect(stylesheet).toContain("--footer-blue: var(--blue-deep);");

    [
      "reference-footer",
      "page-hero",
      "get-involved-hero",
      "section-blue",
      "why-reference",
      "events-partner-card",
      "donation-impact-box",
      "donation-why-card",
      "about-invitation-band",
      "page-hero-contact",
      "blog-hero-header",
      "blog-newsletter-section",
    ].forEach((selector) => {
      expect(stylesheet).toMatch(
        new RegExp(`\\.${selector}\\s*\\{[^}]*background:\\s*var\\(--footer-blue\\)`),
      );
    });
  });
});
