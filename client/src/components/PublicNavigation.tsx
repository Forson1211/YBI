import { ArrowUpRight } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type DropdownLink = {
  label: string;
  description: string;
  href: string;
};

type PublicNavItem = {
  label: string;
  href: string;
  items?: DropdownLink[];
};

export const publicNavItems: PublicNavItem[] = [
  {
    label: "About",
    href: "/about",
    items: [
      { label: "Who we are", description: "Our purpose and intergenerational approach.", href: "/about" },
      { label: "Vision & mission", description: "The difference we are working toward.", href: "/about" },
      { label: "Our approach", description: "How learning becomes shared progress.", href: "/about" },
    ],
  },
  {
    label: "Focus Areas",
    href: "/focus-areas",
    items: [
      { label: "Leadership", description: "Responsible influence for everyday life.", href: "/focus-areas" },
      { label: "Education", description: "Practical, active learning together.", href: "/focus-areas" },
      { label: "Business", description: "Useful ideas built with integrity.", href: "/focus-areas" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    items: [
      { label: "Public speaking", description: "Voice, presence, and courage in practice.", href: "/programs" },
      { label: "Entrepreneurship", description: "Turn a meaningful idea into a beginning.", href: "/programs" },
      { label: "Generations in conversation", description: "Exchange insight across lived experience.", href: "/programs" },
    ],
  },
  {
    label: "Join Us",
    href: "/join-us",
    items: [
      { label: "Participate", description: "Learn, practise, and meet the platform.", href: "/join-us" },
      { label: "Mentor", description: "Share experience with an emerging leader.", href: "/join-us" },
      { label: "Partner", description: "Build opportunities and resources with us.", href: "/join-us" },
    ],
  },
  {
    label: "Media",
    href: "/media",
    items: [
      { label: "Platform stories", description: "Notes and reflections from the YBI community.", href: "/media" },
      { label: "Stay connected", description: "Find the next invitation and update.", href: "/media" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
];

export default function PublicNavigation({ menuOpen, onNavigate }: { menuOpen: boolean; onNavigate: () => void }) {
  return (
    <nav className={`reference-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
      <div className="reference-nav-desktop">
        <NavigationMenu viewport={false} className="ybi-navigation-menu">
          <NavigationMenuList className="ybi-navigation-list">
            {publicNavItems.map((item) => (
              <NavigationMenuItem key={item.label}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="ybi-nav-trigger">{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="ybi-nav-dropdown">
                      {item.items.map((link) => (
                        <NavigationMenuLink asChild key={link.label}>
                          <a className="ybi-dropdown-link" href={link.href}>
                            <span><strong>{link.label}</strong><small>{link.description}</small></span>
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </a>
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <a className="ybi-nav-link" href={item.href}>{item.label}</a>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="reference-nav-mobile">
        {publicNavItems.map((item) => (
          <div className="mobile-nav-group" key={item.label}>
            <a className="mobile-nav-parent" href={item.href} onClick={onNavigate}>{item.label}</a>
            {item.items ? <div className="mobile-nav-submenu">{item.items.map((link) => <a href={link.href} key={link.label} onClick={onNavigate}>{link.label}</a>)}</div> : null}
          </div>
        ))}
      </div>
    </nav>
  );
}
