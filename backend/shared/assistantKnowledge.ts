import { getAssistantProgramLinks, type AssistantGuidanceLink } from "./assistantProgramLinks";

export type AssistantResult = {
  answer: string;
  guidance: AssistantGuidanceLink[];
};

export function getYbiKnowledgeResponse(question: string, page: string = "/"): AssistantResult {
  const query = question.toLowerCase().trim();
  const guidance = getAssistantProgramLinks(query);

  if (/(what.*ybi|who.*ybi|tell me about|about ybi|what do you do|what is ybi|overview)/.test(query)) {
    return {
      answer:
        "**Young Beginners Inspiration (YBI)** is a nonprofit organization dedicated to empowering young people, older adults, and developing talent to become responsible leaders.\n\nWe provide spaces for inspiration, practical training, and intergenerational dialogue through 5 core focus pillars: **Leadership**, **Education**, **Business**, **Public Speaking**, and **Entrepreneurship**.",
      guidance,
    };
  }

  if (/(which program|what program|explore program|all program|programs|programme)/.test(query)) {
    return {
      answer:
        "YBI offers three signature programs designed to build skills, confidence, and community impact:\n\n1. **Public Speaking**: Develop voice, stage presence, speech crafting, and communication confidence.\n2. **Entrepreneurship**: Turn useful ideas into practical ventures, sustainable initiatives, and solutions.\n3. **Generations in Conversation**: Intergenerational dialogue bridging youth energy with the lived experience of seniors.\n\nExplore our Programs page to learn more about each track!",
      guidance,
    };
  }

  if (/(public speak|speak|presentation|presenting|speech|voice|confidence)/.test(query)) {
    return {
      answer:
        "Our **Public Speaking Program** equips participants with the art of impactful communication, debate, and confident presentation. It covers vocal delivery, message structuring, overcoming stage anxiety, and storytelling.",
      guidance,
    };
  }

  if (/(entrepreneur|enterprise|business idea|startup|start-up|start up|venture)/.test(query)) {
    return {
      answer:
        "The **Entrepreneurship Program** trains emerging changemakers in business fundamentals, ideation, market validation, financial literacy, and pitching ideas into actionable ventures.",
      guidance,
    };
  }

  if (/(intergenerational|generation|older adult|senior|aged|elder|mentor|mentorship)/.test(query)) {
    return {
      answer:
        "**Generations in Conversation** is our flagship intergenerational program. It creates collaborative exchange circles where young beginners learn from older adults' life lessons, and seniors gain fresh digital and community perspectives.",
      guidance,
    };
  }

  if (/(volunteer|partner|sponsor|donate|support|join|participate|how.*join|get involved)/.test(query)) {
    return {
      answer:
        "We'd love to have you join the YBI movement! You can get involved in several ways:\n\n- **Participate**: Enroll in one of our programs.\n- **Volunteer & Mentor**: Share your skills and guide aspiring leaders.\n- **Partner**: Collaborate with us as an educational, community, or corporate partner.\n\nVisit our **Join Us** page or reach out directly on the **Contact Us** page.",
      guidance,
    };
  }

  if (/(focus area|pillar|leadership|education|business)/.test(query)) {
    return {
      answer:
        "YBI's work is anchored on five interconnected focus areas:\n\n- **Leadership**: Building values-based, empathetic, and responsible leaders.\n- **Education**: Hands-on learning that translates into life readiness.\n- **Business & Entrepreneurship**: Creating economic independence and problem-solving skills.\n- **Public Speaking**: Inspiring voices to be heard clearly in society.",
      guidance,
    };
  }

  if (/(contact|email|phone|reach|message|talk to|office|location|address)/.test(query)) {
    return {
      answer:
        "You can connect directly with the YBI team through our **Contact Us** page. Fill out our contact form or send us an inquiry, and a member of our team will get back to you promptly!",
      guidance,
    };
  }

  if (/(media|news|story|stories|gallery|photo|picture|event|update)/.test(query)) {
    return {
      answer:
        "You can explore our journey, impact stories, press releases, and photo galleries on the **Media & Stories** and **Photo Gallery** pages!",
      guidance,
    };
  }

  if (/(team|founder|who runs|board|leadership team|staff)/.test(query)) {
    return {
      answer:
        "YBI is guided by dedicated mentors, educators, and community leaders committed to unlocking human potential. Visit our **About** and **Team** pages to meet our leadership and explore our mission.",
      guidance,
    };
  }

  if (/(hello|hi|hey|good morning|good afternoon|good evening)/.test(query)) {
    return {
      answer:
        "Hello! Welcome to Young Beginners Inspiration. I'm here to help you discover our programs, focus areas, and ways to get involved. How can I guide you today?",
      guidance,
    };
  }

  return {
    answer:
      "Young Beginners Inspiration (YBI) creates spaces for people to be inspired, learn practical leadership, and shape positive futures. You can explore our signature programs (Public Speaking, Entrepreneurship, Generations in Conversation) or message the YBI team through Contact Us.",
    guidance,
  };
}
