import { ArrowUpRight, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import "../team-profiles.css";

const TEAM_PROFILE_FALLBACK_IMAGE = "/ybi-assets/community/ybi-community.jpg";

export default function Team() {
  const { data: members, isLoading } = trpc.publicSite.team.list.useQuery();

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
              </div>
              <p className="page-hero-mark">
                02
                <br />
                <span>Our team</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Team Grid ── */}
        <section className="team-cards-section section-white">
          <div className="page-width">
            {isLoading ? (
              <div className="team-directory-state">Loading the YBI team…</div>
            ) : !members?.length ? (
              <div className="team-directory-state">
                <UsersRound size={22} />
                <p>Team profiles will appear here once published.</p>
              </div>
            ) : (
              <div className="team-card-grid">
                {members.map((member) => (
                  <Link
                    key={member.id}
                    href={`/team/${member.slug}`}
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
                      <p className="team-card-role">({member.role})</p>
                      <span className="team-card-btn">Learn More</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="page-action-panel section-blue">
          <div className="page-width">
            <p className="reference-eyebrow light">
              <span /> Add your experience
            </p>
            <h2>
              Could your time, ideas, or perspective{" "}
              <span>strengthen the work?</span>
            </h2>
            <Link className="reference-button yellow-button" href="/contact">
              Start a conversation <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}
