import type { Message } from "@/components/AIChatBox";

export function getAssistantContactHref(messages: Message[]) {
  const lastVisitorMessage = [...messages].reverse().find((message) => message.role === "user")?.content.trim();
  const message = lastVisitorMessage
    ? `Hello YBI team, I would like guidance with: ${lastVisitorMessage}`
    : "Hello YBI team, I would like guidance about getting involved with YBI.";
  const search = new URLSearchParams({ assistant: "1", interest: "General enquiry", message });
  return `/contact?${search.toString()}`;
}
