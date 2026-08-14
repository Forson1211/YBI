import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const chatSource = readFileSync(new URL("./AIChatBox.tsx", import.meta.url), "utf8");
const assistantSource = readFileSync(new URL("./YbiVisitorAssistant.tsx", import.meta.url), "utf8");
const liveBotSource = readFileSync(new URL("./YbiLiveBotIcon.tsx", import.meta.url), "utf8");
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

  it("uses one live chatbot character for assistant replies, the prompt accent, and launcher", () => {
    expect(chatSource).toContain("YbiLiveBotIcon");
    expect(assistantSource).toContain("YbiLiveBotIcon");
    expect(assistantSource).toContain("ybi-assistant-intro-icon");
    expect(assistantSource).toContain("ybi-assistant-launcher-orb");
    expect(liveBotSource).toContain("ybi-live-bot-eye");
    expect(liveBotSource).toContain("ybi-live-bot-mouth");
    expect(styles).toContain(".ybi-assistant-intro-icon");
  });

  it("adds gentle blink and idle motion while respecting reduced-motion preferences", () => {
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(styles).toContain("ybi-live-bot-blink");
    expect(styles).toContain("ybi-live-bot-idle");
  });

  it("keeps the live launcher character larger on desktop while preserving the compact mobile override", () => {
    expect(styles).toContain(".ybi-assistant-launcher-orb .ybi-live-bot { width: 32px; height: 32px; font-size: 32px; }");
    expect(styles).toContain("@media (max-width: 520px) { .ybi-assistant-launcher-orb .ybi-live-bot { width: 24px; height: 24px; }");
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
