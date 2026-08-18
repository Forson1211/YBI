import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const stylesheet = readFileSync(resolve(process.cwd(), "frontend/src/index.css"), "utf8");

describe("clean About and Contact page heroes", () => {
  it("removes legacy pseudo-element decorations while retaining the shared footer-blue surface", () => {
    expect(stylesheet).toContain(".page-hero-about::before,");
    expect(stylesheet).toContain(".page-hero-contact::after {");
    expect(stylesheet).toMatch(/\.page-hero-about::before,[\s\S]*?display: none;/);
    expect(stylesheet).toMatch(/\.page-hero-contact::after \{[\s\S]*?display: none;/);
    expect(stylesheet).toMatch(/\.page-hero-about,[\s\S]*?\.page-hero-contact \{[\s\S]*?background: var\(--footer-blue\);/);
  });
});
