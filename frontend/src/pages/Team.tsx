import { useEffect, useMemo, useState } from "react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import "../team-profiles.css";

const TEAM_PROFILE_FALLBACK_IMAGE = "/ybi-assets/community/ybi-community.jpg";

/* Always-visible team member profiles */
const SAMPLE_MEMBERS = [
  { id: 1, name: "Maxwell Odonkor", role: "Executive Director", slug: "maxwell-odonkor", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
  { id: 2, name: "Viccoma Danquah", role: "Communications & Advocacy Officer", slug: "viccoma-danquah", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
  { id: 3, name: "Breah Lyon", role: "Director of Strategy & External Affairs", slug: "breah-lyon", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
  { id: 4, name: "Priscila Arkorful", role: "Finance & Administrative Associate", slug: "priscila-arkorful", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
  { id: 5, name: "Edem John Amevor", role: "Marketing Associate", slug: "edem-john-amevor", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
  { id: 6, name: "Alimatuo Nyass", role: "Administrative Officer", slug: "alimatuo-nyass", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
  { id: 7, name: "Forson Odonkor", role: "Media Associate", slug: "forson-odonkor", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
  { id: 8, name: "Thelma Naroog Bamanteeh", role: "Executive Assistant", slug: "thelma-naroog-bamanteeh", imageUrl: "/ybi-assets/community/ybi-community.jpg" },
];

function getInitialPublicTeam() {
  try {
    const cached = localStorage.getItem("ybi_admin_team_cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return SAMPLE_MEMBERS;
}

function TeamCard({
  member,
}: {
  member: { id: string | number; name: string; role: string; slug: string; sortOrder?: number; imageUrl: string | null | undefined };
}) {
  const photo = (typeof window !== "undefined" ? (
    (member.sortOrder ? localStorage.getItem(`ybi_team_photo_${member.sortOrder}`) : null) ||
    (member.slug ? localStorage.getItem(`ybi_team_photo_${member.slug}`) : null) ||
    (member.name ? localStorage.getItem(`ybi_team_photo_${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`) : null)
  ) : null) || member.imageUrl || TEAM_PROFILE_FALLBACK_IMAGE;

  return (
    <Link
      href={member.slug === "#" ? "#" : `/team/${member.slug}`}
      className="team-card"
      aria-label={`Read ${member.name}'s full profile`}
    >
      <div className="team-card-photo-wrap">
        <img
          src={photo}
          alt={`Portrait of ${member.name}`}
          className="team-card-photo"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = TEAM_PROFILE_FALLBACK_IMAGE;
          }}
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
  const [cached] = useState(getInitialPublicTeam);

  const displayMembers = useMemo(() => {
    const base = cached.length > 0 ? cached : SAMPLE_MEMBERS;
    const slots = base.map((s) => ({ ...s }));
    if (members && members.length > 0) {
      for (const m of members) {
        const order = Number(m.sortOrder) || 1;
        const slotIndex = order >= 1 && order <= 8 ? order - 1 : -1;
        if (slotIndex >= 0 && slotIndex < slots.length) {
          slots[slotIndex] = { ...slots[slotIndex], ...m, id: m.id ?? slots[slotIndex].id };
        } else {
          slots.push(m);
        }
      }
    }
    return slots;
  }, [members, cached]);

  useEffect(() => {
    if (displayMembers && displayMembers.length > 0) {
      try {
        localStorage.setItem("ybi_admin_team_cache", JSON.stringify(displayMembers));
      } catch (e) {}
    }
  }, [displayMembers]);

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
