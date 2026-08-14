import { describe, expect, it } from "vitest";
import { getAssistantProgramLinks } from "@shared/assistantProgramLinks";

describe("YBI assistant program links", () => {
  it("matches public-speaking questions to the anchored program and leadership focus", () => {
    expect(getAssistantProgramLinks("How can I grow my confidence in public speaking?")).toEqual([
      expect.objectContaining({ label: "Public Speaking", href: "/programs#public-speaking" }),
      expect.objectContaining({ label: "Leadership focus", href: "/focus-areas#leadership" }),
    ]);
  });

  it("matches business ideas to entrepreneurship without returning unrelated programs", () => {
    expect(getAssistantProgramLinks("I have a business idea that I want to develop.")).toEqual([
      expect.objectContaining({ label: "Entrepreneurship", href: "/programs#entrepreneurship" }),
      expect.objectContaining({ label: "Business focus", href: "/focus-areas#business" }),
    ]);
  });

  it("offers all program pathways when a visitor asks which program to explore", () => {
    expect(getAssistantProgramLinks("Which program should I explore?").map((link) => link.href)).toEqual([
      "/programs#public-speaking",
      "/programs#entrepreneurship",
      "/programs#generations",
    ]);
  });
});
