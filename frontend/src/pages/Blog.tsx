import { useState, useMemo } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import { DEFAULT_ARTICLES } from "@/lib/defaultArticles";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Mail,
  Newspaper,
  Flame,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Mentorship",
  "Public Speaking",
  "Entrepreneurship",
  "Leadership",
  "Community",
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: posts } = trpc.publicSite.blog.list.useQuery({
    limit: 30,
  });
  const effectivePosts = posts?.length ? posts : DEFAULT_ARTICLES;

  const subscribeMutation = trpc.publicSite.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      toast.success("Thank you for subscribing to YBI Stories & Insights!");
    },
    onError: (err) => {
      toast.error(err.message || "Subscription failed. Please try again.");
    },
  });

  const filteredPosts = useMemo(() => {
    return effectivePosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [effectivePosts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    if (effectivePosts.length === 0) return null;
    return effectivePosts[0];
  }, [effectivePosts]);

  const regularPosts = useMemo(() => {
    if (selectedCategory !== "All" || searchQuery.trim() !== "") {
      return filteredPosts;
    }
    return filteredPosts.slice(1);
  }, [filteredPosts, selectedCategory, searchQuery]);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;
    subscribeMutation.mutate({ email: subscriberEmail.trim() });
  };

  return (
    <PublicPageShell>
      <div className="blog-page-container">
        {/* Editorial Header */}
        <section className="blog-hero-header">
          <div className="page-width">
            <h1 className="blog-hero-title">
              Insights, Ideas & Voices from the Field
            </h1>
            <p className="blog-hero-subtitle">
              Essays on intergenerational mentorship, public speaking methodologies, values-led
              youth enterprise, and field stories transforming communities across Ghana.
            </p>


            {/* Category Filter Pills & Search */}
            <div className="blog-controls-row">
              <div className="blog-category-tabs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`blog-category-btn ${selectedCategory === cat ? "is-active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="blog-search-box">
                <Search size={16} className="blog-search-icon" />
                <input
                  type="text"
                  placeholder="Search articles & essays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="blog-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="blog-search-clear"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Editorial Content */}
        <section className="blog-content-section">
          <div className="page-width">
            {filteredPosts.length === 0 ? (
              <div className="blog-empty-state">
                <BookOpen size={42} />
                <h3>No articles found</h3>
                <p>
                  {searchQuery || selectedCategory !== "All"
                    ? "Try adjusting your search terms or category selection."
                    : "No published articles available yet. Check back soon!"}
                </p>
                {(searchQuery || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="reference-button blue-button"
                  >
                    View All Articles
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Featured Story (Shown on All tab with no search) */}
                {selectedCategory === "All" && searchQuery === "" && featuredPost && (
                  <div className="blog-featured-card">
                    <div className="featured-media">
                      <img
                        src={
                          featuredPost.coverImageUrl ||
                          "/ybi-assets/community/ybi-community.jpg"
                        }
                        alt={featuredPost.title}
                        loading="lazy"
                      />
                      <span className="featured-pill">
                        <Flame size={13} /> Featured Story
                      </span>
                    </div>

                    <div className="featured-body">
                      <div className="featured-meta">
                        <span className="category-tag">{featuredPost.category}</span>
                        <span className="read-time">
                          <Clock size={13} /> 5 min read
                        </span>
                        <span className="date">
                          {featuredPost.publishedAt
                            ? new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>

                      <h2 className="featured-title">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="featured-excerpt">{featuredPost.excerpt}</p>

                      <div className="featured-footer">
                        <div className="author-info">
                          <div className="author-avatar-initials">
                            {featuredPost.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="author-name">{featuredPost.authorName}</span>
                            <span className="author-org">Young Beginners Inspiration</span>
                          </div>
                        </div>

                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          className="featured-read-btn"
                        >
                          <span>Read Full Story</span>
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Magazine Grid */}
                <div className="blog-grid">
                  {regularPosts.map((post) => {
                    const postDate = post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recent";

                    const postImg =
                      post.coverImageUrl ||
                      "/ybi-assets/programs/ybi-public-speaking.jpg";

                    return (
                      <article key={post.id} className="blog-card">
                        <Link href={`/blog/${post.slug}`} className="blog-card-media">
                          <img src={postImg} alt={post.title} loading="lazy" />
                          <span className="category-badge">{post.category}</span>
                        </Link>

                        <div className="blog-card-content">
                          <div className="blog-card-meta">
                            <span className="meta-date">
                              <Calendar size={13} /> {postDate}
                            </span>
                            <span className="meta-read-time">
                              <Clock size={13} /> 4 min read
                            </span>
                          </div>

                          <h3 className="blog-card-title">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>

                          <p className="blog-card-excerpt">{post.excerpt}</p>

                          <div className="blog-card-footer">
                            <div className="blog-card-author">
                              <span className="author-dot" />
                              <span>{post.authorName}</span>
                            </div>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="blog-read-link"
                              aria-label={`Read ${post.title}`}
                            >
                              <span>Read</span>
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Newsletter Subscription Band */}
        <section className="blog-newsletter-section">
          <div className="page-width">
            <div className="blog-newsletter-card">
              <div className="newsletter-text">
                <span className="newsletter-kicker">Stay In The Dialogue</span>
                <h2>Get YBI Perspectives Delivered to Your Inbox</h2>
                <p>
                  Monthly reflections on leadership ethics, youth enterprise breakthroughs, and
                  intergenerational community stories across Ghana.
                </p>
              </div>

              <div className="newsletter-form-container">
                {subscribed ? (
                  <div className="newsletter-success">
                    <CheckCircle2 size={24} className="text-green" />
                    <span>You're subscribed! Welcome to the YBI journal community.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletter} className="newsletter-form">
                    <div className="newsletter-input-wrap">
                      <Mail size={18} className="newsletter-mail-icon" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={subscriberEmail}
                        onChange={(e) => setSubscriberEmail(e.target.value)}
                        className="newsletter-email-input"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={subscribeMutation.isPending}
                      className="reference-button yellow-button"
                    >
                      {subscribeMutation.isPending ? "Subscribing..." : "Subscribe Free"}
                    </button>
                  </form>
                )}
                <span className="newsletter-note">Zero spam. Unsubscribe anytime in one click.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicPageShell>
  );
}
