import { AIChatBox, type Message } from "@/components/AIChatBox";
import { YbiLiveBotIcon } from "@/components/YbiLiveBotIcon";
import { trpc } from "@/lib/trpc";
import { getYbiKnowledgeResponse } from "@shared/assistantKnowledge";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isThinking, setIsThinking] = useState(false);
  const pendingQuestionRef = useRef<string>("");
  const pendingTimestampRef = useRef<number>(0);
  const { data: savedQuickQuestions } = trpc.publicSite.assistant.quickQuestions.useQuery();

  const assistant = trpc.publicSite.assistant.chat.useMutation({
    onSuccess: (result) => {
      const elapsed = Date.now() - pendingTimestampRef.current;
      const remainingDelay = Math.max(0, 1100 - elapsed);

      setTimeout(() => {
        setMessages((current) => [...current, { role: "assistant", content: result.answer, guidance: result.guidance }]);
        setIsThinking(false);
      }, remainingDelay);
    },
    onError: () => {
      const elapsed = Date.now() - pendingTimestampRef.current;
      const remainingDelay = Math.max(0, 1100 - elapsed);
      const fallback = getYbiKnowledgeResponse(pendingQuestionRef.current || "What does YBI do?", location);

      setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: fallback.answer,
            guidance: fallback.guidance,
          },
        ]);
        setIsThinking(false);
      }, remainingDelay);
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

  useEffect(() => {
    if (!isOpen || typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportChange = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const isMobile = window.matchMedia("(max-width: 520px)").matches;
      if (!isMobile) return;

      const keyboardHeight = Math.max(0, window.innerHeight - vv.height);
      document.documentElement.style.setProperty("--ybi-keyboard-inset", `${Math.round(keyboardHeight)}px`);
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);
    handleViewportChange();

    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("scroll", handleViewportChange);
      document.documentElement.style.removeProperty("--ybi-keyboard-inset");
    };
  }, [isOpen]);

  if (location.startsWith("/admin")) return null;

  const quickQuestions = savedQuickQuestions?.length ? savedQuickQuestions : suggestedPrompts;

  const isBusy = assistant.isPending || isThinking;

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isBusy) return;

    pendingQuestionRef.current = trimmed;
    pendingTimestampRef.current = Date.now();
    setIsThinking(true);

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
              <button type="button" key={prompt} onClick={() => sendMessage(prompt)} disabled={isBusy}>
                {prompt}
              </button>
            ))}
          </div>

          <AIChatBox
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isBusy}
            placeholder="Ask YBI a question..."
            height="430px"
            className="ybi-assistant-chatbox"
            compact
            onClearChat={() => {
              assistant.reset();
              setIsThinking(false);
              setMessages([welcomeMessage]);
            }}
            typingLabel="YBI is preparing a reply"
            onGuidanceNavigate={() => setIsOpen(false)}
          />
        </section>
      )}

      <button
        className={`ybi-assistant-launcher ${isOpen ? "ybi-assistant-launcher--open" : ""}`}
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
