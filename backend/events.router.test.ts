import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("Events Router (Public & Admin)", () => {
  const caller = appRouter.createCaller({
    user: { openId: "admin-1", role: "admin", name: "Admin" },
  } as any);

  const publicCaller = appRouter.createCaller({
    user: null,
  } as any);

  it("lists public published events and retrieves event by slug", async () => {
    const events = await publicCaller.publicSite.events.list();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);

    const firstEvent = events[0];
    const fetched = await publicCaller.publicSite.events.getBySlug({ slug: firstEvent.slug });
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(firstEvent.id);
    expect(fetched?.title).toBe(firstEvent.title);
  });

  it("creates, updates, and deletes an event via admin router", async () => {
    const createdId = await caller.admin.events.save({
      title: "Youth Leadership Summit 2026",
      slug: "youth-leadership-summit-2026-test",
      description: "An intensive 2-day summit for emerging Ghanaian leaders.",
      imageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
      scheduledFor: new Date("2026-11-20T10:00:00Z").toISOString(),
      location: "Accra Digital Center",
      capacity: 30,
      isFree: true,
      priceGhs: 0,
      status: "published",
    });

    expect(createdId).toBeDefined();

    // Fetch single
    const found = await publicCaller.publicSite.events.getBySlug({
      slug: "youth-leadership-summit-2026-test",
    });
    expect(found).not.toBeNull();
    expect(found?.title).toBe("Youth Leadership Summit 2026");

    // Update
    const updatedId = await caller.admin.events.save({
      id: createdId,
      title: "Youth Leadership Summit 2026 (Updated)",
      slug: "youth-leadership-summit-2026-test",
      description: "Updated description.",
      imageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
      scheduledFor: new Date("2026-11-20T10:00:00Z").toISOString(),
      location: "Accra Digital Center",
      capacity: 40,
      isFree: true,
      priceGhs: 0,
      status: "published",
    });
    expect(updatedId).toBe(createdId);

    // Remove
    await caller.admin.events.remove({ id: createdId });
    await expect(
      publicCaller.publicSite.events.getBySlug({
        slug: "youth-leadership-summit-2026-test",
      })
    ).rejects.toThrow();
  });

  it("registers an attendee for an event and tracks registration stats", async () => {
    // Create an event with capacity 1
    const eventId = await caller.admin.events.save({
      title: "Exclusive Masterclass",
      slug: "exclusive-masterclass-test",
      description: "Limited seats.",
      imageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
      scheduledFor: new Date("2026-12-01T10:00:00Z").toISOString(),
      location: "Kumasi",
      capacity: 1,
      isFree: true,
      priceGhs: 0,
      status: "published",
    });

    // 1st Registration (Confirmed)
    const reg1 = await publicCaller.publicSite.events.register({
      eventId: eventId,
      name: "Kwame Mensah",
      email: "kwame.test@example.com",
      phone: "+233241112233",
      smsOptIn: true,
    });
    expect(reg1.success).toBe(true);
    expect(reg1.isWaitlist).toBe(false);
    expect(reg1.registrationId).toBeDefined();

    // 2nd Registration (Waitlisted due to capacity = 1)
    const reg2 = await publicCaller.publicSite.events.register({
      eventId: eventId,
      name: "Ama Serwaa",
      email: "ama.test@example.com",
      phone: "+233501112233",
      smsOptIn: true,
    });
    expect(reg2.success).toBe(true);
    expect(reg2.isWaitlist).toBe(true);

    // Verify admin can fetch registrations
    const list = await caller.admin.events.registrations({ eventId });
    expect(list.length).toBe(2);
    expect(list.find((r) => r.name === "Kwame Mensah")?.isWaitlist).toBe(false);
    expect(list.find((r) => r.name === "Ama Serwaa")?.isWaitlist).toBe(true);

    // Clean up
    await caller.admin.events.remove({ id: eventId });
  });

});

