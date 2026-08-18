import {
  ArrowRight,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Compass,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
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
  const mentoringImage = getImage(
    "about_mentoring",
    "/ybi-assets/programs/ybi-public-speaking.jpg",
    "YBI mentor working with participants"
  );

  return (
    <PublicPageShell>
      <main className="public-page about-page">
        {/* 1. Page Hero */}
        <section className="page-hero page-hero-about">
          <div className="page-width">
            <div className="about-hero-content">
              <motion.p
                className="reference-eyebrow light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span /> About Us
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Who we are and <span>what we do.</span>
              </motion.h1>
              <motion.p
                className="hero-lead"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Young Beginners Inspiration (YBI) is a nonprofit that brings
                together youth and experienced mentors to learn, grow, and
                create real change in their communities.
              </motion.p>
            </div>
          </div>
        </section>

        {/* 2. Genesis / Story */}
        <section className="about-genesis-section section-white">
          <div className="page-width">
            <div className="about-genesis-grid">
              {/* Left — text + image */}
              <motion.div
                className="genesis-left"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
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
                <div className="genesis-image-box">
                  <img
                    src={storyImage.src}
                    alt={storyImage.alt}
                    loading="lazy"
                  />
                </div>
              </motion.div>

              {/* Right — numbered cards */}
              <div className="genesis-right">
                {[
                  {
                    num: "01",
                    title: "The Generational Divide",
                    body: "Emerging youth often lack accessible guidance and trusted networks, while older generations hold decades of rich lived experience left untapped. We saw the need to bridge this silo.",
                  },
                  {
                    num: "02",
                    title: "The Grassroots Spark",
                    body: "What began as intimate community dialogue circles and youth speaking clinics proved that two-way learning fosters deep mutual respect and unlocks dormant confidence.",
                  },
                  {
                    num: "03",
                    title: "A Growing Movement",
                    body: "Today, YBI runs structured cohorts across Public Speaking, Youth Entrepreneurship, Mentorship Circles, and Values-Led Leadership Labs across Ghana.",
                  },
                ].map(({ num, title, body }, idx) => (
                  <motion.div
                    className="genesis-card"
                    key={num}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                  >
                    <div className="genesis-card-num">{num}</div>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Vision & Mission */}
        <section id="approach" className="about-mission-section section-cream">
          <div className="page-width">
            <div className="about-mission-grid">
              <motion.div
                className="about-mission-media"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
              >
                <img src={mentoringImage.src} alt={mentoringImage.alt} loading="lazy" />
                <div className="mission-media-overlay">
                  <div className="media-tag">
                    <Compass size={16} /> Intergenerational Impact
                  </div>
                  <strong>Over 1,250 youth and elders engaged across Ghana</strong>
                </div>
              </motion.div>

              <motion.div
                className="about-mission-content"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
              >
                <p className="reference-eyebrow">
                  <span /> Mission & Vision
                </p>
                <h2>
                  Equipping generations to <span>lead with purpose.</span>
                </h2>

                <div className="mission-vision-blocks">
                  <motion.div
                    className="mv-card vision-card"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mv-card-header">
                      <Compass size={22} />
                      <h3>Our Vision</h3>
                    </div>
                    <p>
                      To inspire, motivate, and impact developing potential across leadership,
                      education, and business—building a thriving society where every generation
                      shares wisdom and opportunity.
                    </p>
                  </motion.div>

                  <motion.div
                    className="mv-card mission-card"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                  >
                    <div className="mv-card-header">
                      <Target size={22} />
                      <h3>Our Mission</h3>
                    </div>
                    <p>
                      To provide an empowering platform uniting youth ambition and elder wisdom
                      through practical skills training, voice coaching, entrepreneurship, and
                      structured mentorship to solve real-world problems.
                    </p>
                  </motion.div>
                </div>

                <Link className="reference-text-link" href="/programs">
                  Explore our core programs <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Core Values */}
        <section className="about-values-section section-white">
          <div className="page-width">
            <motion.div
              className="section-split-heading"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
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
            </motion.div>

            <div className="about-values-grid">
              {coreValues.map(({ icon: Icon, title, text }, index) => (
                <motion.article
                  className="about-value-card"
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div className="value-card-top">
                    <span className="value-index">0{index + 1}</span>
                    <div className="value-icon-box">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
