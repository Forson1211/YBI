import type { ReactNode } from "react";
import { useState } from "react";
import { ArrowUpRight, HandHeart, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import PublicNavigation from "@/components/PublicNavigation";
import { footerImpactActions, footerNavigation } from "@/lib/footerNavigation";

const mark = "/ybi-assets/brand/ybi-logo.png";

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="reference-header">
      <div className="reference-header-inner">
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={27} /> : <Menu size={29} />}
        </button>
        <Link className="reference-brand" href="/" onClick={closeMenu} aria-label="Young Beginners Inspiration home">
          <img src={mark} alt="Young Beginners Inspiration logo" />
          <span>Young Beginners<br />Inspiration</span>
        </Link>
        <PublicNavigation menuOpen={menuOpen} onNavigate={closeMenu} />
        <Link className="header-support" href="/join-us" onClick={closeMenu}><HandHeart size={22} /><span>Support Us</span></Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="reference-footer">
      <div className="page-width footer-reference-grid">
        <div className="footer-reference-brand">
          <Link className="reference-brand footer-brand" href="/" aria-label="Young Beginners Inspiration home">
            <img src={mark} alt="Young Beginners Inspiration logo" />
            <span>Young Beginners<br />Inspiration</span>
          </Link>
          <p>Equipping the young and the aged to inspire, learn, and become responsible leaders.</p>
          <Link className="reference-button yellow-button" href="/join-us">Support us <ArrowUpRight size={17} /></Link>
        </div>
        <div className="footer-reference-links">
          {footerNavigation.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map((link) => <Link href={link.href} key={link.label}>{link.label}</Link>)}
            </div>
          ))}
        </div>
        <div className="footer-reference-note">
          <h4>Our belief</h4>
          <p>“Every generation has something valuable to share.”</p>
          <div className="footer-socials footer-connection-links">
            <Link href="/contact">Contact</Link>
            <Link href="/media">Stories</Link>
            <Link href="/gallery">Gallery</Link>
          </div>
          <div className="footer-impact-card">
            <span>Make an impact</span>
            <p>Find a meaningful way to learn, lead, volunteer, or partner with YBI.</p>
            <div>{footerImpactActions.map((action) => <Link href={action.href} key={action.label}>{action.label} <ArrowUpRight size={14} /></Link>)}</div>
          </div>
        </div>
      </div>
      <div className="page-width footer-reference-bottom">
        <span>© 2026 Young Beginners Inspiration</span>
        <span>Leadership · Education · Business</span>
        <Link href="/">Back home <ArrowUpRight size={14} /></Link>
      </div>
    </footer>
  );
}

export function PublicPageShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return <div className="reference-site-shell"><PublicHeader /><div className="public-route-enter" key={location}>{children}</div><PublicFooter /></div>;
}
