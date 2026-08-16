import { readFileSync } from "node:fs";
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

  it("removes the auxiliary contact action while retaining a modest gap above the main chat card", () => {
    const source = readFileSync(new URL("./YbiVisitorAssistant.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../ybi-visitor-enhancements.css", import.meta.url), "utf8");

    expect(source).not.toContain("ybi-assistant-contact-action");
    expect(source).not.toContain("ArrowUpRight");
    expect(source).not.toContain("getAssistantContactHref");
    expect(source).not.toContain("Contact the YBI team");
    expect(source).not.toContain("Open a ready-to-edit enquiry for personal follow-up.");
    expect(styles).not.toContain(".ybi-assistant-contact-action");
    expect(styles).toContain(".ybi-assistant-chatbox { margin-top: 24px; }");
    expect(styles).toContain(".ybi-assistant-chatbox { margin-top: 18px; }");
  });

  it("passes contextual server guidance into assistant replies and closes the panel when a link is followed", () => {
    const source = readFileSync(new URL("./YbiVisitorAssistant.tsx", import.meta.url), "utf8");
    const chatSource = readFileSync(new URL("./AIChatBox.tsx", import.meta.url), "utf8");
    const styles = readFileSync(new URL("../ybi-visitor-enhancements.css", import.meta.url), "utf8");

    expect(source).toContain("guidance: result.guidance");
    expect(source).toContain("onGuidanceNavigate={() => setIsOpen(false)}");
    expect(chatSource).toContain('aria-label="Related YBI pages"');
    expect(chatSource).toContain("ybi-chat-guidance-link");
    expect(styles).toContain(".ybi-chat-guidance-link");
  });
});
