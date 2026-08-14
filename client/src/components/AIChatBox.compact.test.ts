import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const chatSource = readFileSync(new URL("./AIChatBox.tsx", import.meta.url), "utf8");
const assistantSource = readFileSync(new URL("./YbiVisitorAssistant.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../index.css", import.meta.url), "utf8");

describe("YBI assistant compact chat presentation", () => {
  it("uses compact message rendering inside the floating YBI assistant", () => {
    expect(assistantSource).toContain("compact");
    expect(chatSource).toContain("compact = false");
    expect(chatSource).toContain("&& !compact");
  });

  it("preserves dedicated message, composer, and input styling hooks", () => {
    expect(chatSource).toContain("ybi-chat-message-list");
    expect(chatSource).toContain("ybi-chat-composer");
    expect(chatSource).toContain("ybi-chat-input");
    expect(styles).toContain(".ybi-assistant-chatbox .ybi-chat-bubble--assistant");
    expect(styles).toContain(".ybi-assistant-chatbox .ybi-chat-composer");
  });

  it("uses one chatbot symbol for assistant replies and the prompt accent", () => {
    expect(chatSource).toContain("BotMessageSquare");
    expect(assistantSource).toContain("ybi-assistant-intro-icon");
    expect(assistantSource).toContain("<BotMessageSquare size={14}");
    expect(styles).toContain(".ybi-assistant-intro-icon");
  });

  it("keeps the mobile assistant within the keyboard-resized viewport without moving the public page", () => {
    const indexHtml = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

    expect(indexHtml).toContain("interactive-widget=resizes-content");
    expect(assistantSource).toContain('classList.add("ybi-assistant-open")');
    expect(assistantSource).toContain('style.setProperty("--ybi-assistant-scroll-y"');
    expect(assistantSource).toContain("window.scrollTo(0, scrollPosition)");
    expect(styles).toContain("html.ybi-assistant-open, html.ybi-assistant-open body");
    expect(styles).toContain("html.ybi-assistant-open body { position: fixed");
    expect(styles).toContain("top: var(--ybi-assistant-scroll-y, 0px)");
    expect(styles).toContain(".ybi-assistant-chatbox .ybi-chat-input { font-size: 16px; }");
    expect(styles).toContain("max-height: calc(100dvh - var(--header-height) - 80px)");
    expect(styles).toContain(".ybi-assistant-panel { position: absolute");
    expect(styles).toContain(".ybi-assistant-root { inset: 0; pointer-events: none; }");
    expect(styles).not.toContain(".ybi-assistant-root { inset: 0; right: auto; bottom: auto;");
  });
});
