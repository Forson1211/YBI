import { ArrowRight, ArrowUpRight, Check, Mic2, Sparkles, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";

const publicSpeaking = "/manus-storage/ybi-public-speaking_08161e85.jpg";
const entrepreneurship = "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg";
const community = "/manus-storage/ybi-community_b2ad3c56.jpg";

const programs = [
  { id: "public-speaking", image: publicSpeaking, kicker: "Voice · Presence · Courage", title: "Public Speaking", text: "Practice clear communication, confident delivery, active listening, and the courage to bring an important idea into the room.", icon: Mic2 },
  { id: "entrepreneurship", image: entrepreneurship, kicker: "Ideas · Enterprise · Responsibility", title: "Entrepreneurship", text: "Move from a meaningful idea to a practical beginning through problem-solving, testing, and shared learning.", icon: Sparkles },
  { id: "generations", image: community, kicker: "Mentorship · Exchange · Belonging", title: "Generations in Conversation", text: "Create connection between lived experience and fresh perspective so each generation can strengthen the other.", icon: UsersRound },
];

export default function Programs() {
  return <PublicPageShell><main className="public-page programs-page">
    <section className="page-hero page-hero-programs"><div className="page-width"><p className="reference-eyebrow light"><span /> YBI programs</p><div className="page-hero-layout"><div><h1>Learn something.<br /><span>Lead somewhere.</span></h1><p>Our programs turn curiosity into confidence through practice, conversation, and meaningful action.</p></div><p className="page-hero-mark">04<br /><span>Programs</span></p></div></div></section>
    <section className="programs-intro section-white"><div className="page-width programs-intro-grid"><div><p className="reference-eyebrow"><span /> A practical next step</p><h2>More than a good conversation.</h2></div><p className="large-paragraph">A YBI program is designed to leave participants with a skill, a connection, and a next step they can use.</p></div></section>
    <section className="programs-list section-cream"><div className="page-width">{programs.map(({ id, image, kicker, title, text, icon: Icon }, index) => <article id={id} className={`program-feature program-feature-${index + 1}`} key={id}><img src={image} alt="" /><div className="program-feature-copy"><p>{kicker}</p><div className="program-title-row"><Icon size={30} strokeWidth={1.5} /><h2>{title}</h2></div><span>{text}</span><a className="reference-text-link" href="/contact">Ask about this program <ArrowRight size={18} /></a></div></article>)}</div></section>
    <section className="programs-path section-white"><div className="page-width"><div className="section-split-heading"><div><p className="reference-eyebrow"><span /> How we learn</p><h2>A clear pathway<br /><span>into action.</span></h2></div><p>Every program brings people together around a real practice and an achievable way to carry it forward.</p></div><div className="program-step-grid">{["Arrive with curiosity", "Practice with others", "Carry a next step forward"].map((step, index) => <article key={step}><span>0{index + 1}</span><Check size={25} /><h3>{step}</h3></article>)}</div></div></section>
    <section className="page-action-panel section-red"><div className="page-width"><p className="reference-eyebrow light"><span /> Find your program</p><h2>Tell us what you want to <span>grow into.</span></h2><a className="reference-button white-button" href="/contact">Connect with YBI <ArrowUpRight size={18} /></a></div></section>
  </main></PublicPageShell>;
}
