import { describe, expect, it } from "vitest";
import { calculateProgress, toLocalDateTimeInput } from "./adminWorkflow";

describe("admin workflow helpers", () => {
  it("calculates bounded progress for impact indicators", () => {
    expect(calculateProgress(38, 100)).toBe(38);
    expect(calculateProgress(140, 100)).toBe(100);
  });

  it("keeps no-target indicators distinct from zero progress", () => {
    expect(calculateProgress(0, null)).toBeNull();
    expect(calculateProgress(0, 0)).toBeNull();
  });

  it("returns a datetime-local compatible value", () => {
    expect(toLocalDateTimeInput("2026-08-12T18:45:00.000Z")).toMatch(/^2026-08-12T\d{2}:\d{2}$/);
  });
});
