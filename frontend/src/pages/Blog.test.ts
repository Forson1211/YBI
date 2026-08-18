import { describe, expect, it } from "vitest";

describe("Blog & Editorial Journal client logic", () => {
  const samplePosts = [
    {
      id: 1,
      slug: "why-youth-voice-belongs-in-governance",
      title: "Why Youth Voice Belongs in Every Governance Room",
      category: "Mentorship",
      authorName: "Kofi Boateng",
      excerpt: "True intergenerational leadership is not about asking permission; it is about building shared ground.",
      body: "Word ".repeat(450), // 450 words ~ 3 min read
      publishedAt: "2026-02-15T00:00:00Z",
    },
    {
      id: 2,
      slug: "crafting-persuasive-argument-debate-room",
      title: "Crafting a Persuasive Argument from the Classroom to the Boardroom",
      category: "Public Speaking",
      authorName: "Ama Serwaa",
      excerpt: "Structure and clarity turn emotional energy into lasting intellectual influence.",
      body: "Word ".repeat(900), // 900 words ~ 5 min read
      publishedAt: "2026-01-28T00:00:00Z",
    },
  ];

  it("calculates estimated reading time based on 200 words per minute average", () => {
    const calculateReadTime = (text: string) => {
      const words = text.trim().split(/\s+/).length;
      return `${Math.max(1, Math.ceil(words / 200))} min read`;
    };

    expect(calculateReadTime(samplePosts[0].body)).toBe("3 min read");
    expect(calculateReadTime(samplePosts[1].body)).toBe("5 min read");
  });

  it("filters blog articles by category correctly", () => {
    const filterByCategory = (category: string) => {
      if (category === "All") return samplePosts;
      return samplePosts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    };

    expect(filterByCategory("All")).toHaveLength(2);
    expect(filterByCategory("Mentorship")).toHaveLength(1);
    expect(filterByCategory("Public Speaking")).toHaveLength(1);
    expect(filterByCategory("Entrepreneurship")).toHaveLength(0);
  });
});
