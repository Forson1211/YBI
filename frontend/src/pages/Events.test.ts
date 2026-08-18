import { describe, expect, it } from "vitest";

describe("Events page client logic", () => {
  const sampleEvents = [
    {
      id: 1,
      title: "Masterclass: Public Speaking & Vocal Articulation",
      slug: "public-speaking-masterclass-2026",
      scheduledFor: "2026-11-15T10:00:00Z",
      location: "British Council Hall, Accra",
      isFree: true,
      priceGhs: 0,
      capacity: 50,
      status: "published",
    },
    {
      id: 2,
      title: "Youth Enterprise Studio: Idea to Market",
      slug: "youth-enterprise-studio-2026",
      scheduledFor: "2026-12-05T09:00:00Z",
      location: "Kumasi Hive Innovation Hub",
      isFree: false,
      priceGhs: 5000,
      capacity: 35,
      status: "published",
    },
    {
      id: 3,
      title: "Inaugural Leadership Cohort 2025",
      slug: "inaugural-cohort-2025",
      scheduledFor: "2025-06-10T10:00:00Z",
      location: "Accra",
      isFree: true,
      priceGhs: 0,
      capacity: 40,
      status: "published",
    },
  ];

  it("filters upcoming vs past events accurately based on scheduledFor timestamp", () => {
    const referenceNow = new Date("2026-08-01T00:00:00Z").getTime();

    const upcoming = sampleEvents.filter(
      (e) => new Date(e.scheduledFor).getTime() >= referenceNow
    );
    const past = sampleEvents.filter(
      (e) => new Date(e.scheduledFor).getTime() < referenceNow
    );

    expect(upcoming).toHaveLength(2);
    expect(past).toHaveLength(1);
    expect(past[0].title).toBe("Inaugural Leadership Cohort 2025");
  });

  it("formats ticket price strings in Ghanaian Cedis (GHS)", () => {
    const formatPrice = (isFree: boolean, priceGhs: number) => {
      if (isFree || priceGhs === 0) return "Free Admission";
      return `GHS ${(priceGhs / 100).toFixed(2)}`;
    };

    expect(formatPrice(sampleEvents[0].isFree, sampleEvents[0].priceGhs)).toBe(
      "Free Admission"
    );
    expect(formatPrice(sampleEvents[1].isFree, sampleEvents[1].priceGhs)).toBe(
      "GHS 50.00"
    );
  });
});
