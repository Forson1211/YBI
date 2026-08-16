import { describe, expect, it } from "vitest";
import { DISABLED_VITE_CLIENT_MODULE } from "./_core/vite";
import viteConfig from "../vite.config";

describe("Vite HMR preview configuration", () => {
  it("disables the unreliable managed-preview HMR WebSocket client", () => {
    expect(viteConfig.server?.host).toBe(true);
    expect(viteConfig.server?.hmr).toBe(false);
    expect(viteConfig.plugins?.some((plugin: any) => plugin?.name === "disable-managed-preview-hmr-client")).toBe(true);
  });

  it("returns an inert, non-cacheable replacement for any stale Vite client request", () => {
    expect(DISABLED_VITE_CLIENT_MODULE).toContain("Vite HMR is intentionally disabled");
    expect(DISABLED_VITE_CLIENT_MODULE).not.toContain("WebSocket");
    expect(DISABLED_VITE_CLIENT_MODULE).toContain("createHotContext");
    expect(DISABLED_VITE_CLIENT_MODULE).toContain("updateStyle");
    expect(DISABLED_VITE_CLIENT_MODULE).toContain("export { ErrorOverlay, createHotContext, injectQuery, removeStyle, updateStyle }");
  });
});
