import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("./TeamProfile.tsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

describe("Team member profile pages", () => {
  it("loads a published profile by its public slug and gives visitors a clear route back to the team", () => {
    expect(page).toContain('useRoute("/team/:slug")');
    expect(page).toContain("trpc.publicSite.team.getBySlug.useQuery");
    expect(page).toContain('href="/team"');
  });

  it("registers the individual Team member route", () => {
    expect(app).toContain('path={"/team/:slug"}');
    expect(app).toContain("TeamProfile");
  });
});
