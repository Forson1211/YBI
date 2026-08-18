import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import "../team-profiles.css";

const TEAM_PROFILE_FALLBACK_IMAGE = "/ybi-assets/community/ybi-community.jpg";

/* Always-visible sample cards — swapped out with real data when it arrives */
const SAMPLE_MEMBERS = [
  { id: "s1", name: "Maxwell Odonkor", role: "Executive Director", slug: "#", imageUrl: "" },
  { id: "s2", name: "Viccoma Danquah", role: "Communications & Advocacy Officer", slug: "#", imageUrl: "" },
  { id: "s3", name: "Breah Lyon", role: "Director of Strategy & External Affairs", slug: "#", imageUrl: "" },
  { id: "s4", name: "Priscila Arkorful", role: "Finance & Administrative Associate", slug: "#", imageUrl: "" },
  { id: "s5", name: "Edem John Amevor", role: "Marketing Associate", slug: "#", imageUrl: "" },
  { id: "s6", name: "Alimatuo Nyass", role: "Administrative Officer", slug: "#", imageUrl: "" },
  { id: "s7", name: "Forson Odonkor", role: "Media Associate", slug: "#", imageUrl: "" },
  { id: "s8", name: "Thelma Naroog Bamanteeh", role: "Executive Assistant", slug: "#", imageUrl: "" },
];

function TeamCard({
  member,
}: {
  member: { id: string; name: string; role: string; slug: string; imageUrl: string | null | undefined };
}) {
  return (
    <Link
      href={member.slug === "#" ? "#" : `/team/${member.slug}`}
      className="team-card"
      aria-label={`Read ${member.name}'s full profile`}
    >
      <div className="team-card-photo-wrap">
        <img
          src={member.imageUrl || TEAM_PROFILE_FALLBACK_IMAGE}
          alt={`Portrait of ${member.name}`}
          className="team-card-photo"
        />
      </div>
      <div className="team-card-info">
        <h3 className="team-card-name">{member.name}</h3>
        <p className="team-card-role">{member.role}</p>
        <span className="team-card-btn">Learn More</span>
      </div>
    </Link>
  );
}

export default function Team() {
  const { data: members } = trpc.publicSite.team.list.useQuery();

  /* Show sample cards immediately; replace with real data when ready */
  const displayMembers = members?.length ? members : SAMPLE_MEMBERS;

  return (
    <PublicPageShell>
      <main className="public-page team-page">
        {/* ── Hero ── */}
        <section className="page-hero page-hero-team">
          <div className="page-width">
            <p className="reference-eyebrow light">
              <span /> The people behind the platform
            </p>
            <div className="page-hero-layout">
              <div>
                <h1>
                  Connect with <span>the team.</span>
                </h1>
                <p className="team-hero-subtitle">
                  Dedicated people working together to inspire young beginners
                  and build stronger communities.
                </p>
              </div>
              <p className="page-hero-mark">
                02
                <br />
                <span>Our team</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Team Grid — always visible, no loading gate ── */}
        <section className="team-cards-section section-white">
          <div className="page-width">
            <div className="team-card-grid">
              {displayMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
