import { ArrowRight, ArrowUpRight, HeartHandshake, Lightbulb, UsersRound } from "lucide-react";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { useSiteImages } from "@/lib/useSiteImage";
import { Link } from "wouter";

const commitments = [
  { icon: UsersRound, title: "Make room", text: "We create welcoming spaces where people of different ages can speak, listen, learn, and contribute." },
  { icon: Lightbulb, title: "Practice possibility", text: "We turn curiosity into practical confidence through leadership, education, business, and communication." },
  { icon: HeartHandshake, title: "Lead responsibly", text: "We encourage people to use their capabilities in ways that strengthen families, communities, and futures." },
];

export default function About() {
  const { getImage } = useSiteImages();
  const storyImage = getImage("about_story_main", "/ybi-assets/community/ybi-community.jpg", "YBI participants sharing an intergenerational conversation");
  const quoteImage = getImage("about_quote_band", "/ybi-assets/programs/ybi-public-speaking.jpg", "A participant practicing public speaking with YBI");

  return <PublicPageShell><main className="public-page about-page">
    <section className="page-hero page-hero-about"><div className="page-width"><p className="reference-eyebrow light"><span /> About YBI</p><div className="page-hero-layout"><div><h1>A place to <span>begin together.</span></h1><p>Young Beginners Inspiration creates room for young people, older adults, and developing potential to inspire one another and move forward with purpose.</p></div><p className="page-hero-mark">01<br /><span>Our story</span></p></div></div></section>
    <section className="page-intro section-white"><div className="page-width page-intro-grid"><div><p className="reference-eyebrow"><span /> Why YBI exists</p><h2>Potential needs <span>a platform.</span></h2></div><div><p className="large-paragraph">We believe that ability grows when people have a place to be seen, challenged, and encouraged.</p><p>YBI brings generations into conversation and connects insight with action. The work is grounded in a simple idea: every person can make a positive difference when they are equipped to use what they know, what they care about, and what they are still discovering.</p></div></div></section>
    <section id="approach" className="about-story section-cream"><div className="page-width about-story-grid"><div className="about-story-media"><img src={storyImage.src} alt={storyImage.alt} /><div><span>Vision</span><strong>Inspire, motivate, and impact developing potential.</strong></div></div><div className="about-story-copy"><p className="reference-eyebrow"><span /> Our approach</p><h2>Learning moves in <span>both directions.</span></h2><p>Our vision is to inspire, motivate, and impact young, aged, and developing potential in leadership, education, and business. Our mission is to provide a platform where people can become responsible leaders who use their capabilities to make a positive difference in the world.</p><Link className="reference-text-link" href="/focus-areas">See our focus areas <ArrowRight size={18} /></Link></div></div></section>
    <section className="page-commitments section-white"><div className="page-width"><div className="section-split-heading"><div><p className="reference-eyebrow"><span /> What guides us</p><h2>Purpose with <span>practical care.</span></h2></div><p>We design each opportunity to give people both a meaningful reason to take part and a useful way to move forward.</p></div><div className="commitment-grid">{commitments.map(({ icon: Icon, title, text }, index) => <article key={title}><span>0{index + 1}</span><Icon size={31} strokeWidth={1.6} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="page-quote-band"><div className="page-width"><img src={quoteImage.src} alt={quoteImage.alt} /><div><p className="reference-eyebrow light"><span /> The invitation</p><h2>Bring your experience.<br /><span>Make room for another person’s beginning.</span></h2><Link className="reference-button white-button" href="/join-us">Find your way in <ArrowUpRight size={18} /></Link></div></div></section>
  </main></PublicPageShell>;
}
