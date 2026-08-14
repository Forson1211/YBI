import { describe, expect, it } from "vitest";
import { getAssistantContactHref } from "@/lib/assistantGuidance";

describe("YBI visitor assistant contact handoff", () => {
  it("opens Contact Us with a ready-to-edit enquiry based on the visitor’s latest question", () => {
    const href = getAssistantContactHref([
      { role: "assistant", content: "Welcome to YBI." },
      { role: "user", content: "How can I volunteer with YBI?" },
      { role: "assistant", content: "You can explore opportunities." },
    ]);
    const url = new URL(href, "https://ybi.example");

    expect(url.pathname).toBe("/contact");
    expect(url.searchParams.get("assistant")).toBe("1");
    expect(url.searchParams.get("interest")).toBe("General enquiry");
    expect(url.searchParams.get("message")).toContain("How can I volunteer with YBI?");
  });
});
