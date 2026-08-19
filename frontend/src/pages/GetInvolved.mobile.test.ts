import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Get Involved donation flow on mobile", () => {
  const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8").replace(/\r\n/g, "\n");
  const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8").replace(/\r\n/g, "\n");

  it("keeps the donation path available from the dedicated donate route", () => {
    expect(appSource).toContain('path={"/donate"} component={GetInvolved}');
  });

  it("uses touch-friendly, single-column donation controls on phone viewports", () => {
    expect(styles).toContain("/* Donation flow: compact, touch-friendly mobile layout */");
    expect(styles).toContain(".pathway-tabs-bar {\n    display: grid;\n    grid-template-columns: 1fr;");
    expect(styles).toContain(".donation-presets-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(styles).toContain(".form-row-2 {\n    grid-template-columns: 1fr;");
    expect(styles).toContain(".custom-input-wrap input,\n  .form-group input,\n  .form-group textarea,\n  .form-group select {\n    min-height: 48px;\n    font-size: 16px !important;");
    expect(styles).toContain(".donate-btn {\n    width: 100%;\n    min-height: 54px;");
  });
});
