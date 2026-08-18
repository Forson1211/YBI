import { COOKIE_NAME, ONE_YEAR_MS } from "./shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { getSiteContent, upsertUser } from "./db";
import { adminRouter, publicSiteRouter } from "./routers/admin";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const configuredAdminPassword = process.env.ADMIN_PASSWORD || "ybi-admin-2026";
        // Check if a password override was saved from the dashboard
        let effectivePassword = configuredAdminPassword;
        try {
          const stored = await getSiteContent("settings:admin-password");
          if (stored?.body) effectivePassword = stored.body;
        } catch {}
        if (input.password !== effectivePassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect administrator password. Please try again.",
          });
        }

        const sessionToken = await sdk.createSessionToken("admin_ybi_owner", {
          name: "YBI Administrator",
          expiresInMs: ONE_YEAR_MS,
        });

        await upsertUser({
          openId: "admin_ybi_owner",
          name: "YBI Administrator",
          email: "admin@ybi.org",
          role: "admin",
          loginMethod: "password",
          lastSignedIn: new Date(),
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return {
          success: true,
          token: sessionToken,
          user: {
            id: 1,
            openId: "admin_ybi_owner",
            name: "YBI Administrator",
            email: "admin@ybi.org",
            role: "admin" as const,
          },
        };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  admin: adminRouter,
  publicSite: publicSiteRouter,
});

export type AppRouter = typeof appRouter;
