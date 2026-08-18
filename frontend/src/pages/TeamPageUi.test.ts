import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("./Team.tsx", import.meta.url), "utf8");
const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("Team page interface", () => {
  it("introduces the people-first role section and clear role-card content", () => {
    expect(page).toContain("Intergenerational by design");
    expect(page).toContain("The people who move the work");
    expect(page).toContain("Different strengths.");
    expect(page).toContain('className="team-role-copy"');
    expect(page).toContain('className="team-role-text"');
    expect(page).toContain('className="team-action-copy"');
  });

  it("removes the legacy oversized overlay card behavior in favor of compact profiles", () => {
    expect(stylesheet).toContain(".team-role-card {\n  position: relative;\n  min-height: 0;");
    expect(stylesheet).toContain(".team-role-card > .team-role-copy {\n  z-index: auto;\n  height: auto;\n  min-height: 0;");
    expect(stylesheet).toContain(".team-role-card img {\n  position: static;");
    expect(stylesheet).toContain(".team-hero-context {");
    expect(stylesheet).toContain(".team-page .page-action-panel::before {");
  });
});
