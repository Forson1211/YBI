import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUserContext(role: "user" | "admin"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin router access", () => {
  it("rejects ordinary users before dashboard data is queried", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));
    await expect(caller.admin.overview()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("protects every expanded community, session, opportunity, and impact workflow", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));

    await expect(caller.admin.inquiries.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.admin.sessions.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.admin.opportunities.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.admin.impact.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("validates public contact enquiries before they reach the community inbox", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));

    await expect(caller.publicSite.contact.submit({
      name: "A",
      email: "not-an-email",
      interest: "YBI",
      message: "short",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
