// Ground-truth reference: worldinspiringnetwork.org — direct nonprofit page hierarchy,
// white navigation, strong color blocks, clear calls to participate, and compact copy.
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, HandHeart, Lightbulb, Menu, Mic2, Sparkles, UsersRound, X } from "lucide-react";

const mark = "/manus-storage/ybi-logo_a28c9057.png";
const publicSpeaking = "/manus-storage/ybi-public-speaking_08161e85.jpg";
const entrepreneurship = "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg";
const community = "/manus-storage/ybi-community_b2ad3c56.jpg";

export type SubpageKey = "about" | "focus-areas" | "programs" | "join-us" | "media";

type PageItem = { eyebrow: string; title: string; text: string; icon?: LucideIcon; image?: string };

const pageContent: Record<SubpageKey, { eyebrow: string; title: string; accent: string; intro: string; statement: string; aside: string; items: PageItem[]; ctaTitle: string; ctaText: string; ctaLabel: string; ctaHref: string }> = {
  about: {
    eyebrow: "Who we are",
    title: "A place to",
    accent: "begin together.",
    intro: "Young Beginners Inspiration creates space for the young and the aged to inspire, learn, and be impacted.",
    statement: "Every generation carries something worth sharing.",
    aside: "Our work connects lived experience with fresh possibility so people can grow into responsible leaders who make a positive difference.",
    items: [
      { eyebrow: "Our vision", title: "Inspire potential", text: "To inspire, motivate, and impact the young, aged, and developing potential of individuals in leadership, education, and business.", icon: Sparkles },
      { eyebrow: "Our mission", title: "Equip for impact", text: "To provide a platform where the young and aged become responsible leaders who use their capabilities to make a positive difference in the world.", icon: HandHeart },
      { eyebrow: "Our approach", title: "Learn both ways", text: "We design practical spaces where mentorship is mutual, participation is active, and every person can contribute to the room.", icon: UsersRound },
    ],
    ctaTitle: "Bring your experience.", ctaText: "There is room here for the person beginning and the person ready to share what they have learned.", ctaLabel: "Join us", ctaHref: "/join-us",
  },
  "focus-areas": {
    eyebrow: "What we focus on",
    title: "Capability becomes",
    accent: "impact through practice.",
    intro: "We concentrate on three connected areas that help people find their voice, strengthen their thinking, and create responsible opportunities.",
    statement: "Skills are more powerful when they serve people.",
    aside: "Our focus areas are designed to move beyond inspiration alone. Each one gives participants language, confidence, and practical next steps.",
    items: [
      { eyebrow: "01 · Leadership", title: "Lead with responsibility", text: "Build self-awareness, communication, and the everyday decision-making habits that make influence trustworthy.", icon: UsersRound },
      { eyebrow: "02 · Education", title: "Make learning active", text: "Turn knowledge into confidence through shared learning, reflective practice, and opportunities to teach one another.", icon: BookOpen },
      { eyebrow: "03 · Business", title: "Create useful value", text: "Explore entrepreneurship as a way to notice real needs, test thoughtful ideas, and build with integrity.", icon: BriefcaseBusiness },
    ],
    ctaTitle: "Start with a skill.", ctaText: "Find the focus area that feels closest to your next step and ask us about an upcoming session.", ctaLabel: "Explore programs", ctaHref: "/programs",
  },
  programs: {
    eyebrow: "Programs",
    title: "Learn something.",
    accent: "Lead somewhere.",
    intro: "Our programs turn curiosity into confidence through practice, conversation, and meaningful action.",
    statement: "A good program leaves you with a next step you can use.",
    aside: "Public speaking and entrepreneurship are our starting points. We create welcoming spaces where skills grow through repetition and shared encouragement.",
    items: [
      { eyebrow: "Voice · presence · courage", title: "Public Speaking", text: "Practice clear communication, confident delivery, active listening, and the courage to bring an important idea into the room.", image: publicSpeaking, icon: Mic2 },
      { eyebrow: "Ideas · enterprise · responsibility", title: "Entrepreneurship", text: "Move from a meaningful idea to a practical beginning through problem-solving, testing, and shared learning.", image: entrepreneurship, icon: Lightbulb },
      { eyebrow: "Mentorship · exchange · belonging", title: "Generations in Conversation", text: "Create connection between lived experience and fresh perspective so each generation can strengthen the other.", image: community, icon: UsersRound },
    ],
    ctaTitle: "Your next session can start here.", ctaText: "Tell us what you want to learn and we will help you find the right way into the work.", ctaLabel: "Ask about a program", ctaHref: "/join-us",
  },
  "join-us": {
    eyebrow: "Join the platform",
    title: "There is room for",
    accent: "your voice.",
    intro: "Whether you want to learn, mentor, collaborate, volunteer, or support the work, there is a meaningful way to participate.",
    statement: "The platform grows through people who choose to show up.",
    aside: "You do not need to arrive with everything figured out. Bring curiosity, care, and a willingness to contribute to something bigger than yourself.",
    items: [
      { eyebrow: "For participants", title: "Learn with us", text: "Join a program, practice a skill, and meet people who are also finding their next direction.", icon: BookOpen },
      { eyebrow: "For mentors", title: "Share what you know", text: "Offer lived experience, encouragement, and perspective to someone taking an important first step.", icon: HandHeart },
      { eyebrow: "For partners", title: "Build with us", text: "Collaborate on programming, resources, spaces, and opportunities that help people become capable leaders.", icon: BriefcaseBusiness },
    ],
    ctaTitle: "Let us start a conversation.", ctaText: "Reach out and tell us how you would like to be part of Young Beginners Inspiration.", ctaLabel: "Contact the team", ctaHref: "mailto:hello@youngbeginnersinspiration.org",
  },
  media: {
    eyebrow: "From the platform",
    title: "Ideas worth",
    accent: "carrying forward.",
    intro: "Short notes, reflections, and updates for people finding their voice, building capability, and making a difference.",
    statement: "Keep the conversation moving.",
    aside: "This is where we will share stories from our programs, upcoming opportunities, and practical prompts for the work of becoming.",
    items: [
      { eyebrow: "Leadership note", title: "Start with the room you are in", text: "Leadership begins in ordinary places: the conversation, responsibility, and courage already within reach.", icon: UsersRound },
      { eyebrow: "Business note", title: "An idea becomes useful when it serves", text: "Entrepreneurship is not only about starting. It is about noticing a need and building with care.", icon: Lightbulb },
      { eyebrow: "Speaking note", title: "Your voice gets stronger in practice", text: "Public speaking grows through small brave repetitions—and people who make it safe to try.", icon: Mic2 },
    ],
    ctaTitle: "Stay close to the next invitation.", ctaText: "Join the newsletter for meaningful updates from Young Beginners Inspiration.", ctaLabel: "Join the newsletter", ctaHref: "/#newsletter",
  },
};

