import { useState, type FormEvent } from "react";
import { ArrowUpRight, Clock3, Mail, MessageCircle, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("General enquiry");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`YBI website enquiry: ${interest}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`);
    toast.success("Your email message is ready.", { description: "Your email app will open with your enquiry addressed to the YBI team." });
    window.location.href = `mailto:hello@youngbeginnersinspiration.org?subject=${subject}&body=${body}`;
  };

  return <PublicPageShell><main className="public-page contact-page">
    <section className="page-hero page-hero-contact"><div className="page-width"><p className="reference-eyebrow light"><span /> Contact YBI</p><div className="page-hero-layout"><div><h1>Let’s make room for <span>the next conversation.</span></h1><p>Whether you want to join a program, share your experience, explore a partnership, or simply learn more, we would be glad to hear from you.</p></div><p className="page-hero-mark">07<br /><span>Contact</span></p></div></div></section>
    <section className="contact-main section-white"><div className="page-width contact-main-grid"><div className="contact-copy"><p className="reference-eyebrow"><span /> Reach the team</p><h2>Start with a <span>simple hello.</span></h2><p>Tell us what has brought you to YBI. We read every message and will help direct you to the most useful next step.</p><div className="contact-detail-list"><a href="mailto:hello@youngbeginnersinspiration.org"><Mail size={22} /><span><strong>Email the YBI team</strong>hello@youngbeginnersinspiration.org</span></a><div><UsersRound size={22} /><span><strong>Ways to connect</strong>Programs, mentoring, volunteering, and partnerships</span></div><div><Clock3 size={22} /><span><strong>Best starting point</strong>Share your interest and the team will follow up by email</span></div></div></div><form className="contact-form" onSubmit={handleSubmit}><div className="contact-form-heading"><MessageCircle size={26} /><div><h3>Send an enquiry</h3><p>Your message will open in your email app, addressed to the YBI team.</p></div></div><label htmlFor="contact-name">Your name<input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} required /></label><label htmlFor="contact-email">Email address<input id="contact-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label htmlFor="contact-interest">I would like to<select id="contact-interest" value={interest} onChange={(event) => setInterest(event.target.value)}><option>General enquiry</option><option>Join a program</option><option>Volunteer or mentor</option><option>Partner with YBI</option><option>Media enquiry</option></select></label><label htmlFor="contact-message">Your message<textarea id="contact-message" value={message} onChange={(event) => setMessage(event.target.value)} required rows={5} /></label><button className="reference-button blue-button" type="submit">Prepare my email <ArrowUpRight size={18} /></button></form></div></section>
    <section className="contact-cta section-cream"><div className="page-width"><p className="reference-eyebrow"><span /> Not sure where to begin?</p><h2>Explore a program or find your place <span>in the platform.</span></h2><div><a className="reference-button blue-button" href="/programs">Explore programs <ArrowUpRight size={18} /></a><a className="reference-button outline-page-button" href="/join-us">Ways to join <ArrowUpRight size={18} /></a></div></div></section>
  </main></PublicPageShell>;
}
