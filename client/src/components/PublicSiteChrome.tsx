import type { ReactNode } from "react";
import { useState } from "react";
import { ArrowUpRight, HandHeart, Menu, X } from "lucide-react";
import PublicNavigation from "@/components/PublicNavigation";
import { footerImpactActions, footerNavigation } from "@/lib/footerNavigation";

const mark = "/manus-storage/ybi-logo_a28c9057.png";

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
        <a className="reference-brand" href="/" onClick={closeMenu} aria-label="Young Beginners Inspiration home">
          <img src={mark} alt="Young Beginners Inspiration logo" />
          <span>Young Beginners<br />Inspiration</span>
        </a>
        <PublicNavigation menuOpen={menuOpen} onNavigate={closeMenu} />
        <a className="header-support" href="/join-us" onClick={closeMenu}><HandHeart size={22} /><span>Support Us</span></a>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="reference-footer">
      <div className="page-width footer-reference-grid">
        <div className="footer-reference-brand">
          <a className="reference-brand footer-brand" href="/" aria-label="Young Beginners Inspiration home">
            <img src={mark} alt="Young Beginners Inspiration logo" />
            <span>Young Beginners<br />Inspiration</span>
          </a>
          <p>Equipping the young and the aged to inspire, learn, and become responsible leaders.</p>
          <a className="reference-button yellow-button" href="/join-us">Support us <ArrowUpRight size={17} /></a>
        </div>
        <div className="footer-reference-links">
          {footerNavigation.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-reference-note">
          <h4>Our belief</h4>
          <p>“Every generation has something valuable to share.”</p>
          <div className="footer-socials footer-connection-links">
            <a href="/contact">Contact</a>
            <a href="/media">Stories</a>
            <a href="/gallery">Gallery</a>
          </div>
          <div className="footer-impact-card">
            <span>Make an impact</span>
            <p>Find a meaningful way to learn, lead, volunteer, or partner with YBI.</p>
            <div>{footerImpactActions.map((action) => <a href={action.href} key={action.label}>{action.label} <ArrowUpRight size={14} /></a>)}</div>
          </div>
        </div>
      </div>
      <div className="page-width footer-reference-bottom">
        <span>© 2026 Young Beginners Inspiration</span>
        <span>Leadership · Education · Business</span>
        <a href="/">Back home <ArrowUpRight size={14} /></a>
      </div>
    </footer>
  );
}

export function PublicPageShell({ children }: { children: ReactNode }) {
  return <div className="reference-site-shell"><PublicHeader />{children}<PublicFooter /></div>;
}
