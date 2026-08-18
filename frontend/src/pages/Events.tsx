import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { useSiteImages } from "@/lib/useSiteImage";
import { DEFAULT_EVENTS } from "@/lib/defaultEvents";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Events() {
  const { getImage } = useSiteImages();
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: eventsList } = trpc.publicSite.events.list.useQuery();
  const effectiveEvents = eventsList?.length ? eventsList : DEFAULT_EVENTS;

  const now = useMemo(() => new Date(), []);

  const categorizedEvents = useMemo(() => {
    const upcoming = effectiveEvents.filter(
      (e) => new Date(e.scheduledFor).getTime() >= now.getTime()
    );
    const past = effectiveEvents.filter(
      (e) => new Date(e.scheduledFor).getTime() < now.getTime()
    );

    return { upcoming, past };
  }, [effectiveEvents, now]);

  const filteredEvents = useMemo(() => {
    const list = activeTab === "upcoming" ? categorizedEvents.upcoming : categorizedEvents.past;
    return list.filter((event) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "free" && event.isFree) ||
        (selectedCategory === "paid" && !event.isFree);

      return matchesSearch && matchesCategory;
    });
  }, [activeTab, categorizedEvents, searchQuery, selectedCategory]);

  return (
    <PublicPageShell>
      <div className="events-page-container">
        {/* Page Hero Header */}
        <section className="events-hero-header">
          <div className="page-width">
            <div className="events-hero-content">
              <h1 className="events-hero-title">
                Events, Workshops & Mentorship Gatherings
              </h1>
              <p className="events-hero-subtitle">
                Join inspiring masterclasses, youth enterprise pitch labs, and structured
                intergenerational dialogue summits designed to equip emerging changemakers across Ghana.
              </p>
            </div>


            {/* Filter & Search Bar */}
            <div className="events-controls-bar">
              <div className="events-tabs">
                <button
                  type="button"
                  className={`events-tab-btn ${activeTab === "upcoming" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming Events ({categorizedEvents.upcoming.length})
                </button>
                <button
                  type="button"
                  className={`events-tab-btn ${activeTab === "past" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("past")}
                >
                  Past Gatherings ({categorizedEvents.past.length})
                </button>
              </div>

              <div className="events-filters-group">
                <div className="events-search-box">
                  <Search size={17} className="events-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by title, location or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="events-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="events-search-clear"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="events-category-pills">
                  <button
                    type="button"
                    className={`category-pill ${selectedCategory === "all" ? "is-active" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    className={`category-pill ${selectedCategory === "free" ? "is-active" : ""}`}
                    onClick={() => setSelectedCategory("free")}
                  >
                    Free Access
                  </button>
                  <button
                    type="button"
                    className={`category-pill ${selectedCategory === "paid" ? "is-active" : ""}`}
                    onClick={() => setSelectedCategory("paid")}
                  >
                    Special Masterclasses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid Section */}
        <section className="events-listing-section">
          <div className="page-width">
            {filteredEvents.length === 0 ? (
              <div className="events-empty-state">
                <div className="events-empty-icon">
                  <Calendar size={40} />
                </div>
                <h3>No events match your criteria</h3>
                <p>
                  {searchQuery || selectedCategory !== "all"
                    ? "Try clearing your filters or search keywords to see more gatherings."
                    : activeTab === "upcoming"
                    ? "We are currently scheduling our next cohort of workshops. Check back soon or subscribe to our newsletter for updates!"
                    : "No past events recorded yet."}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="reference-button blue-button"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map((event) => {
                  const eventDate = new Date(event.scheduledFor);
                  const monthName = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                  const dayNum = eventDate.getDate();
                  const timeStr = eventDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  const isPaid = !event.isFree && event.priceGhs > 0;
                  const priceFormatted = isPaid
                    ? `GHS ${(event.priceGhs / 100).toFixed(2)}`
                    : "Free";

                    const cardImg =
                      event.imageUrl && !event.imageUrl.includes("undefined")
                        ? event.imageUrl
                        : event.slug.includes("speaking")
                        ? "/ybi-assets/programs/ybi-public-speaking.jpg"
                        : event.slug.includes("generations")
                        ? "/ybi-assets/community/ybi-community.jpg"
                        : "/ybi-assets/programs/ybi-entrepreneurship.jpg";

                    return (
                      <article key={event.id} className="event-card">
                        <div className="event-card-media">
                          <img
                            src={cardImg}
                            alt={event.title}
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/ybi-assets/programs/ybi-public-speaking.jpg";
                            }}
                          />
                          <div className="event-date-badge">
                            <span className="event-date-month">{monthName}</span>
                            <span className="event-date-day">{dayNum}</span>
                          </div>
                          <div className="event-price-badge">
                            {isPaid ? (
                              <span className="badge-paid">{priceFormatted}</span>
                            ) : (
                              <span className="badge-free">Free Admission</span>
                            )}
                          </div>
                        </div>

                        <div className="event-card-content">
                          <div className="event-meta-row">
                            <span className="event-time">
                              <Clock size={13} /> {timeStr}
                            </span>
                            <span className="event-location" title={event.location}>
                              <MapPin size={13} /> {event.location}
                            </span>
                          </div>

                          <h2 className="event-card-title">
                            <Link href={`/events/${event.slug}`}>{event.title}</Link>
                          </h2>

                          <p className="event-card-description">
                            {event.description}
                          </p>

                          <div className="event-card-footer">
                            {event.capacity ? (
                              <div className="event-capacity-info">
                                <Users size={14} />
                                <span>{event.capacity} seats max</span>
                              </div>
                            ) : (
                              <div className="event-capacity-info">
                                <Sparkles size={14} />
                                <span>Open Cohort</span>
                              </div>
                            )}

                            <Link
                              href={`/events/${event.slug}`}
                              className="event-register-btn"
                              onMouseEnter={() => utils.publicSite.events.getBySlug.prefetch({ slug: event.slug })}
                              onFocus={() => utils.publicSite.events.getBySlug.prefetch({ slug: event.slug })}
                            >
                              <span>{activeTab === "upcoming" ? "Register" : "View Details"}</span>
                              <ArrowRight size={14} />
                            </Link>

                          </div>
                        </div>
                      </article>
                    );

                })}
              </div>
            )}
          </div>
        </section>

        {/* Host an Event / Partner CTA */}
        <section className="events-partner-banner">
          <div className="page-width">
            <div className="events-partner-card">
              <div className="events-partner-text">
                <h2>Want to Host or Sponsor a YBI Workshop?</h2>
                <p>
                  We partner with schools, universities, community centers, and youth organizations
                  to deliver tailored speaking, mentorship, and enterprise cohorts.
                </p>
              </div>
              <div className="events-partner-actions">
                <Link href="/get-involved" className="reference-button yellow-button">
                  Partner With Us
                </Link>
                <Link href="/contact" className="reference-button outline-button">
                  Contact Events Team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicPageShell>
  );
}
