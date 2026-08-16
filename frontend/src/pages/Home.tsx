// Ground-truth reference: worldinspiringnetwork.org — white utility header,
// documentary hero, centered mobile-first copy, bold support CTA, and a nonprofit
// storytelling sequence. Adapted for YBI blue, red, yellow, and orange.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useSiteImages } from "@/lib/useSiteImage";
import { createImageWallRows, type ImageWallPhoto } from "@/lib/imageWall";
import { homepageUpdates } from "@/lib/homeUpdates";
import { footerImpactActions, footerNavigation } from "@/lib/footerNavigation";
import { aboutMediaSlides } from "@/lib/aboutMedia";
import PublicNavigation from "@/components/PublicNavigation";
import { PublicFooter } from "@/components/PublicSiteChrome";
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

const mark = "/ybi-assets/brand/ybi-logo.png";
const hero = "/ybi-assets/homepage/ybi-hero.jpg";
const publicSpeaking = aboutMediaSlides[0].src;
const community = aboutMediaSlides[1].src;
const entrepreneurship = aboutMediaSlides[2].src;

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

function RotatingAboutImage({ slides }: { slides: Array<{ src: string; alt: string }> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const changeImage = (step: 1 | -1) => {
    setActiveIndex((currentIndex) => {
      setExitingIndex(currentIndex);
      setDirection(step);
      return (currentIndex + step + slides.length) % slides.length;
    });
  };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const rotation = window.setInterval(() => changeImage(1), 8200);
    return () => window.clearInterval(rotation);
  }, [reducedMotion, slides.length]);

  return <div aria-label="Images from Young Beginners Inspiration activities" className="about-image-rotator" onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const endX = event.changedTouches[0]?.clientX; if (touchStartX.current === null || endX === undefined) return; const distance = endX - touchStartX.current; touchStartX.current = null; if (Math.abs(distance) < 36) return; changeImage(distance < 0 ? 1 : -1); }}>
    {slides.map((image, index) => <img aria-hidden="true" alt={image.alt} className={`about-rotating-image${index === activeIndex ? " is-active" : ""}${index === exitingIndex ? " is-exiting" : ""}${direction === -1 ? " is-reverse" : ""}`} key={image.src} src={image.src} />)}
  </div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getImage } = useSiteImages();
  const heroImage = getImage("home_hero", hero, "A young woman speaking to an intergenerational audience");
  const wall1 = getImage("home_wall_1", "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg", "Young facilitator leading a community leadership workshop");
  const wall2 = getImage("home_wall_2", "/ybi-assets/image-wall/ybi-wall-intergenerational-mentoring.jpg", "Intergenerational mentoring around a practical project");
  const wall3 = getImage("home_wall_3", "/ybi-assets/image-wall/ybi-wall-entrepreneurship.jpg", "Community members developing an entrepreneurship idea");
  const wall4 = getImage("home_wall_4", "/ybi-assets/image-wall/ybi-wall-public-speaking.jpg", "Young participant practicing public speaking");
  const wall5 = getImage("home_wall_5", "/ybi-assets/image-wall/ybi-wall-community-circle.jpg", "An outdoor intergenerational community circle");
  const programPhoto1 = getImage("program_public_speaking", publicSpeaking, "Young people developing public-speaking confidence");
  const programPhoto2 = getImage("program_entrepreneurship", entrepreneurship, "Participants exploring entrepreneurship together");
  const programPhoto3 = getImage("program_community", community, "Intergenerational community conversation");

  const dynamicSlides = useMemo(() => [
    { src: programPhoto1.src, alt: programPhoto1.alt },
    { src: programPhoto3.src, alt: programPhoto3.alt },
    { src: programPhoto2.src, alt: programPhoto2.alt },
  ], [programPhoto1, programPhoto2, programPhoto3]);

  const dynamicInitiatives = useMemo(() => [
    { image: programPhoto1.src, number: "01", kicker: "Voice · Presence · Courage", title: "Public Speaking", text: "Practice the confidence to speak clearly, listen deeply, and bring your ideas into the room." },
    { image: programPhoto2.src, number: "02", kicker: "Ideas · Enterprise · Responsibility", title: "Entrepreneurship", text: "Turn a meaningful idea into a practical beginning with guidance, testing, and shared learning." },
    { image: programPhoto3.src, number: "03", kicker: "Mentorship · Exchange · Belonging", title: "Generations in Conversation", text: "Create meaningful connections where lived experience and fresh perspective strengthen one another." },
  ], [programPhoto1, programPhoto2, programPhoto3]);

  const dynamicWallFallback: ImageWallPhoto[] = useMemo(() => [
    { src: programPhoto1.src, alt: programPhoto1.alt },
    { src: programPhoto2.src, alt: programPhoto2.alt },
    { src: programPhoto3.src, alt: programPhoto3.alt },
    { src: wall1.src, alt: wall1.alt },
    { src: wall2.src, alt: wall2.alt },
    { src: wall3.src, alt: wall3.alt },
    { src: wall4.src, alt: wall4.alt },
    { src: wall5.src, alt: wall5.alt },
  ], [programPhoto1, programPhoto2, programPhoto3, wall1, wall2, wall3, wall4, wall5]);

  const { data: managedHero } = trpc.publicSite.content.useQuery({ contentKey: "homepage-hero" });
  const { data: managedGallery } = trpc.publicSite.gallery.useQuery();
  const imageWallRows = useMemo(() => {
    const publishedPhotos = (managedGallery ?? []).slice(0, 12).map((photo) => ({
      src: photo.imageUrl,
      alt: photo.altText || photo.title,
    }));

    return createImageWallRows([...publishedPhotos, ...dynamicWallFallback]);
  }, [managedGallery, dynamicWallFallback]);

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
          <PublicNavigation menuOpen={menuOpen} onNavigate={closeMenu} />
          <Link className="header-support" href="/join-us" onClick={closeMenu}><HandHeart size={22} /><span>Support Us</span></Link>
        </div>
      </header>

      <main id="top" className="public-route-enter">
        <section className="reference-hero" aria-labelledby="hero-title">
          <img className="reference-hero-image" src={heroImage.src} alt={heroImage.alt} />
          <div className="reference-hero-overlay" />
          <div className="reference-hero-content page-width">
            <p className="reference-eyebrow light"><span /> A platform for possibility</p>
            <h1 id="hero-title" className="managed-hero-title">
              {(managedHero?.title ?? "Inspiring Voices,\nBuilding Leaders,\nShaping Futures.")
                .split("\n")
                .map((line: string, index: number) => (
                  <span key={index} className="hero-title-line">
                    {line}
                  </span>
                ))}
            </h1>
            <p className="reference-hero-copy">{managedHero?.body ?? "We create a platform where the young and the aged inspire one another, build practical capability, and use their gifts to make a positive difference in the world."}</p>
            <a className="reference-button white-button" href={managedHero?.actionHref || "#connect"}>{managedHero?.actionLabel || "Support us"} <ArrowUpRight size={18} /></a>
          </div>
          <a className="hero-scroll" href="#about"><span>Discover more</span><ChevronDown size={18} /></a>
        </section>

        <section id="about" className="about-reference section-white">
          <div className="page-width about-reference-grid">
            <div className="about-reference-copy">
              <p className="reference-eyebrow"><span /> Who we are</p>
              <h2>People grow when they have a place to <span>begin.</span></h2>
              <p className="large-paragraph">Young Beginners Inspiration is a non-profit organization creating a platform that gives both the young and the old age space to inspire and be impacted.</p>
              <p>We believe every generation has something valuable to share. Through learning, public speaking, entrepreneurship, and meaningful connection, we help potential become responsible leadership.</p>
              <Link className="reference-text-link" href="/about">Discover more <ArrowRight size={18} /></Link>
            </div>
            <figure className="about-reference-image"><RotatingAboutImage slides={dynamicSlides} /></figure>
          </div>
        </section>

        <section className="problem-reference section-cream">
          <div className="page-width">
            <div className="section-split-heading"><div><p className="reference-eyebrow"><span /> The opportunity</p><h2>What happens when potential<br /><span>gets a platform?</span></h2></div><p>We start by making room for the real barriers people face—and the practical possibilities that open when they are supported.</p></div>
            <div className="problem-grid">{problemCards.map((card) => <article className={`problem-card ${card.color}`} key={card.number}><div className="problem-card-top"><span>{card.number}</span><ArrowUpRight size={18} /></div><h3>{card.title}</h3><p>{card.text}</p></article>)}</div>
          </div>
        </section>

        <section id="focus" className="solution-reference section-white">
          <div className="page-width">
            <div className="section-split-heading"><div><p className="reference-eyebrow"><span /> The solution</p><h2>Inspiration becomes impact<br /><span>through practice.</span></h2></div><p>Our focus areas give people a strong foundation for the next conversation, the next idea, and the next responsible decision.</p></div>
            <div className="solution-grid">{solutionCards.map(({ icon: Icon, title, text }) => <article className="solution-card" key={title}><div className="solution-icon"><Icon size={29} strokeWidth={1.6} /></div><h3>{title}</h3><p>{text}</p><Link className="reference-text-link" href="/focus-areas">Read more <ArrowRight size={18} /></Link></article>)}</div>
          </div>
        </section>

        <section id="initiatives" className="initiatives-reference section-cream">
          <div className="page-width"><div className="section-split-heading"><div><p className="reference-eyebrow"><span /> Our programs</p><h2>Learn something.<br /><span>Lead somewhere.</span></h2></div><p>Our programs are designed to leave people with more than inspiration: a skill, a connection, and a next step they can use.</p></div><div className="initiative-grid">{dynamicInitiatives.map((card) => <article className="initiative-card" key={card.number}><div className="initiative-image"><img src={card.image} alt="" /><span>{card.number}</span></div><div className="initiative-copy"><p className="initiative-kicker">{card.kicker}</p><h3>{card.title}</h3><p>{card.text}</p><a className="reference-text-link" href="#connect">Learn more <ArrowRight size={18} /></a></div></article>)}</div></div>
        </section>

        <section className="why-reference section-blue">
          <div className="page-width"><div className="section-split-heading light-heading"><div><p className="reference-eyebrow light"><span /> Why Young Beginners Inspiration?</p><h2>A platform that believes<br /><span>everyone can begin.</span></h2></div><p>We bring an open, practical, intergenerational approach to the work of becoming.</p></div><div className="reasons-grid">{reasons.map(({ icon: Icon, title, text }) => <article className="reason-card" key={title}><Icon size={31} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section id="connect" className="join-reference section-red"><div className="page-width join-grid"><div><p className="reference-eyebrow light"><span /> Be part of the beginning</p><h2>There is room<br />for your <span>voice.</span></h2></div><div><p>Whether you want to learn, mentor, collaborate, volunteer, or support the work, there is a meaningful way to join this platform.</p><Link className="reference-button white-button" href="/join-us">Join us today <ArrowUpRight size={18} /></Link></div></div></section>

        <section id="updates" className="updates-reference section-white"><div className="page-width"><div className="updates-heading"><div><p className="reference-eyebrow"><span /> From the platform</p><h2>Ideas worth<br /><span>carrying forward.</span></h2></div><p>Short notes and practical prompts for people finding their voice, building capability, and making a difference.</p></div><div className="updates-grid">{homepageUpdates.map((update) => <article className="update-news-card" key={update.category}><Link href="/media" aria-label={`Read ${update.title}`}><div className="update-news-image"><img src={update.image} alt={update.imageAlt} /><span className="update-category">{update.category}</span></div><div className="update-news-copy"><h3>{update.title}</h3><p className="update-news-summary">{update.summary}</p></div><div className="update-news-meta"><span>{update.source}</span><span>{update.detail}</span></div></Link></article>)}</div></div></section>

        <section id="gallery-wall" className="home-image-wall" aria-labelledby="image-wall-title">
          <div className="page-width image-wall-heading">
            <div>
              <p className="reference-eyebrow"><span /> From the YBI community</p>
              <h2 id="image-wall-title">Every gathering<br /><span>moves us forward.</span></h2>
            </div>
            <Link className="reference-text-link" href="/gallery">View gallery <ArrowRight size={18} /></Link>
          </div>
          <div className="image-wall-stage" aria-hidden="true">
            <div className="image-wall-viewport">
              {imageWallRows.map((row, rowIndex) => (
                <div className={`image-wall-track image-wall-track-${rowIndex + 1}`} key={rowIndex}>
                  {[0, 1].map((copyIndex) => (
                    <div className="image-wall-sequence" key={`${rowIndex}-sequence-${copyIndex}`}>
                      {row.map((photo, photoIndex) => (
                        <figure className="image-wall-card" key={`${rowIndex}-${copyIndex}-${photoIndex}-${photo.src}`}>
                          <img src={photo.src} alt="" loading="eager" decoding="async" />
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="image-wall-mobile-fallback">
              {imageWallRows.map((row, rowIndex) => (
                <div className={`image-wall-mobile-fallback-row${rowIndex === 1 ? " is-portrait" : ""}`} key={`fallback-${rowIndex}`}>
                  {[0, 1].map((copyIndex) => (
                    <div className="image-wall-mobile-fallback-sequence" key={`fallback-${rowIndex}-sequence-${copyIndex}`}>
                      {row.map((photo, photoIndex) => (
                        <figure className="image-wall-mobile-fallback-card" key={`fallback-${rowIndex}-${copyIndex}-${photoIndex}-${photo.src}`}>
                          <img src={photo.src} alt="" loading="eager" decoding="async" />
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="newsletter" className="newsletter-reference section-cream"><div className="page-width newsletter-reference-inner"><div className="newsletter-intro"><p className="reference-eyebrow"><span /> Stay connected</p><h2>Make room for<br /><span>the next invitation.</span></h2><p>Thoughtful updates on leadership, learning, entrepreneurship, and the people building a positive difference together.</p><div className="newsletter-topics"><span>Leadership</span><span>Learning</span><span>Community</span></div></div><div className="newsletter-signup-card"><p className="newsletter-card-kicker">Keep the conversation moving</p><form onSubmit={handleNewsletter}><div className="newsletter-field"><label htmlFor="reference-name">Full name</label><input id="reference-name" name="name" placeholder="First & last name" required /></div><div className="newsletter-field"><label htmlFor="reference-email">Email</label><input id="reference-email" name="email" type="email" placeholder="Email address" required /></div><button className="reference-button blue-button" type="submit">Subscribe <ArrowUpRight size={18} /></button><p className="newsletter-form-note">Practical notes, meaningful invitations, and stories from the YBI community.</p></form></div></div></section>
      </main>

      <PublicFooter />
    </div>
  );
}
