export type HomepageUpdateCard = {
  category: string;
  title: string;
  source: string;
  detail: string;
  image: string;
  imageAlt: string;
};

export const homepageUpdates: HomepageUpdateCard[] = [
  {
    category: "Leadership",
    title: "Start with the room you are in",
    source: "YBI platform",
    detail: "Leadership note",
    image: "/manus-storage/ybi-community_b2ad3c56.jpg",
    imageAlt: "People taking part in an intergenerational Young Beginners Inspiration conversation",
  },
  {
    category: "Entrepreneurship",
    title: "An idea becomes useful when it serves",
    source: "YBI platform",
    detail: "Enterprise note",
    image: "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg",
    imageAlt: "Participants developing an entrepreneurial idea together",
  },
  {
    category: "Public speaking",
    title: "Your voice gets stronger in practice",
    source: "YBI platform",
    detail: "Voice note",
    image: "/manus-storage/ybi-public-speaking_08161e85.jpg",
    imageAlt: "A participant presenting to a Young Beginners Inspiration group",
  },
];
