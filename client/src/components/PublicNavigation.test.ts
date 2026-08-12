import { describe, expect, it } from "vitest";
import { publicNavItems } from "./PublicNavigation";

describe("public navigation structure", () => {
  it("keeps all primary header destinations and dropdown sections available", () => {
    expect(publicNavItems.map((item) => item.label)).toEqual([
      "About",
      "Focus Areas",
      "Programs",
      "Join Us",
      "Media",
      "Gallery",
    ]);

    const dropdownLabels = publicNavItems.filter((item) => item.items).map((item) => item.label);
    expect(dropdownLabels).toEqual(["About", "Focus Areas", "Programs", "Join Us", "Media"]);
    expect(publicNavItems.find((item) => item.label === "Gallery")?.items).toBeUndefined();
  });
});
