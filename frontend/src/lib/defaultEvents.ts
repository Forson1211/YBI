export interface PublicEventItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  scheduledFor: string | Date;
  location: string;
  capacity: number | null;
  isFree: boolean;
  priceGhs: number;
  status?: string;
}

// Generate stable future dates so events always appear in the upcoming calendar
const now = Date.now();
const DAY_MS = 86400000;

export const DEFAULT_EVENTS: PublicEventItem[] = [
  {
    id: 1,
    slug: "public-speaking-masterclass-2026",
    title: "Public Speaking & Youth Voice Masterclass",
    description:
      "A hands-on intensive workshop designed to build stage confidence, debate rhetoric, vocal modulation, and storytelling power for young emerging leaders.",
    imageUrl: "/ybi-assets/programs/ybi-public-speaking.jpg",
    scheduledFor: new Date(now + DAY_MS * 14).toISOString(),
    location: "Accra Community Center & Virtual Stream",
    capacity: 50,
    isFree: true,
    priceGhs: 0,
    status: "published",
  },
  {
    id: 2,
    slug: "generations-in-conversation-summit",
    title: "Generations in Conversation: Annual Youth-Elder Summit",
    description:
      "An inspiring intergenerational gathering bridging youth innovators and experienced community elders for dialogue, mentorship pairing, and legacy building.",
    imageUrl: "/ybi-assets/community/ybi-community.jpg",
    scheduledFor: new Date(now + DAY_MS * 28).toISOString(),
    location: "YBI Main Auditorium, East Legon, Accra",
    capacity: 100,
    isFree: false,
    priceGhs: 5000,
    status: "published",
  },
  {
    id: 3,
    slug: "youth-enterprise-pitch-lab",
    title: "Youth Enterprise & Venture Pitch Lab",
    description:
      "Practical business modeling, market validation, and pitch coaching for aspiring entrepreneurs aged 16-30.",
    imageUrl: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    scheduledFor: new Date(now + DAY_MS * 45).toISOString(),
    location: "YBI Innovation Hub, Kumasi & Online",
    capacity: 40,
    isFree: true,
    priceGhs: 0,
    status: "published",
  },
];