const navItems = [
  ["About", "/about"],
  ["Focus Areas", "/focus-areas"],
  ["Programs", "/programs"],
  ["Join Us", "/join-us"],
  ["Media", "/media"],
  ["Gallery", "/gallery"],
];

function PageHeader({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  return <header className="reference-header"><div className="reference-header-inner"><button className="mobile-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={27} /> : <Menu size={29} />}</button><a className="reference-brand" href="/" aria-label="Young Beginners Inspiration home"><img src={mark} alt="Young Beginners Inspiration logo" /><span>Young Beginners<br />Inspiration</span></a><nav className={`reference-nav ${menuOpen ? "is-open" : ""}`}>{navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav><a className="header-support" href="/join-us" onClick={() => setMenuOpen(false)}><HandHeart size={22} /><span>Support Us</span></a></div></header>;
}

function PageFooter() {
  return <footer className="reference-footer"><div className="page-width footer-reference-grid"><div className="footer-reference-brand"><a className="reference-brand footer-brand" href="/"><img src={mark} alt="Young Beginners Inspiration logo" /><span>Young Beginners<br />Inspiration</span></a><p>Equipping the young and the aged to inspire, learn, and become responsible leaders.</p><a className="reference-button yellow-button" href="/join-us">Support us <ArrowUpRight size={17} /></a></div><div className="footer-reference-links"><div><h4>Explore</h4>{navItems.slice(0, 3).map(([label, href]) => <a href={href} key={href}>{label}</a>)}<a href="/media">Media</a><a href="/gallery">Gallery</a></div><div><h4>Join us</h4><a href="/join-us">Volunteer</a><a href="/join-us">Partner with us</a><a href="mailto:hello@youngbeginnersinspiration.org">Contact us</a></div></div><div className="footer-reference-note"><h4>Our belief</h4><p>“Every generation has something valuable to share.”</p><div className="footer-socials"><a href="/join-us" aria-label="Facebook">f</a><a href="/join-us" aria-label="Instagram">◎</a><a href="/join-us" aria-label="LinkedIn">in</a></div></div></div><div className="page-width footer-reference-bottom"><span>© 2026 Young Beginners Inspiration</span><span>Leadership · Education · Business</span><a href="/">Back home <ArrowUpRight size={14} /></a></div></footer>;
}

export default function Subpage({ page }: { page: SubpageKey }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const content = pageContent[page];
  return <div className="reference-site-shell"><PageHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} /><main className="subpage-main"><section className="subpage-hero section-blue"><div className="page-width subpage-hero-inner"><p className="reference-eyebrow light"><span /> {content.eyebrow}</p><h1>{content.title}<br /><span>{content.accent}</span></h1><p>{content.intro}</p></div></section><section className="subpage-content section-white"><div className="page-width"><div className="subpage-lead-grid"><div><p className="reference-eyebrow"><span /> The YBI approach</p><h2>{content.statement}</h2></div><p className="subpage-aside">{content.aside}</p></div><div className={`subpage-feature-grid ${page === "programs" ? "with-images" : ""}`}>{content.items.map((item) => <article className="subpage-feature-card" key={item.title}>{item.image ? <img src={item.image} alt="" /> : null}<div className="subpage-feature-card-inner">{item.icon ? <div className="solution-icon"><item.icon size={28} strokeWidth={1.6} /></div> : null}<p className="subpage-card-eyebrow">{item.eyebrow}</p><h3>{item.title}</h3><p>{item.text}</p><a className="reference-text-link" href={page === "media" ? "/join-us" : "/programs"}>Learn more <ArrowRight size={18} /></a></div></article>)}</div></div></section><section className="subpage-cta section-red"><div className="page-width subpage-cta-inner"><div><p className="reference-eyebrow light"><span /> Keep moving forward</p><h2>{content.ctaTitle}</h2></div><div><p>{content.ctaText}</p><a className="reference-button white-button" href={content.ctaHref}>{content.ctaLabel} <ArrowUpRight size={18} /></a></div></div></section></main><PageFooter /></div>;
}
