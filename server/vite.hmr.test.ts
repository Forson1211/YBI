import { describe, expect, it } from "vitest";
import viteConfig from "../vite.config";

describe("Vite HMR preview configuration", () => {
  it("derives its HMR connection from the current browser origin", () => {
    expect(viteConfig.server?.host).toBe(true);
    expect(viteConfig.server?.hmr).toBeUndefined();
  });
});
