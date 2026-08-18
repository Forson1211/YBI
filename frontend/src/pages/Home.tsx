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
  Flame,
  HandHeart,
  Lightbulb,
  Menu,
  Mic2,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  Calendar,
  Clock,
  MapPin,
  Newspaper,
  Tag,
} from "lucide-react";

const mark = "/ybi-assets/brand/ybi-logo.png";
const hero = "/ybi-assets/homepage/ybi-hero.jpg";
const publicSpeaking = aboutMediaSlides[0].src;
const community = aboutMediaSlides[1].src;
const entrepreneurship = aboutMediaSlides[2].src;

const problemCards = [
  {
    number: "01",
    title: "Unused potential",
    text: "Too many capable people never get the room, tools, or encouragement to turn latent talent into active contribution.",
    color: "red",
  },
  {
    number: "02",
    title: "Quiet voices",
    text: "Without practice and mentorship, important ideas stay unspoken instead of shaping families, classrooms, and futures.",
    color: "orange",
  },
  {
    number: "03",
    title: "Few bridges",
    text: "Young and older generations have much to learn from one another, but too few structured spaces are built for that exchange.",
    color: "blue",
  },
];

const solutionCards = [
  {
    icon: UsersRound,
    title: "Leadership",
    text: "We equip responsible leaders who understand that true influence is measured by the difference it makes for other people.",
  },
  {
    icon: BookOpen,
    title: "Education",
    text: "We make learning practical, shared, and active—so knowledge becomes confidence and confidence becomes action.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Business",
    text: "We help ideas take shape through entrepreneurship, thoughtful problem-solving, and ventures that serve real needs.",
  },
];

const programCards = [
  {
    image: publicSpeaking,
    number: "01",
    kicker: "Voice · Presence · Courage",
    title: "Public Speaking & Communication",
    text: "Master vocal presence, speech crafting, debate, and the confidence to bring your voice and ideas into any room.",
    href: "/programs#public-speaking",
  },
  {
    image: entrepreneurship,
    number: "02",
    kicker: "Ideas · Enterprise · Responsibility",
    title: "Youth Entrepreneurship & Enterprise",
    text: "Turn meaningful ideas into viable ventures through problem validation, business fundamentals, and pitch coaching.",
    href: "/programs#entrepreneurship",
  },
  {
    image: community,
    number: "03",
    kicker: "Mentorship · Intergenerational · Purpose",
    title: "Generations in Conversation",
    text: "Structured intergenerational dialogue circles connecting young ambition with elder wisdom for mutual learning.",
    href: "/programs#generations",
  },
  {
    image: "/ybi-assets/gallery/workshop-1.jpg",
    number: "04",
    kicker: "Ethics · Stewardship · Influence",
    title: "Values-Led Leadership Lab",
    text: "Develop self-awareness, ethical decision-making, and community stewardship habits to lead with enduring integrity.",
    href: "/programs#leadership",
  },
];

const reasons = [
  {
    icon: ShieldCheck,
    badgeBg: "var(--yellow)",
    iconColor: "var(--blue-deep)",
    borderColor: "var(--yellow)",
    title: "Proven Track Record",
    text: "Since our founding, YBI has demonstrated a strong record of success in empowering youth and driving positive change across Ghana.",
    linkText: "Our story & record",
    linkHref: "/about",
  },
  {
    icon: UsersRound,
    badgeBg: "var(--red)",
    iconColor: "#ffffff",
    borderColor: "var(--red)",
    title: "Grassroots Expertise",
    text: "Deeply embedded in the communities we serve, we build trust and ensure programs are relevant, practical, and highly effective.",
    linkText: "Community circles",
    linkHref: "/programs",
  },
  {
    icon: Flame,
    badgeBg: "var(--blue)",
    iconColor: "var(--yellow)",
    borderColor: "var(--blue)",
    title: "Youth-Led & Practical",
    text: "Driven by young people, our programs are uniquely designed to meet the real needs and aspirations of Ghana's emerging leaders.",
    linkText: "Explore cohorts",
    linkHref: "/programs",
  },
  {
    icon: HandHeart,
    badgeBg: "var(--orange)",
    iconColor: "var(--blue-deep)",
    borderColor: "var(--orange)",
    title: "Focus on Stewardship",
    text: "We are committed to developing sustainable strategies and ethical leadership that address core community needs for enduring change.",
    linkText: "Get involved",
    linkHref: "/get-involved",
  },
];

