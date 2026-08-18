import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("shared public-page hero styling", () => {
  it("suppresses the legacy overlay decorations for every page using page-hero", () => {
    expect(stylesheet).toMatch(
      /\.page-hero::before,\s*\.page-hero::after\s*\{[\s\S]*?display:\s*none;/,
    );
  });
});
