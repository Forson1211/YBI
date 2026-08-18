import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("./Team.tsx", import.meta.url), "utf8");
const stylesheet = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("Team page interface", () => {
  it("introduces the people-first member directory with linked public profiles", () => {
    expect(page).toContain("Intergenerational by design");
    expect(page).toContain("The people who move the work");
    expect(page).toContain("Different strengths.");
    expect(page).toContain("trpc.publicSite.team.list.useQuery");
    expect(page).toContain('href={`/team/${member.slug}`}');
    expect(page).toContain("Learn More");
    expect(page).toContain('className="team-action-copy"');
  });

  it("keeps a dedicated profile stylesheet for accessible cards and the public bio layout", () => {
    const profiles = readFileSync(new URL("../team-profiles.css", import.meta.url), "utf8");
    expect(profiles).toContain(".team-role-card:focus-visible");
    expect(profiles).toContain(".team-profile-layout");
    expect(profiles).toContain(".team-profile-aside");
    expect(stylesheet).toContain(".team-hero-context {");
    expect(stylesheet).toContain("border-radius: 50% !important;");
    expect(stylesheet).toContain("min-height: 205px !important;");
  });
});
