import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import {
  Heart,
  HandHeart,
  Users,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Check,
  Lock,
  Gift,
  Coins,
  Smile,
  Loader2,
  BookOpen,
  Mic2,
  Briefcase,
} from "lucide-react";

const DONATION_PRESETS = [
  {
    amount: 50,
    label: "GHS 50",
    impact: "Provides workshop stationery, debate materials, and learning kits for 1 youth participant.",
  },
  {
    amount: 100,
    label: "GHS 100",
    impact: "Sponsors speech coaching resources and transport support for a public speaking mentee.",
  },
  {
    amount: 250,
    label: "GHS 250",
    impact: "Funds 1 month of structured intergenerational dialogue circle sessions between youth and elders.",
  },
  {
    amount: 500,
    label: "GHS 500",
    impact: "Covers venue, curriculum, and mentorship materials for an entire community cohort.",
  },
  {
    amount: 1000,
    label: "GHS 1,000",
    impact: "Accelerates a youth enterprise venture with seed validation support, pitch coaching, and expert mentorship.",
  },
];

const VOLUNTEER_ROLES = [
  {
    id: "mentor-speaking",
    title: "Public Speaking & Voice Coach",
    icon: Mic2,
    desc: "Help young learners overcome stage fear, structure arguments, and speak with vocal presence.",
  },
  {
    id: "mentor-intergenerational",
    title: "Intergenerational Circle Mentor / Elder",
    icon: Users,
    desc: "Share lived wisdom, cultural grounding, and life guidance in structured dialogue circles.",
  },
  {
    id: "mentor-enterprise",
    title: "Youth Enterprise & Business Advisor",
    icon: Briefcase,
    desc: "Coach aspiring founders on business models, market validation, and ethical leadership.",
  },
  {
    id: "volunteer-events",
    title: "Community Events & Field Logistics",
    icon: HandHeart,
    desc: "Support workshop setup, attendee coordination, media capture, and cohort facilitation.",
  },
];

