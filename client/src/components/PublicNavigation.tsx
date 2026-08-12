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
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Our Approach", href: "/about" },
    ],
  },
  {
    label: "Focus Areas",
    href: "/focus-areas",
    items: [
      { label: "Leadership", href: "/focus-areas" },
      { label: "Education", href: "/focus-areas" },
      { label: "Business", href: "/focus-areas" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    items: [
      { label: "Public Speaking", href: "/programs" },
      { label: "Entrepreneurship", href: "/programs" },
      { label: "Generations in Conversation", href: "/programs" },
    ],
  },
  {
    label: "Join Us",
    href: "/join-us",
    items: [
      { label: "Participate", href: "/join-us" },
      { label: "Mentor", href: "/join-us" },
      { label: "Partner", href: "/join-us" },
    ],
  },
  {
    label: "Media",
    href: "/media",
    items: [
      { label: "Platform Stories", href: "/media" },
      { label: "Stay Connected", href: "/media" },
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
                            {link.label}
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
