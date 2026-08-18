import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Check,
  ShieldCheck,
  Sparkles,
  Loader2,
  Ticket,
  MessageSquare,
  Building,
} from "lucide-react";

export default function EventDetail() {
  const [, params] = useRoute("/events/:slug");
  const [location] = useLocation();
  const slug = params?.slug || "";

  // Parse reference from URL query if user just returned from Paystack
  const urlRef = useMemo(() => {
    if (typeof window === "undefined") return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ref") || urlParams.get("reference");
  }, []);

  const utils = trpc.useUtils();
  const { data: eventsList } = trpc.publicSite.events.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: fetchedEvent,
    isLoading: isFetchingDirect,
    error,
    refetch,
  } = trpc.publicSite.events.getBySlug.useQuery(
    { slug },
    { enabled: Boolean(slug), staleTime: 1000 * 60 * 10 }
  );

  const event = fetchedEvent || eventsList?.find((e) => e.slug === slug);
  const isLoading = !event && isFetchingDirect;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    smsOptIn: true,
  });

  const [registrationSuccess, setRegistrationSuccess] = useState<{
    reference?: string;
    isWaitlist: boolean;
    name: string;
    email: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  // Mutation for registration
  const registerMutation = trpc.publicSite.events.register.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        // Redirect to Paystack Checkout
        window.location.href = data.checkoutUrl;
      } else {
        setRegistrationSuccess({
          isWaitlist: data.isWaitlist,
          name: formData.name,
          email: formData.email,
        });
        toast.success(
          data.isWaitlist
            ? "You've been added to the waitlist!"
            : "Registration confirmed successfully!"
        );
        refetch();
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit registration. Please try again.");
    },
  });

  // Verify payment if returned with ref
  const verifyPaymentMutation = trpc.publicSite.payments.verifyPayment.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setRegistrationSuccess({
          reference: urlRef || undefined,
          isWaitlist: false,
          name: "Registered Attendee",
          email: "your email address",
        });
        toast.success("Payment verified! Your ticket has been confirmed.");
        refetch();
      }
    },
  });

  useEffect(() => {
    if (urlRef && !registrationSuccess) {
      verifyPaymentMutation.mutate({ reference: urlRef });
    }
  }, [urlRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    registerMutation.mutate({
      eventId: event.id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      smsOptIn: formData.smsOptIn,
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Event link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <PublicPageShell>
        <div className="event-detail-loading page-width">
          <Loader2 size={32} className="spin" />
          <p>Loading gathering details...</p>
        </div>
      </PublicPageShell>
    );
  }

  if (error || !event) {
    return (
      <PublicPageShell>
        <div className="event-detail-not-found page-width">
          <AlertCircle size={48} className="text-red" />
          <h1>Event Not Found</h1>
          <p>The event you are looking for may have expired, been cancelled, or moved.</p>
          <Link href="/events" className="reference-button blue-button">
            <ArrowLeft size={16} /> Back to All Events
          </Link>
        </div>
      </PublicPageShell>
    );
  }

  const eventDate = new Date(event.scheduledFor);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const isPaid = !event.isFree && event.priceGhs > 0;
  const priceFormatted = isPaid
    ? `GHS ${(event.priceGhs / 100).toFixed(2)}`
    : "Free Admission";

  const isSoldOut = event.isSoldOut;
  const confirmedCount = event.confirmedCount || 0;
  const capacityPercent = event.capacity
    ? Math.min(100, Math.round((confirmedCount / event.capacity) * 100))
    : 0;

  const eventHeroImg = event.imageUrl || "/ybi-assets/programs/ybi-public-speaking.jpg";

  return (
    <PublicPageShell>
      <div className="event-detail-page">
        {/* Navigation Breadcrumb */}
        <div className="event-detail-breadcrumb page-width">
          <Link href="/events" className="back-link">
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="share-btn"
            title="Share this gathering"
          >
            {copiedLink ? <Check size={15} /> : <Share2 size={15} />}
            <span>{copiedLink ? "Link Copied" : "Share Event"}</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="page-width event-detail-grid">
          {/* Left Column: Event Information */}
          <div className="event-detail-main">
            <div className="event-detail-media">
              <img src={eventHeroImg} alt={event.title} />
              <div className="event-detail-badge-strip">
                <span className={`pill-badge ${isPaid ? "paid" : "free"}`}>
                  {priceFormatted}
                </span>
                {isSoldOut && <span className="pill-badge sold-out">Sold Out</span>}
              </div>
            </div>

            <h1 className="event-detail-title">{event.title}</h1>

            {/* Event Key Highlights Box */}
            <div className="event-highlights-card">
              <div className="highlight-item">
                <div className="highlight-icon blue">
                  <Calendar size={20} />
                </div>
                <div>
                  <label>Date & Day</label>
                  <p>{formattedDate}</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon orange">
                  <Clock size={20} />
                </div>
                <div>
                  <label>Time</label>
                  <p>{formattedTime}</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon red">
                  <MapPin size={20} />
                </div>
                <div>
                  <label>Location / Venue</label>
                  <p>{event.location}</p>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon yellow">
                  <Ticket size={20} />
                </div>
                <div>
                  <label>Investment / Fee</label>
                  <p>{priceFormatted}</p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="event-description-section">
              <h2>About this Gathering</h2>
              <div className="event-description-prose">
                {event.description.split("\n\n").map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}

              </div>
            </div>

            {/* What to Expect / Value Pillars */}
            <div className="event-expectations-section">
              <h3>What to Expect</h3>
              <div className="expectations-grid">
                <div className="expectation-card">
                  <Sparkles size={20} className="icon-sparkle" />
                  <h4>Hands-On Practice</h4>
                  <p>Engage in active drills, debate rhetoric, and structured interactive group exercises.</p>
                </div>
                <div className="expectation-card">
                  <Users size={20} className="icon-users" />
                  <h4>Intergenerational Peers</h4>
                  <p>Connect with emerging youth pioneers, experienced mentors, and community leaders.</p>
                </div>
                <div className="expectation-card">
                  <ShieldCheck size={20} className="icon-shield" />
                  <h4>Values-Led Foundation</h4>
                  <p>Grounded in integrity, mutual listening, and practical leadership stewardship.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <aside className="event-detail-sidebar">
            <div className="event-registration-sticky-card">
              {registrationSuccess ? (
                <div className="registration-success-box">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={42} className="text-green" />
                  </div>
                  <h3>
                    {registrationSuccess.isWaitlist
                      ? "Added to Waitlist"
                      : "Registration Confirmed!"}
                  </h3>
                  <p>
                    {registrationSuccess.isWaitlist
                      ? `Thank you, ${registrationSuccess.name}. You are on the waitlist for "${event.title}". If a seat opens up, we will contact you immediately.`
                      : `You're officially registered for "${event.title}". A confirmation has been recorded for ${registrationSuccess.email}.`}
                  </p>

                  <div className="success-event-summary">
                    <div>
                      <span>Date:</span>
                      <strong>{formattedDate}</strong>
                    </div>
                    <div>
                      <span>Time:</span>
                      <strong>{formattedTime}</strong>
                    </div>
                    <div>
                      <span>Venue:</span>
                      <strong>{event.location}</strong>
                    </div>
                    {registrationSuccess.reference && (
                      <div>
                        <span>Reference:</span>
                        <code>{registrationSuccess.reference}</code>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationSuccess(null);
                      setFormData({ name: "", email: "", phone: "", smsOptIn: true });
                    }}
                    className="reference-button outline-button full-width"
                  >
                    Register Another Person
                  </button>
                </div>
              ) : (
                <div className="registration-form-wrap">
                  <div className="reg-card-header">
                    <h3>
                      {isSoldOut ? "Join Event Waitlist" : isPaid ? "Reserve Your Seat" : "Free Registration"}
                    </h3>
                    <div className="price-tag-large">
                      <span className="amount">{priceFormatted}</span>
                      {isPaid && <span className="currency-note">via Paystack (Card, MoMo, Bank)</span>}
                    </div>
                  </div>

                  {event.capacity && (
                    <div className="capacity-progress-container">
                      <div className="capacity-labels">
                        <span>Attendance</span>
                        <span>
                          {confirmedCount} / {event.capacity} spots filled
                        </span>
                      </div>
                      <div className="capacity-bar-track">
                        <div
                          className={`capacity-bar-fill ${capacityPercent >= 90 ? "almost-full" : ""}`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                      {isSoldOut && (
                        <p className="sold-out-warning">
                          <AlertCircle size={14} /> Capacity reached. Submitting below places you on the priority waitlist.
                        </p>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="event-reg-form">
                    <div className="form-group">
                      <label htmlFor="reg-name">
                        Full Name <span className="req">*</span>
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        placeholder="e.g. Ama Serwaa"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-email">
                        Email Address <span className="req">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        placeholder="ama@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-phone">
                        Phone Number (SMS Notifications) <span className="req">*</span>
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        placeholder="+233 24 000 0000"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>

                    <div className="form-checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.smsOptIn}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, smsOptIn: e.target.checked }))
                          }
                        />
                        <span>Send me event reminders & venue updates via SMS</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="reference-button yellow-button full-width"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 size={17} className="spin" />
                          <span>Processing...</span>
                        </>
                      ) : isSoldOut ? (
                        <span>Join Waitlist</span>
                      ) : isPaid ? (
                        <span>Proceed to Pay {priceFormatted}</span>
                      ) : (
                        <span>Confirm Free Registration</span>
                      )}
                    </button>

                    <p className="form-trust-notice">
                      <ShieldCheck size={14} /> Instant confirmation · No spam ever · Secure processing
                    </p>
                  </form>
                </div>
              )}

              {/* Sidebar Help Card */}
              <div className="sidebar-help-card">
                <h4>Questions about this gathering?</h4>
                <p>Reach out to the YBI event coordination desk.</p>
                <Link href="/contact" className="help-contact-link">
                  <MessageSquare size={14} /> Send a Message
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicPageShell>
  );
}
