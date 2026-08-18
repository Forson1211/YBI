import { useMemo } from "react";
import { ArrowLeft, ArrowUpRight, Linkedin, Mail, UsersRound } from "lucide-react";
import { Link, useRoute } from "wouter";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import "../team-profiles.css";

const FALLBACK_TEAM_PROFILES: Record<string, { name: string; role: string; bio: string; imageUrl: string; email: string }> = {
  "maxwell-odonkor": { name: "Maxwell Odonkor", role: "Executive Director", bio: "Executive Director leading the vision, strategy, and community initiatives at Young Beginners Inspiration.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "maxwell@ybi.org" },
  "viccoma-danquah": { name: "Viccoma Danquah", role: "Communications & Advocacy Officer", bio: "Overseeing external communications, community advocacy, and outreach storytelling.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "viccoma@ybi.org" },
  "breah-lyon": { name: "Breah Lyon", role: "Director of Strategy & External Affairs", bio: "Guiding strategic partnerships, organizational development, and external relations.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "breah@ybi.org" },
  "priscila-arkorful": { name: "Priscila Arkorful", role: "Finance & Administrative Associate", bio: "Managing financial administration, operational reporting, and fiscal stewardship.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "priscila@ybi.org" },
  "edem-john-amevor": { name: "Edem John Amevor", role: "Marketing Associate", bio: "Driving digital marketing, brand engagement, and audience growth across YBI channels.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "edem@ybi.org" },
  "alimatuo-nyass": { name: "Alimatuo Nyass", role: "Administrative Officer", bio: "Coordinating program logistics, internal communications, and office administration.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "alimatuo@ybi.org" },
  "forson-odonkor": { name: "Forson Odonkor", role: "Media Associate", bio: "Producing multimedia content, photography, and creative assets for YBI campaigns.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "forson@ybi.org" },
  "thelma-naroog-bamanteeh": { name: "Thelma Naroog Bamanteeh", role: "Executive Assistant", bio: "Providing executive support, schedule management, and key stakeholder coordination.", imageUrl: "/ybi-assets/community/ybi-community.jpg", email: "thelma@ybi.org" },
};

function getCachedTeamProfile(slug: string) {
  try {
    const cached = localStorage.getItem("ybi_admin_team_cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        const found = parsed.find(
          (m: any) =>
            m.slug === slug ||
            (m.name && m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === slug)
        );
        if (found) return found;
      }
    }
  } catch (e) {}
  return FALLBACK_TEAM_PROFILES[slug] || null;
}

export default function TeamProfile() {
  const [, params] = useRoute("/team/:slug");
  const slug = params?.slug ?? "";
  const { data: fetchedMember } = trpc.publicSite.team.getBySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const fallback = useMemo(() => getCachedTeamProfile(slug), [slug]);
  const member = fetchedMember || (fallback ? { ...fallback, slug, id: (fallback as any).id ?? 0, sortOrder: (fallback as any).sortOrder ?? 0, isPublished: true, linkedIn: (fallback as any).linkedIn || "" } : null);

  if (!member) {
    return <PublicPageShell><main className="public-page team-profile-page"><section className="team-profile-loading"><h1>Profile not found</h1><p>This team profile may be unpublished or no longer available.</p><Link className="reference-button blue-button" href="/team"><ArrowLeft size={17} /> Back to the team</Link></section></main></PublicPageShell>;
  }

  const paragraphs: string[] = member.bio.split(/\n{2,}/).filter(Boolean);
  return <PublicPageShell><main className="public-page team-profile-page">
    <section className="page-hero team-profile-hero"><div className="page-width"><Link className="team-profile-back" href="/team"><ArrowLeft size={16} /> Meet the team</Link><p className="reference-eyebrow light"><span /> YBI team profile</p><div className="page-hero-layout"><div><h1>{member.name}</h1><p>{member.role}</p></div><p className="page-hero-mark">YBI<br /><span>Team</span></p></div></div></section>
    <section className="team-profile-body section-white"><div className="page-width team-profile-layout">
      <aside className="team-profile-aside">
        {(() => {
          const photo = (typeof window !== "undefined" ? (
            (member.sortOrder ? localStorage.getItem(`ybi_team_photo_${member.sortOrder}`) : null) ||
            (slug ? localStorage.getItem(`ybi_team_photo_${slug}`) : null) ||
            (member.name ? localStorage.getItem(`ybi_team_photo_${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`) : null)
          ) : null) || member.imageUrl;
          return photo ? (
            <img
              src={photo}
              alt={`Professional portrait of ${member.name}`}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/ybi-assets/community/ybi-community.jpg"; }}
            />
          ) : (
            <div className="team-profile-image-fallback" aria-hidden="true">{member.name.slice(0, 1)}</div>
          );
        })()}
        {(member.email || member.linkedIn) ? <div className="team-profile-contact"><p>Connect</p>{member.email ? <a href={`mailto:${member.email}`}>{member.email}</a> : null}{member.linkedIn ? <a href={member.linkedIn} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn profile</a> : null}</div> : null}
      </aside>
      <article className="team-profile-copy"><p className="reference-eyebrow"><span /> About {member.name}</p><h2>A commitment to <span>shared progress.</span></h2>{paragraphs.map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}<Link className="reference-button blue-button" href="/contact">Connect with YBI <ArrowUpRight size={18} /></Link></article>
    </div></section>
  </main></PublicPageShell>;
}
