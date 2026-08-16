export type FooterNavigationGroup = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export const footerNavigation: FooterNavigationGroup[] = [
  {
    title: "Explore",
    links: [
      { label: "About us", href: "/about" },
      { label: "Focus areas", href: "/focus-areas" },
      { label: "Programs", href: "/programs" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Volunteer", href: "/join-us#volunteer" },
      { label: "Partner with us", href: "/join-us#partner" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Our team", href: "/team" },
      { label: "Gallery", href: "/gallery" },
      { label: "Latest updates", href: "/media#stories" },
      { label: "Newsletter", href: "/media#newsletter" },
    ],
  },
];

export const footerImpactActions = [
  { label: "Volunteer with YBI", href: "/join-us#volunteer" },
  { label: "Explore programs", href: "/programs" },
];
