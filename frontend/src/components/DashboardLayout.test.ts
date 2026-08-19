import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("YBI admin shell responsive safeguards", () => {
  const dashboardSource = readFileSync(new URL("./DashboardLayout.tsx", import.meta.url), "utf8").replace(/\r\n/g, "\n");
  const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8").replace(/\r\n/g, "\n");

  it("closes the mobile drawer when an admin section is selected", () => {
    expect(dashboardSource).toContain("const handleNavigation = (path: string)");
    expect(dashboardSource).toContain("setMobileDrawerOpen(false);");
    expect(dashboardSource).toContain("onClick={() => handleNavigation(item.path)}");
  });

  it("keeps a branded, dismissible mobile admin navigation header", () => {
    expect(dashboardSource).toContain('className="admin-drawer-header"');
    expect(dashboardSource).toContain('aria-label="Close navigation"');
    expect(dashboardSource).toContain('className="admin-mobile-topbar md:hidden"');
    expect(dashboardSource).toContain('aria-label="Open YBI Admin navigation"');
    expect(dashboardSource).toContain('aria-expanded={mobileDrawerOpen}');
    expect(dashboardSource).toContain('<Menu size={20} strokeWidth={2.2} />');
    expect(dashboardSource).toContain('className="admin-mobile-brand"');
  });

  it("uses dedicated mobile styling rather than a fixed desktop panel", () => {
    expect(styles).toContain(".admin-drawer-header");
    expect(styles).toContain(".admin-mobile-topbar");
  });
});