const impactStats = [
  {
    number: "1,250+",
    title: "Youth & Community Reached",
    desc: "Young learners and emerging leaders equipped through workshops and cohorts.",
  },
  {
    number: "500+",
    title: "Mentorship Hours",
    desc: "Dedicated one-on-one and small group intergenerational coaching sessions.",
  },
  {
    number: "35+",
    title: "Cohorts Delivered",
    desc: "Hands-on speaking, entrepreneurship, and leadership cohorts run across Ghana.",
  },
  {
    number: "15+",
    title: "Communities Engaged",
    desc: "Partner schools, youth hubs, and intergenerational spaces connected.",
  },
];

const testimonials = [
  {
    quote:
      "YBI gave me the courage to speak up and trust my ideas. Having an elder mentor who genuinely listened changed my entire outlook on what I can achieve.",
    author: "Kofi A.",
    role: "Public Speaking Mentee",
    initials: "KA",
  },
  {
    quote:
      "Mentoring with YBI showed me how much the next generation has to teach us. It’s a true two-way exchange of wisdom and vibrant energy.",
    author: "Evelyn D.",
    role: "Intergenerational Mentor",
    initials: "ED",
  },
  {
    quote:
      "The practical confidence and values-led focus YBI instills in young people is transforming local community leadership across Ghana.",
    author: "Marcus T.",
    role: "Community Partner",
    initials: "MT",
  },
];

