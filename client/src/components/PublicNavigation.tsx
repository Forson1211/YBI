import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { Link } from "wouter";

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
      { label: "Our Approach", href: "/about#approach" },
    ],
  },
  {
    label: "Focus Areas",
    href: "/focus-areas",
    items: [
      { label: "Leadership", href: "/focus-areas#leadership" },
      { label: "Education", href: "/focus-areas#education" },
      { label: "Business", href: "/focus-areas#business" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    items: [
      { label: "Public Speaking", href: "/programs#public-speaking" },
      { label: "Entrepreneurship", href: "/programs#entrepreneurship" },
      { label: "Generations in Conversation", href: "/programs#generations" },
    ],
  },
  {
    label: "Join Us",
    href: "/join-us",
    items: [
      { label: "Participate", href: "/join-us#participate" },
      { label: "Mentor", href: "/join-us#volunteer" },
      { label: "Partner", href: "/join-us#partner" },
    ],
  },
  {
    label: "Media",
    href: "/media",
    items: [
      { label: "Platform Stories", href: "/media#stories" },
      { label: "Stay Connected", href: "/media#newsletter" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function getNextMobileSubmenu(current: string | null, target: string) {
  return current === target ? null : target;
}

export default function PublicNavigation({ menuOpen, onNavigate }: { menuOpen: boolean; onNavigate: () => void }) {
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen) setExpandedMobileItem(null);
  }, [menuOpen]);

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
                          <Link className="ybi-dropdown-link" href={link.href}>
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link className="ybi-nav-link" href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="reference-nav-mobile">
        {publicNavItems.map((item) => {
          const isExpanded = expandedMobileItem === item.label;
          const submenuId = `mobile-submenu-${item.label.toLowerCase().replaceAll(" ", "-")}`;

          return <div className="mobile-nav-group" key={item.label}>
            {item.items ? <>
              <button aria-controls={submenuId} aria-expanded={isExpanded} className="mobile-nav-parent" onClick={() => setExpandedMobileItem((current) => getNextMobileSubmenu(current, item.label))} type="button">
                {item.label}<span aria-hidden="true" />
              </button>
              <div aria-hidden={!isExpanded} className={`mobile-nav-submenu${isExpanded ? " is-expanded" : ""}`} id={submenuId}>
                {item.items.map((link) => <Link href={link.href} key={link.label} onClick={onNavigate}>{link.label}</Link>)}
              </div>
            </> : <Link className="mobile-nav-parent mobile-nav-direct-link" href={item.href} onClick={onNavigate}>{item.label}</Link>}
          </div>;
        })}
      </div>
    </nav>
  );
}
