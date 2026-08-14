import { ArrowUpRight, BriefcaseBusiness, HandHeart, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { Link } from "wouter";

const publicSpeaking = "/ybi-assets/programs/ybi-public-speaking.jpg";
const entrepreneurship = "/ybi-assets/programs/ybi-entrepreneurship.jpg";
const community = "/ybi-assets/community/ybi-community.jpg";

const roles = [
  { image: community, label: "Community hosts", title: "Create a room where people belong.", text: "They make gatherings feel open, respectful, and ready for meaningful conversation.", icon: UsersRound },
  { image: publicSpeaking, label: "Program builders", title: "Turn practice into confidence.", text: "They shape opportunities that make leadership, learning, and communication tangible.", icon: HandHeart },
  { image: entrepreneurship, label: "Partners and mentors", title: "Connect experience with possibility.", text: "They contribute insight, encouragement, space, and pathways for participants to grow.", icon: BriefcaseBusiness },
];

export default function Team() {
  return <PublicPageShell><main className="public-page team-page">
    <section className="page-hero page-hero-team"><div className="page-width"><p className="reference-eyebrow light"><span /> The people behind the platform</p><div className="page-hero-layout"><div><h1>People who make <span>space for possibility.</span></h1><p>YBI is carried forward by people who believe that young and aged voices become stronger when they have a shared room to learn, contribute, and lead.</p></div><p className="page-hero-mark">02<br /><span>Our team</span></p></div></div></section>
    <section className="team-lead section-white"><div className="page-width team-lead-grid"><div><p className="reference-eyebrow"><span /> One shared purpose</p><h2>We build the platform <span>together.</span></h2></div><p className="large-paragraph">From welcoming a first-time participant to connecting a mentor with a young person, the YBI team works to make growth feel possible and practical.</p></div></section>
    <section className="team-roles section-cream"><div className="page-width"><div className="team-role-grid">{roles.map(({ image, label, title, text, icon: Icon }, index) => <article className={`team-role-card team-role-${index + 1}`} key={label}><img src={image} alt="" /><div><span className="team-role-count">0{index + 1}</span><Icon size={27} strokeWidth={1.6} /><p>{label}</p><h3>{title}</h3><span>{text}</span></div></article>)}</div></div></section>
    <section className="team-principles section-blue"><div className="page-width"><div><p className="reference-eyebrow light"><span /> How we show up</p><h2>Warm welcome.<br /><span>Clear next step.</span></h2></div><div className="team-principle-list"><p><strong>Listen first.</strong> Every generation’s experience adds something to the room.</p><p><strong>Build with care.</strong> Good opportunities give people practical tools they can use.</p><p><strong>Share the stage.</strong> Responsibility grows when people have a chance to lead.</p></div></div></section>
    <section className="page-action-panel section-white"><div className="page-width"><p className="reference-eyebrow"><span /> Add your experience</p><h2>Could your time, ideas, or perspective <span>strengthen the work?</span></h2><Link className="reference-button blue-button" href="/contact">Start a conversation <ArrowUpRight size={18} /></Link></div></section>
  </main></PublicPageShell>;
}
