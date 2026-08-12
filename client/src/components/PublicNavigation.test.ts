import { describe, expect, it } from "vitest";
import { getNextMobileSubmenu, publicNavItems } from "./PublicNavigation";

describe("public navigation structure", () => {
  it("keeps all primary header destinations and dropdown sections available", () => {
    expect(publicNavItems.map((item) => item.label)).toEqual([
      "About",
      "Focus Areas",
      "Programs",
      "Join Us",
      "Media",
      "Gallery",
      "Contact",
    ]);

    const dropdownLabels = publicNavItems.filter((item) => item.items).map((item) => item.label);
    expect(dropdownLabels).toEqual(["About", "Focus Areas", "Programs", "Join Us", "Media"]);
    expect(publicNavItems.find((item) => item.label === "Gallery")?.items).toBeUndefined();
    expect(publicNavItems.find((item) => item.label === "Contact")?.href).toBe("/contact");

    expect(publicNavItems.find((item) => item.label === "About")?.items).toContainEqual({
      label: "Our Team",
      href: "/team",
    });

    const destinations = publicNavItems.flatMap((item) => [item.href, ...(item.items?.map((link) => link.href) ?? [])]);
    expect(destinations.every((href) => href.startsWith("/"))).toBe(true);
    expect(destinations).toContain("/media#newsletter");
  });

  it("keeps mobile submenus collapsed initially and toggles one parent section at a time", () => {
    expect(getNextMobileSubmenu(null, "About")).toBe("About");
    expect(getNextMobileSubmenu("About", "About")).toBeNull();
    expect(getNextMobileSubmenu("About", "Programs")).toBe("Programs");
  });
});
