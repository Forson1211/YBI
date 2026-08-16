import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { SITE_IMAGE_SLOTS, type SiteImageDefinition } from "@shared/siteImages";

function createContext(role?: "user" | "admin"): TrpcContext {
  return {
    user: role
      ? {
          id: 1,
          openId: "test-user",
          name: "Test User",
          email: "test@example.com",
          loginMethod: "manus",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Site Images Customizer Router", () => {
  it("rejects unauthenticated or non-admin users from accessing admin.siteImages", async () => {
    const unauthCaller = appRouter.createCaller(createContext(undefined));
    await expect(unauthCaller.admin.siteImages.list()).rejects.toMatchObject({ code: "FORBIDDEN" });

    const userCaller = appRouter.createCaller(createContext("user"));
    await expect(userCaller.admin.siteImages.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(userCaller.admin.siteImages.save({ slotKey: "home_hero", imageUrl: "https://example.com/test.jpg" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(userCaller.admin.siteImages.reset({ slotKey: "home_hero" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows admin to list, customize, and reset site images across pages", async () => {
    const adminCaller = appRouter.createCaller(createContext("admin"));
    const publicCaller = appRouter.createCaller(createContext(undefined));

    // 1. List slots
    const slots = await adminCaller.admin.siteImages.list();
    expect(slots.length).toBe(SITE_IMAGE_SLOTS.length);
    expect(slots.some((s: SiteImageDefinition) => s.key === "home_hero")).toBe(true);

    // 2. Save a customized image for home_hero
    const testImageUrl = "https://images.unsplash.com/photo-test-hero.jpg";
    const testAlt = "Customized youth leadership workshop banner";
    await adminCaller.admin.siteImages.save({
      slotKey: "home_hero",
      imageUrl: testImageUrl,
      altText: testAlt,
    });

    // 3. Verify publicSite returns override
    const overrides = await publicCaller.publicSite.siteImages.getAll();
    expect(overrides.home_hero).toBeDefined();
    expect(overrides.home_hero?.src).toBe(testImageUrl);
    expect(overrides.home_hero?.alt).toBe(testAlt);

    // 4. Verify admin list reflects custom status
    const updatedSlots = await adminCaller.admin.siteImages.list();
    const heroSlot = updatedSlots.find((s: SiteImageDefinition) => s.key === "home_hero");
    expect(heroSlot?.isCustomized).toBe(true);
    expect(heroSlot?.customSrc).toBe(testImageUrl);

    // 5. Reset to default
    await adminCaller.admin.siteImages.reset({ slotKey: "home_hero" });
    const resetOverrides = await publicCaller.publicSite.siteImages.getAll();
    expect(resetOverrides.home_hero).toBeUndefined();

    const resetSlots = await adminCaller.admin.siteImages.list();
    const resetHeroSlot = resetSlots.find((s: SiteImageDefinition) => s.key === "home_hero");
    expect(resetHeroSlot?.isCustomized).toBe(false);
  });
});
