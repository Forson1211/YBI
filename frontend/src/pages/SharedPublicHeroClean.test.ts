import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("shared public-page hero styling", () => {
  it("suppresses the legacy overlay decorations for every page using page-hero", () => {
    expect(stylesheet).toMatch(
      /\.page-hero::before,\s*\.page-hero::after\s*\{[\s\S]*?display:\s*none;/,
    );
  });

  it("uses compact responsive vertical spacing across shared and clean donation-style heroes", () => {
    expect(stylesheet).toContain(
      ".page-hero {\n  display: block;\n  min-height: 0;\n  padding: clamp(2rem, 4vw, 3.5rem) 0 2.5rem;",
    );
    expect(stylesheet).toContain(
      ".get-involved-hero {\n  padding: clamp(2rem, 4vw, 3.5rem) 0 2.5rem;",
    );
    expect(stylesheet).toContain(
      ".page-hero-contact {\n  padding: clamp(2rem, 4vw, 3.5rem) 0 clamp(2.5rem, 4vw, 3.5rem);",
    );
  });
});
