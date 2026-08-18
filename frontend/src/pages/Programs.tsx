import { ArrowRight, ArrowUpRight, Check, Compass, Mic2, Sparkles, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { useSiteImages } from "@/lib/useSiteImage";
import { Link } from "wouter";

export default function Programs() {
  const { getImage } = useSiteImages();
  const publicSpeaking = getImage("program_public_speaking", "/ybi-assets/programs/ybi-public-speaking.jpg", "Public speaking practice");
  const entrepreneurship = getImage("program_entrepreneurship", "/ybi-assets/programs/ybi-entrepreneurship.jpg", "Youth entrepreneurship workshop");
  const community = getImage("program_community", "/ybi-assets/community/ybi-community.jpg", "Generations in conversation circle");
  const leadership = getImage("program_leadership", "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg", "Values-led leadership workshop");

  const dynamicPrograms = [
    { id: "public-speaking", image: publicSpeaking.src, alt: publicSpeaking.alt, kicker: "Voice · Presence · Courage", title: "Public Speaking & Communication", text: "Master vocal presence, speech crafting, debate, and the confidence to bring your voice and ideas into any room with clarity and conviction.", icon: Mic2 },
    { id: "entrepreneurship", image: entrepreneurship.src, alt: entrepreneurship.alt, kicker: "Ideas · Enterprise · Responsibility", title: "Youth Entrepreneurship & Enterprise", text: "Turn meaningful ideas into viable ventures through problem validation, business fundamentals, financial literacy, and pitch coaching.", icon: Sparkles },
    { id: "generations", image: community.src, alt: community.alt, kicker: "Mentorship · Intergenerational · Purpose", title: "Generations in Conversation", text: "Structured intergenerational dialogue circles and 1-on-1 mentorship pairings connecting young ambition with elder wisdom to solve real community challenges.", icon: UsersRound },
    { id: "leadership-lab", image: leadership.src, alt: leadership.alt, kicker: "Character · Ethics · Impact", title: "Values-Led Leadership Lab", text: "Develop self-awareness, ethical decision-making, and community stewardship habits to lead with integrity and measurable positive impact.", icon: Compass },
  ];

  return <PublicPageShell><main className="public-page programs-page">
    <section className="page-hero page-hero-programs"><div className="page-width"><p className="reference-eyebrow light"><span /> YBI programs</p><div className="page-hero-layout"><div><h1>Learn something.<br /><span>Lead somewhere.</span></h1><p>Our programs turn curiosity into practical confidence and community leadership through hands-on practice, dialogue, and mentorship.</p></div><p className="page-hero-mark">04<br /><span>Programs</span></p></div></div></section>
    
    <section className="programs-intro section-white">
      <div className="page-width programs-intro-grid">
        <div>
          <p className="reference-eyebrow"><span /> A practical pathway</p>
          <h2>More than a good conversation.</h2>
        </div>
        <p className="large-paragraph">Every YBI program is designed to leave participants with a marketable skill, a trusted intergenerational connection, and an actionable next step.</p>
      </div>
    </section>

    <section className="programs-list section-cream">
      <div className="page-width">
        {dynamicPrograms.map(({ id, image, alt, kicker, title, text, icon: Icon }, index) => (
          <article id={id} className={`program-feature program-feature-${index + 1}`} key={id}>
            <img src={image} alt={alt} />
            <div className="program-feature-copy">
              <p>{kicker}</p>
              <div className="program-title-row">
                <Icon size={30} strokeWidth={1.5} />
                <h2>{title}</h2>
              </div>
              <span>{text}</span>
              <Link className="reference-text-link" href="/contact">Ask about joining this cohort <ArrowRight size={18} /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="programs-path section-white">
      <div className="page-width">
        <div className="section-split-heading">
          <div>
            <p className="reference-eyebrow"><span /> How we learn</p>
            <h2>A clear pathway<br /><span>into action.</span></h2>
          </div>
          <p>Every cohort guides participants through four progressive milestones from discovery to community leadership.</p>
        </div>
        <div className="program-step-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {[
            { step: "01", title: "Arrive with curiosity", text: "Join an orientation circle and identify your growth goals." },
            { step: "02", title: "Practice with others", text: "Engage in experiential workshops, mock pitches, and speaking drills." },
            { step: "03", title: "Intergenerational Mentorship", text: "Pair with an experienced mentor for personalized feedback and guidance." },
            { step: "04", title: "Lead in community", text: "Launch a practical project or showcase your voice to create real local impact." },
          ].map(({ step, title, text }) => (
            <article key={step}>
              <span>{step}</span>
              <Check size={25} />
              <h3>{title}</h3>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.78)", fontSize: "13px" }}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="page-action-panel section-red">
      <div className="page-width">
        <p className="reference-eyebrow light"><span /> Find your program</p>
        <h2>Tell us what you want to <span>grow into.</span></h2>
        <Link className="reference-button white-button" href="/contact">Connect with YBI <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  </main></PublicPageShell>;
}
