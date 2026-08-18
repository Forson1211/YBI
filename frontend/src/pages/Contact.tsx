import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Sparkles,
  Send,
  HelpCircle,
  Bot,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";

const validInterests = [
  "General enquiry",
  "Join a program",
  "Volunteer or mentor",
  "Partner with YBI",
  "Media enquiry",
];

export function getAssistantContactPrefill(search: string) {
  const params = new URLSearchParams(search);
  if (params.get("assistant") !== "1") return null;

  const interest = params.get("interest") ?? "General enquiry";
  return {
    interest: validInterests.includes(interest) ? interest : "General enquiry",
    message:
      params.get("message")?.trim() ||
      "Hello YBI team, I would like guidance about getting involved with YBI.",
  };
}

export default function Contact() {
  const [location] = useLocation();
  const initialAssistantPrefill = getAssistantContactPrefill(
    typeof window === "undefined" ? "" : window.location.search
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(
    initialAssistantPrefill?.interest ?? "General enquiry"
  );
  const [message, setMessage] = useState(
    initialAssistantPrefill?.message ?? ""
  );
  const [isAssistantGuided, setIsAssistantGuided] = useState(
    Boolean(initialAssistantPrefill)
  );
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const prefill = getAssistantContactPrefill(window.location.search);
    if (!prefill) return;
    setInterest((current) =>
      current === "General enquiry" ? prefill.interest : current
    );
    setMessage((current) => current || prefill.message);
    setIsAssistantGuided(true);
  }, [location]);

  useEffect(() => {
    if (!isAssistantGuided) return;
    const focusTimer = window.setTimeout(
      () => messageInputRef.current?.focus(),
      0
    );
    return () => window.clearTimeout(focusTimer);
  }, [isAssistantGuided]);

  const submitInquiry = trpc.publicSite.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Your enquiry has reached the YBI team.", {
        description:
          "Thank you for getting in touch. We will follow up via email or phone within 24–48 hours.",
      });
      setName("");
      setEmail("");
      setPhone("");
      setInterest("General enquiry");
      setMessage("");
      setIsAssistantGuided(false);
    },
    onError: (error) =>
      toast.error("Your enquiry could not be sent.", {
        description: error.message,
      }),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitInquiry.mutate({
      name: name.trim(),
      email: email.trim(),
      interest: phone.trim() ? `${interest} (Tel: ${phone.trim()})` : interest,
      message: message.trim(),
    });
  };

  return (
    <PublicPageShell>
      <main className="public-page contact-page">
        {/* 1. Page Hero Header */}
        <section className="page-hero page-hero-contact">
          <div className="page-width">
            <div className="contact-hero-content">
              <p className="reference-eyebrow light">
                <span /> Get in Touch
              </p>
              <h1>
                Let’s make room for <span>the next conversation.</span>
              </h1>
              <p className="hero-lead">
                Whether you want to join an upcoming cohort, mentor emerging youth, explore an
                institutional partnership, or simply learn more, we would love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Main Contact Grid */}
        <section className="contact-main section-white">
          <div className="page-width contact-main-grid">
            {/* Left: Contact Info & Channels */}
            <div className="contact-info-column">
              <p className="reference-eyebrow">
                <span /> Reach Out
              </p>
              <h2>
                Start with a <span>simple hello.</span>
              </h2>

              <p className="contact-lead-desc">
                Tell us what has brought you to YBI. We read every message and will connect you with
                the right program lead, mentor coordinator, or community director.
              </p>

              <div className="contact-cards-list">
                <a
                  href="mailto:hello@youngbeginnersinspiration.org"
                  className="contact-channel-card"
                >
                  <div className="channel-icon blue">
                    <Mail size={22} />
                  </div>
                  <div>
                    <label>Official Email</label>
                    <strong>hello@youngbeginnersinspiration.org</strong>
                    <span>Direct community desk inbox</span>
                  </div>
                </a>

                <div className="contact-channel-card">
                  <div className="channel-icon orange">
                    <Phone size={22} />
                  </div>
                  <div>
                    <label>Phone & WhatsApp</label>
                    <strong>+233 (0) 24 000 0000</strong>
                    <span>Mon – Fri, 9:00 AM – 5:00 PM GMT</span>
                  </div>
                </div>

                <div className="contact-channel-card">
                  <div className="channel-icon red">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <label>Location</label>
                    <strong>Accra, Ghana</strong>
                    <span>Greater Accra Region · Nationwide Cohorts</span>
                  </div>
                </div>

                <div className="contact-channel-card">
                  <div className="channel-icon yellow">
                    <Clock3 size={22} />
                  </div>
                  <div>
                    <label>Response Time</label>
                    <strong>Within 24 – 48 Hours</strong>
                    <span>Our coordination team will follow up directly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Modern Contact Form */}
            <div className="contact-form-column">
              <form className="contact-modern-form" onSubmit={handleSubmit}>
                <div className="contact-form-heading">
                  <div className="form-heading-icon">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3>Send a Direct Message</h3>
                    <p>Your inquiry is sent securely to the YBI community team.</p>
                  </div>
                </div>

                {isAssistantGuided && (
                  <div className="contact-assistant-handoff" role="status">
                    <Bot size={18} />
                    <span>Your note from the visitor assistant is pre-filled below. Feel free to edit before sending.</span>
                  </div>
                )}

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="contact-name">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Kwesi Mensah"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="kwesi@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="contact-phone">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+233 24 000 0000"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-interest">
                      I Would Like To <span className="req">*</span>
                    </label>
                    <select
                      id="contact-interest"
                      value={interest}
                      onChange={(event) => setInterest(event.target.value)}
                    >
                      {validInterests.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">
                    Your Message <span className="req">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    ref={messageInputRef}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us what you'd like to explore, discuss, or collaborate on..."
                    required
                    rows={5}
                  />
                </div>

                <button
                  disabled={submitInquiry.isPending}
                  className="reference-button yellow-button full-width contact-submit-btn"
                  type="submit"
                >
                  {submitInquiry.isPending ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="form-security-footer">
                  <ShieldCheck size={16} />
                  <span>Your information is protected. We will never share your email with third parties.</span>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 3. Bottom Fast Support Cards */}
        <section className="contact-cta-band section-cream">
          <div className="page-width">
            <div className="fast-support-grid">
              <div className="support-card">
                <div className="support-card-header">
                  <HelpCircle size={28} className="text-blue" />
                  <div>
                    <h3>Have Quick Questions?</h3>
                    <p>Find instant answers about our speaking programs, youth venture incubators, and mentor circles.</p>
                  </div>
                </div>
                <Link className="reference-button outline-page-button" href="/faq">
                  Browse FAQs <ArrowRight size={16} />
                </Link>
              </div>

              <div className="support-card">
                <div className="support-card-header">
                  <Sparkles size={28} className="text-yellow" />
                  <div>
                    <h3>Looking to Get Involved?</h3>
                    <p>Choose your pathway: make a donation, apply to volunteer as a coach, or collaborate as an institution.</p>
                  </div>
                </div>
                <Link className="reference-button blue-button" href="/get-involved">
                  Explore Pathways <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicPageShell>
  );
}

