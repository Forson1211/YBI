import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "../_core/context";

const llmMocks = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("../_core/llm", () => llmMocks);

import { appRouter } from "../routers";

function createVisitorContext(): TrpcContext {
  return { user: null, req: { headers: { "x-forwarded-for": "ybi-assistant-test" } } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("YBI visitor assistant", () => {
  it("returns a grounded AI response with program guidance", async () => {
    llmMocks.invokeLLM.mockResolvedValue({ choices: [{ message: { content: "YBI offers practical pathways in leadership, education, business, public speaking, and entrepreneurship." } }] });
    const caller = appRouter.createCaller(createVisitorContext());

    await expect(caller.publicSite.assistant.chat({
      page: "/",
      messages: [{ role: "user", content: "Which entrepreneurship programme should I explore?" }],
    })).resolves.toEqual(expect.objectContaining({
      answer: expect.stringContaining("YBI offers practical pathways"),
      guidance: expect.arrayContaining([
        expect.objectContaining({ label: "Entrepreneurship", href: "/programs#entrepreneurship" }),
      ]),
    }));

    expect(llmMocks.invokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      model: "gpt-4o-mini",
      messages: expect.arrayContaining([expect.objectContaining({ role: "system", content: expect.stringContaining("Young Beginners Inspiration") })]),
    }));
  });

  it("rejects malformed visitor messages before calling the model", async () => {
    const caller = appRouter.createCaller(createVisitorContext());
    await expect(caller.publicSite.assistant.chat({ page: "/", messages: [{ role: "user", content: "" }] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("gracefully falls back to verified knowledge base when LLM service is unavailable", async () => {
    llmMocks.invokeLLM.mockRejectedValueOnce(new Error("API rate limit or unconfigured key"));
    const caller = appRouter.createCaller(createVisitorContext());

    const result = await caller.publicSite.assistant.chat({
      page: "/",
      messages: [{ role: "user", content: "What does YBI do?" }],
    });

    expect(result.answer).toContain("Young Beginners Inspiration (YBI)");
    expect(result.guidance.length).toBeGreaterThan(0);
  });
});
