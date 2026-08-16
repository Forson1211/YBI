import { describe, expect, it } from "vitest";
import { getAssistantContactPrefill } from "./Contact";

describe("Contact Us assistant handoff", () => {
  it("accepts an assistant-provided message and a supported interest", () => {
    expect(getAssistantContactPrefill("?assistant=1&interest=Volunteer+or+mentor&message=I+would+like+to+mentor")).toEqual({
      interest: "Volunteer or mentor",
      message: "I would like to mentor",
    });
  });

  it("ignores unrelated URLs and falls back from unsupported interests", () => {
    expect(getAssistantContactPrefill("?message=Hello")).toBeNull();
    expect(getAssistantContactPrefill("?assistant=1&interest=Unsupported&message=Hello")).toEqual({
      interest: "General enquiry",
      message: "Hello",
    });
  });
});
