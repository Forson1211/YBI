// Design reminder: The Commons of Becoming — offset editorial composition,
// tactile warmth, clear invitations, and photography that keeps people first.
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleArrowOutUpRight,
  HandHeart,
  Menu,
  Mic2,
  MoveRight,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

const mark = "/manus-storage/ybi-mark_df94b617.png";
const hero = "/manus-storage/ybi-hero_42b78e95.jpg";
const publicSpeaking = "/manus-storage/ybi-public-speaking_08161e85.jpg";
const entrepreneurship = "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg";
const community = "/manus-storage/ybi-community_b2ad3c56.jpg";

const focusAreas = [
  {
    number: "01",
    title: "Leadership",
    text: "We help people recognise the leadership already present in their choices, communities, and everyday acts of courage.",
    icon: UsersRound,
  },
  {
    number: "02",
    title: "Education",
    text: "We create space for practical learning, shared wisdom, and the confidence to keep asking better questions.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Business",
    text: "We make room for ideas to become useful ventures, responsible work, and positive difference in the world.",
    icon: BriefcaseBusiness,
  },
];

const steps = [
  "Bring your story",
  "Build your capability",
  "Use it for good",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleNewsletter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("You’re on the list.", {
      description: "We’ll share the next opportunity to learn, lead, and take part.",
    });
    event.currentTarget.reset();
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Young Beginners Inspiration home" onClick={closeMenu}>
          <img src={mark} alt="" className="brand-mark" />
          <span className="brand-name">
            <span>Young Beginners</span>
            <span>Inspiration</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav id="primary-navigation" className={`primary-nav ${menuOpen ? "is-open" : ""}`}>
          <a href="#about" onClick={closeMenu}>About us</a>
          <a href="#focus" onClick={closeMenu}>Our focus</a>
          <a href="#programs" onClick={closeMenu}>Programs</a>
          <a href="#connect" onClick={closeMenu}>Get involved</a>
          <a className="header-cta" href="#connect" onClick={closeMenu}>Support the work <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <img className="hero-image" src={hero} alt="A young speaker addressing an intergenerational community gathering" />
          <div className="hero-overlay" />
          <div className="hero-content page-width">
            <p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> A platform for possibility</p>
            <h1 id="hero-title">Your voice<br /><em>is a beginning.</em></h1>
            <p className="hero-copy">We bring the young and the aged into the same room to inspire, learn, and become responsible leaders who make a positive difference.</p>
            <div className="hero-actions">
              <a className="button button-gold" href="#programs">Explore the programs <MoveRight size={18} /></a>
              <a className="text-link light-link" href="#about">Why we exist <ArrowDownRight size={18} /></a>
            </div>
          </div>
          <div className="hero-note">Young + aged<br /><span>One shared future</span></div>
          <a className="scroll-cue" href="#about" aria-label="Scroll to learn more"><span>Scroll to explore</span><ChevronDown size={18} /></a>
        </section>

        <section id="about" className="intro-section section-pad">
          <div className="page-width intro-grid">
            <div className="section-marker">01 / who we are</div>
            <div className="intro-copy">
              <p className="eyebrow"><span className="eyebrow-dot" /> A shared table</p>
              <h2>There is more in us when we <em>make room</em> for one another.</h2>
              <p className="lead-copy">Young Beginners Inspiration is a non-profit organization creating a platform where both the young and the old age can inspire and be impacted.</p>
              <p>We believe potential does not have an expiry date. When generations exchange courage, experience, and practical skills, people leave with more than information—they leave with a next step.</p>
              <a className="text-link ink-link" href="#focus">See the three places we begin <ArrowUpRight size={17} /></a>
            </div>
            <div className="vision-card">
              <div className="vision-card-top"><Sparkles size={20} /><span>Our vision</span></div>
              <p>To inspire, motivate, and impact the young, aged, and developing potential of individuals in leadership, education, and business.</p>
              <div className="vision-card-line" />
              <div className="vision-card-bottom">A place to be seen, heard, and equipped.</div>
            </div>
          </div>
        </section>

        <section id="focus" className="focus-section section-pad">
          <div className="page-width">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow"><span className="eyebrow-dot" /> Our focus</p>
                <h2>Capability is a form of <em>care.</em></h2>
              </div>
              <p>We focus on the practical places where a person’s potential can become a contribution: how they lead, how they learn, and how they build.</p>
            </div>
            <div className="focus-list">
              {focusAreas.map(({ number, title, text, icon: Icon }) => (
                <article className="focus-item" key={title}>
                  <div className="focus-number">{number}</div>
                  <div className="focus-icon"><Icon size={25} strokeWidth={1.6} /></div>
                  <div className="focus-body"><h3>{title}</h3><p>{text}</p></div>
                  <ArrowUpRight className="focus-arrow" size={22} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="programs" className="programs-section section-pad">
          <div className="page-width">
            <div className="section-heading programs-heading">
              <div>
                <p className="eyebrow"><span className="eyebrow-dot" /> Where it becomes practice</p>
                <h2>Start with a skill.<br /><em>Leave with a direction.</em></h2>
              </div>
              <p>Our first programs turn good intentions into useful confidence—one voice, one idea, one responsible next step at a time.</p>
            </div>
            <div className="program-grid">
              <article className="program-card program-card-large">
                <div className="program-image-wrap"><img src={publicSpeaking} alt="Young adults practicing public speaking with an older mentor" /><span className="program-index">01</span></div>
                <div className="program-card-copy"><p className="card-kicker">Voice / presence / courage</p><h3>Public<br /><em>Speaking</em></h3><p>Find the words, the rhythm, and the grounded confidence to say what matters—whether you are addressing a room or beginning with one person.</p><a className="text-link ink-link" href="#connect">Ask about the next session <ArrowUpRight size={17} /></a></div>
              </article>
              <article className="program-card program-card-small">
                <div className="program-image-wrap"><img src={entrepreneurship} alt="A young woman and older mentor working on a business idea" /><span className="program-index">02</span></div>
                <div className="program-card-copy"><p className="card-kicker">Ideas / enterprise / responsibility</p><h3>Entrepreneurship</h3><p>Turn an idea into a thoughtful beginning: understand the problem, test the value, and build with people—not just for profit.</p><a className="text-link ink-link" href="#connect">Bring an idea <ArrowUpRight size={17} /></a></div>
              </article>
            </div>
          </div>
        </section>

        <section className="mission-section section-pad">
          <div className="page-width mission-grid">
            <div className="mission-label"><span>02</span><span>Our mission</span></div>
            <div className="mission-quote"><p>“We equip people to become responsible leaders who use their capabilities to make a positive difference in the world.”</p><div className="quote-rule" /><span>Young Beginners Inspiration</span></div>
            <div className="mission-aside"><p>We do this through an open platform for learning, mentorship, and meaningful exchange between generations.</p><a className="button button-outline-light" href="#connect">Join the circle <ArrowUpRight size={17} /></a></div>
          </div>
        </section>

        <section className="community-section section-pad">
          <div className="page-width community-grid">
            <div className="community-image-wrap"><img src={community} alt="Young people and elders sharing a conversation outdoors" /><div className="image-caption">Wisdom moves in more than one direction.</div></div>
            <div className="community-copy"><p className="eyebrow"><span className="eyebrow-dot" /> Why this work matters</p><h2>Inspiration is not an age group. It is a <em>practice.</em></h2><p>Some people need a place to begin. Others have a lifetime of lessons waiting to be shared. Our work connects both truths so that learning becomes mutual, leadership becomes responsible, and possibility becomes practical.</p><div className="steps-list">{steps.map((step, index) => <div className="step-item" key={step}><span>0{index + 1}</span><strong>{step}</strong><Check size={17} /></div>)}</div></div>
          </div>
        </section>

        <section id="connect" className="connect-section section-pad">
          <div className="page-width connect-grid">
            <div className="connect-copy"><p className="eyebrow"><span className="eyebrow-dot" /> Make room for possibility</p><h2>There is a place for your <em>voice</em> here.</h2><p>Stay close to new sessions, collaborations, and ways to support a platform that believes potential is worth investing in at every age.</p><div className="connect-options"><a href="mailto:hello@youngbeginnersinspiration.org"><span>For a conversation</span><strong>hello@youngbeginnersinspiration.org</strong><ArrowUpRight size={17} /></a><a href="#newsletter"><span>For occasional updates</span><strong>Join the newsletter below</strong><ArrowDownRight size={17} /></a></div></div>
            <div id="newsletter" className="newsletter-card"><HandHeart size={27} strokeWidth={1.5} /><p className="card-kicker">A note from the platform</p><h3>Bring your curiosity.<br /><em>We’ll bring the next invitation.</em></h3><form onSubmit={handleNewsletter}><label htmlFor="newsletter-name">Your name</label><input id="newsletter-name" name="name" type="text" placeholder="First and last name" required /><label htmlFor="newsletter-email">Your email</label><input id="newsletter-email" name="email" type="email" placeholder="you@example.com" required /><button className="button button-dark" type="submit">Keep me close <ArrowUpRight size={17} /></button></form><small>We only send meaningful updates. No noise, no selling your details.</small></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-top">
          <div className="footer-brand"><a className="brand brand-footer" href="#top"><img src={mark} alt="" className="brand-mark" /><span className="brand-name"><span>Young Beginners</span><span>Inspiration</span></span></a><p>A platform for the young and the aged to inspire, learn, and become.</p></div>
          <div className="footer-nav"><div><span className="footer-label">Explore</span><a href="#about">About us</a><a href="#focus">Our focus</a><a href="#programs">Programs</a></div><div><span className="footer-label">Take part</span><a href="#connect">Get involved</a><a href="#newsletter">Newsletter</a><a href="mailto:hello@youngbeginnersinspiration.org">Contact us</a></div></div>
          <div className="footer-note"><span className="footer-label">The invitation</span><p>“The future is not waiting for perfect people. It is waiting for participating ones.”</p><a className="text-link gold-link" href="#connect">Find your way in <ArrowUpRight size={17} /></a></div>
        </div>
        <div className="page-width footer-bottom"><span>© 2026 Young Beginners Inspiration</span><span>Leadership · Education · Business</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></div>
      </footer>
    </div>
  );
}
