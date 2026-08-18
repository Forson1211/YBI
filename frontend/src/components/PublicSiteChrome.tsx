import type { FormEvent, ReactNode } from "react";
import { useState, useEffect } from "react";

import {
  ChevronDown,
  Facebook,
  HandHeart,
  Instagram,
  Linkedin,
  Menu,
  Send,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import PublicNavigation from "@/components/PublicNavigation";
import { useSiteImages } from "@/lib/useSiteImage";
import { toast } from "sonner";

const mark = "/ybi-assets/brand/ybi-logo.png";

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getImage } = useSiteImages();
  const brandLogo = getImage("brand_logo", mark, "Young Beginners Inspiration logo");
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
          <img src={brandLogo.src} alt={brandLogo.alt} />
          <span>Young Beginners<br />Inspiration</span>
        </Link>
        <PublicNavigation menuOpen={menuOpen} onNavigate={closeMenu} />
        <Link className="header-support" href="/get-involved" onClick={closeMenu}><HandHeart size={22} /><span>Support Us</span></Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  const { getImage } = useSiteImages();
  const brandLogo = getImage("brand_logo", mark, "Young Beginners Inspiration logo");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    toast.success("Thank you for subscribing! You'll receive YBI updates.");
    setSubscribedEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="reference-footer">
      <div className="page-width footer-container">
        {/* Top bar: Brand + Social Links */}
        <div className="footer-top-bar">
          <Link className="footer-brand" href="/" aria-label="Young Beginners Inspiration home">
            <img src={brandLogo.src} alt={brandLogo.alt} />
            <span className="footer-brand-text">
              YOUNG BEGINNERS<br />INSPIRATION
            </span>
          </Link>
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Middle 5-column Navigation Grid / Accordion on Mobile */}
        <div className="footer-columns-grid">
          {/* Column 1: Organization */}
          <div className={`footer-nav-col ${openSections["org"] ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-col-header"
              onClick={() => toggleSection("org")}
              aria-expanded={Boolean(openSections["org"])}
            >
              <span>Organization</span>
              <ChevronDown className="footer-col-chevron" size={18} />
            </button>
            <div className="footer-col-body">
              <div className="footer-col-links">
                <Link href="/about">About Us</Link>
                <Link href="/team">Our Team</Link>
                <Link href="/focus-areas">Focus Areas</Link>
                <Link href="/programs">Core Programs</Link>
              </div>
            </div>
          </div>

          {/* Column 2: Participation */}
          <div className={`footer-nav-col ${openSections["part"] ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-col-header"
              onClick={() => toggleSection("part")}
              aria-expanded={Boolean(openSections["part"])}
            >
              <span>Participation</span>
              <ChevronDown className="footer-col-chevron" size={18} />
            </button>
            <div className="footer-col-body">
              <div className="footer-col-links">
                <Link href="/events">Upcoming Events</Link>
                <Link href="/blog">YBI Journal & Stories</Link>
                <Link href="/get-involved#donate">Make a Donation</Link>
                <Link href="/get-involved#volunteer">Volunteer / Mentor</Link>
              </div>
            </div>
          </div>

          {/* Column 3: Support & Legal */}
          <div className={`footer-nav-col ${openSections["legal"] ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-col-header"
              onClick={() => toggleSection("legal")}
              aria-expanded={Boolean(openSections["legal"])}
            >
              <span>Support & Legal</span>
              <ChevronDown className="footer-col-chevron" size={18} />
            </button>
            <div className="footer-col-body">
              <div className="footer-col-links">
                <Link href="/faq">Frequently Asked Questions</Link>
                <Link href="/contact">Contact YBI</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms-of-use">Terms of Use</Link>
              </div>
            </div>
          </div>

          {/* Column 4: Connect */}
          <div className={`footer-nav-col ${openSections["connect"] ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-col-header"
              onClick={() => toggleSection("connect")}
              aria-expanded={Boolean(openSections["connect"])}
            >
              <span>Connect</span>
              <ChevronDown className="footer-col-chevron" size={18} />
            </button>
            <div className="footer-col-body">
              <div className="footer-col-links">
                <Link href="/contact">Contact Us</Link>
                <Link href="/blog">YBI Journal</Link>
                <Link href="/events">Events Calendar</Link>
                <Link href="/gallery">Photo Gallery</Link>
              </div>
            </div>
          </div>

          {/* Column 5: Make an Impact & Stay Updated */}
          <div className={`footer-nav-col footer-col-impact ${openSections["impact"] ? "is-open" : ""}`}>
            <button
              type="button"
              className="footer-col-header"
              onClick={() => toggleSection("impact")}
              aria-expanded={Boolean(openSections["impact"])}
            >
              <span>Make an Impact</span>
              <ChevronDown className="footer-col-chevron" size={18} />
            </button>
            <div className="footer-col-body">
              <div className="footer-col-links">
                <Link href="/get-involved#donate">Donate to YBI</Link>
                <Link href="/get-involved#volunteer">Mentor with YBI</Link>
                <Link href="/events">View Events Calendar</Link>
              </div>
              <div className="footer-newsletter-section">
                <span className="footer-newsletter-title">STAY UPDATED</span>
                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Your email..."
                    value={subscribedEmail}
                    onChange={(e) => setSubscribedEmail(e.target.value)}
                    required
                    className="footer-newsletter-input"
                    aria-label="Your email for newsletter"
                  />
                  <button type="submit" className="footer-newsletter-btn" aria-label="Submit newsletter subscription">
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Center Legal & Ghana badge, Developed by, Back to Top */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-copy">
            © 2026 Young Beginners Inspiration. All rights reserved.
          </div>
          <div className="footer-bottom-middle">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span className="footer-sep">•</span>
            <Link href="/terms-of-use">Terms of Use</Link>
            <span className="footer-sep">•</span>
            <span className="footer-ngo-tag">Registered NGO • Ghana</span>
            <span className="footer-sep">•</span>
            <span className="footer-developed-by">
              Developed by{" "}
              <a
                href="https://oflexcreative.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-author-link"
              >
                Oflex Creative
              </a>
            </span>
          </div>
          <div className="footer-bottom-actions">
            <button type="button" className="footer-back-to-top-btn" onClick={scrollToTop}>
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}




export function PublicPageShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.body.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  return <div className="reference-site-shell"><PublicHeader /><div className="public-route-enter" key={location}>{children}</div><PublicFooter /></div>;
}

