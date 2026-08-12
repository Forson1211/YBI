import { ArrowUpRight, BriefcaseBusiness, HandHeart, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { Link } from "wouter";

const ways = [
  { id: "participate", icon: UsersRound, label: "For participants", title: "Learn with us", text: "Join a program, practice a skill, and meet people who are also finding their next direction.", action: "Explore programs", href: "/programs" },
  { id: "volunteer", icon: HandHeart, label: "For mentors and volunteers", title: "Share what you know", text: "Offer lived experience, encouragement, and practical perspective to someone taking an important first step.", action: "Contact the team", href: "/contact" },
  { id: "partner", icon: BriefcaseBusiness, label: "For partners", title: "Build with us", text: "Collaborate on programming, resources, spaces, and opportunities that help people become capable leaders.", action: "Start a partnership conversation", href: "/contact" },
];

export default function JoinUs() {
  return <PublicPageShell><main className="public-page join-page">
    <section className="page-hero page-hero-join"><div className="page-width"><p className="reference-eyebrow light"><span /> Join the platform</p><div className="page-hero-layout"><div><h1>There is room for <span>your voice.</span></h1><p>Whether you want to learn, mentor, collaborate, volunteer, or support the work, there is a meaningful way to participate.</p></div><p className="page-hero-mark">05<br /><span>Join us</span></p></div></div></section>
    <section className="join-intro section-white"><div className="page-width page-intro-grid"><div><p className="reference-eyebrow"><span /> Choose your connection</p><h2>A platform grows through people who <span>show up.</span></h2></div><div><p className="large-paragraph">You do not need to arrive with everything figured out. Bring curiosity, care, and a willingness to contribute to something bigger than yourself.</p><p>YBI welcomes people who want to develop their capability, offer their lived experience, or help open new paths for others.</p></div></div></section>
    <section className="join-lanes section-cream"><div className="page-width join-lane-grid">{ways.map(({ id, icon: Icon, label, title, text, action, href }) => <article id={id} key={id}><div className="join-lane-icon"><Icon size={31} strokeWidth={1.5} /></div><p>{label}</p><h3>{title}</h3><span>{text}</span><Link href={href}>{action} <ArrowUpRight size={17} /></Link></article>)}</div></section>
    <section className="join-message section-blue"><div className="page-width"><div><p className="reference-eyebrow light"><span /> Every contribution matters</p><h2>Come as you are.<br /><span>Grow into what is next.</span></h2></div><div><p>From a first conversation to a long-term partnership, each connection helps make a more generous platform for the people who follow.</p><Link className="reference-button yellow-button" href="/contact">Contact YBI <ArrowUpRight size={18} /></Link></div></div></section>
  </main></PublicPageShell>;
}
