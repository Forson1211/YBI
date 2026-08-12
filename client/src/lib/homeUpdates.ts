export type HomepageUpdateCard = {
  category: string;
  title: string;
  source: string;
  detail: string;
  media: Array<{ src: string; alt: string }>;
};

const ybiUpdateMedia = [
  { src: "/manus-storage/ybi-community_b2ad3c56.jpg", alt: "People taking part in an intergenerational Young Beginners Inspiration conversation" },
  { src: "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg", alt: "Participants developing an entrepreneurial idea together" },
  { src: "/manus-storage/ybi-public-speaking_08161e85.jpg", alt: "A participant presenting to a Young Beginners Inspiration group" },
];

export const homepageUpdates: HomepageUpdateCard[] = [
  {
    category: "Leadership",
    title: "Start with the room you are in",
    source: "YBI platform",
    detail: "Leadership note",
    media: ybiUpdateMedia,
  },
  {
    category: "Entrepreneurship",
    title: "An idea becomes useful when it serves",
    source: "YBI platform",
    detail: "Enterprise note",
    media: [...ybiUpdateMedia.slice(1), ybiUpdateMedia[0]],
  },
  {
    category: "Public speaking",
    title: "Your voice gets stronger in practice",
    source: "YBI platform",
    detail: "Voice note",
    media: [...ybiUpdateMedia.slice(2), ...ybiUpdateMedia.slice(0, 2)],
  },
];
