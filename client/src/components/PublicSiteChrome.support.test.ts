import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("PublicHeader Support Us action", () => {
  it("uses the same yellow YBI treatment on desktop and mobile", () => {
    expect(stylesheet).toContain(".header-support { display: inline-flex; flex: none; align-items: center; gap: 9px; padding: 13px 18px; background: var(--yellow); color: var(--blue-deep);");
    expect(stylesheet).toContain(".header-support:hover { background: var(--orange); transform: translateY(-2px); }");
    expect(stylesheet).toContain(".header-support { width: 49px; height: 42px; justify-content: center; padding: 0; background: var(--yellow); color: var(--blue-deep); }");
  });
});
