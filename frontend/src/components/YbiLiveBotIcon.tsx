import { cn } from "@/lib/utils";

type YbiLiveBotIconProps = {
  className?: string;
};

/** A small, decorative YBI chatbot character with CSS-driven blink and idle motion. */
export function YbiLiveBotIcon({ className }: YbiLiveBotIconProps) {
  return (
    <span className={cn("ybi-live-bot", className)} aria-hidden="true">
      <span className="ybi-live-bot-shell">
        <span className="ybi-live-bot-antenna" />
        <span className="ybi-live-bot-eye ybi-live-bot-eye--left" />
        <span className="ybi-live-bot-eye ybi-live-bot-eye--right" />
        <span className="ybi-live-bot-mouth" />
      </span>
    </span>
  );
}
