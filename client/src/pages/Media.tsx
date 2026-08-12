import { useState, type FormEvent } from "react";
import { ArrowUpRight, Download, Mail, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { homepageUpdates } from "@/lib/homeUpdates";

export default function Media() {
  const [email, setEmail] = useState("");
  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Thank you for staying connected.", { description: "We’ll share meaningful updates from the platform." });
    setEmail("");
  };

  return <PublicPageShell><main className="public-page media-page">
    <section className="page-hero page-hero-media"><div className="page-width"><p className="reference-eyebrow light"><span /> From the platform</p><div className="page-hero-layout"><div><h1>Ideas worth <span>carrying forward.</span></h1><p>Notes, reflections, and invitations for people finding their voice, building capability, and making a difference.</p></div><p className="page-hero-mark">06<br /><span>Media</span></p></div></div></section>
    <section id="stories" className="media-stories section-white"><div className="page-width"><div className="section-split-heading"><div><p className="reference-eyebrow"><span /> Platform stories</p><h2>Start with the room <span>you are in.</span></h2></div><p>Short practical prompts from the YBI community—designed to keep the conversation about leadership, learning, and enterprise moving.</p></div><div className="media-story-grid">{homepageUpdates.map((story, index) => <article key={story.category}><img src={story.image} alt={story.imageAlt} /><div><span>0{index + 1} · {story.category}</span><h3>{story.title}</h3><p>{story.summary}</p><a href="/contact">Share a story <ArrowUpRight size={16} /></a></div></article>)}</div></div></section>
    <section className="media-resources section-cream"><div className="page-width media-resources-grid"><div><p className="reference-eyebrow"><span /> Share YBI</p><h2>Help the right conversation <span>reach further.</span></h2><p>For speaking invitations, community collaboration, or a conversation about the YBI platform, our team would be glad to hear from you.</p><a className="reference-button blue-button" href="/contact">Contact the team <ArrowUpRight size={18} /></a></div><div className="media-resource-list"><article><PlayCircle size={25} /><div><h3>Program conversations</h3><p>Explore the activities, skills, and connections at the heart of YBI.</p></div></article><article><Download size={25} /><div><h3>Media enquiries</h3><p>Reach out for a clear introduction to our focus areas and programs.</p></div></article><article><Mail size={25} /><div><h3>Stay in touch</h3><p>Receive thoughtful updates and invitations from the platform.</p></div></article></div></div></section>
    <section id="newsletter" className="media-newsletter section-blue"><div className="page-width"><div><p className="reference-eyebrow light"><span /> Stay connected</p><h2>Make room for the <span>next invitation.</span></h2><p>Thoughtful updates on leadership, learning, entrepreneurship, and the people making a difference through YBI.</p></div><form onSubmit={handleSubscribe}><label htmlFor="media-email">Email address</label><div><input id="media-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /><button type="submit">Stay connected <ArrowUpRight size={17} /></button></div></form></div></section>
  </main></PublicPageShell>;
}
