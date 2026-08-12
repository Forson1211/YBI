// Ground-truth reference: worldinspiringnetwork.org — white utility header,
// documentary hero, centered mobile-first copy, bold support CTA, and a nonprofit
// storytelling sequence. Adapted for YBI blue, red, yellow, and orange.
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  HandHeart,
  Lightbulb,
  Menu,
  Mic2,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

const mark = "/manus-storage/ybi-logo_a28c9057.png";
const hero = "/manus-storage/ybi-hero_42b78e95.jpg";
const publicSpeaking = "/manus-storage/ybi-public-speaking_08161e85.jpg";
const entrepreneurship = "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg";
const community = "/manus-storage/ybi-community_b2ad3c56.jpg";

const problemCards = [
  { number: "01", title: "Unused potential", text: "Too many capable people never get the room, tools, or encouragement to turn potential into contribution.", color: "red" },
  { number: "02", title: "Quiet voices", text: "Without practice and support, important ideas stay unspoken instead of shaping families, communities, and futures.", color: "orange" },
  { number: "03", title: "Few bridges", text: "Young and older generations have much to learn from one another, but too few spaces are built for that exchange.", color: "blue" },
];

const solutionCards = [
  { icon: UsersRound, title: "Leadership", text: "We equip responsible leaders who understand that influence is measured by the difference it makes for other people." },
  { icon: BookOpen, title: "Education", text: "We make learning practical, shared, and active—so knowledge becomes confidence and confidence becomes action." },
  { icon: BriefcaseBusiness, title: "Business", text: "We help ideas take shape through entrepreneurship, thoughtful problem-solving, and work that serves a real need." },
];

const initiativeCards = [
  { image: publicSpeaking, number: "01", kicker: "Voice · Presence · Courage", title: "Public Speaking", text: "Practice the confidence to speak clearly, listen deeply, and bring your ideas into the room." },
  { image: entrepreneurship, number: "02", kicker: "Ideas · Enterprise · Responsibility", title: "Entrepreneurship", text: "Turn a meaningful idea into a practical beginning with guidance, testing, and shared learning." },
  { image: community, number: "03", kicker: "Mentorship · Exchange · Belonging", title: "Generations in Conversation", text: "Create meaningful connections where lived experience and fresh perspective strengthen one another." },
];

