import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { BotMessageSquare, ChevronRight, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

type GuidanceLink = { label: string; href: string; description: string };

const suggestedPrompts = [
  "What does YBI do?",
  "Which program should I explore?",
  "How can I volunteer or partner?",
];

const defaultGuidance: GuidanceLink[] = [
  { label: "About YBI", href: "/about", description: "Our purpose and approach" },
  { label: "Explore programs", href: "/programs", description: "Practical ways to learn and lead" },
  { label: "Join YBI", href: "/join-us", description: "Take part, volunteer, or partner" },
];

const welcomeMessage: Message = {
  role: "assistant",
  content: "Welcome to YBI. I can help you find programs, understand our focus areas, or discover how to participate, volunteer, or partner.",
};

export function YbiVisitorAssistant() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [guidance, setGuidance] = useState<GuidanceLink[]>(defaultGuidance);
  const assistant = trpc.publicSite.assistant.chat.useMutation({
    onSuccess: (result) => {
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
      setGuidance(result.guidance);
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I am unable to answer that right now. You can still explore YBI through these helpful pages, or send a message through Contact Us.",
        },
      ]);
      setGuidance([
        ...defaultGuidance.slice(0, 2),
        { label: "Contact YBI", href: "/contact", description: "Send a message to the YBI team" },
      ]);
    },
  });

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (location.startsWith("/admin")) return null;

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || assistant.isPending) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    assistant.mutate({
      page: location,
      messages: nextMessages
        .filter((message): message is { role: "user" | "assistant"; content: string } => message.role !== "system")
        .slice(-8)
        .map((message) => ({ role: message.role, content: message.content })),
    });
  };

  return (
    <div className="ybi-assistant-root">
      {isOpen && (
        <section className="ybi-assistant-panel" aria-label="YBI visitor assistant">
          <header className="ybi-assistant-heading">
            <div className="ybi-assistant-identity">
              <span className="ybi-assistant-mark" aria-hidden="true"><BotMessageSquare size={24} /></span>
              <div>
                <p>YBI Visitor Assistant</p>
                <h2>How can I guide you?</h2>
              </div>
            </div>
            <button className="ybi-assistant-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close YBI visitor assistant">
              <X size={19} />
            </button>
            <span className="ybi-assistant-accent" aria-hidden="true" />
          </header>

          <div className="ybi-assistant-intro">
            <Sparkles size={15} aria-hidden="true" />
            <span>Ask about YBI, or select a quick question to get started.</span>
          </div>

          <div className="ybi-assistant-prompts" aria-label="Suggested questions">
            {suggestedPrompts.map((prompt) => (
              <button type="button" key={prompt} onClick={() => sendMessage(prompt)} disabled={assistant.isPending}>
                {prompt}
              </button>
            ))}
          </div>

          <AIChatBox
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={assistant.isPending}
            placeholder="Ask YBI a question..."
            height="255px"
            className="ybi-assistant-chatbox"
          />

          <nav className="ybi-assistant-guidance" aria-label="YBI guided pages">
            <p>Helpful next steps</p>
            <div>
              {guidance.map((item) => (
                <Link href={item.href} key={`${item.href}-${item.label}`} onClick={() => setIsOpen(false)}>
                  <span><strong>{item.label}</strong><small>{item.description}</small></span>
                  <ChevronRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </nav>
        </section>
      )}

      <button
        className="ybi-assistant-launcher"
        type="button"
        aria-label={isOpen ? "Close YBI visitor assistant" : "Open YBI visitor assistant"}
        aria-expanded={isOpen}
        aria-controls="ybi-visitor-assistant"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="ybi-assistant-launcher-orb" aria-hidden="true"><BotMessageSquare size={30} /></span>
        <span>YBI</span>
      </button>
    </div>
  );
}
