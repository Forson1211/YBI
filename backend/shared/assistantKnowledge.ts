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
        "**Young Beginners Inspiration (YBI)** is a nonprofit organization dedicated to inspiring, motivating, and impacting the developing potential of individuals across **leadership, education, and business**.\n\nWe provide an empowering intergenerational platform where youth and older adults inspire one another, build practical skills, and lead lasting positive change in their communities.",
      guidance,
    };
  }

  if (/(vision|what.*vision|goal)/.test(query)) {
    return {
      answer:
        "**YBI Vision Statement**:\n\n> *\"To inspire, motivate, and impact the young, aged, and developing potential of individuals across leadership, education, and business—building a world where every generation thrives and leads together.\"*",
      guidance,
    };
  }

  if (/(mission|what.*mission|purpose)/.test(query)) {
    return {
      answer:
        "**YBI Mission Statement**:\n\n> *\"To provide an empowering intergenerational platform that equips people of all ages with practical skills, mentorship, and opportunities to become responsible leaders who create lasting positive change.\"*",
      guidance,
    };
  }

  if (/(value|values|principle|principles|core value|what guides)/.test(query)) {
    return {
      answer:
        "**YBI Core Values**:\n\n1. **Intergenerational Exchange**: Wisdom and possibility move in both directions between youth and elders.\n2. **Integrity & Responsibility**: Measuring leadership by its trustworthy impact on others.\n3. **Inclusive Opportunity**: Welcoming spaces where people of every background have room to begin.\n4. **Practical Action**: Turning curiosity and ideas into tangible skills and real-world solutions.\n5. **Community Care**: Mutual respect, active listening, and collective growth across generations.",
      guidance,
    };
  }

  if (/(story|history|found|how.*start|background|why.*founded)/.test(query)) {
    return {
      answer:
        "**Our Story & History**:\n\nYoung Beginners Inspiration was founded on a simple conviction: **potential needs a platform**, and every person—regardless of age—carries something invaluable to share. Recognizing that emerging youth often lack accessible guidance while older adults have rich lived experience left untapped, YBI was created to bridge this divide.\n\nWhat started as grassroots community circles and speaking workshops has grown into an impactful movement connecting learners, mentors, and changemakers across leadership, education, public speaking, and entrepreneurship.",
      guidance,
    };
  }

  if (/(impact|stat|stats|statistics|number|numbers|metric|metrics|reach|result)/.test(query)) {
    return {
      answer:
        "**YBI Key Impact Numbers**:\n\n- **1,250+** Youth & Community Members Reached\n- **500+** Hours of Dedicated Mentorship Completed\n- **35+** Interactive Workshops, Labs & Speaking Circles\n- **15+** Partner Communities, Schools & Hubs Engaged",
      guidance,
    };
  }

  if (/(which program|what program|explore program|all program|programs|programme)/.test(query)) {
    return {
      answer:
        "YBI offers four signature programs designed to build skills, confidence, and community impact:\n\n1. **Public Speaking & Communication**: Master vocal presence, speech crafting, debate, and delivery confidence.\n2. **Youth Entrepreneurship & Enterprise**: Transform meaningful ideas into viable ventures through ideation, business modeling, and pitch coaching.\n3. **Generations in Conversation**: Flagship intergenerational mentorship pairing youth ambition with elder wisdom.\n4. **Values-Led Leadership Lab**: Develop self-awareness, ethical decision-making, and community stewardship.\n\nExplore our Programs page to learn more about joining an upcoming cohort!",
      guidance,
    };
  }

  if (/(public speak|speak|presentation|presenting|speech|voice|confidence)/.test(query)) {
    return {
      answer:
        "Our **Public Speaking & Communication Program** equips participants with the art of impactful communication, debate, and confident presentation. It covers vocal delivery, message structuring, overcoming stage anxiety, and storytelling.",
      guidance,
    };
  }

  if (/(entrepreneur|enterprise|business idea|startup|start-up|start up|venture)/.test(query)) {
    return {
      answer:
        "The **Youth Entrepreneurship & Enterprise Program** trains emerging changemakers in business fundamentals, problem validation, financial literacy, venture prototyping, and pitching ideas into actionable community solutions.",
      guidance,
    };
  }

  if (/(intergenerational|generation|older adult|senior|aged|elder|mentor|mentorship)/.test(query)) {
    return {
      answer:
        "**Generations in Conversation** is our signature intergenerational mentorship program.\n\n- **Who it serves**: Emerging youth, early-career strivers, and older adults/retirees.\n- **How it works**: Structured dialogue circles and 1-on-1 pairings meeting for life coaching, skill-sharing, and community action.\n- **The Experience**: Mentees gain trusted guidance and confidence, while mentors discover renewed purpose and fresh youth perspectives.",
      guidance,
    };
  }

  if (/(testimonial|success story|review|feedback|what people say)/.test(query)) {
    return {
      answer:
        "**Community Voices**:\n\n- *\"YBI gave me the courage to speak up and trust my ideas. Having a mentor who genuinely listened changed my entire outlook.\"* — Kofi A., Mentee\n- *\"Mentoring with YBI showed me how much the next generation has to teach us. It’s a true two-way exchange of wisdom.\"* — Evelyn D., Senior Mentor\n- *\"The practical confidence and values-led focus YBI instills in young people is transforming our community.\"* — Marcus T., Partner",
      guidance,
    };
  }

  if (/(volunteer|partner|sponsor|donate|support|join|participate|how.*join|get involved)/.test(query)) {
    return {
      answer:
        "We'd love to have you join the YBI movement! You can get involved in several ways:\n\n- **Participate**: Enroll in a speaking, entrepreneurship, or leadership cohort.\n- **Mentor & Volunteer**: Share your lived experience and guide aspiring leaders.\n- **Partner**: Collaborate with us as a school, civic organization, or sponsor.\n\nVisit our **Join Us** page or message us directly via the **Contact Us** page.",
      guidance,
    };
  }

  if (/(focus area|pillar|leadership|education|business)/.test(query)) {
    return {
      answer:
        "YBI's work is anchored on five interconnected focus areas:\n\n- **Leadership**: Building values-based, empathetic, and responsible leaders.\n- **Education**: Hands-on learning that translates into life readiness.\n- **Business & Entrepreneurship**: Creating economic capability and problem-solving skills.\n- **Public Speaking**: Inspiring voices to be heard clearly in society.\n- **Intergenerational Mentorship**: Bridging youth energy with elder wisdom.",
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
        "YBI is guided by dedicated mentors, educators, and community leaders:\n\n- **Executive Director & Founder**: Vision and strategic direction.\n- **Programs & Curriculum Lead**: Experiential learning and cohort design.\n- **Mentorship & Community Lead**: Intergenerational pairings and gatherings.\n- **Enterprise & Venture Coaches**: Mentoring youth startups and community projects.\n\nVisit our **Team** page to meet our leadership!",
      guidance,
    };
  }

  if (/(hello|hi|hey|good morning|good afternoon|good evening)/.test(query)) {
    return {
      answer:
        "Hello! Welcome to Young Beginners Inspiration. I'm here to help you discover our vision, programs, mentorship opportunities, and ways to get involved. How can I guide you today?",
      guidance,
    };
  }

  return {
    answer:
      "Young Beginners Inspiration (YBI) creates spaces for people to be inspired, learn practical leadership, and shape positive futures through Public Speaking, Entrepreneurship, and Intergenerational Mentorship. How can I assist you today?",
    guidance,
  };
}