export default function GetInvolved() {
  const [location] = useLocation();

  // Active pathway tab: 'donate' | 'volunteer' | 'partner'
  const [activeTab, setActiveTab] = useState<"donate" | "volunteer" | "partner">(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#donate" || window.location.search.includes("don_ref")) return "donate";
      if (window.location.hash === "#volunteer") return "volunteer";
      if (window.location.hash === "#partner") return "partner";
    }
    return "donate";
  });

  // Check URL donation reference
  const donRef = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("don_ref") || params.get("ref");
  }, []);

  // Donation State
  const [selectedPreset, setSelectedPreset] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  // Volunteer State
  const [selectedRole, setSelectedRole] = useState("mentor-speaking");
  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerEmail, setVolunteerEmail] = useState("");
  const [volunteerPhone, setVolunteerPhone] = useState("");
  const [volunteerLocation, setVolunteerLocation] = useState("");
  const [volunteerStatement, setVolunteerStatement] = useState("");
  const [volunteerSmsOptIn, setVolunteerSmsOptIn] = useState(true);
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);

  // Partner State
  const [partnerOrg, setPartnerOrg] = useState("");
  const [partnerContact, setPartnerContact] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerType, setPartnerType] = useState("School / Educational Institution");
  const [partnerMessage, setPartnerMessage] = useState("");
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // Mutations
  const initiateDonationMutation = trpc.publicSite.donations.initiate.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setDonationSuccess(true);
        toast.success("Thank you for your generous pledge!");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Could not initiate donation checkout. Please try again.");
    },
  });

  const verifyDonationMutation = trpc.publicSite.donations.verifyPayment.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setDonationSuccess(true);
        toast.success("Donation confirmed! Thank you for standing with YBI.");
      }
    },
  });

  const volunteerMutation = trpc.publicSite.contact.submit.useMutation({
    onSuccess: () => {
      setVolunteerSubmitted(true);
      toast.success("Volunteer application received! Our team will contact you shortly.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit application. Please try again.");
    },
  });

  const partnerMutation = trpc.publicSite.contact.submit.useMutation({
    onSuccess: () => {
      setPartnerSubmitted(true);
      toast.success("Partnership inquiry received! We look forward to collaborating.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send inquiry. Please try again.");
    },
  });

  useEffect(() => {
    if (donRef && !donationSuccess) {
      verifyDonationMutation.mutate({ reference: donRef });
    }
  }, [donRef]);

  const effectiveAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedPreset;

  const currentImpactText = useMemo(() => {
    const matched = DONATION_PRESETS.find((p) => p.amount === effectiveAmount);
    if (matched) return matched.impact;
    if (effectiveAmount >= 1000) {
      return "Enables comprehensive community mentorship cohorts and supports multiple young venture builders.";
    }
    if (effectiveAmount >= 50) {
      return "Provides essential workshop kits, learning aids, and mentor session materials.";
    }
    return "Every cedi contributes directly to equipping youth and elders with transformative learning tools.";
  }, [effectiveAmount]);

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorEmail.trim()) {
      toast.error("Please provide your name and email address.");
      return;
    }
    if (effectiveAmount < 5) {
      toast.error("Minimum donation amount is GHS 5.");
      return;
    }

    initiateDonationMutation.mutate({
      name: donorName.trim(),
      email: donorEmail.trim(),
      phone: donorPhone.trim() || undefined,
      amountGhs: effectiveAmount,
      message: donorMessage.trim() || undefined,
    });
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName.trim() || !volunteerEmail.trim() || !volunteerPhone.trim()) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }

    const roleObj = VOLUNTEER_ROLES.find((r) => r.id === selectedRole);
    const roleTitle = roleObj?.title || selectedRole;

    volunteerMutation.mutate({
      name: volunteerName.trim(),
      email: volunteerEmail.trim(),
      interest: `Volunteer: ${roleTitle} (${volunteerLocation.trim() || "Location unspecified"})`,
      message: `Preferred Role: ${roleTitle}\nPhone: ${volunteerPhone.trim()}\nLocation: ${volunteerLocation.trim()}\nSMS Opt-In: ${volunteerSmsOptIn ? "Yes" : "No"}\n\nMotivation & Background:\n${volunteerStatement.trim()}`,
    });
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerOrg.trim() || !partnerContact.trim() || !partnerEmail.trim()) {
      toast.error("Please fill in organization, contact person, and email.");
      return;
    }

    partnerMutation.mutate({
      name: `${partnerContact.trim()} (${partnerOrg.trim()})`,
      email: partnerEmail.trim(),
      interest: `Institutional Partner: ${partnerType}`,
      message: `Organization: ${partnerOrg.trim()}\nType: ${partnerType}\nContact: ${partnerContact.trim()}\n\nPartnership Vision:\n${partnerMessage.trim()}`,
    });
  };

  return (
    <PublicPageShell>
      <div className="get-involved-page">
        {/* Page Hero Header */}
        <section className="get-involved-hero">
          <div className="page-width">
            <h1 className="hero-heading">
              Support, Mentor, or Partner with <span>YBI</span>
            </h1>
            <p className="hero-lead">
              Transforming communities starts with empowering people. Choose how you would like
              to make a lasting difference alongside our youth and elder cohorts.
            </p>


            {/* Pathway Selector Tabs */}
            <div className="pathway-tabs-bar">
              <button
                type="button"
                className={`pathway-tab-btn ${activeTab === "donate" ? "is-active" : ""}`}
                onClick={() => setActiveTab("donate")}
              >
                <Coins size={18} />
                <span>Make a Donation</span>
              </button>
              <button
                type="button"
                className={`pathway-tab-btn ${activeTab === "volunteer" ? "is-active" : ""}`}
                onClick={() => setActiveTab("volunteer")}
              >
                <Users size={18} />
                <span>Mentor or Volunteer</span>
              </button>
              <button
                type="button"
                className={`pathway-tab-btn ${activeTab === "partner" ? "is-active" : ""}`}
                onClick={() => setActiveTab("partner")}
              >
                <Building2 size={18} />
                <span>Partner with Us</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab 1: DONATE PATHWAY */}
        {activeTab === "donate" && (
          <section className="get-involved-section page-width" id="donate">
            {donationSuccess ? (
              <div className="donation-success-card">
                <div className="success-icon-badge">
                  <CheckCircle2 size={48} className="text-green" />
                </div>
                <h2>Thank You for Supporting YBI!</h2>
                <p>
                  Your contribution directly funds workshops, mentorship kits, and community learning
                  spaces for young emerging leaders and elders across Ghana.
                </p>
                <div className="success-pledge-info">
                  <span>Payment Status:</span>
                  <strong>Confirmed & Recorded (GHS {effectiveAmount || 100})</strong>
                </div>
                <div className="success-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setDonationSuccess(false);
                      setCustomAmount("");
                      setDonorMessage("");
                    }}
                    className="reference-button blue-button"
                  >
                    Make Another Donation
                  </button>
                  <Link href="/programs" className="reference-button outline-button">
                    Explore Supported Programs
                  </Link>
                </div>
              </div>
            ) : (
              <div className="donation-layout-grid">
                {/* Left: Donation Form */}
                <div className="donation-form-card">
                  <div className="card-header-band">
                    <h3>Select Donation Amount</h3>
                    <span className="secure-badge">
                      <Lock size={13} /> 256-Bit SSL Encrypted
                    </span>
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="donation-presets-grid">
                    {DONATION_PRESETS.map((preset) => (
                      <button
                        key={preset.amount}
                        type="button"
                        className={`preset-btn ${selectedPreset === preset.amount && !customAmount ? "is-selected" : ""}`}
                        onClick={() => {
                          setSelectedPreset(preset.amount);
                          setCustomAmount("");
                        }}
                      >
                        <span className="preset-val">{preset.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="custom-amount-row">
                    <label htmlFor="custom-amount-input">Or enter a custom amount (GHS):</label>
                    <div className="custom-input-wrap">
                      <span className="currency-prefix">GHS</span>
                      <input
                        id="custom-amount-input"
                        type="number"
                        min="5"
                        placeholder="e.g. 750"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Dynamic Impact Display Box */}
                  <div className="donation-impact-box">
                    <div className="impact-box-header">
                      <Gift size={16} />
                      <span>Your Impact (GHS {effectiveAmount || 0})</span>
                    </div>
                    <p>{currentImpactText}</p>
                  </div>

                  {/* Donor Information Form */}
                  <form onSubmit={handleDonationSubmit} className="donor-info-form">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label htmlFor="donor-name">
                          Full Name <span className="req">*</span>
                        </label>
                        <input
                          id="donor-name"
                          type="text"
                          required
                          placeholder="e.g. Kwesi Appiah"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="donor-email">
                          Email Address <span className="req">*</span>
                        </label>
                        <input
                          id="donor-email"
                          type="email"
                          required
                          placeholder="kwesi@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="donor-phone">
                        Phone Number (for MoMo or SMS Receipt)
                      </label>
                      <input
                        id="donor-phone"
                        type="tel"
                        placeholder="+233 24 000 0000"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="donor-message">
                        Optional Dedication / Encouragement Note
                      </label>
                      <textarea
                        id="donor-message"
                        rows={2}
                        placeholder="e.g. In honor of community mentors who guided me..."
                        value={donorMessage}
                        onChange={(e) => setDonorMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={initiateDonationMutation.isPending}
                      className="reference-button yellow-button full-width donate-btn"
                    >
                      {initiateDonationMutation.isPending ? (
                        <>
                          <Loader2 size={18} className="spin" />
                          <span>Connecting to Paystack...</span>
                        </>
                      ) : (
                        <span>Donate GHS {effectiveAmount} via Paystack</span>
                      )}
                    </button>

                    <div className="payment-methods-strip">
                      <span>Accepted:</span>
                      <span className="method-pill">MTN MoMo</span>
                      <span className="method-pill">Telecel Cash</span>
                      <span className="method-pill">AT Money</span>
                      <span className="method-pill">Visa / Mastercard</span>
                    </div>
                  </form>
                </div>

                {/* Right: Why Donate to YBI */}
                <div className="donation-why-card">
                  <h3>Where Your Giving Goes</h3>
                  <div className="why-item">
                    <div className="why-icon blue">
                      <Mic2 size={18} />
                    </div>
                    <div>
                      <h4>Public Speaking Labs</h4>
                      <p>Equipping young people from diverse backgrounds to articulate their vision with courage and rhetoric.</p>
                    </div>
                  </div>

                  <div className="why-item">
                    <div className="why-icon orange">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4>Intergenerational Circles</h4>
                      <p>Creating safe, structured spaces for elders and youth to exchange lived wisdom, life guidance, and mutual hope.</p>
                    </div>
                  </div>

                  <div className="why-item">
                    <div className="why-icon red">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h4>Youth Venture Studios</h4>
                      <p>Supporting purpose-driven local enterprises with business fundamentals and pitch training.</p>
                    </div>
                  </div>

                  <div className="donation-transparency-box">
                    <ShieldCheck size={20} />
                    <div>
                      <h4>100% Dedicated to Program Delivery</h4>
                      <p>YBI operates with transparent community accountability and reporting.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: VOLUNTEER & MENTOR PATHWAY */}
        {activeTab === "volunteer" && (
          <section className="get-involved-section page-width" id="volunteer">
            {volunteerSubmitted ? (
              <div className="volunteer-success-card">
                <CheckCircle2 size={48} className="text-green" />
                <h2>Application Received!</h2>
                <p>
                  Thank you for applying to volunteer with Young Beginners Inspiration. Our mentorship
                  coordinators will review your details and connect with you within 3 business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setVolunteerSubmitted(false);
                    setVolunteerName("");
                    setVolunteerEmail("");
                    setVolunteerPhone("");
                    setVolunteerStatement("");
                  }}
                  className="reference-button blue-button"
                >
                  Submit Another Form
                </button>
              </div>
            ) : (
              <div className="volunteer-layout-grid">
                {/* Role Selector Column */}
                <div className="volunteer-roles-column">
                  <h3>1. Select an Area of Contribution</h3>
                  <div className="roles-picker-list">
                    {VOLUNTEER_ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <div
                          key={role.id}
                          className={`role-choice-card ${isSelected ? "is-selected" : ""}`}
                          onClick={() => setSelectedRole(role.id)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="role-choice-header">
                            <Icon size={20} className="role-icon" />
                            <h4>{role.title}</h4>
                            <div className="role-check-dot">
                              {isSelected && <Check size={14} />}
                            </div>
                          </div>
                          <p>{role.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Application Form Column */}
                <div className="volunteer-form-column">
                  <h3>2. Tell Us About Yourself</h3>
                  <form onSubmit={handleVolunteerSubmit} className="volunteer-app-form">
                    <div className="form-group">
                      <label htmlFor="vol-name">
                        Full Name <span className="req">*</span>
                      </label>
                      <input
                        id="vol-name"
                        type="text"
                        required
                        placeholder="e.g. Evelyn Darko"
                        value={volunteerName}
                        onChange={(e) => setVolunteerName(e.target.value)}
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label htmlFor="vol-email">
                          Email Address <span className="req">*</span>
                        </label>
                        <input
                          id="vol-email"
                          type="email"
                          required
                          placeholder="evelyn@example.org"
                          value={volunteerEmail}
                          onChange={(e) => setVolunteerEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="vol-phone">
                          Phone Number <span className="req">*</span>
                        </label>
                        <input
                          id="vol-phone"
                          type="tel"
                          required
                          placeholder="+233 20 000 0000"
                          value={volunteerPhone}
                          onChange={(e) => setVolunteerPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="vol-location">
                        Your Location / City in Ghana
                      </label>
                      <input
                        id="vol-location"
                        type="text"
                        placeholder="e.g. Accra, Kumasi, Cape Coast, or Virtual"
                        value={volunteerLocation}
                        onChange={(e) => setVolunteerLocation(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="vol-statement">
                        Why do you want to volunteer or mentor with YBI?
                      </label>
                      <textarea
                        id="vol-statement"
                        rows={4}
                        placeholder="Share a bit about your background, lived experience, skills, and what inspires you to contribute..."
                        value={volunteerStatement}
                        onChange={(e) => setVolunteerStatement(e.target.value)}
                      />
                    </div>

                    <div className="form-checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={volunteerSmsOptIn}
                          onChange={(e) => setVolunteerSmsOptIn(e.target.checked)}
                        />
                        <span>Send me onboarding notifications & cohort alerts via SMS</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={volunteerMutation.isPending}
                      className="reference-button yellow-button full-width"
                    >
                      {volunteerMutation.isPending ? "Submitting Application..." : "Submit Volunteer Application"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tab 3: INSTITUTIONAL PARTNERSHIP */}
        {activeTab === "partner" && (
          <section className="get-involved-section page-width" id="partner">
            {partnerSubmitted ? (
              <div className="partner-success-card">
                <CheckCircle2 size={48} className="text-green" />
                <h2>Partnership Inquiry Submitted!</h2>
                <p>
                  Thank you for reaching out. Our executive and programs team will review your
                  collaboration proposal and follow up with you directly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPartnerSubmitted(false);
                    setPartnerOrg("");
                    setPartnerContact("");
                    setPartnerEmail("");
                    setPartnerMessage("");
                  }}
                  className="reference-button blue-button"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <div className="partner-layout-grid">
                <div className="partner-intro-card">
                  <h3>Collaborate With YBI</h3>
                  <p>
                    We partner with basic and secondary schools, tertiary institutions, youth associations,
                    civil society organizations, and ethical corporate sponsors to scale impactful programs.
                  </p>

                  <div className="partner-benefits-list">
                    <div className="benefit-item">
                      <CheckCircle2 size={16} className="text-blue" />
                      <span>Bring customized Public Speaking & Leadership labs to your students</span>
                    </div>
                    <div className="benefit-item">
                      <CheckCircle2 size={16} className="text-blue" />
                      <span>Host intergenerational community dialogue circles in your venue</span>
                    </div>
                    <div className="benefit-item">
                      <CheckCircle2 size={16} className="text-blue" />
                      <span>Sponsor youth enterprise pitch cohorts as part of your CSR commitment</span>
                    </div>
                  </div>
                </div>

                <div className="partner-form-card">
                  <h3>Start a Partnership Conversation</h3>
                  <form onSubmit={handlePartnerSubmit} className="partner-form">
                    <div className="form-group">
                      <label htmlFor="part-org">
                        Organization / School / Institution Name <span className="req">*</span>
                      </label>
                      <input
                        id="part-org"
                        type="text"
                        required
                        placeholder="e.g. Achimota School or Ghana Youth Council"
                        value={partnerOrg}
                        onChange={(e) => setPartnerOrg(e.target.value)}
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label htmlFor="part-contact">
                          Contact Person & Title <span className="req">*</span>
                        </label>
                        <input
                          id="part-contact"
                          type="text"
                          required
                          placeholder="e.g. Mr. John Osei, Head of Guidance"
                          value={partnerContact}
                          onChange={(e) => setPartnerContact(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="part-email">
                          Official Email <span className="req">*</span>
                        </label>
                        <input
                          id="part-email"
                          type="email"
                          required
                          placeholder="josei@institution.org"
                          value={partnerEmail}
                          onChange={(e) => setPartnerEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="part-type">Organization Type</label>
                      <select
                        id="part-type"
                        value={partnerType}
                        onChange={(e) => setPartnerType(e.target.value)}
                      >
                        <option value="School / Educational Institution">School / Educational Institution</option>
                        <option value="Non-Governmental Organization (NGO)">Non-Governmental Organization (NGO)</option>
                        <option value="Corporate / CSR Partner">Corporate / CSR Partner</option>
                        <option value="Community Center / Hub">Community Center / Hub</option>
                        <option value="Faith-Based Community">Faith-Based Community</option>
                        <option value="Other">Other Collaboration</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="part-message">
                        How would you like to collaborate with YBI?
                      </label>
                      <textarea
                        id="part-message"
                        rows={4}
                        placeholder="Describe your audience, desired workshop focus, estimated timeline, or proposed sponsorship..."
                        value={partnerMessage}
                        onChange={(e) => setPartnerMessage(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={partnerMutation.isPending}
                      className="reference-button yellow-button full-width"
                    >
                      {partnerMutation.isPending ? "Sending Inquiry..." : "Submit Partnership Proposal"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </PublicPageShell>
  );
}
