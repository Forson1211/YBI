import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BotMessageSquare,
  ArrowRight,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1]));

  const { data: faqList, isLoading } = trpc.publicSite.faq.list.useQuery();

  const categories = useMemo(() => {
    if (!faqList) return ["All"];
    const cats = Array.from(new Set(faqList.map((item) => item.category)));
    return ["All", ...cats];
  }, [faqList]);

  const filteredFaqs = useMemo(() => {
    if (!faqList) return [];
    return faqList.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [faqList, selectedCategory, searchQuery]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (filteredFaqs.length > 0) {
      setOpenItems(new Set(filteredFaqs.map((f) => f.id)));
    }
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <PublicPageShell>
      <div className="faq-page-container">
        {/* Page Hero Header */}
        <section className="faq-hero-header">
          <div className="page-width">
            <h1 className="faq-hero-title">
              Common Questions & Answers
            </h1>
            <p className="faq-hero-subtitle">
              Everything you need to know about participating in YBI programs, joining our
              intergenerational mentorship circles, making a donation, or partnering with our team.
            </p>


            {/* Search Box */}
            <div className="faq-search-wrapper">
              <div className="faq-search-input-box">
                <Search size={18} className="faq-search-icon" />
                <input
                  type="text"
                  placeholder="Search questions by keyword (e.g. registration, fees, mentors, MoMo)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="faq-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="faq-search-clear"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="faq-category-pills-row">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`faq-pill-btn ${selectedCategory === cat ? "is-active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="faq-content-section">
          <div className="page-width">
            <div className="faq-list-toolbar">
              <span className="faq-count">
                Showing {filteredFaqs.length} question{filteredFaqs.length === 1 ? "" : "s"}
              </span>
              <div className="faq-expand-controls">
                <button type="button" onClick={expandAll} className="expand-text-btn">
                  Expand All
                </button>
                <span className="divider">|</span>
                <button type="button" onClick={collapseAll} className="expand-text-btn">
                  Collapse All
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="faq-loading-skeleton">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="faq-skeleton-item" />
                ))}
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="faq-empty-state">
                <HelpCircle size={44} />
                <h3>No matching questions found</h3>
                <p>
                  We couldn't find an answer matching "{searchQuery}". You can ask our AI assistant or
                  contact our team directly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="reference-button blue-button"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="faq-accordion-list">
                {filteredFaqs.map((faq) => {
                  const isOpen = openItems.has(faq.id);
                  return (
                    <div
                      key={faq.id}
                      className={`faq-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => toggleItem(faq.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="faq-question-left">
                          <span className="faq-category-tag">{faq.category}</span>
                          <span className="faq-question-text">{faq.question}</span>
                        </div>
                        <div className="faq-chevron-wrap">
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="faq-answer-pane">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="faq-support-banner">
          <div className="page-width">
            <div className="faq-support-grid">
              <div className="support-card assistant">
                <BotMessageSquare size={28} className="support-icon" />
                <h3>Ask YBI Visitor Assistant</h3>
                <p>
                  Get instant answers 24/7 about upcoming workshops, mentorship cohort dates, and
                  community guidelines.
                </p>
                <span className="card-hint">Click the chat icon at bottom-right of any page</span>
              </div>

              <div className="support-card human">
                <MessageSquare size={28} className="support-icon" />
                <h3>Speak with Our Team</h3>
                <p>
                  Have a specific question about program partnership, volunteering, or donations? Send us a direct inquiry.
                </p>
                <Link href="/contact" className="support-action-link">
                  <span>Open Contact Form</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicPageShell>
  );
}
