export type ImageCategory =
  | "Home Page"
  | "About Page"
  | "Programs & Pathways"
  | "Team & Leadership"
  | "Brand & Navigation";

export type SiteImageDefinition = {
  key: string;
  category: ImageCategory;
  label: string;
  description: string;
  defaultSrc: string;
  defaultAlt: string;
  aspectRatio: string;
};

export const SITE_IMAGE_SLOTS: SiteImageDefinition[] = [
  // Home Page
  {
    key: "home_hero",
    category: "Home Page",
    label: "Home: Hero Main Banner",
    description: "The primary bold hero portrait displayed at the top of the homepage.",
    defaultSrc: "/ybi-assets/homepage/ybi-hero.jpg",
    defaultAlt: "Young Beginners Inspiration community members engaged in collaborative learning",
    aspectRatio: "16:9",
  },
  {
    key: "home_about_rotator_1",
    category: "Home Page",
    label: "Home: About Carousel (Slide 1 - Speaking)",
    description: "First rotating image in the Homepage 'About' section interactive photo frame.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "Young people taking part in a Young Beginners Inspiration learning session",
    aspectRatio: "16:10",
  },
  {
    key: "home_about_rotator_2",
    category: "Home Page",
    label: "Home: About Carousel (Slide 2 - Dialogue)",
    description: "Second rotating image in the Homepage 'About' section interactive photo frame.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "People taking part in an intergenerational Young Beginners Inspiration conversation",
    aspectRatio: "16:10",
  },
  {
    key: "home_about_rotator_3",
    category: "Home Page",
    label: "Home: About Carousel (Slide 3 - Enterprise)",
    description: "Third rotating image in the Homepage 'About' section interactive photo frame.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "A Young Beginners Inspiration participant developing an entrepreneurial idea",
    aspectRatio: "16:10",
  },
  {
    key: "home_wall_1",
    category: "Home Page",
    label: "Image Wall: Youth Leadership",
    description: "Row 1 image in the homepage community gallery marquee wall.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg",
    defaultAlt: "Young facilitator leading a community leadership workshop",
    aspectRatio: "4:3",
  },
  {
    key: "home_wall_2",
    category: "Home Page",
    label: "Image Wall: Mentoring & Collaboration",
    description: "Row 1 image showing intergenerational mentoring in the gallery wall.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-intergenerational-mentoring.jpg",
    defaultAlt: "Intergenerational mentoring around a practical project",
    aspectRatio: "4:3",
  },
  {
    key: "home_wall_3",
    category: "Home Page",
    label: "Image Wall: Youth Entrepreneurship",
    description: "Row 2 image highlighting young enterprise and problem-solving.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-entrepreneurship.jpg",
    defaultAlt: "Community members developing an entrepreneurship idea",
    aspectRatio: "4:3",
  },
  {
    key: "home_wall_4",
    category: "Home Page",
    label: "Image Wall: Public Speaking",
    description: "Row 2 image showcasing communication, confidence, and voice.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-public-speaking.jpg",
    defaultAlt: "Young participant practicing public speaking",
    aspectRatio: "4:3",
  },
  {
    key: "home_wall_5",
    category: "Home Page",
    label: "Image Wall: Community Circle",
    description: "Row 3 image showing collective outdoor dialogue and reflection.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-community-circle.jpg",
    defaultAlt: "An outdoor intergenerational community circle",
    aspectRatio: "4:3",
  },
  {
    key: "home_wall_6",
    category: "Home Page",
    label: "Image Wall: Youth Innovation Sprint",
    description: "Row 3 image highlighting project creation and peer collaboration.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "Young participants collaborating during an innovation sprint",
    aspectRatio: "4:3",
  },
  {
    key: "home_community_action",
    category: "Home Page",
    label: "Home: Community Action Feature",
    description: "Featured image for the homepage civic action and mentorship highlight block.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "Young leaders and community elders collaborating outdoors",
    aspectRatio: "16:9",
  },

  // About Page
  {
    key: "about_story_main",
    category: "About Page",
    label: "About Story Hero Visual",
    description: "Large featured image illustrating the YBI origin story and mission.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "YBI community members gathered together",
    aspectRatio: "16:9",
  },
  {
    key: "about_mentoring",
    category: "About Page",
    label: "About: Guided Mentorship",
    description: "Image paired with the leadership and mentorship principles section.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "Participant receiving guidance in a structured workshop",
    aspectRatio: "4:3",
  },
  {
    key: "about_enterprise",
    category: "About Page",
    label: "About: Enterprise & Creativity",
    description: "Visual showcasing creative innovation, practical skills, and youth action.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "Learners demonstrating a creative team solution",
    aspectRatio: "4:3",
  },
  {
    key: "about_quote_band",
    category: "About Page",
    label: "About: Quote Band Background",
    description: "Full-width photographic background behind the inspirational community quote.",
    defaultSrc: "/ybi-assets/homepage/ybi-hero.jpg",
    defaultAlt: "YBI learners in dynamic learning session",
    aspectRatio: "21:9",
  },

  // Programs & Pathways
  {
    key: "program_public_speaking",
    category: "Programs & Pathways",
    label: "Program: Public Speaking & Expression",
    description: "Visual for the communication, confidence, and public speaking pathway.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "Young person speaking with confidence in front of peers",
    aspectRatio: "4:3",
  },
  {
    key: "program_entrepreneurship",
    category: "Programs & Pathways",
    label: "Program: Youth Entrepreneurship",
    description: "Visual for the business foundations and practical enterprise cohort.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "Students pitching ideas in an enterprise sprint",
    aspectRatio: "4:3",
  },
  {
    key: "program_community",
    category: "Programs & Pathways",
    label: "Program: Generations in Conversation",
    description: "Visual for structured intergenerational dialogue and mentorship cohorts.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "Group of youth and elders in guided mentorship dialogue",
    aspectRatio: "4:3",
  },
  {
    key: "program_leadership",
    category: "Programs & Pathways",
    label: "Program: Values-Led Leadership Lab",
    description: "Visual for ethical leadership, character development, and stewardship circles.",
    defaultSrc: "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg",
    defaultAlt: "Young leader facilitating a values-based community session",
    aspectRatio: "4:3",
  },

  // Team & Leadership
  {
    key: "team_banner",
    category: "Team & Leadership",
    label: "Team Main Banner",
    description: "Top banner visual for the team, mentors, and leadership page.",
    defaultSrc: "/ybi-assets/homepage/ybi-hero.jpg",
    defaultAlt: "YBI team leaders and mentors in action",
    aspectRatio: "16:9",
  },
  {
    key: "team_public_speaking",
    category: "Team & Leadership",
    label: "Team Pillar: Mentorship Lead",
    description: "Visual for the mentorship leadership and learning coaches section.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "Mentorship coach working with young participants",
    aspectRatio: "4:3",
  },
  {
    key: "team_entrepreneurship",
    category: "Team & Leadership",
    label: "Team Pillar: Innovation Lead",
    description: "Visual for the innovation, robotics, and entrepreneurship coaches.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "STEAM mentor guiding student project",
    aspectRatio: "4:3",
  },
  {
    key: "team_community",
    category: "Team & Leadership",
    label: "Team Pillar: Community Lead",
    description: "Visual for community engagement and partnership coordinators.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "Community coordinator facilitating dialogue",
    aspectRatio: "4:3",
  },

  // Brand & Navigation
  {
    key: "brand_logo",
    category: "Brand & Navigation",
    label: "Primary YBI Logo",
    description: "Header navigation logo and principal organisation emblem.",
    defaultSrc: "/ybi-assets/brand/ybi-logo.png",
    defaultAlt: "Young Beginners Inspiration Logo",
    aspectRatio: "3:2",
  },
  {
    key: "brand_mark",
    category: "Brand & Navigation",
    label: "Circular YBI Brand Mark",
    description: "Compact brand icon used for mobile navigation and social cards.",
    defaultSrc: "/ybi-assets/brand/ybi-mark.png",
    defaultAlt: "Young Beginners Inspiration Mark",
    aspectRatio: "1:1",
  },
  {
    key: "assistant_avatar",
    category: "Brand & Navigation",
    label: "AI Assistant Header Avatar",
    description: "Avatar displayed inside the AI assistant chat header card.",
    defaultSrc: "/ybi-assets/brand/ybi-logo.png",
    defaultAlt: "YBI AI Assistant",
    aspectRatio: "1:1",
  },

  // Media & Platform Stories (/media)
  {
    key: "media_story_1",
    category: "Media & Platform Stories",
    label: "Platform Story 1: Leadership (Start with the room you are in)",
    description: "Featured visual for Story 01 on the Media & Platform Stories page.",
    defaultSrc: "/ybi-assets/community/ybi-community.jpg",
    defaultAlt: "People taking part in an intergenerational Young Beginners Inspiration conversation",
    aspectRatio: "16:10",
  },
  {
    key: "media_story_2",
    category: "Media & Platform Stories",
    label: "Platform Story 2: Entrepreneurship (An idea becomes useful when it serves)",
    description: "Featured visual for Story 02 on the Media & Platform Stories page.",
    defaultSrc: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    defaultAlt: "Participants developing an entrepreneurial idea together",
    aspectRatio: "16:10",
  },
  {
    key: "media_story_3",
    category: "Media & Platform Stories",
    label: "Platform Story 3: Public Speaking (Your voice gets stronger in practice)",
    description: "Featured visual for Story 03 on the Media & Platform Stories page.",
    defaultSrc: "/ybi-assets/programs/ybi-public-speaking.jpg",
    defaultAlt: "A participant presenting to a Young Beginners Inspiration group",
    aspectRatio: "16:10",
  },
];

export const SITE_IMAGE_PREFIX = "ybi_site_image_";

export function formatImageContentKey(slotKey: string): string {
  return `${SITE_IMAGE_PREFIX}${slotKey}`;
}

export function extractSlotKeyFromContentKey(contentKey: string): string | null {
  if (contentKey.startsWith(SITE_IMAGE_PREFIX)) {
    return contentKey.slice(SITE_IMAGE_PREFIX.length);
  }
  if (contentKey.startsWith("site-image:")) {
    return contentKey.slice("site-image:".length);
  }
  return null;
}
