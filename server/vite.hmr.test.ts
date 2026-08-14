import { describe, expect, it } from "vitest";
import viteConfig from "../vite.config";

describe("Vite HMR preview configuration", () => {
  it("disables the unreliable managed-preview HMR WebSocket client", () => {
    expect(viteConfig.server?.host).toBe(true);
    expect(viteConfig.server?.hmr).toBe(false);
    expect(viteConfig.plugins?.some(plugin => plugin.name === "disable-managed-preview-hmr-client")).toBe(true);
  });
});
