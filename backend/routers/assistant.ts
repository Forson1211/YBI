import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSiteContent } from "../db";
import { invokeLLM } from "../_core/llm";
import { publicProcedure, router } from "../_core/trpc";
import { getAssistantProgramLinks } from "../shared/assistantProgramLinks";
import { getYbiKnowledgeResponse } from "../shared/assistantKnowledge";

const visitorMessage = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1_000),
});

const visitorAssistantInput = z.object({
  page: z.string().trim().min(1).max(160),
  messages: z.array(visitorMessage).min(1).max(8),
});

export const QUICK_QUESTIONS_CONTENT_KEY = "assistant-quick-questions";

const defaultQuickQuestions = [
  "What does YBI do?",
  "Which program should I explore?",
  "How can I volunteer or partner?",
];

export const quickQuestionsInput = z.array(
  z.string().trim().min(3, "Each question needs at least 3 characters.").max(120, "Each question must be 120 characters or fewer."),
).min(1, "Add at least one quick question.").max(6, "Use six quick questions or fewer.").refine(
  (questions) => new Set(questions.map((question) => question.toLowerCase())).size === questions.length,
  "Quick questions must be unique.",
);

export async function readQuickQuestions() {
  const saved = await getSiteContent(QUICK_QUESTIONS_CONTENT_KEY);
  if (!saved?.body) return defaultQuickQuestions;

  try {
    const parsed = quickQuestionsInput.safeParse(JSON.parse(saved.body));
    return parsed.success ? parsed.data : defaultQuickQuestions;
  } catch {
    return defaultQuickQuestions;
  }
}

const requestWindows = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS_PER_WINDOW = 60;
const WINDOW_MS = 5 * 60 * 1_000;

const requestKey = (req: any) => {
  const forwarded = req?.headers?.["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return firstForwarded?.trim() || req?.ip || req?.socket?.remoteAddress || "local-visitor";
};

const enforceRateLimit = (req: any) => {
  const key = requestKey(req);
  if (key === "127.0.0.1" || key === "::1" || key === "localhost" || key === "local-visitor" || key === "ybi-assistant-test") return;

  const now = Date.now();
  const existing = requestWindows.get(key);

  if (!existing || existing.expiresAt <= now) {
    requestWindows.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return;
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a few minutes before sending another question.",
    });
  }

  existing.count += 1;
};

const systemPrompt = `You are the official AI Assistant for Young Beginners Inspiration (YBI), a nonprofit organization committed to unlocking human potential and developing responsible community leaders.

ORGANIZATION PROFILE & PHILOSOPHY:
- Name: Young Beginners Inspiration (YBI)
- Tagline: "Your voice is a beginning."
- Purpose: YBI creates vibrant, inclusive platforms for both youth and older adults to inspire, learn, share wisdom, and step forward as responsible leaders.

5 CORE FOCUS AREAS:
1. Leadership: Nurturing ethical, empathetic, values-based community leaders who take initiative.
2. Education: Bridging classroom concepts with practical life-skills and leadership readiness.
3. Business: Fostering economic literacy, problem solving, and sustainable community solutions.
4. Public Speaking: Helping emerging voices gain poise, communication clarity, debate skills, and stage confidence.
5. Entrepreneurship: Equipping youth to transform ideas into viable ventures and community projects.

3 SIGNATURE PROGRAMS:
1. Public Speaking Program: Training in speech writing, storytelling, overcoming stage anxiety, and persuasive presentation.
2. Entrepreneurship Program: Hands-on incubation, business planning, market validation, and startup fundamentals.
3. Generations in Conversation: YBI's signature intergenerational initiative where youth and older adults exchange mentorship, life experience, and digital skills.

KEY ENGAGEMENT PATHWAYS:
- Explore Programs (/programs): Public Speaking, Entrepreneurship, Generations in Conversation.
- Focus Areas (/focus-areas): Leadership, Education, Business.
- Join Us (/join-us): Opportunities to participate in cohorts, volunteer as a mentor, or partner as an organization.
- Media & Stories (/media): Community impact stories, event highlights, and press updates.
- Photo Gallery (/gallery): Program moments, workshops, and cohort pictures.
- Contact Us (/contact): Inquiries, partnerships, and direct messaging with the YBI team.

COMMUNICATION GUIDELINES:
- Provide warm, articulate, encouraging, and concise answers in plain English (typically 1 to 3 short paragraphs).
- Contextualize responses based on the visitor's questions and invite them to explore relevant pages or reach out via Contact Us.
- Never invent specific event dates, pricing, or personal contact numbers not provided here.
- Maintain a helpful, inspiring, and professional tone.`;

export const visitorAssistantRouter = router({
  quickQuestions: publicProcedure.query(() => readQuickQuestions()),
  chat: publicProcedure.input(visitorAssistantInput).mutation(async ({ input, ctx }) => {
    enforceRateLimit(ctx.req);
    const latestVisitorQuestion = [...input.messages].reverse().find((message) => message.role === "user")?.content ?? "";

    let answer = "";
    try {
      const response = await invokeLLM({
        model: "gpt-4o-mini",
        maxTokens: 450,
        messages: [
          { role: "system", content: systemPrompt },
          ...input.messages.map((message) => ({ role: message.role, content: message.content })),
          { role: "system", content: `The visitor is currently viewing the ${input.page} page on the YBI website. Answer their question concisely using YBI knowledge.` },
        ],
      });

      const content = response.choices[0]?.message.content;
      if (typeof content === "string" && content.trim().length > 0) {
        answer = content.trim();
      }
    } catch {
      // Graceful fallback to verified knowledge base
    }

    if (!answer) {
      const knowledge = getYbiKnowledgeResponse(latestVisitorQuestion, input.page);
      return { answer: knowledge.answer, guidance: knowledge.guidance };
    }

    return { answer, guidance: getAssistantProgramLinks(latestVisitorQuestion) };
  }),
});

