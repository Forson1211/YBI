import { AIChatBox, type Message } from "@/components/AIChatBox";
import { YbiLiveBotIcon } from "@/components/YbiLiveBotIcon";
import { getAssistantContactHref } from "@/lib/assistantGuidance";
import { trpc } from "@/lib/trpc";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const suggestedPrompts = [
  "What does YBI do?",
  "Which program should I explore?",
  "How can I volunteer or partner?",
];

const welcomeMessage: Message = {
  role: "assistant",
  content: "Welcome to YBI. I can help you find programs, understand our focus areas, or discover how to participate, volunteer, or partner.",
};

export function YbiVisitorAssistant() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const { data: savedQuickQuestions } = trpc.publicSite.assistant.quickQuestions.useQuery();
  const assistant = trpc.publicSite.assistant.chat.useMutation({
    onSuccess: (result) => {
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I am unable to answer that right now. Please try again shortly, or send a message to the YBI team through Contact Us.",
        },
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

  useEffect(() => {
    const documentElement = document.documentElement;
    if (!isOpen) {
      documentElement.classList.remove("ybi-assistant-open");
      documentElement.style.removeProperty("--ybi-assistant-scroll-y");
      return;
    }

    documentElement.classList.add("ybi-assistant-open");
    const isMobileAssistant = window.matchMedia("(max-width: 520px)").matches;
    const scrollPosition = window.scrollY;

    if (isMobileAssistant) {
      documentElement.style.setProperty("--ybi-assistant-scroll-y", `-${scrollPosition}px`);
    }

    return () => {
      documentElement.classList.remove("ybi-assistant-open");
      documentElement.style.removeProperty("--ybi-assistant-scroll-y");
      if (isMobileAssistant) window.scrollTo(0, scrollPosition);
    };
  }, [isOpen]);

  if (location.startsWith("/admin")) return null;

  const quickQuestions = savedQuickQuestions?.length ? savedQuickQuestions : suggestedPrompts;

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

  const openContactEnquiry = () => {
    assistant.reset();
    setIsOpen(false);
    setLocation(getAssistantContactHref(messages));
  };

  return (
    <div className="ybi-assistant-root">
      {isOpen && (
        <section id="ybi-visitor-assistant" className="ybi-assistant-panel" aria-label="YBI visitor assistant">
          <header className="ybi-assistant-heading">
            <div className="ybi-assistant-identity">
              <img
                className="ybi-assistant-logo"
                src="/ybi-assets/brand/ybi-logo.png"
                alt="Young Beginners Inspiration"
              />
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
            <span className="ybi-assistant-intro-icon" aria-hidden="true">
              <YbiLiveBotIcon className="size-3.5" />
            </span>
            <span>Ask about YBI, or select a quick question to get started.</span>
          </div>

          <div className="ybi-assistant-prompts" aria-label="Suggested questions">
            {quickQuestions.map((prompt) => (
              <button type="button" key={prompt} onClick={() => sendMessage(prompt)} disabled={assistant.isPending}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="ybi-assistant-contact-action">
            <button type="button" onClick={openContactEnquiry}>Contact the YBI team</button>
            <p>Open a ready-to-edit enquiry for personal follow-up.</p>
          </div>

          <AIChatBox
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={assistant.isPending}
            placeholder="Ask YBI a question..."
            height="255px"
            className="ybi-assistant-chatbox"
            compact
            onClearChat={() => {
              assistant.reset();
              setMessages([welcomeMessage]);
            }}
            typingLabel="YBI is preparing a reply"
          />
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
        <span className="ybi-assistant-launcher-orb" aria-hidden="true"><YbiLiveBotIcon className="size-[30px]" /></span>
      </button>
    </div>
  );
}
