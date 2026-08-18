import { ArrowUpRight, Award, BriefcaseBusiness, Compass, HandHeart, Sparkles, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { useSiteImages } from "@/lib/useSiteImage";
import { Link } from "wouter";

export default function Team() {
  const { getImage } = useSiteImages();
  const teamCommunity = getImage("team_community", "/ybi-assets/community/ybi-community.jpg", "Community hosts and facilitators");
  const teamPublicSpeaking = getImage("team_public_speaking", "/ybi-assets/programs/ybi-public-speaking.jpg", "Program builders and mentors");
  const teamEntrepreneurship = getImage("team_entrepreneurship", "/ybi-assets/programs/ybi-entrepreneurship.jpg", "Partners and innovation coaches");
  const teamLeadership = getImage("team_leadership", "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg", "Leadership and strategic direction");

  const dynamicRoles = [
    {
      image: teamLeadership.src,
      alt: "Executive leadership and strategic direction",
      label: "Leadership & Strategy",
      title: "Executive Director & Founder",
      text: "Leads the vision and strategic expansion of YBI, championing intergenerational empowerment and building institutional partnerships across education and enterprise.",
      icon: Compass,
    },
    {
      image: teamPublicSpeaking.src,
      alt: "Programs & curriculum leadership",
      label: "Learning Design",
      title: "Programs & Curriculum Lead",
      text: "Designs experiential, hands-on curricula across public speaking, youth entrepreneurship, and leadership labs—ensuring every session delivers practical confidence.",
      icon: Award,
    },
    {
      image: teamCommunity.src,
      alt: "Intergenerational mentorship and community circles",
      label: "Intergenerational Mentorship",
      title: "Mentorship & Community Lead",
      text: "Facilitates structured mentor-mentee matching, oversees 'Generations in Conversation' circles, and fosters inclusive, intergenerational dialogue.",
      icon: UsersRound,
    },
    {
      image: teamEntrepreneurship.src,
      alt: "Community hosts and innovation partners",
      label: "Partnerships & Enterprise",
      title: "Enterprise & Venture Coach",
      text: "Mentors emerging changemakers in business model validation, seed project prototyping, and community problem-solving.",
      icon: BriefcaseBusiness,
    },
  ];

  return <PublicPageShell><main className="public-page team-page">
    <section className="page-hero page-hero-team"><div className="page-width"><p className="reference-eyebrow light"><span /> The people behind the platform</p><div className="page-hero-layout"><div><h1>People who make <span>space for possibility.</span></h1><p>YBI is carried forward by educators, mentors, and community builders who believe that young and aged voices become stronger when they have a shared room to learn, contribute, and lead.</p></div><p className="page-hero-mark">02<br /><span>Our team</span></p></div></div></section>
    
    <section className="team-lead section-white">
      <div className="page-width team-lead-grid">
        <div>
          <p className="reference-eyebrow"><span /> One shared purpose</p>
          <h2>We build the platform <span>together.</span></h2>
        </div>
        <p className="large-paragraph">From welcoming a first-time participant to connecting a seasoned mentor with a young striver, the YBI team works tirelessly to make growth feel possible, practical, and enduring.</p>
      </div>
    </section>

    <section className="team-roles section-cream">
      <div className="page-width">
        <div className="team-role-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {dynamicRoles.map(({ image, alt, label, title, text, icon: Icon }, index) => (
            <article className={`team-role-card team-role-${index + 1}`} key={title}>
              <img src={image} alt={alt} />
              <div>
                <span className="team-role-count">0{index + 1}</span>
                <Icon size={27} strokeWidth={1.6} />
                <p>{label}</p>
                <h3>{title}</h3>
                <span>{text}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="team-principles section-blue">
      <div className="page-width">
        <div>
          <p className="reference-eyebrow light"><span /> How we show up</p>
          <h2>Warm welcome.<br /><span>Clear next step.</span></h2>
        </div>
        <div className="team-principle-list">
          <p><strong>Listen first.</strong> Every generation’s lived experience adds something irreplaceable to the room.</p>
          <p><strong>Build with care.</strong> Transformative opportunities give participants real, actionable tools they can carry into life.</p>
          <p><strong>Share the stage.</strong> True responsibility grows when people are given trust, space, and a genuine platform to lead.</p>
          <p><strong>Lead with integrity.</strong> Ethical stewardship and community care guide all our operations and relationships.</p>
        </div>
      </div>
    </section>

    <section className="page-action-panel section-white">
      <div className="page-width">
        <p className="reference-eyebrow"><span /> Add your experience</p>
        <h2>Could your time, ideas, or perspective <span>strengthen the work?</span></h2>
        <Link className="reference-button blue-button" href="/contact">Start a conversation <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  </main></PublicPageShell>;
}
