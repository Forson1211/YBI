import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("./Team.tsx", import.meta.url), "utf8");

describe("Team page interface", () => {
  it("introduces the people-first member directory with linked public profiles", () => {
    expect(page).toContain("Connect with");
    expect(page).toContain("the team.");
    expect(page).toContain("trpc.publicSite.team.list.useQuery");
    expect(page).toContain("team-card");
    expect(page).toContain("Learn More");
  });

  it("keeps a dedicated profile stylesheet for accessible cards and the public bio layout", () => {
    const profiles = readFileSync(new URL("../team-profiles.css", import.meta.url), "utf8");
    expect(profiles).toContain(".team-card-photo");
    expect(profiles).toContain(".team-profile-layout");
    expect(profiles).toContain(".team-profile-aside");
  });
});

