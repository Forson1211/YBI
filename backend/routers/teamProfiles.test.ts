import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const db = readFileSync(new URL("../db.ts", import.meta.url), "utf8");
const router = readFileSync(new URL("./admin.ts", import.meta.url), "utf8");

describe("Team profile management contracts", () => {
  it("persists Team members with slugs and exposes a published-only public directory", () => {
    expect(db).toContain("getTeamMemberBySlug");
    expect(db).toContain("getTeamProfilePool");
    expect(db).toContain("SELECT * FROM `teamMembers`");
    expect(router).toContain("list: publicProcedure.query(() => listTeamMembers(false))");
    expect(router).toContain("getBySlug");
  });

  it("provides an admin-only portrait upload endpoint", () => {
    expect(router).toContain("uploadPortrait: adminProcedure");
    expect(router).toContain("team-members/");
    expect(router).toContain("Portrait images must be 5 MB or smaller.");
  });
});
