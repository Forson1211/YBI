export type AssistantGuidanceLink = {
  label: string;
  href: string;
  description: string;
};

const programLinks = {
  publicSpeaking: {
    label: "Public Speaking",
    href: "/programs#public-speaking",
    description: "Build voice, presence, and confidence",
  },
  entrepreneurship: {
    label: "Entrepreneurship",
    href: "/programs#entrepreneurship",
    description: "Turn a useful idea into practical action",
  },
  generations: {
    label: "Generations in Conversation",
    href: "/programs#generations",
    description: "Learn across generations through shared exchange",
  },
} satisfies Record<string, AssistantGuidanceLink>;

const focusLinks = {
  leadership: {
    label: "Leadership focus",
    href: "/focus-areas#leadership",
    description: "Explore responsible leadership at YBI",
  },
  education: {
    label: "Education focus",
    href: "/focus-areas#education",
    description: "See how learning becomes practical confidence",
  },
  business: {
    label: "Business focus",
    href: "/focus-areas#business",
    description: "Explore business, ideas, and problem-solving",
  },
} satisfies Record<string, AssistantGuidanceLink>;

const commonLinks = {
  about: { label: "About YBI", href: "/about", description: "Our purpose and approach" },
  programs: { label: "Explore programs", href: "/programs", description: "Practical ways to learn and lead" },
  join: { label: "Join YBI", href: "/join-us", description: "Take part, volunteer, or partner" },
  contact: { label: "Contact YBI", href: "/contact", description: "Send the team a direct message" },
  stories: { label: "YBI stories", href: "/media#stories", description: "Read community stories and updates" },
  gallery: { label: "Photo gallery", href: "/gallery", description: "See YBI moments in pictures" },
} satisfies Record<string, AssistantGuidanceLink>;

/** Returns no more than three direct next steps chosen from the visitor's latest question. */
export function getAssistantProgramLinks(question: string): AssistantGuidanceLink[] {
  const query = question.toLowerCase();

  if (/(public speaking|presentation|presenting|speak|speaking|voice|confidence)/.test(query)) {
    return [programLinks.publicSpeaking, focusLinks.leadership];
  }

  if (/(entrepreneur|enterprise|start.?up|business idea|business|idea)/.test(query)) {
    return [programLinks.entrepreneurship, focusLinks.business];
  }

  if (/(intergenerational|generation|older adult|older people|aged|senior|mentor)/.test(query)) {
    return [programLinks.generations, commonLinks.join];
  }

  if (/(program|programme|which.*explore|what.*offer)/.test(query)) {
    return [programLinks.publicSpeaking, programLinks.entrepreneurship, programLinks.generations];
  }

  if (/(leadership|leader|lead)/.test(query)) {
    return [focusLinks.leadership, programLinks.publicSpeaking];
  }

  if (/(education|learn|learning|training|study)/.test(query)) {
    return [focusLinks.education, commonLinks.programs];
  }

  if (/(volunteer|partner|donat|support|join|participate)/.test(query)) {
    return [commonLinks.join, commonLinks.programs];
  }

  if (/(gallery|photo|media|story|news)/.test(query)) {
    return [commonLinks.stories, commonLinks.gallery];
  }

  if (/(contact|message|email|talk)/.test(query)) {
    return [commonLinks.contact, commonLinks.join];
  }

  return [commonLinks.about, commonLinks.programs];
}
