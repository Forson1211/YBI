export interface PublicArticleItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  authorName: string;
  coverImageUrl: string | null;
  category: string;
  status: "published" | "draft";
  publishedAt: string | Date;
}

const now = Date.now();
const DAY_MS = 86400000;

export const DEFAULT_ARTICLES: PublicArticleItem[] = [
  {
    id: 1,
    slug: "power-of-intergenerational-dialogue",
    title: "The Transformative Power of Intergenerational Dialogue in African Communities",
    excerpt:
      "When youth ambition meets elder wisdom, sustainable community development accelerates. Here is what we learned from 500+ hours of mentorship circles.",
    body: `## Bridging Generations Through Intentional Conversation

In many modern societies, generational disconnects leave young people navigating complex careers and leadership paths without grounded elder wisdom, while experienced leaders lack direct touchpoints with youth energy.

At Young Beginners Inspiration (YBI), our **Generations in Conversation** initiative was created to shatter these silos. Rather than formal lectures, we curate structured peer-to-peer and small-group circles where both sides actively listen, challenge assumptions, and build enduring mutual respect.

### Key Takeaways from Our Recent Cohorts

1. **Listening Precedes Leadership:** Young leaders who listen to past community struggles develop higher contextual empathy.
2. **Mutual Learning:** Elders report feeling reinvigorated by the fresh perspectives, digital insights, and ethical curiosity of young mentees.
3. **Practical Legacy:** Mentorship is not just advice—it is the deliberate transfer of resilience, cultural values, and network access.

Join our upcoming events or volunteer as a mentor to take part in this expanding movement.`,
    authorName: "YBI Editorial Team",
    coverImageUrl: "/ybi-assets/community/ybi-community.jpg",
    category: "Mentorship",
    status: "published",
    publishedAt: new Date(now - DAY_MS * 3).toISOString(),
  },
  {
    id: 2,
    slug: "building-confidence-through-public-speaking",
    title: "Finding Your Voice: How Public Speaking Unlocks Leadership Potential",
    excerpt:
      "Mastering vocal presence, speech crafting, and active listening transforms shy participants into confident changemakers across schools and enterprises.",
    body: `## Voice as a Catalyst for Impact

Every impactful idea begins with the courage to articulate it clearly. In our public speaking workshops across Ghana, we consistently witness young individuals transition from hesitant observers to compelling communicators.

### The Three Pillars of the YBI Speech Lab

- **Authenticity over Performance:** Speaking with genuine conviction resonates far deeper than memorized rhetoric.
- **Structured Argumentation:** Learning how to frame a problem, back it with lived evidence, and offer actionable solutions.
- **Overcoming Stage Anxiety:** Practical breathwork and vocal drills that calm the nervous system before addressing any audience.

Whether preparing for a classroom debate, an entrepreneurial pitch, or civic advocacy, mastering the spoken word is one of the most transferable skills for the 21st century.`,
    authorName: "Kwame Mensah",
    coverImageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
    category: "Public Speaking",
    status: "published",
    publishedAt: new Date(now - DAY_MS * 10).toISOString(),
  },
  {
    id: 3,
    slug: "values-led-entrepreneurship-ghana",
    title: "Values-Led Entrepreneurship: Building Ventures with Community Roots",
    excerpt:
      "Why purpose-driven enterprise is key to youth employment and how YBI incubates sustainable, ethical business ideas.",
    body: `## Beyond Profit: The Rise of Ethical Enterprise

Entrepreneurship is often framed purely around rapid scale and valuation. However, in our communities, the most resilient enterprises are those solving fundamental local challenges—from educational access to sustainable agriculture.

### Guiding Principles for Young Founders

1. **Solve Real Pain Points:** Validate with actual community members before investing resources.
2. **Maintain Ethical Transparency:** Trust is the ultimate currency of any enduring organization.
3. **Reinvest in People:** Sustainable enterprises create dignified livelihoods and mentor the next generation.

Explore our youth entrepreneurship cohorts to learn how we support early-stage venture builders.`,
    authorName: "Ama Serwaa",
    coverImageUrl: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    category: "Entrepreneurship",
    status: "published",
    publishedAt: new Date(now - DAY_MS * 20).toISOString(),
  },
];
