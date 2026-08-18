export type FooterNavigationGroup = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export const footerNavigation: FooterNavigationGroup[] = [
  {
    title: "Organization",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Focus Areas", href: "/focus-areas" },
      { label: "Core Programs", href: "/programs" },
    ],
  },
  {
    title: "Participation",
    links: [
      { label: "Upcoming Events", href: "/events" },
      { label: "YBI Journal & Stories", href: "/blog" },
      { label: "Make a Donation", href: "/get-involved#donate" },
      { label: "Volunteer / Mentor", href: "/get-involved#volunteer" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { label: "Frequently Asked Questions", href: "/faq" },
      { label: "Contact YBI", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "YBI Journal", href: "/blog" },
      { label: "Events Calendar", href: "/events" },
      { label: "Photo Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Make an Impact",
    links: [
      { label: "Donate to YBI", href: "/get-involved#donate" },
      { label: "Mentor with YBI", href: "/get-involved#volunteer" },
      { label: "View Events Calendar", href: "/events" },
    ],
  },
];

export const footerImpactActions = [
  { label: "Donate to YBI", href: "/get-involved#donate" },
  { label: "Mentor with YBI", href: "/get-involved#volunteer" },
  { label: "View Events Calendar", href: "/events" },
];