const reasons = [
  { icon: Sparkles, title: "Purpose-led", text: "Every activity starts with the positive difference it can make." },
  { icon: UsersRound, title: "Intergenerational", text: "We believe wisdom and possibility move in both directions." },
  { icon: Lightbulb, title: "Practical", text: "We focus on skills people can carry into their next step." },
  { icon: HandHeart, title: "Open-hearted", text: "We build a platform where people can be seen, heard, and equipped." },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const handleNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Thank you for staying connected.", { description: "We’ll share meaningful updates from the platform." });
    event.currentTarget.reset();
  };

  return (
    <div className="reference-site-shell">
      <header className="reference-header">
        <div className="reference-header-inner">
          <button className="mobile-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={27} /> : <Menu size={29} />}
          </button>
          <a className="reference-brand" href="#top" onClick={closeMenu} aria-label="Young Beginners Inspiration home">
            <img src={mark} alt="Young Beginners Inspiration logo" />
            <span>Young Beginners<br />Inspiration</span>
          </a>
          <nav className={`reference-nav ${menuOpen ? "is-open" : ""}`}>
            <a href="/about" onClick={closeMenu}>About</a>
            <a href="/focus-areas" onClick={closeMenu}>Focus Areas</a>
            <a href="/programs" onClick={closeMenu}>Programs</a>
            <a href="/join-us" onClick={closeMenu}>Join Us</a>
            <a href="/media" onClick={closeMenu}>Media</a>
          </nav>
          <a className="header-support" href="/join-us" onClick={closeMenu}><HandHeart size={22} /><span>Support Us</span></a>
        </div>
      </header>

      <main id="top">
        <section className="reference-hero" aria-labelledby="hero-title">
          <img className="reference-hero-image" src={hero} alt="A young woman speaking to an intergenerational audience" />
          <div className="reference-hero-overlay" />
          <div className="reference-hero-content page-width">
            <p className="reference-eyebrow light"><span /> A platform for possibility</p>
            <h1 id="hero-title">Inspiring voices,<br />building leaders,<br /><span>shaping futures.</span></h1>
            <p className="reference-hero-copy">We create a platform where the young and the aged inspire one another, build practical capability, and use their gifts to make a positive difference in the world.</p>
            <a className="reference-button white-button" href="#connect">Support us <ArrowUpRight size={18} /></a>
          </div>
          <a className="hero-scroll" href="#about"><span>Discover more</span><ChevronDown size={18} /></a>
        </section>

        <section id="about" className="about-reference section-white">
          <div className="page-width about-reference-grid">
            <div className="section-kicker">We are<br /><span>YBI</span></div>
            <div className="about-reference-copy"><p className="reference-eyebrow"><span /> Who we are</p><h2>People grow when they have a place to <span>begin.</span></h2><p className="large-paragraph">Young Beginners Inspiration is a non-profit organization creating a platform that gives both the young and the old age space to inspire and be impacted.</p><p>We believe every generation has something valuable to share. Through learning, public speaking, entrepreneurship, and meaningful connection, we help potential become responsible leadership.</p><a className="reference-text-link" href="/about">Discover more <ArrowRight size={18} /></a></div>
            <div className="about-reference-card"><span className="card-number">01</span><HandHeart size={30} /><h3>A shared space.<br /><span>A shared future.</span></h3><p>A place for voices, ideas, and experience to meet.</p></div>
          </div>
        </section>

        <section className="problem-reference section-cream">
          <div className="page-width">
            <div className="center-heading"><p className="reference-eyebrow"><span /> The opportunity</p><h2>What happens when potential<br /><span>gets a platform?</span></h2><p>We start by making room for the real barriers people face—and the practical possibilities that open when they are supported.</p></div>
            <div className="problem-grid">{problemCards.map((card) => <article className={`problem-card ${card.color}`} key={card.number}><div className="problem-card-top"><span>{card.number}</span><ArrowUpRight size={18} /></div><h3>{card.title}</h3><p>{card.text}</p></article>)}</div>
          </div>
        </section>

        <section id="focus" className="solution-reference section-white">
          <div className="page-width">
            <div className="center-heading"><p className="reference-eyebrow"><span /> The solution</p><h2>Inspiration becomes impact<br /><span>through practice.</span></h2><p>Our focus areas give people a strong foundation for the next conversation, the next idea, and the next responsible decision.</p></div>
            <div className="solution-grid">{solutionCards.map(({ icon: Icon, title, text }) => <article className="solution-card" key={title}><div className="solution-icon"><Icon size={29} strokeWidth={1.6} /></div><h3>{title}</h3><p>{text}</p><a className="reference-text-link" href="/focus-areas">Read more <ArrowRight size={18} /></a></article>)}</div>
          </div>
        </section>

        <section id="initiatives" className="initiatives-reference section-cream">
          <div className="page-width"><div className="center-heading"><p className="reference-eyebrow"><span /> Our programs</p><h2>Learn something.<br /><span>Lead somewhere.</span></h2><p>Our programs are designed to leave people with more than inspiration: a skill, a connection, and a next step they can use.</p></div><div className="initiative-grid">{initiativeCards.map((card) => <article className="initiative-card" key={card.number}><div className="initiative-image"><img src={card.image} alt="" /><span>{card.number}</span></div><div className="initiative-copy"><p className="initiative-kicker">{card.kicker}</p><h3>{card.title}</h3><p>{card.text}</p><a className="reference-text-link" href="#connect">Learn more <ArrowRight size={18} /></a></div></article>)}</div></div>
        </section>

        <section className="why-reference section-blue">
          <div className="page-width"><div className="center-heading light-heading"><p className="reference-eyebrow light"><span /> Why Young Beginners Inspiration?</p><h2>A platform that believes<br /><span>everyone can begin.</span></h2><p>We bring an open, practical, intergenerational approach to the work of becoming.</p></div><div className="reasons-grid">{reasons.map(({ icon: Icon, title, text }) => <article className="reason-card" key={title}><Icon size={31} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section id="connect" className="join-reference section-red"><div className="page-width join-grid"><div><p className="reference-eyebrow light"><span /> Be part of the beginning</p><h2>There is room<br />for your <span>voice.</span></h2></div><div><p>Whether you want to learn, mentor, collaborate, volunteer, or support the work, there is a meaningful way to join this platform.</p><a className="reference-button white-button" href="/join-us">Join us today <ArrowUpRight size={18} /></a></div></div></section>

        <section id="updates" className="updates-reference section-white"><div className="page-width"><div className="updates-heading"><div><p className="reference-eyebrow"><span /> From the platform</p><h2>Ideas worth<br /><span>carrying forward.</span></h2></div><p>Short notes and practical prompts for people finding their voice, building capability, and making a difference.</p></div><div className="updates-grid"><article><div className="update-number">01</div><h3>Start with the room you are in</h3><p>Leadership begins in ordinary places: the conversation, responsibility, and courage already within reach.</p><a className="reference-text-link" href="/media">Read more <ArrowRight size={18} /></a></article><article><div className="update-number">02</div><h3>An idea becomes useful when it serves</h3><p>Entrepreneurship is not only about starting. It is about noticing a need and building with care.</p><a className="reference-text-link" href="/media">Read more <ArrowRight size={18} /></a></article><article><div className="update-number">03</div><h3>Your voice gets stronger in practice</h3><p>Public speaking grows through small brave repetitions—and people who make it safe to try.</p><a className="reference-text-link" href="/media">Read more <ArrowRight size={18} /></a></article></div></div></section>

        <section className="newsletter-reference section-cream"><div className="page-width newsletter-reference-inner"><div><p className="reference-eyebrow"><span /> Stay connected</p><h2>Make room for<br /><span>the next invitation.</span></h2></div><form onSubmit={handleNewsletter}><label htmlFor="reference-name">Full name</label><input id="reference-name" name="name" placeholder="First & last name" required /><label htmlFor="reference-email">Email</label><input id="reference-email" name="email" type="email" placeholder="Email address" required /><button className="reference-button blue-button" type="submit">Subscribe <ArrowUpRight size={18} /></button></form></div></section>
      </main>

      <footer className="reference-footer"><div className="page-width footer-reference-grid"><div className="footer-reference-brand"><a className="reference-brand footer-brand" href="/"><img src={mark} alt="Young Beginners Inspiration logo" /><span>Young Beginners<br />Inspiration</span></a><p>Equipping the young and the aged to inspire, learn, and become responsible leaders.</p><a className="reference-button yellow-button" href="/join-us">Support us <ArrowUpRight size={17} /></a></div><div className="footer-reference-links"><div><h4>Explore</h4><a href="/about">About us</a><a href="/focus-areas">Focus areas</a><a href="/programs">Programs</a><a href="/media">Media</a></div><div><h4>Join us</h4><a href="/join-us">Volunteer</a><a href="/join-us">Partner with us</a><a href="mailto:hello@youngbeginnersinspiration.org">Contact us</a></div></div><div className="footer-reference-note"><h4>Our belief</h4><p>“Every generation has something valuable to share.”</p><div className="footer-socials"><a href="/join-us" aria-label="Facebook">f</a><a href="/join-us" aria-label="Instagram">◎</a><a href="/join-us" aria-label="LinkedIn">in</a></div></div></div><div className="page-width footer-reference-bottom"><span>© 2026 Young Beginners Inspiration</span><span>Leadership · Education · Business</span><a href="/">Back home <ArrowUpRight size={14} /></a></div></footer>
    </div>
  );
}