function RotatingAboutImage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const changeImage = (step: 1 | -1) => {
    setActiveIndex((currentIndex) => {
      setExitingIndex(currentIndex);
      setDirection(step);
      return (currentIndex + step + aboutMediaSlides.length) % aboutMediaSlides.length;
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
  }, [reducedMotion]);

  return (
    <div
      aria-label="Images from Young Beginners Inspiration activities"
      className="about-image-rotator"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const endX = event.changedTouches[0]?.clientX;
        if (touchStartX.current === null || endX === undefined) return;
        const distance = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(distance) < 36) return;
        changeImage(distance < 0 ? 1 : -1);
      }}
    >
      {aboutMediaSlides.map((image, index) => (
        <img
          aria-hidden="true"
          alt=""
          className={`about-rotating-image${index === activeIndex ? " is-active" : ""}${
            index === exitingIndex ? " is-exiting" : ""
          }${direction === -1 ? " is-reverse" : ""}`}
          key={image.src}
          src={image.src}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getImage } = useSiteImages();

  const heroImage = getImage("home_hero", "/ybi-assets/homepage/ybi-hero.jpg", "Young facilitator inspiring participants");
  const wall1 = getImage("home_wall_1", "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg", "Young facilitator leading a community leadership workshop");
  const wall2 = getImage("home_wall_2", "/ybi-assets/image-wall/ybi-wall-intergenerational-mentoring.jpg", "Intergenerational mentoring around a practical project");
  const wall3 = getImage("home_wall_3", "/ybi-assets/image-wall/ybi-wall-entrepreneurship.jpg", "Community members developing an entrepreneurship idea");
  const wall4 = getImage("home_wall_4", "/ybi-assets/image-wall/ybi-wall-public-speaking.jpg", "Young participant practicing public speaking");
  const wall5 = getImage("home_wall_5", "/ybi-assets/image-wall/ybi-wall-community-circle.jpg", "An outdoor intergenerational community circle");

  const utils = trpc.useUtils();
  const { data: managedHero } = trpc.publicSite.content.useQuery({ contentKey: "homepage-hero" });
  const { data: managedGallery } = trpc.publicSite.gallery.useQuery();
  const { data: upcomingEvents } = trpc.publicSite.events.list.useQuery();
  const { data: latestBlogPosts } = trpc.publicSite.blog.list.useQuery({ limit: 3 });


  const dynamicEvents = useMemo(() => {
    if (!upcomingEvents) return [];
    const now = new Date().getTime();
    return upcomingEvents
      .filter((e) => new Date(e.scheduledFor).getTime() >= now)
      .slice(0, 3);
  }, [upcomingEvents]);

  const dynamicWallFallback: ImageWallPhoto[] = useMemo(
    () => [
      { src: publicSpeaking, alt: "Young people developing public-speaking confidence" },
      { src: entrepreneurship, alt: "Participants exploring entrepreneurship together" },
      { src: community, alt: "Intergenerational community conversation" },
      { src: wall1.src, alt: wall1.alt },
      { src: wall2.src, alt: wall2.alt },
      { src: wall3.src, alt: wall3.alt },
      { src: wall4.src, alt: wall4.alt },
      { src: wall5.src, alt: wall5.alt },
    ],
    [wall1, wall2, wall3, wall4, wall5]
  );

  const imageWallRows = useMemo(() => {
    const publishedPhotos = (managedGallery ?? []).slice(0, 12).map((photo) => ({
      src: photo.imageUrl,
      alt: photo.altText || photo.title,
    }));
    return createImageWallRows([...publishedPhotos, ...dynamicWallFallback]);
  }, [managedGallery, dynamicWallFallback]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="reference-site-shell">
      {/* Header */}
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
          <Link
            className="reference-brand"
            href="/"
            onClick={closeMenu}
            aria-label="Young Beginners Inspiration home"
          >
            <img src={mark} alt="Young Beginners Inspiration logo" />
            <span>
              Young Beginners
              <br />
              Inspiration
            </span>
          </Link>
          <PublicNavigation menuOpen={menuOpen} onNavigate={closeMenu} />
          <Link className="header-support" href="/get-involved#donate" onClick={closeMenu}>
            <HandHeart size={22} />
            <span>Support Us</span>
          </Link>
        </div>
      </header>

      <main id="top" className="public-route-enter">
        {/* 1. DOCUMENTARY HERO SECTION (Ground-Truth Classic) */}
        <section id="hero" className="reference-hero" aria-labelledby="hero-title">
          <img
            className="reference-hero-image"
            src={heroImage.src}
            alt={heroImage.alt || "Young Beginners Inspiration community gathering"}
            loading="eager"
            decoding="async"
          />
          <div className="reference-hero-overlay" />
          <div className="reference-hero-content page-width">
            <p className="reference-eyebrow light">
              <span /> A platform for possibility
            </p>
            <h1 id="hero-title" className="managed-hero-title">
              {(managedHero?.title ?? "Inspiring Voices,\nBuilding Leaders,\nShaping Futures.")
                .split("\n")
                .map((line: string, index: number) => (
                  <span key={index} className="hero-title-line">
                    {line}
                  </span>
                ))}
            </h1>

            <p className="reference-hero-copy">
              {managedHero?.body ??
                "We create a platform where the young and the aged inspire one another, build practical capability, and use their gifts to make a positive difference in the world."}
            </p>
            <Link
              className="reference-button white-button"
              href={managedHero?.actionHref || "/get-involved#donate"}
            >
              {managedHero?.actionLabel || "Support us"} <ArrowUpRight size={18} />
            </Link>
          </div>
          <a className="hero-scroll" href="#about" aria-label="Scroll to discover more">
            <span>Discover more</span>
            <ChevronDown size={18} />
          </a>
        </section>

        {/* 2. ABOUT SECTION (Who we are + Rotating about media) */}
        <section id="about" className="about-reference section-white">
          <div className="page-width about-reference-grid">
            <div className="about-reference-copy">
              <p className="reference-eyebrow">
                <span /> Who we are
              </p>
              <h2>
                People grow when they have a place to <span>begin.</span>
              </h2>
              <p className="large-paragraph">
                Young Beginners Inspiration (YBI) is a non-profit organization creating a platform
                that gives both the young and the old age space to inspire and be impacted.
              </p>
              <p>
                We believe every generation has something valuable to share. Through learning,
                public speaking, entrepreneurship, and meaningful connection, we help potential
                become responsible leadership.
              </p>
              <Link className="reference-text-link" href="/about">
                Discover more <ArrowRight size={18} />
              </Link>
            </div>
            <figure className="about-reference-image">
              <RotatingAboutImage />
            </figure>
          </div>
        </section>

        {/* 3. THE OPPORTUNITY / PROBLEM CARDS */}
        <section className="problem-reference section-cream">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> The opportunity
                </p>
                <h2>
                  What happens when potential
                  <br />
                  <span>gets a platform?</span>
                </h2>
              </div>
              <p>
                We start by making room for the real barriers people face—and the practical
                possibilities that open when they are supported.
              </p>
            </div>
            <div className="problem-grid">
              {problemCards.map((card) => (
                <article className={`problem-card ${card.color}`} key={card.number}>
                  <div className="problem-card-top">
                    <span>{card.number}</span>
                    <ArrowUpRight size={18} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. THE THREE PILLARS / FOCUS AREAS */}
        <section id="focus" className="solution-reference section-white">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> Our Three Pillars
                </p>
                <h2>
                  Inspiration becomes impact
                  <br />
                  <span>through practice.</span>
                </h2>
              </div>
              <p>
                Our core focus areas give youth and community elders a strong foundation for the
                next conversation, the next venture, and the next responsible decision.
              </p>
            </div>
            <div className="solution-grid">
              {solutionCards.map(({ icon: Icon, title, text }) => (
                <article className="solution-card" key={title}>
                  <div className="solution-icon">
                    <Icon size={29} strokeWidth={1.6} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <Link className="reference-text-link" href="/focus-areas">
                    Read more <ArrowRight size={18} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CORE PROGRAMS — 4 INITIATIVES */}
        <section id="programs" className="initiatives-reference section-cream">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> Core Programs
                </p>
                <h2>
                  Learn something.
                  <br />
                  <span>Lead somewhere.</span>
                </h2>
              </div>
              <p>
                Our cohorts are designed to leave participants with more than inspiration:
                practical skills, enduring networks, and clear steps forward.
              </p>
            </div>

            <div className="initiative-grid four-cards">
              {programCards.map((card) => (
                <article className="initiative-card" key={card.number}>
                  <div className="initiative-image">
                    <img src={card.image} alt={card.title} loading="lazy" />
                    <span>{card.number}</span>
                  </div>
                  <div className="initiative-copy">
                    <p className="initiative-kicker">{card.kicker}</p>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    <Link className="reference-text-link" href={card.href}>
                      Explore cohort <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. UPCOMING GATHERINGS & EVENTS */}
        <section id="events" className="home-events-section section-white">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> Live Calendar
                </p>
                <h2>
                  Gatherings, Workshops
                  <br />
                  <span>& Masterclasses.</span>
                </h2>
              </div>
              <Link href="/events" className="reference-text-link">
                View all upcoming events <ArrowRight size={18} />
              </Link>
            </div>

            {dynamicEvents.length > 0 ? (
              <div className="home-events-grid">
                {dynamicEvents.map((evt) => {
                  const date = new Date(evt.scheduledFor);
                  const priceFormatted =
                    evt.isFree || evt.priceGhs === 0
                      ? "Free"
                      : `GHS ${(evt.priceGhs / 100).toFixed(2)}`;
                  const eventImg =
                    evt.imageUrl ||
                    (evt.slug.includes("speaking")
                      ? publicSpeaking
                      : evt.slug.includes("generations")
                      ? community
                      : entrepreneurship);

                  return (
                    <article className="home-event-card" key={evt.id}>
                      <div className="home-event-media">
                        <img
                          src={eventImg}
                          alt={evt.title}
                          loading="lazy"
                        />
                        <div className="home-event-date-chip">
                          <span className="month">
                            {date.toLocaleString("default", { month: "short" })}
                          </span>
                          <span className="day">{date.getDate()}</span>
                        </div>
                        <span className={`home-event-price ${evt.isFree ? "free" : "paid"}`}>
                          {priceFormatted}
                        </span>
                      </div>
                      <div className="home-event-body">
                        <div className="home-event-meta">
                          <span className="location-badge">
                            <MapPin size={13} /> {evt.location}
                          </span>
                        </div>
                        <h3>
                          <Link href={`/events/${evt.slug}`}>{evt.title}</Link>
                        </h3>
                        <p>{evt.description.slice(0, 130)}…</p>
                        <Link
                          href={`/events/${evt.slug}`}
                          className="home-event-register-btn"
                          onMouseEnter={() => utils.publicSite.events.getBySlug.prefetch({ slug: evt.slug })}
                          onFocus={() => utils.publicSite.events.getBySlug.prefetch({ slug: evt.slug })}
                        >
                          <span>Register now</span>
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </article>
                  );
                })}

              </div>
            ) : (
              <div className="empty-events-banner">
                <Calendar size={32} />
                <p>New cohorts and masterclasses are being scheduled.</p>
                <Link href="/events" className="reference-button blue-button">
                  Browse Event Archive <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 8. WHY YBI */}
        <section className="why-reference section-blue">
          <div className="page-width">
            <div className="section-split-heading light-heading">
              <div>
                <p className="reference-eyebrow light">
                  <span /> Why Young Beginners Inspiration?
                </p>
                <h2>
                  A platform that believes
                  <br />
                  <span>everyone can begin.</span>
                </h2>
              </div>
              <p>
                We bring an open, practical, intergenerational approach to the work of becoming.
              </p>
            </div>
            <div className="reasons-grid">
              {reasons.map(
                ({
                  icon: IconComponent,
                  badgeBg,
                  iconColor,
                  borderColor,
                  title,
                  text,
                  linkText,
                  linkHref,
                }) => (
                  <article
                    className="reason-card"
                    key={title}
                    style={{ borderTopColor: borderColor }}
                  >
                    <div
                      className="reason-icon-wrapper"
                      style={{
                        background: badgeBg,
                        color: iconColor,
                        borderRadius: "50%",
                      }}
                    >
                      <IconComponent size={28} strokeWidth={2.2} />
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <Link href={linkHref} className="reason-card-action">
                      <span>{linkText}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        {/* 9. IMPACT METRICS GRID */}
        <section className="impact-reference section-cream">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> Measurable Change
                </p>
                <h2>
                  Building momentum,
                  <br />
                  <span>one leader at a time.</span>
                </h2>
              </div>
              <p>
                Through sustained cohorts, intergenerational mentoring, and local partnerships, we
                are creating pathways of practical empowerment across Ghana.
              </p>
            </div>

            <div className="impact-grid">
              {impactStats.map((stat) => (
                <div key={stat.title} className="impact-card">
                  <div className="impact-card-top">
                    <strong className="impact-number">{stat.number}</strong>
                    <div className="impact-badge-dot" />
                  </div>
                  <h3>{stat.title}</h3>
                  <p>{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 10. LATEST JOURNAL ARTICLES */}
        <section id="blog" className="home-blog-section section-white">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> Editorial Journal
                </p>
                <h2>
                  Ideas worth
                  <br />
                  <span>carrying forward.</span>
                </h2>
              </div>
              <Link href="/blog" className="reference-text-link">
                Explore all articles <ArrowRight size={18} />
              </Link>
            </div>

            <div className="home-blog-grid">
              {(latestBlogPosts ?? []).slice(0, 3).map((post) => {
                const fallbackImg =
                  post.category === "Entrepreneurship"
                    ? "/ybi-assets/programs/ybi-entrepreneurship.jpg"
                    : post.category === "Mentorship"
                    ? "/ybi-assets/community/ybi-community.jpg"
                    : "/ybi-assets/programs/ybi-public-speaking.jpg";
                return (
                  <article key={post.id} className="home-blog-card">
                    <div className="home-blog-cover">
                      <Link href={`/blog/${post.slug}`} className="home-blog-cover-link">
                        <img
                          src={post.coverImageUrl || fallbackImg}
                          alt={post.title}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackImg;
                          }}
                        />
                      </Link>
                      <span className="home-blog-category">{post.category}</span>
                    </div>
                    <div className="home-blog-content">
                      <div className="home-blog-meta-top">
                        <span className="home-blog-date">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                        {post.authorName && (
                          <span className="home-blog-author">By {post.authorName}</span>
                        )}
                      </div>
                      <h3>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p>{post.excerpt}</p>
                      <div className="home-blog-footer">
                        <Link href={`/blog/${post.slug}`} className="home-blog-read-link">
                          <span>Read article</span>
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 10. TESTIMONIALS */}
        <section id="testimonials" className="testimonials-reference section-white">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> Community Voices
                </p>
                <h2>
                  Stories of growth,
                  <br />
                  <span>mentorship, and trust.</span>
                </h2>
              </div>
              <p>
                Hear from the mentees, intergenerational elders, and partners who bring the YBI
                platform to life.
              </p>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((t) => (
                <article className="testimonial-card" key={t.author}>
                  <p className="testimonial-quote">{t.quote}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div className="testimonial-meta">
                      <strong>{t.author}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 13. FINAL CTA BAND */}
        <section id="connect" className="join-reference section-red">
          <div className="page-width join-grid">
            <div>
              <p className="reference-eyebrow light">
                <span /> Be part of the beginning
              </p>
              <h2>
                There is room
                <br />
                for your <span>voice.</span>
              </h2>
            </div>
            <div>
              <p>
                Whether you want to learn, mentor, collaborate, volunteer, or support the work
                financially, there is a meaningful place for you here.
              </p>
              <div className="join-buttons-row">
                <Link className="reference-button white-button" href="/get-involved#donate">
                  Support Us <ArrowUpRight size={18} />
                </Link>
                <Link className="reference-button yellow-button" href="/get-involved#volunteer">
                  Become a Mentor <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 14. GALLERY WALL MARQUEE */}
        <section id="gallery-wall" className="home-image-wall" aria-labelledby="image-wall-title">
          <div className="page-width image-wall-heading">
            <div>
              <p className="reference-eyebrow">
                <span /> From the YBI community
              </p>
              <h2 id="image-wall-title">
                Every gathering
                <br />
                <span>moves us forward.</span>
              </h2>
            </div>
            <Link className="reference-text-link" href="/gallery">
              View gallery <ArrowRight size={18} />
            </Link>
          </div>
          <div className="image-wall-stage" aria-hidden="true">
            <div className="image-wall-viewport">
              {imageWallRows.map((row, rowIndex) => (
                <div
                  className={`image-wall-track image-wall-track-${rowIndex + 1}`}
                  key={rowIndex}
                >
                  {[0, 1].map((copyIndex) => (
                    <div
                      className="image-wall-sequence"
                      key={`${rowIndex}-sequence-${copyIndex}`}
                    >
                      {row.map((photo, photoIndex) => (
                        <figure
                          className="image-wall-card"
                          key={`${rowIndex}-${copyIndex}-${photoIndex}-${photo.src}`}
                        >
                          <img src={photo.src} alt="" loading="lazy" decoding="async" />
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="image-wall-mobile-fallback">
              {imageWallRows.map((row, rowIndex) => (
                <div
                  className={`image-wall-mobile-fallback-row${
                    rowIndex === 1 ? " is-portrait" : ""
                  }`}
                  key={`fallback-${rowIndex}`}
                >
                  {[0, 1].map((copyIndex) => (
                    <div
                      className="image-wall-mobile-fallback-sequence"
                      key={`fallback-${rowIndex}-sequence-${copyIndex}`}
                    >
                      {row.map((photo, photoIndex) => (
                        <figure
                          className="image-wall-mobile-fallback-card"
                          key={`fallback-${rowIndex}-${copyIndex}-${photoIndex}-${photo.src}`}
                        >
                          <img src={photo.src} alt="" loading="lazy" decoding="async" />
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

    </div>
  );
}
