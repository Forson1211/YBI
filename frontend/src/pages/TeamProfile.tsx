import { ArrowLeft, ArrowUpRight, Linkedin, Mail, UsersRound } from "lucide-react";
import { Link, useRoute } from "wouter";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import "../team-profiles.css";

export default function TeamProfile() {
  const [, params] = useRoute("/team/:slug");
  const slug = params?.slug ?? "";
  const { data: member, isLoading } = trpc.publicSite.team.getBySlug.useQuery({ slug }, { enabled: Boolean(slug) });

  if (isLoading) {
    return <PublicPageShell><main className="public-page team-profile-page"><section className="team-profile-loading"><UsersRound size={28} /><p>Loading team profile…</p></section></main></PublicPageShell>;
  }

  if (!member) {
    return <PublicPageShell><main className="public-page team-profile-page"><section className="team-profile-loading"><h1>Profile not found</h1><p>This team profile may be unpublished or no longer available.</p><Link className="reference-button blue-button" href="/team"><ArrowLeft size={17} /> Back to the team</Link></section></main></PublicPageShell>;
  }

  const paragraphs: string[] = member.bio.split(/\n{2,}/).filter(Boolean);
  return <PublicPageShell><main className="public-page team-profile-page">
    <section className="page-hero team-profile-hero"><div className="page-width"><Link className="team-profile-back" href="/team"><ArrowLeft size={16} /> Meet the team</Link><p className="reference-eyebrow light"><span /> YBI team profile</p><div className="page-hero-layout"><div><h1>{member.name}</h1><p>{member.role}</p></div><p className="page-hero-mark">YBI<br /><span>Team</span></p></div></div></section>
    <section className="team-profile-body section-white"><div className="page-width team-profile-layout">
      <aside className="team-profile-aside">
        {member.imageUrl ? <img src={member.imageUrl} alt={`Professional portrait of ${member.name}`} /> : <div className="team-profile-image-fallback" aria-hidden="true">{member.name.slice(0, 1)}</div>}
        {(member.email || member.linkedIn) ? <div className="team-profile-contact"><p>Connect</p>{member.email ? <a href={`mailto:${member.email}`}><Mail size={17} /> Email {member.name}</a> : null}{member.linkedIn ? <a href={member.linkedIn} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn profile</a> : null}</div> : null}
      </aside>
      <article className="team-profile-copy"><p className="reference-eyebrow"><span /> About {member.name}</p><h2>A commitment to <span>shared progress.</span></h2>{paragraphs.map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}<Link className="reference-button blue-button" href="/contact">Connect with YBI <ArrowUpRight size={18} /></Link></article>
    </div></section>
  </main></PublicPageShell>;
}
