import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { count, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  blogPosts,
  communityInquiries,
  donations,
  eventRegistrations,
  events,
  faqItems,
  galleryPhotos,
  impactMetrics,
  InsertUser,
  newsletterSubscribers,
  opportunities,
  programs,
  programSessions,
  siteContent,
  smsLogs,
  teamMembers,
  updates,
  users,
} from "./drizzle/schema";
import * as schema from "./drizzle/schema";
import { ENV } from './_core/env';

// Load .env for local development
dotenv.config();

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _teamProfilePool: import("mysql2/promise").Pool | null = null;
let teamProfilePoolUnavailable = false;

// Lazily create the drizzle (postgres) instance — falls back to in-memory if no DATABASE_URL.
export async function getDb() {
  // This project’s managed data connection is MySQL-compatible. The legacy
  // PostgreSQL helper below cannot service that URL and otherwise waits for a
  // failing socket before callers can use their safe fallback paths.
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("postgres")) {
    return null;
  }
  if (!_db && process.env.DATABASE_URL) {
    try {
      const postgres = (await import("postgres")).default;
      const client = postgres(process.env.DATABASE_URL, {
        max: 5,
        ssl: "require",
        prepare: false,
        idle_timeout: 20,
        connect_timeout: 10,
      });
      _db = drizzle(client, { schema });
      console.log("[Database] Connected to Supabase PostgreSQL ✓");
    } catch (error) {
      console.warn("[Database] Failed to connect to Supabase:", error);
      _db = null;
    }
  }
  return _db;
}

