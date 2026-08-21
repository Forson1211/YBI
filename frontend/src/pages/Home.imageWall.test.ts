import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("homepage image-wall mobile marquee safeguards", () => {
  const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
  const rawStyles = readFileSync(new URL("../index.css", import.meta.url), "utf8");
  const styles = rawStyles.replace(/\s+/g, " ");

  it("renders two explicit matching sequences for every marquee row", () => {
    expect(homeSource).toContain('id="gallery-wall"');
    expect(homeSource).toContain("[0, 1].map((copyIndex) =>");
    expect(homeSource).toContain('className="image-wall-sequence"');
  });

  it("keeps the mobile marquee gap in each repeated sequence and animates by one sequence width", () => {
    expect(styles).toContain(".image-wall-sequence { display: flex; flex: 0 0 auto; gap: var(--image-wall-gap); padding-right: var(--image-wall-gap); }");
    expect(styles).toContain("@keyframes image-wall-left { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }");
    expect(styles).toContain(".image-wall-viewport { --image-wall-gap: 10px;");
  });

  it("keeps a mobile-only visible photo layer that is itself continuously animated", () => {
    expect(homeSource).toContain('className="image-wall-stage"');
    expect(homeSource).toContain('className="image-wall-mobile-fallback"');
    expect(homeSource).toContain('[0, 1].map((copyIndex) =>');
    expect(homeSource).toContain('className="image-wall-mobile-fallback-sequence"');
    expect(homeSource).toContain('className="image-wall-mobile-fallback-card"');
    expect(styles).toContain(".image-wall-viewport { display: none; }");
    expect(styles).toContain(".image-wall-mobile-fallback-row { display: flex; width: max-content;");
    expect(styles).toContain("animation: image-wall-left 64s linear infinite;");
    expect(styles).toContain(".image-wall-mobile-fallback-row.is-portrait { height: clamp(210px, 60vw, 320px); animation-name: image-wall-right;");
    expect(styles).toContain(".image-wall-mobile-fallback-card img { display: block;");
  });

  it("keeps the rotating about image clean on desktop and square without a yellow backing on mobile", () => {
    expect(styles).toContain(".about-reference-image { position: relative; width: 100%; height: auto; aspect-ratio: 16 / 10; margin: 0; overflow: hidden; background: var(--blue-deep); }");
    expect(styles).not.toContain("box-shadow: 20px 20px 0 rgba(255,208,0,.58)");
    expect(styles).not.toContain("box-shadow: 14px 14px 0 rgba(255,208,0,.58)");
    expect(styles).not.toContain("box-shadow: 10px 10px 0 rgba(255,208,0,.58)");
    expect(styles).toContain(".about-reference-image { height: auto; aspect-ratio: 1 / 1; box-shadow: none; }");
  });
});
