import { useLocation } from "wouter";
import { Link } from "wouter";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { ShieldCheck, FileText, ArrowLeft, Lock, Calendar, Globe } from "lucide-react";

interface LegalProps {
  variant?: "privacy" | "terms";
}

export default function Legal({ variant }: LegalProps) {
  const [location] = useLocation();

  const isPrivacy = variant === "privacy" || location.includes("privacy");
  const contentKey = isPrivacy ? "legal:privacy-policy" : "legal:terms-of-use";

  const { data: cmsRecord } = trpc.publicSite.content.useQuery({
    contentKey,
  });

  const title = isPrivacy
    ? "Privacy Policy & Data Protection"
    : "Terms of Use & Community Guidelines";

  const kicker = isPrivacy ? "Legal & Data Safeguards" : "Website Terms & User Agreement";

  return (
    <PublicPageShell>
      <div className="legal-page-container">
        {/* Hero Header */}
        <section className="legal-hero-header">
          <div className="page-width">
            <Link href="/" className="legal-back-link">
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <div className="legal-badge">
              {isPrivacy ? <Lock size={15} /> : <FileText size={15} />}
              <span>{kicker}</span>
            </div>
            <h1 className="legal-title">{cmsRecord?.title || title}</h1>
            <p className="legal-subtitle">
              Last updated: January 2026 · Young Beginners Inspiration (YBI), Ghana
            </p>
          </div>
        </section>

        {/* Legal Document Content */}
        <section className="legal-content-section">
          <div className="page-width legal-layout-grid">
            {/* Sidebar Navigation */}
            <aside className="legal-sidebar">
              <div className="legal-nav-box">
                <h4>Legal Documents</h4>
                <Link
                  href="/privacy-policy"
                  className={`legal-nav-link ${isPrivacy ? "is-active" : ""}`}
                >
                  <ShieldCheck size={16} />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  href="/terms-of-use"
                  className={`legal-nav-link ${!isPrivacy ? "is-active" : ""}`}
                >
                  <FileText size={16} />
                  <span>Terms of Use</span>
                </Link>
              </div>

              <div className="legal-contact-box">
                <h4>Compliance Questions?</h4>
                <p>
                  Reach our Data Protection & Governance officer at:
                </p>
                <a href="mailto:info@ybi.org" className="legal-email-link">
                  info@ybi.org
                </a>
              </div>
            </aside>

            {/* Document Body */}
            <main className="legal-main-content">
              {cmsRecord?.body ? (
                <div className="legal-cms-body">
                  {cmsRecord.body.split("\n\n").map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

              ) : isPrivacy ? (
                <div className="legal-default-body">
                  <section>
                    <h2>1. Introduction & Organizational Commitment</h2>
                    <p>
                      Young Beginners Inspiration (YBI) is a non-governmental organization registered in
                      Ghana dedicated to empowering youth through public speaking, entrepreneurship,
                      and intergenerational mentorship. We respect your fundamental privacy rights and
                      are committed to transparent, lawful, and secure handling of personal data in
                      accordance with the <strong>Ghana Data Protection Act, 2012 (Act 843)</strong> and
                      international best practices.
                    </p>
                  </section>

                  <section>
                    <h2>2. Information We Collect</h2>
                    <p>We may collect personal details when you interact with our website, including:</p>
                    <ul>
                      <li><strong>Event & Workshop Registrations:</strong> Full name, email address, telephone number, and SMS opt-in preferences.</li>
                      <li><strong>Donations & Financial Contributions:</strong> Name, email address, phone number, donation amount, and transaction reference numbers generated via Paystack. (Note: YBI never stores payment card numbers or MoMo PINs on our servers).</li>
                      <li><strong>Volunteer & Mentorship Applications:</strong> Name, contact details, city, skill background, and statements of interest.</li>
                      <li><strong>Newsletter Subscriptions:</strong> Email address and mobile phone number for community broadcasts.</li>
                    </ul>
                  </section>

                  <section>
                    <h2>3. How We Use Your Information</h2>
                    <p>Your personal information is used strictly to:</p>
                    <ul>
                      <li>Confirm event seats, issue digital passes, and send venue directions.</li>
                      <li>Deliver essential SMS reminders and broadcast alerts when you have opted in.</li>
                      <li>Acknowledge donations and provide financial contribution receipts.</li>
                      <li>Facilitate mentor-mentee matching for intergenerational dialogue circles.</li>
                      <li>Improve our website performance and answer visitor inquiries.</li>
                    </ul>
                  </section>

                  <section>
                    <h2>4. Payment Security (Paystack Integration)</h2>
                    <p>
                      All monetary transactions and donations made on this website are processed securely
                      via <strong>Paystack</strong>, a licensed Payment Service Provider. All payment data is
                      encrypted via industry-standard SSL/TLS (256-bit encryption) and adheres to PCI-DSS Level 1 compliance.
                    </p>
                  </section>

                  <section>
                    <h2>5. SMS Communication & Opt-Out</h2>
                    <p>
                      When you opt-in to SMS updates during registration or subscription, messages are
                      delivered via Africa's Talking / licensed Ghanaian telco aggregators. You may opt out
                      at any time by contacting us or replying STOP to broadcast messages.
                    </p>
                  </section>

                  <section>
                    <h2>6. Youth Safeguarding & Child Protection</h2>
                    <p>
                      YBI operates youth cohorts for learners aged 15–30. In all activities involving minors,
                      parental/guardian consent is required during registration, and photographic media is only
                      published in compliance with ethical safeguarding policies.
                    </p>
                  </section>

                  <section>
                    <h2>7. Data Retention & Your Rights</h2>
                    <p>
                      You have the right to request a copy of the personal data we hold about you, request
                      corrections, or ask for your information to be deleted from our mailing and SMS lists.
                      Direct inquiries to <a href="mailto:info@ybi.org">info@ybi.org</a>.
                    </p>
                  </section>
                </div>
              ) : (
                <div className="legal-default-body">
                  <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                      By accessing or using the Young Beginners Inspiration (YBI) website, attending our events,
                      or contributing through our platforms, you agree to be bound by these Terms of Use and our
                      accompanying Privacy Policy. If you do not agree, please discontinue use of this site.
                    </p>
                  </section>

                  <section>
                    <h2>2. Purpose & Code of Conduct</h2>
                    <p>
                      YBI provides educational workshops, public speaking mentorship, and intergenerational
                      gatherings. All users, participants, and mentors are expected to uphold mutual respect,
                      integrity, and constructive dialogue across generational and cultural backgrounds.
                    </p>
                    <p>Users shall not:</p>
                    <ul>
                      <li>Submit false, misleading, or abusive information through inquiry forms.</li>
                      <li>Attempt unauthorized access to administrative systems or databases.</li>
                      <li>Misrepresent an affiliation with Young Beginners Inspiration.</li>
                    </ul>
                  </section>

                  <section>
                    <h2>3. Event Registrations & Payments</h2>
                    <p>
                      Event seats are allocated on a first-confirmed basis. For paid masterclasses, payment must
                      be completed via Paystack to secure admission. In the event of workshop rescheduling or
                      cancellation by YBI, registered attendees will be notified promptly and offered full credit or refunds.
                    </p>
                  </section>

                  <section>
                    <h2>4. Intellectual Property</h2>
                    <p>
                      All curriculum materials, workshop guides, logos, photographs, articles, and audio-visual
                      content displayed on this website are the intellectual property of Young Beginners Inspiration
                      or credited contributors. Educational reproduction is permitted with attribution; commercial
                      exploitation is prohibited without written permission.
                    </p>
                  </section>

                  <section>
                    <h2>5. Donations & Non-Profit Transparency</h2>
                    <p>
                      YBI is dedicated to transparent financial stewardship. Donations made to YBI are voluntary
                      contributions that support non-profit community programs, student learning kits, and mentorship spaces.
                    </p>
                  </section>

                  <section>
                    <h2>6. Limitation of Liability</h2>
                    <p>
                      While YBI takes reasonable steps to ensure accurate and up-to-date program information,
                      we provide this website on an "as is" basis without warranties of any kind.
                    </p>
                  </section>

                  <section>
                    <h2>7. Governing Law</h2>
                    <p>
                      These Terms are governed by and construed in accordance with the laws of the Republic of Ghana.
                    </p>
                  </section>
                </div>
              )}
            </main>
          </div>
        </section>
      </div>
    </PublicPageShell>
  );
}
