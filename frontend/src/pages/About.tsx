import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Compass,
  Target,
  Quote,
} from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { useSiteImages } from "@/lib/useSiteImage";
import { Link } from "wouter";

const coreValues = [
  {
    icon: UsersRound,
    title: "Intergenerational Exchange",
    text: "We believe wisdom and possibility move in both directions between youth and elders.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Responsibility",
    text: "We measure leadership by its positive, trustworthy impact on families and communities.",
  },
  {
    icon: Sparkles,
    title: "Inclusive Opportunity",
    text: "We create welcoming spaces where people of every background have room to begin and be heard.",
  },
  {
    icon: Lightbulb,
    title: "Practical Action",
    text: "We turn curiosity and ideas into tangible skills, sustainable ventures, and real-world solutions.",
  },
  {
    icon: HeartHandshake,
    title: "Community Care",
    text: "We foster mutual respect, active listening, and collective growth across all generations.",
  },
];

export default function About() {
  const { getImage } = useSiteImages();
  const storyImage = getImage(
    "about_story_main",
    "/ybi-assets/community/ybi-community.jpg",
    "YBI participants sharing an intergenerational conversation"
  );
  const quoteImage = getImage(
    "about_quote_band",
    "/ybi-assets/programs/ybi-public-speaking.jpg",
    "A participant practicing public speaking with YBI"
  );

  return (
    <PublicPageShell>
      <main className="public-page about-page">
        {/* 1. Page Hero */}
        <section className="page-hero page-hero-about">
          <div className="page-width">
            <div className="about-hero-content">
              <p className="reference-eyebrow light">
                <span /> About Young Beginners Inspiration
              </p>
              <h1>
                A platform where generations <span>inspire, learn, and lead.</span>
              </h1>
              <p className="hero-lead">
                Young Beginners Inspiration creates space for youth, community elders, and emerging
                leaders to learn from one another, build practical capabilities, and use their gifts
                to make a lasting difference.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Why YBI Exists / Story Section */}
        <section className="about-genesis-section section-white">
          <div className="page-width">
            <div className="about-genesis-grid">
              <div className="genesis-left">
                <p className="reference-eyebrow">
                  <span /> The Genesis
                </p>
                <h2>
                  Potential needs a <span>platform.</span>
                </h2>

                <p className="genesis-lead">
                  Young Beginners Inspiration (YBI) was founded on a simple conviction: potential
                  needs a platform, and every person—regardless of age—carries something invaluable
                  to contribute.
                </p>

                <div className="genesis-quote-card">
                  <Quote size={24} className="quote-icon" />
                  <p>
                    “When a young person with energy is paired with an elder with perspective,
                    leadership ceases to be an abstract concept—it becomes real community action.”
                  </p>
                </div>
              </div>

              <div className="genesis-right">
                <div className="genesis-card">
                  <div className="genesis-card-num">01</div>
                  <div>
                    <h3>The Generational Divide</h3>
                    <p>
                      Emerging youth often lack accessible guidance and trusted networks, while older
                      generations hold decades of rich lived experience left untapped. We saw the
                      need to bridge this silo.
                    </p>
                  </div>
                </div>

                <div className="genesis-card">
                  <div className="genesis-card-num">02</div>
                  <div>
                    <h3>The Grassroots Spark</h3>
                    <p>
                      What began as intimate community dialogue circles and youth speaking clinics
                      proved that two-way learning fosters deep mutual respect and unlocks dormant
                      confidence.
                    </p>
                  </div>
                </div>

                <div className="genesis-card">
                  <div className="genesis-card-num">03</div>
                  <div>
                    <h3>A Growing Movement</h3>
                    <p>
                      Today, YBI runs structured cohorts across Public Speaking, Youth
                      Entrepreneurship, Mentorship Circles, and Values-Led Leadership Labs across
                      Ghana.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Vision & Mission */}
        <section id="approach" className="about-mission-section section-cream">
          <div className="page-width">
            <div className="about-mission-grid">
              <div className="about-mission-media">
                <img src={storyImage.src} alt={storyImage.alt} loading="lazy" />
                <div className="mission-media-overlay">
                  <div className="media-tag">
                    <Compass size={16} /> Intergenerational Impact
                  </div>
                  <strong>Over 1,250 youth and elders engaged across Ghana</strong>
                </div>
              </div>

              <div className="about-mission-content">
                <p className="reference-eyebrow">
                  <span /> Mission & Vision
                </p>
                <h2>
                  Equipping generations to <span>lead with purpose.</span>
                </h2>

                <div className="mission-vision-blocks">
                  <div className="mv-card vision-card">
                    <div className="mv-card-header">
                      <Compass size={22} />
                      <h3>Our Vision</h3>
                    </div>
                    <p>
                      To inspire, motivate, and impact developing potential across leadership,
                      education, and business—building a thriving society where every generation
                      shares wisdom and opportunity.
                    </p>
                  </div>

                  <div className="mv-card mission-card">
                    <div className="mv-card-header">
                      <Target size={22} />
                      <h3>Our Mission</h3>
                    </div>
                    <p>
                      To provide an empowering platform uniting youth ambition and elder wisdom
                      through practical skills training, voice coaching, entrepreneurship, and
                      structured mentorship to solve real-world problems.
                    </p>
                  </div>
                </div>

                <Link className="reference-text-link" href="/programs">
                  Explore our core programs <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Core Values */}
        <section className="about-values-section section-white">
          <div className="page-width">
            <div className="section-split-heading">
              <div>
                <p className="reference-eyebrow">
                  <span /> What guides us
                </p>
                <h2>
                  Our Core <span>Values.</span>
                </h2>
              </div>
              <p>
                Five foundational principles that guide how we operate, gather, mentor, and build
                enduring community together.
              </p>
            </div>

            <div className="about-values-grid">
              {coreValues.map(({ icon: Icon, title, text }, index) => (
                <article className="about-value-card" key={title}>
                  <div className="value-card-top">
                    <span className="value-index">0{index + 1}</span>
                    <div className="value-icon-box">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. The Invitation CTA Band */}
        <section className="about-invitation-band">
          <div className="page-width">
            <div className="about-invitation-grid">
              <div className="invitation-image-box">
                <img src={quoteImage.src} alt={quoteImage.alt} loading="lazy" />
              </div>
              <div className="invitation-text-box">
                <p className="reference-eyebrow light">
                  <span /> The Invitation
                </p>
                <h2>

                  Bring your experience.
                  <br />
                  <span>Make room for another person’s beginning.</span>
                </h2>
                <p>
                  Whether you are a young person looking for a platform to express your ideas or a
                  seasoned professional ready to mentor, there is a place for you at YBI.
                </p>
                <div className="invitation-actions">
                  <Link className="reference-button yellow-button" href="/get-involved">
                    Get Involved With Us <ArrowUpRight size={18} />
                  </Link>
                  <Link className="reference-button outline-light" href="/contact">
                    Contact Our Team <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

