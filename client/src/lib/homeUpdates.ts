export type HomepageUpdateCard = {
  category: string;
  title: string;
  summary: string;
  source: string;
  detail: string;
  image: string;
  imageAlt: string;
};

export const homepageUpdates: HomepageUpdateCard[] = [
  {
    category: "Leadership",
    title: "Start with the room you are in",
    summary: "Leadership takes root when people listen, accept responsibility, and make space for the next person to contribute.",
    source: "YBI platform",
    detail: "Leadership note",
    image: "/manus-storage/ybi-community_b2ad3c56.jpg",
    imageAlt: "People taking part in an intergenerational Young Beginners Inspiration conversation",
  },
  {
    category: "Entrepreneurship",
    title: "An idea becomes useful when it serves",
    summary: "A practical idea becomes meaningful when it responds to a need, builds skills, and creates value for others.",
    source: "YBI platform",
    detail: "Enterprise note",
    image: "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg",
    imageAlt: "Participants developing an entrepreneurial idea together",
  },
  {
    category: "Public speaking",
    title: "Your voice gets stronger in practice",
    summary: "Confidence grows through guided practice, constructive feedback, and the courage to speak in front of others.",
    source: "YBI platform",
    detail: "Voice note",
    image: "/manus-storage/ybi-public-speaking_08161e85.jpg",
    imageAlt: "A participant presenting to a Young Beginners Inspiration group",
  },
];
