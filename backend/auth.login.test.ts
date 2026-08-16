import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { sdk } from "./_core/sdk";

describe("Direct Admin Password Authentication", () => {
  it("rejects invalid administrator passwords", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: { cookie: () => {}, clearCookie: () => {} } as any,
    });

    await expect(caller.auth.login({ password: "wrong-password" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("authenticates with default password and grants admin privileges to dashboard procedures", async () => {
    let setCookieToken = "";
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {
        cookie: (_name: string, val: string) => {
          setCookieToken = val;
        },
        clearCookie: () => {},
      } as any,
    });

    const loginRes = await caller.auth.login({ password: "ybi-admin-2026" });
    expect(loginRes.success).toBe(true);
    expect(loginRes.token).toBeDefined();
    expect(loginRes.user.role).toBe("admin");

    // Authenticate a simulated request with the returned token in Authorization header
    const simulatedReq = {
      headers: {
        authorization: `Bearer ${loginRes.token}`,
      },
    } as any;

    const authenticatedUser = await sdk.authenticateRequest(simulatedReq);
    expect(authenticatedUser).toBeDefined();
    expect(authenticatedUser.role).toBe("admin");

    // Create caller with authenticated user and verify admin endpoints work
    const adminCaller = appRouter.createCaller({
      user: authenticatedUser,
      req: simulatedReq,
      res: {} as any,
    });

    const overview = await adminCaller.admin.overview();
    expect(overview).toBeDefined();
    expect(overview.gallery).toBeDefined();
  });
});
