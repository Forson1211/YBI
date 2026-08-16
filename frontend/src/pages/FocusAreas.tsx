import { ArrowUpRight, BookOpen, BriefcaseBusiness, Lightbulb, Mic2, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { Link } from "wouter";

const areas = [
  { id: "leadership", number: "01", icon: UsersRound, title: "Leadership", text: "Build self-awareness, communication, and the everyday choices that make influence trustworthy.", accent: "blue" },
  { id: "education", number: "02", icon: BookOpen, title: "Education", text: "Make learning active through shared knowledge, reflection, and opportunities to teach one another.", accent: "yellow" },
  { id: "business", number: "03", icon: BriefcaseBusiness, title: "Business", text: "Notice real needs, test thoughtful ideas, and create useful value with integrity.", accent: "red" },
  { id: "public-speaking", number: "04", icon: Mic2, title: "Public Speaking", text: "Practice clear expression, active listening, and the confidence to bring an important idea into the room.", accent: "orange" },
  { id: "entrepreneurship", number: "05", icon: Lightbulb, title: "Entrepreneurship", text: "Turn a meaningful idea into a practical beginning through problem-solving, testing, and shared learning.", accent: "blue" },
];

export default function FocusAreas() {
  return <PublicPageShell><main className="public-page focus-page">
    <section className="page-hero page-hero-focus"><div className="page-width"><p className="reference-eyebrow light"><span /> What we focus on</p><div className="page-hero-layout"><div><h1>Capability becomes <span>impact through practice.</span></h1><p>Our focus areas create a strong foundation for the next conversation, the next idea, and the next responsible decision.</p></div><p className="page-hero-mark">03<br /><span>Focus areas</span></p></div></div></section>
    <section className="focus-intro section-white"><div className="page-width focus-intro-grid"><p className="reference-eyebrow"><span /> Five connected fields</p><h2>Skills become more powerful when they <span>serve people.</span></h2><p>Each area connects reflection with action. Participants develop language, confidence, and practical next steps they can carry into their family, studies, work, enterprise, and community.</p></div></section>
    <section className="focus-areas-list section-cream"><div className="page-width">{areas.map(({ id, number, icon: Icon, title, text, accent }) => <article id={id} className={`focus-area-row focus-${accent}`} key={id}><div className="focus-area-index">{number}</div><div className="focus-area-icon"><Icon size={32} strokeWidth={1.5} /></div><div><h3>{title}</h3><p>{text}</p></div><Link href="/programs" aria-label={`Explore ${title} programs`}><ArrowUpRight size={22} /></Link></article>)}</div></section>
    <section className="focus-bridge section-blue"><div className="page-width"><div><p className="reference-eyebrow light"><span /> Designed to connect</p><h2>Start with what matters <span>to you now.</span></h2></div><p>There is no single route into growth. Choose the skill that feels closest to your next step, then find the people and practice that can help you carry it forward.</p><Link className="reference-button white-button" href="/programs">Explore programs <ArrowUpRight size={18} /></Link></div></section>
  </main></PublicPageShell>;
}
