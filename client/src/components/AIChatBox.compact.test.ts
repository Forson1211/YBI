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
});
