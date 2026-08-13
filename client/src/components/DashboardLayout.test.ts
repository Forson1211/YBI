import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("YBI admin shell responsive safeguards", () => {
  const dashboardSource = readFileSync(new URL("./DashboardLayout.tsx", import.meta.url), "utf8");
  const sidebarSource = readFileSync(new URL("./ui/sidebar.tsx", import.meta.url), "utf8");
  const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");

  it("closes the mobile drawer when an admin section is selected", () => {
    expect(dashboardSource).toContain("const handleNavigation = (path: string)");
    expect(dashboardSource).toContain("if (isMobile) setOpenMobile(false);");
    expect(dashboardSource).toContain("onClick={() => handleNavigation(item.path)}");
  });

  it("keeps a branded, dismissible mobile admin navigation header", () => {
    expect(dashboardSource).toContain('? "admin-drawer-header" : "h-16 justify-center"');
    expect(dashboardSource).toContain('aria-label="Close management menu"');
    expect(dashboardSource).toContain('className="admin-mobile-topbar"');
    expect(dashboardSource).toContain("Secure</span>");
    expect(sidebarSource).toContain('"bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",');
    expect(sidebarSource).toContain("className\n          )}");
  });

  it("uses dedicated mobile styling rather than a fixed desktop panel", () => {
    expect(styles).toContain(".admin-drawer-header");
    expect(styles).toContain(".admin-mobile-topbar");
    expect(styles).toContain('.admin-sidebar[data-sidebar="sidebar"]');
    expect(styles).toContain(".admin-page-actions{align-items:flex-end;flex-direction:column}");
  });
});
