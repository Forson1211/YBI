import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

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

export function getPublicPathname(href: string) {
  const pathname = href.split(/[?#]/, 1)[0] || "/";
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function isPublicRouteActive(href: string, currentLocation: string) {
  return getPublicPathname(href) === getPublicPathname(currentLocation);
}

export function isPublicNavItemActive(item: PublicNavItem, currentLocation: string) {
  return isPublicRouteActive(item.href, currentLocation) || item.items?.some((link) => isPublicRouteActive(link.href, currentLocation)) === true;
}

export default function PublicNavigation({ menuOpen, onNavigate }: { menuOpen: boolean; onNavigate: () => void }) {
  const [location] = useLocation();
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen) setExpandedMobileItem(null);
  }, [menuOpen]);

  return (
    <nav className={`reference-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
      <div className="reference-nav-desktop">
        <NavigationMenu viewport={false} className="ybi-navigation-menu">
          <NavigationMenuList className="ybi-navigation-list">
            {publicNavItems.map((item) => {
              const isItemActive = isPublicNavItemActive(item, location);

              return <NavigationMenuItem key={item.label}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className={`ybi-nav-trigger${isItemActive ? " is-active" : ""}`} aria-current={isItemActive ? "page" : undefined}>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="ybi-nav-dropdown">
                      {item.items.map((link) => {
                        const isLinkActive = isPublicRouteActive(link.href, location);

                        return (
                        <NavigationMenuLink asChild key={link.label}>
                          <Link aria-current={isLinkActive ? "page" : undefined} className={`ybi-dropdown-link${isLinkActive ? " is-active" : ""}`} href={link.href}>
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                        );
                      })}
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link aria-current={isItemActive ? "page" : undefined} className={`ybi-nav-link${isItemActive ? " is-active" : ""}`} href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="reference-nav-mobile">
        {publicNavItems.map((item) => {
          const isExpanded = expandedMobileItem === item.label;
          const isItemActive = isPublicNavItemActive(item, location);
          const submenuId = `mobile-submenu-${item.label.toLowerCase().replaceAll(" ", "-")}`;

          return <div className="mobile-nav-group" key={item.label}>
            {item.items ? <>
              <button aria-controls={submenuId} aria-current={isItemActive ? "page" : undefined} aria-expanded={isExpanded} className={`mobile-nav-parent${isItemActive ? " is-active" : ""}`} onClick={() => setExpandedMobileItem((current) => getNextMobileSubmenu(current, item.label))} type="button">
                {item.label}<span aria-hidden="true" />
              </button>
              <div aria-hidden={!isExpanded} className={`mobile-nav-submenu${isExpanded ? " is-expanded" : ""}`} id={submenuId}>
                {item.items.map((link) => <Link aria-current={isPublicRouteActive(link.href, location) ? "page" : undefined} className={isPublicRouteActive(link.href, location) ? "is-active" : undefined} href={link.href} key={link.label} onClick={onNavigate}>{link.label}</Link>)}
              </div>
            </> : <Link aria-current={isItemActive ? "page" : undefined} className={`mobile-nav-parent mobile-nav-direct-link${isItemActive ? " is-active" : ""}`} href={item.href} onClick={onNavigate}>{item.label}</Link>}
          </div>;
        })}
      </div>
    </nav>
  );
}
