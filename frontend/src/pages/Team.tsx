import { ArrowUpRight, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import "../team-profiles.css";

const TEAM_PROFILE_FALLBACK_IMAGE = "/ybi-assets/community/ybi-community.jpg";

export default function Team() {
  const { data: members, isLoading } = trpc.publicSite.team.list.useQuery();

  return <PublicPageShell><main className="public-page team-page">
    <section className="page-hero page-hero-team"><div className="page-width"><p className="reference-eyebrow light"><span /> The people behind the platform</p><div className="page-hero-layout"><div><h1>People who make <span>space for possibility.</span></h1><p>YBI is carried forward by educators, mentors, and community builders who believe that young and aged voices become stronger when they have a shared room to learn, contribute, and lead.</p><p className="team-hero-context">Intergenerational by design · Practical in action · Community-led</p></div><p className="page-hero-mark">02<br /><span>Our team</span></p></div></div></section>
    
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
        <div className="team-role-heading">
          <div>
            <p className="reference-eyebrow"><span /> The people who move the work</p>
            <h2>Different strengths.<br /><span>One shared platform.</span></h2>
          </div>
          <p>Each role brings practical experience, care, and accountability to the moments where beginners become contributors and community ideas become action.</p>
        </div>
        {isLoading ? <div className="team-directory-state">Loading the YBI team…</div> : !members?.length ? <div className="team-directory-state"><UsersRound size={22} /><p>Team profiles will appear here as soon as the YBI administrator publishes them.</p></div> : <div className="team-role-grid">
          {members.map((member) => (
            <Link className="team-role-card" key={member.id} href={`/team/${member.slug}`} aria-label={`Read ${member.name}'s full profile`}>
              <img src={member.imageUrl || TEAM_PROFILE_FALLBACK_IMAGE} alt={`Professional portrait of ${member.name}`} />
              <div className="team-role-copy">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <span className="team-role-link">Learn More <ArrowUpRight size={15} aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </div>}
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
        <p className="team-action-copy">Whether you are ready to mentor, partner, volunteer, or simply share an idea, there is room for your experience at YBI.</p>
        <Link className="reference-button blue-button" href="/contact">Start a conversation <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  </main></PublicPageShell>;
}
