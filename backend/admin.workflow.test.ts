import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  createCommunityInquiry: vi.fn(), getDashboardOverview: vi.fn(), getSiteContent: vi.fn(),
  listCommunityInquiries: vi.fn(), listGalleryPhotos: vi.fn(), listImpactMetrics: vi.fn(), listOpportunities: vi.fn(), listPrograms: vi.fn(), listProgramSessions: vi.fn(), listSiteContent: vi.fn(), listUpdates: vi.fn(),
  removeCommunityInquiry: vi.fn(), removeGalleryPhoto: vi.fn(), removeImpactMetric: vi.fn(), removeOpportunity: vi.fn(), removeProgram: vi.fn(), removeProgramSession: vi.fn(), removeUpdate: vi.fn(),
  saveImpactMetric: vi.fn(), saveGalleryPhoto: vi.fn(), saveOpportunity: vi.fn(), saveProgram: vi.fn(), saveProgramSession: vi.fn(), saveUpdate: vi.fn(),
  updateCommunityInquiry: vi.fn(), upsertSiteContent: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

function createAdminContext(): TrpcContext {
  return { user: { id: 1, openId: "admin", name: "Admin", email: "admin@ybi.test", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("expanded admin workflows", () => {
  beforeEach(() => vi.clearAllMocks());

  it("accepts a valid public enquiry and routes it to the inbox helper", async () => {
    dbMocks.createCommunityInquiry.mockResolvedValue({ id: 12 });
    const caller = appRouter.createCaller(createAdminContext());
    await expect(caller.publicSite.contact.submit({ name: "Amina YBI", email: "amina@example.com", interest: "Volunteer", message: "I would like to support the next leadership session." })).resolves.toEqual({ id: 12 });
    expect(dbMocks.createCommunityInquiry).toHaveBeenCalledWith(expect.objectContaining({ email: "amina@example.com", interest: "Volunteer" }));
  });

  it("allows an administrator to list, save, and remove community enquiries", async () => {
    dbMocks.listCommunityInquiries.mockResolvedValue([]); dbMocks.updateCommunityInquiry.mockResolvedValue({ id: 4 }); dbMocks.removeCommunityInquiry.mockResolvedValue({ id: 4 });
    const caller = appRouter.createCaller(createAdminContext());
    await expect(caller.admin.inquiries.list()).resolves.toEqual([]);
    await caller.admin.inquiries.save({ id: 4, status: "responded", adminNotes: "Replied with program details." });
    await caller.admin.inquiries.remove({ id: 4 });
    expect(dbMocks.updateCommunityInquiry).toHaveBeenCalledWith(expect.objectContaining({ id: 4, status: "responded" })); expect(dbMocks.removeCommunityInquiry).toHaveBeenCalledWith(4);
  });

  it("allows an administrator to list, save, and remove program sessions", async () => {
    dbMocks.listProgramSessions.mockResolvedValue([]); dbMocks.saveProgramSession.mockResolvedValue({ id: 8 }); dbMocks.removeProgramSession.mockResolvedValue({ id: 8 });
    const caller = appRouter.createCaller(createAdminContext());
    await expect(caller.admin.sessions.list()).resolves.toEqual([]);
    await caller.admin.sessions.save({ title: "Purposeful leadership", focusArea: "Leadership", details: "Practical discussion for emerging leaders.", scheduledFor: "2026-10-11T09:00:00.000Z", venue: "YBI room", capacity: 30, status: "published" });
    await caller.admin.sessions.remove({ id: 8 });
    expect(dbMocks.saveProgramSession).toHaveBeenCalledWith(expect.objectContaining({ title: "Purposeful leadership", scheduledFor: expect.any(Date) })); expect(dbMocks.removeProgramSession).toHaveBeenCalledWith(8);
  });

  it("allows an administrator to list, save, and remove opportunities and impact indicators", async () => {
    dbMocks.listOpportunities.mockResolvedValue([]); dbMocks.saveOpportunity.mockResolvedValue({ id: 3 }); dbMocks.removeOpportunity.mockResolvedValue({ id: 3 }); dbMocks.listImpactMetrics.mockResolvedValue([]); dbMocks.saveImpactMetric.mockResolvedValue({ id: 9 }); dbMocks.removeImpactMetric.mockResolvedValue({ id: 9 });
    const caller = appRouter.createCaller(createAdminContext());
    await expect(caller.admin.opportunities.list()).resolves.toEqual([]); await caller.admin.opportunities.save({ title: "Mentor leaders", category: "Mentoring", summary: "Support a young person through regular reflection.", commitment: "Two hours monthly", status: "published", sortOrder: 1 }); await caller.admin.opportunities.remove({ id: 3 });
    await expect(caller.admin.impact.list()).resolves.toEqual([]); await caller.admin.impact.save({ title: "Leaders equipped", focusArea: "Leadership", description: "Participants completing a leadership learning journey.", currentValue: 24, targetValue: 40, unit: "people", period: "2026", status: "active" }); await caller.admin.impact.remove({ id: 9 });
    expect(dbMocks.saveOpportunity).toHaveBeenCalledWith(expect.objectContaining({ title: "Mentor leaders" })); expect(dbMocks.removeOpportunity).toHaveBeenCalledWith(3); expect(dbMocks.saveImpactMetric).toHaveBeenCalledWith(expect.objectContaining({ title: "Leaders equipped", currentValue: 24 })); expect(dbMocks.removeImpactMetric).toHaveBeenCalledWith(9);
  });

  it("lets administrators manage visitor quick questions and exposes the saved prompts publicly", async () => {
    const questions = ["How can I mentor?", "Which YBI program fits my goals?"];
    dbMocks.getSiteContent.mockResolvedValue({ body: JSON.stringify(questions) });
    const caller = appRouter.createCaller(createAdminContext());

    await expect(caller.admin.assistantSettings.get()).resolves.toEqual(questions);
    await caller.admin.assistantSettings.save({ questions });
    await expect(caller.publicSite.assistant.quickQuestions()).resolves.toEqual(questions);

    expect(dbMocks.upsertSiteContent).toHaveBeenCalledWith(expect.objectContaining({
      contentKey: "assistant-quick-questions",
      body: JSON.stringify(questions),
    }));
  });
});