// In-memory mock store for standalone / local operation without external database
const memoryStore = {
  users: new Map<string, any>(),
  galleryPhotos: [
    { id: 1, title: "Robotics Workshop in Action", altText: "Students collaborating on robotic kits", imageUrl: "/ybi-assets/gallery/workshop-1.jpg", storageKey: "workshop-1.jpg", isPublished: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: "Mentorship Circle", altText: "Young people in guided discussion", imageUrl: "/ybi-assets/gallery/mentorship-1.jpg", storageKey: "mentorship-1.jpg", isPublished: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  programs: [
    { id: 1, title: "Public Speaking & Communication", category: "Public Speaking", summary: "Master vocal presence, speech crafting, debate, and the confidence to bring your voice and ideas into any room.", status: "published" as const, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: "Youth Entrepreneurship & Enterprise", category: "Entrepreneurship", summary: "Turn meaningful ideas into viable ventures through problem validation, business fundamentals, and pitch coaching.", status: "published" as const, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: "Generations in Conversation", category: "Mentorship", summary: "Structured intergenerational dialogue circles and 1-on-1 mentorship pairings connecting young ambition with elder wisdom.", status: "published" as const, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, title: "Values-Led Leadership Lab", category: "Leadership", summary: "Develop self-awareness, ethical decision-making, and community stewardship habits to lead with integrity.", status: "published" as const, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  updates: [
    { id: 1, title: "YBI Launches 2026 Intergenerational Mentorship Cohorts", excerpt: "Connecting young ambition with elder wisdom across community dialogue spaces.", body: "Young Beginners Inspiration is expanding its signature intergenerational mentorship cohorts, public speaking labs, and youth enterprise studios across local community centers.", status: "published" as const, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  siteContent: new Map<string, any>(),
  communityInquiries: [
    { id: 1, name: "Ama Serwaa", email: "ama@example.org", interest: "Mentorship & Volunteering", message: "Hello YBI team, I would love to volunteer as a mentor in the upcoming cohort.", status: "new" as const, adminNotes: null, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  programSessions: [
    { id: 1, title: "Public Speaking & Debate Practicum", focusArea: "Public Speaking", details: "Interactive speaking drills, body language coaching, and debate practice.", scheduledFor: new Date(Date.now() + 86400000 * 7), venue: "YBI Community Hub", capacity: 30, status: "published" as const, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  opportunities: [
    { id: 1, title: "Intergenerational Mentor", category: "Mentorship", summary: "Guide youth through structured dialogue, career exploration, and life reflection.", commitment: "2 hours / week", status: "published" as const, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  impactMetrics: [
    { id: 1, title: "Youth & Community Reached", focusArea: "Leadership & Learning", description: "Young learners and emerging leaders equipped through workshops and cohorts.", currentValue: 1250, targetValue: 2000, unit: "Participants", period: "2026", status: "active" as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: "Mentorship Hours Completed", focusArea: "Mentorship", description: "Dedicated one-on-one and small group intergenerational coaching sessions.", currentValue: 500, targetValue: 1000, unit: "Hours", period: "2026", status: "active" as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: "Programs & Cohorts Delivered", focusArea: "Education", description: "Hands-on speaking, entrepreneurship, and leadership cohorts run.", currentValue: 35, targetValue: 50, unit: "Cohorts", period: "2026", status: "active" as const, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, title: "Partner Communities Engaged", focusArea: "Community", description: "Partner schools, youth hubs, and intergenerational spaces connected.", currentValue: 15, targetValue: 25, unit: "Communities", period: "2026", status: "active" as const, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  teamMembers: [
    { id: 1, slug: "maxwell-odonkor", name: "Maxwell Odonkor", role: "Executive Director", bio: "Executive Director leading the vision, strategy, and community initiatives at Young Beginners Inspiration.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "maxwell@ybi.org", linkedIn: "", sortOrder: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, slug: "viccoma-danquah", name: "Viccoma Danquah", role: "Communications & Advocacy Officer", bio: "Overseeing external communications, community advocacy, and outreach storytelling.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "viccoma@ybi.org", linkedIn: "", sortOrder: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, slug: "breah-lyon", name: "Breah Lyon", role: "Director of Strategy & External Affairs", bio: "Guiding strategic partnerships, organizational development, and external relations.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "breah@ybi.org", linkedIn: "", sortOrder: 3, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, slug: "priscila-arkorful", name: "Priscila Arkorful", role: "Finance & Administrative Associate", bio: "Managing financial administration, operational reporting, and fiscal stewardship.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "priscila@ybi.org", linkedIn: "", sortOrder: 4, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, slug: "edem-john-amevor", name: "Edem John Amevor", role: "Marketing Associate", bio: "Driving digital marketing, brand engagement, and audience growth across YBI channels.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "edem@ybi.org", linkedIn: "", sortOrder: 5, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, slug: "alimatuo-nyass", name: "Alimatuo Nyass", role: "Administrative Officer", bio: "Coordinating program logistics, internal communications, and office administration.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "alimatuo@ybi.org", linkedIn: "", sortOrder: 6, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 7, slug: "forson-odonkor", name: "Forson Odonkor", role: "Media Associate", bio: "Producing multimedia content, photography, and creative assets for YBI campaigns.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "forson@ybi.org", linkedIn: "", sortOrder: 7, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 8, slug: "thelma-naroog-bamanteeh", name: "Thelma Naroog Bamanteeh", role: "Executive Assistant", bio: "Providing executive support, schedule management, and key stakeholder coordination.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "thelma@ybi.org", linkedIn: "", sortOrder: 8, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ] as any[],
  events: [
    {
      id: 1,
      slug: "public-speaking-masterclass-2026",
      title: "Public Speaking & Youth Voice Masterclass",
      description: "A hands-on intensive workshop designed to build stage confidence, debate rhetoric, vocal modulation, and storytelling power for young emerging leaders.",
      imageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
      scheduledFor: new Date(Date.now() + 86400000 * 14),
      location: "Accra Community Center & Virtual Stream",
      capacity: 50,
      isFree: true,
      priceGhs: 0,
      status: "published" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      slug: "generations-in-conversation-summit",
      title: "Generations in Conversation: Annual Youth-Elder Summit",
      description: "An inspiring intergenerational gathering bridging youth innovators and experienced community elders for dialogue, mentorship pairing, and legacy building.",
      imageUrl: "/ybi-assets/community/ybi-community.jpg",
      scheduledFor: new Date(Date.now() + 86400000 * 28),
      location: "YBI Main Auditorium, East Legon, Accra",
      capacity: 100,
      isFree: false,
      priceGhs: 5000,
      status: "published" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      slug: "youth-enterprise-pitch-lab",
      title: "Youth Enterprise & Venture Pitch Lab",
      description: "Practical business modeling, market validation, and pitch coaching for aspiring entrepreneurs aged 16-30.",
      imageUrl: "/ybi-assets/gallery/workshop-1.jpg",
      scheduledFor: new Date(Date.now() + 86400000 * 45),
      location: "YBI Innovation Hub, Kumasi & Online",
      capacity: 40,
      isFree: true,
      priceGhs: 0,
      status: "published" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ] as any[],
  eventRegistrations: [
    {
      id: 1,
      eventId: 1,
      name: "Emmanuel Darko",
      email: "emmanuel.darko@gmail.com",
      phone: "+233 24 112 3344",
      smsOptIn: true,
      amountPaidGhs: 0,
      paymentStatus: "free",
      paystackRef: "FREE_PUBLIC_SPEAKING_01",
      confirmedAt: new Date(Date.now() - 86400000 * 2),
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      id: 2,
      eventId: 2,
      name: "Grace Quaye",
      email: "grace.quaye@yahoo.com",
      phone: "+233 54 887 9901",
      smsOptIn: true,
      amountPaidGhs: 5000,
      paymentStatus: "paid",
      paystackRef: "PAYSTACK_GEN_CONV_02",
      confirmedAt: new Date(Date.now() - 86400000 * 5),
      createdAt: new Date(Date.now() - 86400000 * 5),
      updatedAt: new Date(Date.now() - 86400000 * 5),
    },
    {
      id: 3,
      eventId: 3,
      name: "Kwabena Boateng",
      email: "kwabena.b@techgh.com",
      phone: "+233 20 334 5566",
      smsOptIn: true,
      amountPaidGhs: 0,
      paymentStatus: "free",
      paystackRef: "FREE_YOUTH_PITCH_03",
      confirmedAt: new Date(Date.now() - 86400000 * 8),
      createdAt: new Date(Date.now() - 86400000 * 8),
      updatedAt: new Date(Date.now() - 86400000 * 8),
    },
  ] as any[],
  blogPosts: [
    {
      id: 1,
      slug: "power-of-intergenerational-dialogue",
      title: "The Transformative Power of Intergenerational Dialogue in African Communities",
      excerpt: "When youth ambition meets elder wisdom, sustainable community development accelerates. Here is what we learned from 500+ hours of mentorship circles.",
      body: `## Bridging Generations Through Intentional Conversation\n\nIn many modern societies, generational disconnects leave young people navigating complex careers and leadership paths without grounded elder wisdom, while experienced leaders lack direct touchpoints with youth energy.\n\nAt Young Beginners Inspiration (YBI), our **Generations in Conversation** initiative was created to shatter these silos. Rather than formal lectures, we curate structured peer-to-peer and small-group circles where both sides actively listen, challenge assumptions, and build enduring mutual respect.\n\n### Key Takeaways from Our Recent Cohorts\n\n1. **Listening Precedes Leadership:** Young leaders who listen to past community struggles develop higher contextual empathy.\n2. **Mutual Learning:** Elders report feeling reinvigorated by the fresh perspectives, digital insights, and ethical curiosity of young mentees.\n3. **Practical Legacy:** Mentorship is not just advice—it is the deliberate transfer of resilience, cultural values, and network access.\n\nJoin our upcoming events or volunteer as a mentor to take part in this expanding movement.`,
      authorName: "YBI Editorial Team",
      coverImageUrl: "/ybi-assets/community/ybi-community.jpg",
      category: "Mentorship",
      status: "published" as const,
      publishedAt: new Date(Date.now() - 86400000 * 3),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      slug: "building-confidence-through-public-speaking",
      title: "Finding Your Voice: How Public Speaking Unlocks Leadership Potential",
      excerpt: "Mastering vocal presence, speech crafting, and active listening transforms shy participants into confident changemakers across schools and enterprises.",
      body: `## Voice as a Catalyst for Impact\n\nEvery impactful idea begins with the courage to articulate it clearly. In our public speaking workshops across Ghana, we consistently witness young individuals transition from hesitant observers to compelling communicators.\n\n### The Three Pillars of the YBI Speech Lab\n\n- **Authenticity over Performance:** Speaking with genuine conviction resonates far deeper than memorized rhetoric.\n- **Structured Argumentation:** Learning how to frame a problem, back it with lived evidence, and offer actionable solutions.\n- **Overcoming Stage Anxiety:** Practical breathwork and vocal drills that calm the nervous system before addressing any audience.\n\nWhether preparing for a classroom debate, an entrepreneurial pitch, or civic advocacy, mastering the spoken word is one of the most transferable skills for the 21st century.`,
      authorName: "Kwame Mensah",
      coverImageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
      category: "Public Speaking",
      status: "published" as const,
      publishedAt: new Date(Date.now() - 86400000 * 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      slug: "values-led-entrepreneurship-ghana",
      title: "Values-Led Entrepreneurship: Building Ventures with Community Roots",
      excerpt: "Why purpose-driven enterprise is key to youth employment and how YBI incubates sustainable, ethical business ideas.",
      body: `## Beyond Profit: The Rise of Ethical Enterprise\n\nEntrepreneurship is often framed purely around rapid scale and valuation. However, in our communities, the most resilient enterprises are those solving fundamental local challenges—from educational access to sustainable agriculture.\n\n### Guiding Principles for Young Founders\n\n1. **Solve Real Pain Points:** Validate with actual community members before investing resources.\n2. **Maintain Ethical Transparency:** Trust is the ultimate currency of any enduring organization.\n3. **Reinvest in People:** Sustainable enterprises create dignified livelihoods and mentor the next generation.\n\nExplore our youth entrepreneurship cohorts to learn how we support early-stage venture builders.`,
      authorName: "Ama Serwaa",
      coverImageUrl: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
      category: "Entrepreneurship",
      status: "published" as const,
      publishedAt: new Date(Date.now() - 86400000 * 20),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ] as any[],
  donations: [
    {
      id: 1,
      name: "Kwesi Appiah",
      email: "kwesi@example.com",
      phone: "+233240000001",
      amountGhs: 25000,
      message: "Keep up the inspiring work empowering our youth!",
      paystackRef: "ybi_don_mock_1",
      paymentStatus: "success" as const,
      createdAt: new Date(Date.now() - 86400000 * 2),
      updatedAt: new Date(Date.now() - 86400000 * 2),
    },
  ] as any[],
  faqItems: [
    {
      id: 1,
      question: "What is Young Beginners Inspiration (YBI)?",
      answer: "Young Beginners Inspiration (YBI) is a nonprofit organization dedicated to empowering youth through public speaking, entrepreneurship, intergenerational mentorship, and values-led leadership programs.",
      category: "General",
      sortOrder: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      question: "Who can participate in YBI programs?",
      answer: "Our core programs are designed for young people aged 12 to 30, while our mentorship circles actively welcome experienced elders, professionals, and community leaders of all ages as mentors.",
      category: "Programs",
      sortOrder: 2,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      question: "How can I volunteer or become a mentor?",
      answer: "You can apply directly through our Get Involved page or contact us. We match volunteers based on interest, experience, and availability for cohorts and community workshops.",
      category: "Get Involved",
      sortOrder: 3,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      question: "Are YBI events free to attend?",
      answer: "Most of our community workshops and public lectures are completely free. Select specialized summits or masterclasses have a nominal fee to cover materials and venue costs, with scholarship waivers available upon request.",
      category: "Events",
      sortOrder: 4,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      question: "How are donations utilized?",
      answer: "100% of public donations directly fund student workshop materials, mentorship venue logistics, rural outreach cohorts, and facilitator stipends.",
      category: "Donations",
      sortOrder: 5,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ] as any[],
  smsLogs: [] as any[],
  newsletterSubscribers: [] as any[],
  autoId: 100,
};

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    const existing = memoryStore.users.get(user.openId) || {};
    memoryStore.users.set(user.openId, { ...existing, ...user, lastSignedIn: user.lastSignedIn || new Date() });
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    try {
      await db.insert(users).values(values).onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
    } catch (dbErr) {
      console.warn("[Database] Live DB query failed, falling back to memoryStore:", dbErr);
      const existing = memoryStore.users.get(user.openId) || {};
      memoryStore.users.set(user.openId, { ...existing, ...values, id: existing.id || 1, createdAt: existing.createdAt || new Date(), updatedAt: new Date() });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    return memoryStore.users.get(openId);
  }

  try {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : memoryStore.users.get(openId);
  } catch {
    return memoryStore.users.get(openId);
  }
}

export async function getDashboardOverview() {
  const db = await getDb();
  if (!db) {
    return {
      gallery: memoryStore.galleryPhotos.length,
      programs: memoryStore.programs.length,
      updates: memoryStore.updates.length,
      content: memoryStore.siteContent.size,
      inquiries: memoryStore.communityInquiries.length,
      sessions: memoryStore.programSessions.length,
      opportunities: memoryStore.opportunities.length,
      impactMetrics: memoryStore.impactMetrics.length,
      teamMembers: memoryStore.teamMembers.length,
      subscribers: memoryStore.newsletterSubscribers.length,
      events: memoryStore.events.length,
      blogPosts: memoryStore.blogPosts.length,
      donations: memoryStore.donations.length,
      registrations: memoryStore.eventRegistrations.length,
      faqItems: memoryStore.faqItems.length,
    };
  }
  const [
    gallery,
    programCount,
    updateCount,
    contentCount,
    inquiryCount,
    sessionCount,
    opportunityCount,
    metricCount,
    eventCount,
    blogCount,
    donationCount,
    regCount,
    faqCount,
    subCount,
  ] = await Promise.all([
    db.select({ value: count() }).from(galleryPhotos).catch(() => [{ value: memoryStore.galleryPhotos.length }]),
    db.select({ value: count() }).from(programs).catch(() => [{ value: memoryStore.programs.length }]),
    db.select({ value: count() }).from(updates).catch(() => [{ value: memoryStore.updates.length }]),
    db.select({ value: count() }).from(siteContent).catch(() => [{ value: memoryStore.siteContent.size }]),
    db.select({ value: count() }).from(communityInquiries).catch(() => [{ value: memoryStore.communityInquiries.length }]),
    db.select({ value: count() }).from(programSessions).catch(() => [{ value: memoryStore.programSessions.length }]),
    db.select({ value: count() }).from(opportunities).catch(() => [{ value: memoryStore.opportunities.length }]),
    db.select({ value: count() }).from(impactMetrics).catch(() => [{ value: memoryStore.impactMetrics.length }]),
    db.select({ value: count() }).from(events).catch(() => [{ value: memoryStore.events.length }]),
    db.select({ value: count() }).from(blogPosts).catch(() => [{ value: memoryStore.blogPosts.length }]),
    db.select({ value: count() }).from(donations).catch(() => [{ value: memoryStore.donations.length }]),
    db.select({ value: count() }).from(eventRegistrations).catch(() => [{ value: memoryStore.eventRegistrations.length }]),
    db.select({ value: count() }).from(faqItems).catch(() => [{ value: memoryStore.faqItems.length }]),
    db.select({ value: count() }).from(newsletterSubscribers).catch(() => [{ value: memoryStore.newsletterSubscribers.length }]),
  ]);
  return {
    gallery: gallery[0]?.value ?? 0,
    programs: programCount[0]?.value ?? 0,
    updates: updateCount[0]?.value ?? 0,
    content: contentCount[0]?.value ?? 0,
    inquiries: inquiryCount[0]?.value ?? 0,
    sessions: sessionCount[0]?.value ?? 0,
    opportunities: opportunityCount[0]?.value ?? 0,
    impactMetrics: metricCount[0]?.value ?? 0,
    teamMembers: memoryStore.teamMembers.length,
    subscribers: (subCount[0]?.value && subCount[0].value > 0) ? subCount[0].value : memoryStore.newsletterSubscribers.length,
    events: (eventCount[0]?.value && eventCount[0].value > 0) ? eventCount[0].value : memoryStore.events.length,
    blogPosts: (blogCount[0]?.value && blogCount[0].value > 0) ? blogCount[0].value : memoryStore.blogPosts.length,
    donations: (donationCount[0]?.value && donationCount[0].value > 0) ? donationCount[0].value : memoryStore.donations.length,
    registrations: (regCount[0]?.value && regCount[0].value > 0) ? regCount[0].value : memoryStore.eventRegistrations.length,
    faqItems: (faqCount[0]?.value && faqCount[0].value > 0) ? faqCount[0].value : memoryStore.faqItems.length,
  };
}

export async function createCommunityInquiry(input: {
  name: string;
  email: string;
  interest: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.communityInquiries.unshift({ id, ...input, status: "new", adminNotes: null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const result = await db.insert(communityInquiries).values(input).returning({ id: communityInquiries.id });
  return Number(result[0].id);
}

export async function listCommunityInquiries() {
  const db = await getDb();
  if (!db) return memoryStore.communityInquiries;
  return db.select().from(communityInquiries).orderBy(desc(communityInquiries.createdAt));
}

export async function updateCommunityInquiry(input: {
  id: number;
  status: "new" | "in_progress" | "responded" | "closed";
  adminNotes?: string | null;
}) {
  const db = await getDb();
  if (!db) {
    const item = memoryStore.communityInquiries.find(i => i.id === input.id);
    if (item) {
      item.status = input.status;
      if (input.adminNotes !== undefined) item.adminNotes = input.adminNotes;
      item.updatedAt = new Date();
    }
    return;
  }
  await db.update(communityInquiries).set({
    status: input.status,
    adminNotes: input.adminNotes ?? null,
    updatedAt: new Date(),
  }).where(eq(communityInquiries.id, input.id));
}

export async function removeCommunityInquiry(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.communityInquiries.findIndex(i => i.id === id);
    if (index !== -1) memoryStore.communityInquiries.splice(index, 1);
    return;
  }
  await db.delete(communityInquiries).where(eq(communityInquiries.id, id));
}

export async function listProgramSessions() {
  const db = await getDb();
  if (!db) return memoryStore.programSessions;
  return db.select().from(programSessions).orderBy(programSessions.scheduledFor, desc(programSessions.createdAt));
}

export async function saveProgramSession(input: {
  id?: number;
  title: string;
  focusArea: string;
  details: string;
  scheduledFor: Date;
  venue: string;
  capacity?: number | null;
  status: "draft" | "published" | "complete";
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.programSessions.findIndex(s => s.id === input.id);
      if (index !== -1) {
        memoryStore.programSessions[index] = { ...memoryStore.programSessions[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.programSessions.push({ id, ...input, capacity: input.capacity ?? null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { ...input, id: undefined, updatedAt: new Date() };
  if (input.id) {
    const { id, ...updateValues } = values;
    await db.update(programSessions).set(updateValues).where(eq(programSessions.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(programSessions).values(insertValues).returning({ id: programSessions.id });
  return Number(result[0].id);
}

export async function removeProgramSession(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.programSessions.findIndex(s => s.id === id);
    if (index !== -1) memoryStore.programSessions.splice(index, 1);
    return;
  }
  await db.delete(programSessions).where(eq(programSessions.id, id));
}

export async function listOpportunities() {
  const db = await getDb();
  if (!db) return memoryStore.opportunities;
  return db.select().from(opportunities).orderBy(opportunities.sortOrder, desc(opportunities.createdAt));
}

export async function saveOpportunity(input: {
  id?: number;
  title: string;
  category: string;
  summary: string;
  commitment: string;
  status: "draft" | "published" | "closed";
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.opportunities.findIndex(o => o.id === input.id);
      if (index !== -1) {
        memoryStore.opportunities[index] = { ...memoryStore.opportunities[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.opportunities.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { ...input, id: undefined, updatedAt: new Date() };
  if (input.id) {
    const { id, ...updateValues } = values;
    await db.update(opportunities).set(updateValues).where(eq(opportunities.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(opportunities).values(insertValues).returning({ id: opportunities.id });
  return Number(result[0].id);
}

export async function removeOpportunity(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.opportunities.findIndex(o => o.id === id);
    if (index !== -1) memoryStore.opportunities.splice(index, 1);
    return;
  }
  await db.delete(opportunities).where(eq(opportunities.id, id));
}

export async function listImpactMetrics() {
  const db = await getDb();
  if (!db) return memoryStore.impactMetrics;
  return db.select().from(impactMetrics).orderBy(impactMetrics.status, impactMetrics.focusArea, impactMetrics.title);
}

export async function saveImpactMetric(input: {
  id?: number;
  title: string;
  focusArea: string;
  description: string;
  currentValue: number;
  targetValue?: number | null;
  unit: string;
  period: string;
  status: "active" | "archived";
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.impactMetrics.findIndex(m => m.id === input.id);
      if (index !== -1) {
        memoryStore.impactMetrics[index] = { ...memoryStore.impactMetrics[index], ...input, targetValue: input.targetValue ?? null, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.impactMetrics.push({ id, ...input, targetValue: input.targetValue ?? null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { ...input, id: undefined, updatedAt: new Date() };
  if (input.id) {
    const { id, ...updateValues } = values;
    await db.update(impactMetrics).set(updateValues).where(eq(impactMetrics.id, input.id));
    return input.id;
  }
  const { id, ...insertValues } = values;
  const result = await db.insert(impactMetrics).values(insertValues).returning({ id: impactMetrics.id });
  return Number(result[0].id);
}

export async function removeImpactMetric(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.impactMetrics.findIndex(m => m.id === id);
    if (index !== -1) memoryStore.impactMetrics.splice(index, 1);
    return;
  }
  await db.delete(impactMetrics).where(eq(impactMetrics.id, id));
}

export async function listGalleryPhotos(includeUnpublished = true) {
  const db = await getDb();
  if (!db) return includeUnpublished ? memoryStore.galleryPhotos : memoryStore.galleryPhotos.filter(p => p.isPublished);
  const rows = await db.select().from(galleryPhotos).orderBy(galleryPhotos.sortOrder, desc(galleryPhotos.createdAt));
  return includeUnpublished ? rows : rows.filter(photo => photo.isPublished);
}

export async function saveGalleryPhoto(input: {
  id?: number;
  title: string;
  altText: string;
  imageUrl?: string;
  storageKey?: string;
  isPublished: boolean;
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.galleryPhotos.findIndex(p => p.id === input.id);
      if (index !== -1) {
        memoryStore.galleryPhotos[index] = { ...memoryStore.galleryPhotos[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.galleryPhotos.push({
      id,
      title: input.title,
      altText: input.altText,
      imageUrl: input.imageUrl || "/ybi-assets/gallery/workshop-1.jpg",
      storageKey: input.storageKey || "sample.jpg",
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }
  if (input.id) {
    await db.update(galleryPhotos).set({
      title: input.title,
      altText: input.altText,
      isPublished: input.isPublished,
      sortOrder: input.sortOrder,
      updatedAt: new Date(),
    }).where(eq(galleryPhotos.id, input.id));
    return input.id;
  }
  if (!input.imageUrl || !input.storageKey) throw new Error("Image details are required for a new gallery photo");
  const result = await db.insert(galleryPhotos).values({
    title: input.title,
    altText: input.altText,
    imageUrl: input.imageUrl,
    storageKey: input.storageKey,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder,
  }).returning({ id: galleryPhotos.id });
  return Number(result[0].id);
}

export async function removeGalleryPhoto(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.galleryPhotos.findIndex(p => p.id === id);
    if (index !== -1) memoryStore.galleryPhotos.splice(index, 1);
    return;
  }
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
}

export async function listPrograms(includeDrafts = true) {
  const db = await getDb();
  if (!db) return includeDrafts ? memoryStore.programs : memoryStore.programs.filter(p => p.status === "published");
  const rows = await db.select().from(programs).orderBy(programs.sortOrder, desc(programs.createdAt));
  return includeDrafts ? rows : rows.filter(program => program.status === "published");
}

export async function saveProgram(input: {
  id?: number;
  title: string;
  category: string;
  summary: string;
  status: "draft" | "published";
  sortOrder: number;
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.programs.findIndex(p => p.id === input.id);
      if (index !== -1) {
        memoryStore.programs[index] = { ...memoryStore.programs[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.programs.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = { title: input.title, category: input.category, summary: input.summary, status: input.status, sortOrder: input.sortOrder, updatedAt: new Date() };
  if (input.id) {
    await db.update(programs).set(values).where(eq(programs.id, input.id));
    return input.id;
  }
  const result = await db.insert(programs).values(values).returning({ id: programs.id });
  return Number(result[0].id);
}

export async function removeProgram(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.programs.findIndex(p => p.id === id);
    if (index !== -1) memoryStore.programs.splice(index, 1);
    return;
  }
  await db.delete(programs).where(eq(programs.id, id));
}

export async function listUpdates(includeDrafts = true) {
  const db = await getDb();
  if (!db) return includeDrafts ? memoryStore.updates : memoryStore.updates.filter(u => u.status === "published");
  const rows = await db.select().from(updates).orderBy(desc(updates.createdAt));
  return includeDrafts ? rows : rows.filter(update => update.status === "published");
}

export async function saveUpdate(input: {
  id?: number;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.updates.findIndex(u => u.id === input.id);
      if (index !== -1) {
        memoryStore.updates[index] = { ...memoryStore.updates[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.updates.push({ id, ...input, publishedAt: input.status === "published" ? new Date() : null, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = {
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    status: input.status,
    publishedAt: input.status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
  if (input.id) {
    await db.update(updates).set(values).where(eq(updates.id, input.id));
    return input.id;
  }
  const result = await db.insert(updates).values(values).returning({ id: updates.id });
  return Number(result[0].id);
}

export async function removeUpdate(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.updates.findIndex(u => u.id === id);
    if (index !== -1) memoryStore.updates.splice(index, 1);
    return;
  }
  await db.delete(updates).where(eq(updates.id, id));
}

export async function listSiteContent() {
  const db = await getDb();
  if (!db) return Array.from(memoryStore.siteContent.values());
  try {
    return await db.select().from(siteContent).orderBy(siteContent.contentKey);
  } catch {
    return Array.from(memoryStore.siteContent.values());
  }
}

export async function getSiteContent(contentKey: string) {
  const db = await getDb();
  if (!db) return memoryStore.siteContent.get(contentKey) ?? null;
  try {
    const rows = await db.select().from(siteContent).where(eq(siteContent.contentKey, contentKey)).limit(1);
    return rows[0] ?? null;
  } catch {
    return memoryStore.siteContent.get(contentKey) ?? null;
  }
}

export async function upsertSiteContent(input: {
  contentKey: string;
  label: string;
  title: string;
  body: string;
  actionLabel?: string | null;
  actionHref?: string | null;
}) {
  const db = await getDb();
  if (!db) {
    memoryStore.siteContent.set(input.contentKey, { ...input, updatedAt: new Date() });
    return;
  }
  try {
    await db.insert(siteContent).values(input).onConflictDoUpdate({
      target: siteContent.contentKey,
      set: { ...input, updatedAt: new Date() },
    });
  } catch {
    memoryStore.siteContent.set(input.contentKey, { ...input, updatedAt: new Date() });
  }
}

export async function removeSiteContent(contentKey: string) {
  const db = await getDb();
  if (!db) {
    memoryStore.siteContent.delete(contentKey);
    return;
  }
  try {
    await db.delete(siteContent).where(eq(siteContent.contentKey, contentKey));
  } catch {
    memoryStore.siteContent.delete(contentKey);
  }
}

// ─── Team Members ────────────────────────────────────────────────────────────

type TeamProfileRecord = {
  id: number;
  slug: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email: string | null;
  linkedIn: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function fallbackTeamMembers(includeUnpublished: boolean) {
  const rows = memoryStore.teamMembers.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  return includeUnpublished ? rows : rows.filter(member => member.isPublished);
}

function normalizeTeamSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160) || "team-member";
}

export async function listTeamMembers(includeUnpublished = true) {
  const db = await getDb();
  if (!db) {
    return fallbackTeamMembers(includeUnpublished);
  }
  try {
    // Delete any old dummy / placeholder records from legacy tables
    try {
      await db.delete(teamMembers).where(
        sql`${teamMembers.slug} IN ('executive-director-founder', 'programs-curriculum-lead', 'mentorship-community-lead', 'enterprise-venture-coach') OR ${teamMembers.name} IN ('Oben Joshua', 'Programs & Curriculum Lead', 'Mentorship & Community Lead', 'Enterprise & Venture Coach', 'Executive Director & Founder')`
      );
    } catch (e) {}

    let rows = await db.select().from(teamMembers).orderBy(teamMembers.sortOrder, teamMembers.id);
    const existingOrders = new Set(rows.map((r) => r.sortOrder));
    let seededAny = false;
    for (const m of memoryStore.teamMembers) {
      if (!existingOrders.has(m.sortOrder)) {
        try {
          await db.insert(teamMembers).values({
            slug: m.slug,
            name: m.name,
            role: m.role,
            bio: m.bio,
            imageUrl: m.imageUrl,
            email: m.email || null,
            linkedIn: m.linkedIn || null,
            sortOrder: m.sortOrder,
            isPublished: m.isPublished,
          }).onConflictDoNothing();
          seededAny = true;
        } catch (e) {}
      }
    }
    if (seededAny) {
      rows = await db.select().from(teamMembers).orderBy(teamMembers.sortOrder, teamMembers.id);
    }
    return includeUnpublished ? rows : rows.filter((m) => m.isPublished);
  } catch (error) {
    console.warn("[Team] Error querying PostgreSQL teamMembers; using local fallback.", error);
    return fallbackTeamMembers(includeUnpublished);
  }
}

export async function getTeamMemberBySlug(slug: string, includeUnpublished = false) {
  const db = await getDb();
  if (!db) {
    const member = memoryStore.teamMembers.find(item => item.slug === slug) ?? null;
    return member && (includeUnpublished || member.isPublished) ? member : null;
  }
  try {
    const rows = await db.select().from(teamMembers).where(eq(teamMembers.slug, slug)).limit(1);
    const member = rows[0] ?? null;
    return member && (includeUnpublished || member.isPublished) ? member : null;
  } catch (error) {
    console.warn("[Team] Error loading teamMember by slug from PostgreSQL:", error);
    const member = memoryStore.teamMembers.find(item => item.slug === slug) ?? null;
    return member && (includeUnpublished || member.isPublished) ? member : null;
  }
}

function persistDataUriToFile(dataUri: string, prefix: string): string {
  if (!dataUri || !dataUri.startsWith("data:image/")) {
    return dataUri;
  }
  try {
    const match = dataUri.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!match) return dataUri;
    const ext = match[1] === "jpeg" ? "jpg" : match[1].replace(/\+xml/, "");
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, "base64");
    const filename = `${prefix}-${Date.now()}.${ext}`;
    const relKey = `team-members/${filename}`;

    const uploadsDir = path.resolve(process.cwd(), "uploads", "team-members");
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);

    const feUploadsDir = path.resolve(process.cwd(), "frontend", "public", "uploads", "team-members");
    try {
      fs.mkdirSync(feUploadsDir, { recursive: true });
      fs.writeFileSync(path.join(feUploadsDir, filename), buffer);
    } catch (e) {}

    return `/uploads/${relKey}`;
  } catch (e) {
    console.error("Failed to persist data URI to file:", e);
    return dataUri;
  }
}

export async function saveTeamMember(input: {
  id?: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
  linkedIn?: string;
  sortOrder: number;
  isPublished: boolean;
}) {
  const slug = normalizeTeamSlug(input.name);
  const finalImageUrl = persistDataUriToFile(input.imageUrl, slug);
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.teamMembers.findIndex(m => m.id === input.id);
      if (index !== -1) {
        memoryStore.teamMembers[index] = { ...memoryStore.teamMembers[index], ...input, imageUrl: finalImageUrl, slug, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.teamMembers.push({ id, ...input, imageUrl: finalImageUrl, slug, email: input.email || "", linkedIn: input.linkedIn || "", createdAt: new Date(), updatedAt: new Date() });
    return id;
  }

  const values = {
    slug,
    name: input.name,
    role: input.role,
    bio: input.bio,
    imageUrl: finalImageUrl,
    email: input.email || null,
    linkedIn: input.linkedIn || null,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
    updatedAt: new Date(),
  };

  if (input.id) {
    try {
      const updated = await db.update(teamMembers).set(values).where(eq(teamMembers.id, input.id)).returning({ id: teamMembers.id });
      if (updated.length > 0) {
        const index = memoryStore.teamMembers.findIndex(m => m.id === input.id);
        if (index !== -1) memoryStore.teamMembers[index] = { ...memoryStore.teamMembers[index], ...input, slug, updatedAt: new Date() };
        return input.id;
      }
    } catch (e) {}
  }

  if (input.sortOrder) {
    try {
      const updatedBySort = await db.update(teamMembers).set(values).where(eq(teamMembers.sortOrder, input.sortOrder)).returning({ id: teamMembers.id });
      if (updatedBySort.length > 0) {
        const index = memoryStore.teamMembers.findIndex(m => m.sortOrder === input.sortOrder);
        if (index !== -1) memoryStore.teamMembers[index] = { ...memoryStore.teamMembers[index], ...input, slug, updatedAt: new Date() };
        return Number(updatedBySort[0].id);
      }
    } catch (e) {}
  }

  try {
    const result = await db.insert(teamMembers).values(values).returning({ id: teamMembers.id });
    const insertedId = Number(result[0].id);
    memoryStore.teamMembers.push({ id: insertedId, ...input, slug, email: input.email || "", linkedIn: input.linkedIn || "", createdAt: new Date(), updatedAt: new Date() });
    return insertedId;
  } catch (e) {
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
    const result = await db.insert(teamMembers).values({ ...values, slug: uniqueSlug }).returning({ id: teamMembers.id });
    const insertedId = Number(result[0].id);
    memoryStore.teamMembers.push({ id: insertedId, ...input, slug: uniqueSlug, email: input.email || "", linkedIn: input.linkedIn || "", createdAt: new Date(), updatedAt: new Date() });
    return insertedId;
  }
}

export async function removeTeamMember(id: number) {
  const db = await getDb();
  if (db) {
    try {
      await db.delete(teamMembers).where(eq(teamMembers.id, id));
    } catch (error) {
      console.warn("[Team] Error removing teamMember from PostgreSQL:", error);
    }
  }
  const index = memoryStore.teamMembers.findIndex(member => member.id === id);
  if (index !== -1) memoryStore.teamMembers.splice(index, 1);
}

// ─── Newsletter Subscribers ───────────────────────────────────────────────────

export async function addNewsletterSubscriber(input: {
  email: string;
  name?: string;
  phone?: string;
  smsOptIn?: boolean;
}) {
  const db = await getDb();
  if (!db) {
    const existing = memoryStore.newsletterSubscribers.find(s => s.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      if (input.phone) existing.phone = input.phone;
      if (input.smsOptIn !== undefined) existing.smsOptIn = input.smsOptIn;
      if (input.name) existing.name = input.name;
      return existing.id;
    }
    const id = ++memoryStore.autoId;
    memoryStore.newsletterSubscribers.unshift({
      id,
      email: input.email,
      name: input.name || "",
      phone: input.phone || null,
      smsOptIn: input.smsOptIn ?? false,
      subscribedAt: new Date(),
    });
    return id;
  }
  try {
    const existing = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, input.email)).limit(1);
    if (existing.length > 0) {
      await db.update(newsletterSubscribers).set({
        name: input.name ?? existing[0].name,
        phone: input.phone ?? existing[0].phone,
        smsOptIn: input.smsOptIn ?? existing[0].smsOptIn,
      }).where(eq(newsletterSubscribers.email, input.email));
      return existing[0].id;
    }
    const result = await db.insert(newsletterSubscribers).values({
      email: input.email,
      name: input.name || null,
      phone: input.phone || null,
      smsOptIn: input.smsOptIn ?? false,
    }).returning({ id: newsletterSubscribers.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.newsletterSubscribers.unshift({
      id,
      email: input.email,
      name: input.name || "",
      phone: input.phone || null,
      smsOptIn: input.smsOptIn ?? false,
      subscribedAt: new Date(),
    });
    return id;
  }
}

export async function listNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return memoryStore.newsletterSubscribers;
  try {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
  } catch {
    return memoryStore.newsletterSubscribers;
  }
}

export async function removeNewsletterSubscriber(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.newsletterSubscribers.findIndex(s => s.id === id);
    if (index !== -1) memoryStore.newsletterSubscribers.splice(index, 1);
    return;
  }
  try {
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
  } catch {
    const index = memoryStore.newsletterSubscribers.findIndex(s => s.id === id);
    if (index !== -1) memoryStore.newsletterSubscribers.splice(index, 1);
  }
}

// ─── Phase 2: Events ─────────────────────────────────────────────────────────

export async function listEvents(includeDrafts = true) {
  const db = await getDb();
  if (!db) {
    return includeDrafts
      ? memoryStore.events
      : memoryStore.events.filter(e => e.status === "published");
  }
  try {
    const rows = await db.select().from(events).orderBy(events.scheduledFor);
    return includeDrafts ? rows : rows.filter(e => e.status === "published");
  } catch {
    return includeDrafts
      ? memoryStore.events
      : memoryStore.events.filter(e => e.status === "published");
  }
}

export async function getEventBySlug(slug: string) {
  const db = await getDb();
  if (!db) return memoryStore.events.find(e => e.slug === slug) ?? null;
  try {
    const rows = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
    return rows[0] ?? memoryStore.events.find(e => e.slug === slug) ?? null;
  } catch {
    return memoryStore.events.find(e => e.slug === slug) ?? null;
  }
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return memoryStore.events.find(e => e.id === id) ?? null;
  try {
    const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return rows[0] ?? memoryStore.events.find(e => e.id === id) ?? null;
  } catch {
    return memoryStore.events.find(e => e.id === id) ?? null;
  }
}

export async function saveEvent(input: {
  id?: number;
  slug: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  scheduledFor: Date;
  location: string;
  capacity?: number | null;
  isFree: boolean;
  priceGhs: number;
  status: "draft" | "published" | "cancelled";
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.events.findIndex(e => e.id === input.id);
      if (index !== -1) {
        memoryStore.events[index] = { ...memoryStore.events[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.events.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = {
    slug: input.slug,
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl ?? null,
    scheduledFor: input.scheduledFor,
    location: input.location,
    capacity: input.capacity ?? null,
    isFree: input.isFree,
    priceGhs: input.priceGhs,
    status: input.status,
    updatedAt: new Date(),
  };
  try {
    if (input.id) {
      await db.update(events).set(values).where(eq(events.id, input.id));
      return input.id;
    }
    const result = await db.insert(events).values(values).returning({ id: events.id });
    return Number(result[0].id);
  } catch {
    if (input.id) {
      const index = memoryStore.events.findIndex(e => e.id === input.id);
      if (index !== -1) {
        memoryStore.events[index] = { ...memoryStore.events[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.events.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
}

export async function removeEvent(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.events.findIndex(e => e.id === id);
    if (index !== -1) memoryStore.events.splice(index, 1);
    return;
  }
  try {
    await db.delete(events).where(eq(events.id, id));
  } catch {
    const index = memoryStore.events.findIndex(e => e.id === id);
    if (index !== -1) memoryStore.events.splice(index, 1);
  }
}

// ─── Phase 2: Event Registrations ──────────────────────────────────────────

export async function createEventRegistration(input: {
  eventId: number;
  name: string;
  email: string;
  phone: string;
  smsOptIn?: boolean;
  paystackRef?: string | null;
  paymentStatus?: "pending" | "success" | "failed" | "free";
  isWaitlist?: boolean;
  confirmedAt?: Date | null;
}) {
  const db = await getDb();
  const record = {
    eventId: input.eventId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    smsOptIn: input.smsOptIn ?? false,
    paystackRef: input.paystackRef ?? null,
    paymentStatus: input.paymentStatus ?? "pending",
    isWaitlist: input.isWaitlist ?? false,
    confirmedAt: input.confirmedAt ?? (input.paymentStatus === "success" || input.paymentStatus === "free" ? new Date() : null),
  };
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.eventRegistrations.push({ id, ...record, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  try {
    const result = await db.insert(eventRegistrations).values(record).returning({ id: eventRegistrations.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.eventRegistrations.push({ id, ...record, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
}

export async function listEventRegistrations(eventId?: number) {
  const db = await getDb();
  if (!db) {
    return eventId
      ? memoryStore.eventRegistrations.filter(r => r.eventId === eventId)
      : memoryStore.eventRegistrations;
  }
  try {
    const rows = eventId
      ? await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId)).orderBy(desc(eventRegistrations.createdAt))
      : await db.select().from(eventRegistrations).orderBy(desc(eventRegistrations.createdAt));
    if (rows && rows.length > 0) return rows;
    return eventId
      ? memoryStore.eventRegistrations.filter(r => r.eventId === eventId)
      : memoryStore.eventRegistrations;
  } catch {
    return eventId
      ? memoryStore.eventRegistrations.filter(r => r.eventId === eventId)
      : memoryStore.eventRegistrations;
  }
}

export async function updateEventRegistrationPayment(
  paystackRef: string,
  paymentStatus: "pending" | "success" | "failed" | "free"
) {
  const db = await getDb();
  const item = memoryStore.eventRegistrations.find(r => r.paystackRef === paystackRef);
  if (item) {
    item.paymentStatus = paymentStatus;
    if (paymentStatus === "success" || paymentStatus === "free") item.confirmedAt = new Date();
    item.updatedAt = new Date();
  }
  if (db) {
    try {
      await db.update(eventRegistrations).set({
        paymentStatus,
        confirmedAt: paymentStatus === "success" || paymentStatus === "free" ? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(eventRegistrations.paystackRef, paystackRef));
    } catch {}
  }
}

// ─── Phase 2: Blog Posts ───────────────────────────────────────────────────

export async function listBlogPosts(includeDrafts = true) {
  const db = await getDb();
  if (!db) {
    return includeDrafts
      ? memoryStore.blogPosts
      : memoryStore.blogPosts.filter(p => p.status === "published");
  }
  try {
    const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
    return includeDrafts ? rows : rows.filter(p => p.status === "published");
  } catch {
    return includeDrafts
      ? memoryStore.blogPosts
      : memoryStore.blogPosts.filter(p => p.status === "published");
  }
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return memoryStore.blogPosts.find(p => p.slug === slug) ?? null;
  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return rows[0] ?? memoryStore.blogPosts.find(p => p.slug === slug) ?? null;
  } catch {
    return memoryStore.blogPosts.find(p => p.slug === slug) ?? null;
  }
}

export async function saveBlogPost(input: {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  authorName: string;
  coverImageUrl?: string | null;
  category: string;
  status: "draft" | "published";
  publishedAt?: Date | null;
}) {
  const db = await getDb();
  const publishedAt = input.publishedAt ?? (input.status === "published" ? new Date() : null);
  if (!db) {
    if (input.id) {
      const index = memoryStore.blogPosts.findIndex(p => p.id === input.id);
      if (index !== -1) {
        memoryStore.blogPosts[index] = { ...memoryStore.blogPosts[index], ...input, publishedAt, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.blogPosts.push({ id, ...input, publishedAt, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    authorName: input.authorName,
    coverImageUrl: input.coverImageUrl ?? null,
    category: input.category,
    status: input.status,
    publishedAt,
    updatedAt: new Date(),
  };
  try {
    if (input.id) {
      await db.update(blogPosts).set(values).where(eq(blogPosts.id, input.id));
      return input.id;
    }
    const result = await db.insert(blogPosts).values(values).returning({ id: blogPosts.id });
    return Number(result[0].id);
  } catch {
    if (input.id) {
      const index = memoryStore.blogPosts.findIndex(p => p.id === input.id);
      if (index !== -1) {
        memoryStore.blogPosts[index] = { ...memoryStore.blogPosts[index], ...input, publishedAt, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.blogPosts.push({ id, ...input, publishedAt, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
}

export async function removeBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.blogPosts.findIndex(p => p.id === id);
    if (index !== -1) memoryStore.blogPosts.splice(index, 1);
    return;
  }
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  } catch {
    const index = memoryStore.blogPosts.findIndex(p => p.id === id);
    if (index !== -1) memoryStore.blogPosts.splice(index, 1);
  }
}

// ─── Phase 2: Donations ────────────────────────────────────────────────────

export async function createDonation(input: {
  name: string;
  email: string;
  phone?: string | null;
  amountGhs: number; // in pesewas
  message?: string | null;
  paystackRef?: string | null;
  paymentStatus?: "pending" | "success" | "failed" | "free";
}) {
  const db = await getDb();
  const values = {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    amountGhs: input.amountGhs,
    message: input.message ?? null,
    paystackRef: input.paystackRef ?? null,
    paymentStatus: input.paymentStatus ?? "pending",
  };
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.donations.unshift({ id, ...values, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  try {
    const result = await db.insert(donations).values(values).returning({ id: donations.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.donations.unshift({ id, ...values, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
}

export async function listDonations() {
  const db = await getDb();
  if (!db) return memoryStore.donations;
  try {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  } catch {
    return memoryStore.donations;
  }
}

export async function updateDonationPayment(
  paystackRef: string,
  paymentStatus: "pending" | "success" | "failed" | "free"
) {
  const db = await getDb();
  const item = memoryStore.donations.find(d => d.paystackRef === paystackRef);
  if (item) {
    item.paymentStatus = paymentStatus;
    item.updatedAt = new Date();
  }
  if (db) {
    try {
      await db.update(donations).set({
        paymentStatus,
        updatedAt: new Date(),
      }).where(eq(donations.paystackRef, paystackRef));
    } catch {}
  }
}

// ─── Phase 2: FAQ Items ────────────────────────────────────────────────────

export async function listFaqItems(includeUnpublished = true) {
  const db = await getDb();
  if (!db) {
    const items = includeUnpublished
      ? memoryStore.faqItems
      : memoryStore.faqItems.filter(f => f.isPublished);
    return items.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }
  try {
    const rows = await db.select().from(faqItems).orderBy(faqItems.sortOrder, desc(faqItems.createdAt));
    return includeUnpublished ? rows : rows.filter(f => f.isPublished);
  } catch {
    const items = includeUnpublished
      ? memoryStore.faqItems
      : memoryStore.faqItems.filter(f => f.isPublished);
    return items.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export async function saveFaqItem(input: {
  id?: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
}) {
  const db = await getDb();
  if (!db) {
    if (input.id) {
      const index = memoryStore.faqItems.findIndex(f => f.id === input.id);
      if (index !== -1) {
        memoryStore.faqItems[index] = { ...memoryStore.faqItems[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.faqItems.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
  const values = {
    question: input.question,
    answer: input.answer,
    category: input.category,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
    updatedAt: new Date(),
  };
  try {
    if (input.id) {
      await db.update(faqItems).set(values).where(eq(faqItems.id, input.id));
      return input.id;
    }
    const result = await db.insert(faqItems).values(values).returning({ id: faqItems.id });
    return Number(result[0].id);
  } catch {
    if (input.id) {
      const index = memoryStore.faqItems.findIndex(f => f.id === input.id);
      if (index !== -1) {
        memoryStore.faqItems[index] = { ...memoryStore.faqItems[index], ...input, updatedAt: new Date() };
        return input.id;
      }
    }
    const id = ++memoryStore.autoId;
    memoryStore.faqItems.push({ id, ...input, createdAt: new Date(), updatedAt: new Date() });
    return id;
  }
}

export async function removeFaqItem(id: number) {
  const db = await getDb();
  if (!db) {
    const index = memoryStore.faqItems.findIndex(f => f.id === id);
    if (index !== -1) memoryStore.faqItems.splice(index, 1);
    return;
  }
  try {
    await db.delete(faqItems).where(eq(faqItems.id, id));
  } catch {
    const index = memoryStore.faqItems.findIndex(f => f.id === id);
    if (index !== -1) memoryStore.faqItems.splice(index, 1);
  }
}

// ─── Phase 2: SMS Logs ─────────────────────────────────────────────────────

export async function createSmsLog(input: {
  recipientPhone: string;
  message: string;
  provider?: string;
  status?: string;
  providerRef?: string | null;
}) {
  const db = await getDb();
  const values = {
    recipientPhone: input.recipientPhone,
    message: input.message,
    provider: input.provider ?? "africastalking",
    status: input.status ?? "sent",
    providerRef: input.providerRef ?? null,
  };
  if (!db) {
    const id = ++memoryStore.autoId;
    memoryStore.smsLogs.unshift({ id, ...values, sentAt: new Date() });
    return id;
  }
  try {
    const result = await db.insert(smsLogs).values(values).returning({ id: smsLogs.id });
    return Number(result[0].id);
  } catch {
    const id = ++memoryStore.autoId;
    memoryStore.smsLogs.unshift({ id, ...values, sentAt: new Date() });
    return id;
  }
}

export async function listSmsLogs() {
  const db = await getDb();
  if (!db) return memoryStore.smsLogs;
  try {
    return await db.select().from(smsLogs).orderBy(desc(smsLogs.sentAt));
  } catch {
    return memoryStore.smsLogs;
  }
}
