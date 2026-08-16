import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Clock3, Mail, MessageCircle, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";

const validInterests = ["General enquiry", "Join a program", "Volunteer or mentor", "Partner with YBI", "Media enquiry"];

export function getAssistantContactPrefill(search: string) {
  const params = new URLSearchParams(search);
  if (params.get("assistant") !== "1") return null;

  const interest = params.get("interest") ?? "General enquiry";
  return {
    interest: validInterests.includes(interest) ? interest : "General enquiry",
    message: params.get("message")?.trim() || "Hello YBI team, I would like guidance about getting involved with YBI.",
  };
}

export default function Contact() {
  const [location] = useLocation();
  const initialAssistantPrefill = getAssistantContactPrefill(typeof window === "undefined" ? "" : window.location.search);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(initialAssistantPrefill?.interest ?? "General enquiry");
  const [message, setMessage] = useState(initialAssistantPrefill?.message ?? "");
  const [isAssistantGuided, setIsAssistantGuided] = useState(Boolean(initialAssistantPrefill));
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const prefill = getAssistantContactPrefill(window.location.search);
    if (!prefill) return;
    setInterest((current) => current === "General enquiry" ? prefill.interest : current);
    setMessage((current) => current || prefill.message);
    setIsAssistantGuided(true);
  }, [location]);

  useEffect(() => {
    if (!isAssistantGuided) return;
    const focusTimer = window.setTimeout(() => messageInputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [isAssistantGuided]);
  const submitInquiry = trpc.publicSite.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Your enquiry has reached the YBI team.", { description: "Thank you for getting in touch. We will follow up by email." });
      setName("");
      setEmail("");
      setInterest("General enquiry");
      setMessage("");
      setIsAssistantGuided(false);
    },
    onError: (error) => toast.error("Your enquiry could not be sent.", { description: error.message }),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitInquiry.mutate({ name, email, interest, message });
  };

  return <PublicPageShell><main className="public-page contact-page">
    <section className="page-hero page-hero-contact"><div className="page-width"><p className="reference-eyebrow light"><span /> Contact YBI</p><div className="page-hero-layout"><div><h1>Let’s make room for <span>the next conversation.</span></h1><p>Whether you want to join a program, share your experience, explore a partnership, or simply learn more, we would be glad to hear from you.</p></div><p className="page-hero-mark">07<br /><span>Contact</span></p></div></div></section>
    <section className="contact-main section-white"><div className="page-width contact-main-grid"><div className="contact-copy"><p className="reference-eyebrow"><span /> Reach the team</p><h2>Start with a <span>simple hello.</span></h2><p>Tell us what has brought you to YBI. We read every message and will help direct you to the most useful next step.</p><div className="contact-detail-list"><a href="mailto:hello@youngbeginnersinspiration.org"><Mail size={22} /><span><strong>Email the YBI team</strong>hello@youngbeginnersinspiration.org</span></a><div><UsersRound size={22} /><span><strong>Ways to connect</strong>Programs, mentoring, volunteering, and partnerships</span></div><div><Clock3 size={22} /><span><strong>Best starting point</strong>Share your interest and the team will follow up by email</span></div></div></div><form className="contact-form" onSubmit={handleSubmit}><div className="contact-form-heading"><MessageCircle size={26} /><div><h3>Send an enquiry</h3><p>Your message goes securely to the YBI community inbox for the team to follow up.</p></div></div>{isAssistantGuided && <p className="contact-assistant-handoff" role="status">Your visitor-assistant note is ready to review, edit, and send.</p>}<label htmlFor="contact-name">Your name<input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} required /></label><label htmlFor="contact-email">Email address<input id="contact-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label htmlFor="contact-interest">I would like to<select id="contact-interest" value={interest} onChange={(event) => setInterest(event.target.value)}>{validInterests.map((option) => <option key={option}>{option}</option>)}</select></label><label htmlFor="contact-message">Your message<textarea id="contact-message" ref={messageInputRef} value={message} onChange={(event) => setMessage(event.target.value)} required rows={5} /></label><button disabled={submitInquiry.isPending} className="reference-button blue-button" type="submit">{submitInquiry.isPending ? "Sending…" : "Send enquiry"} <ArrowUpRight size={18} /></button></form></div></section>
    <section className="contact-cta section-cream"><div className="page-width"><p className="reference-eyebrow"><span /> Not sure where to begin?</p><h2>Explore a program or find your place <span>in the platform.</span></h2><div><Link className="reference-button blue-button" href="/programs">Explore programs <ArrowUpRight size={18} /></Link><Link className="reference-button outline-page-button" href="/join-us">Ways to join <ArrowUpRight size={18} /></Link></div></div></section>
  </main></PublicPageShell>;
}
