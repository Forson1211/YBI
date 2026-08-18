import { useState, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import { PublicPageShell } from "@/components/PublicSiteChrome";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  Facebook,
  Linkedin,
  Twitter,
  BookOpen,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

/**
 * Lightweight safe Markdown-to-HTML parser for article bodies
 */
function MarkdownBody({ content }: { content: string }) {
  const renderedElements = useMemo(() => {
    if (!content) return null;
    const blocks = content.split(/\n\n+/);

    return blocks.map((block, index) => {
      const trimmed = block.trim();

      // Heading 2 (## Heading)
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={index} className="article-h2">
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      }

      // Heading 3 (### Heading)
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={index} className="article-h3">
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      }

      // Blockquote (> Quote)
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={index} className="article-quote">
            <p>{trimmed.replace(/^>\s+/, "")}</p>
          </blockquote>
        );
      }

      // Ordered list (1. item)
      if (/^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split("\n");
        return (
          <ol key={index} className="article-ol">
            {lines.map((line, liIdx) => {
              const text = line.replace(/^\d+\.\s+/, "");
              return <li key={liIdx} dangerouslySetInnerHTML={{ __html: formatInline(text) }} />;
            })}
          </ol>
        );
      }

      // Unordered list (- item or * item)
      if (/^[-*]\s/.test(trimmed)) {
        const lines = trimmed.split("\n");
        return (
          <ul key={index} className="article-ul">
            {lines.map((line, liIdx) => {
              const text = line.replace(/^[-*]\s+/, "");
              return <li key={liIdx} dangerouslySetInnerHTML={{ __html: formatInline(text) }} />;
            })}
          </ul>
        );
      }

      // Standard paragraph
      return (
        <p
          key={index}
          className="article-p"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    });
  }, [content]);

  return <div className="article-rendered-prose">{renderedElements}</div>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

import { DEFAULT_ARTICLES } from "@/lib/defaultArticles";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const [copiedLink, setCopiedLink] = useState(false);

  const { data: recentPosts } = trpc.publicSite.blog.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  const { data: fetchedPost, isLoading: isFetchingDirect, error } = trpc.publicSite.blog.getBySlug.useQuery(
    { slug },
    { enabled: Boolean(slug), staleTime: 1000 * 60 * 10 }
  );

  const effectiveRecentPosts = recentPosts?.length ? recentPosts : DEFAULT_ARTICLES;
  const post =
    fetchedPost ||
    effectiveRecentPosts.find((p) => p.slug === slug) ||
    DEFAULT_ARTICLES.find((p) => p.slug === slug);
  const isLoading = !post && isFetchingDirect;

  const otherPosts = useMemo(() => {
    if (!post) return [];
    return effectiveRecentPosts.filter((p) => p.id !== post.id).slice(0, 3);
  }, [effectiveRecentPosts, post]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleShareSocial = (platform: "twitter" | "facebook" | "linkedin" | "whatsapp") => {
    if (typeof window === "undefined" || !post) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);

    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}%20via%20@YBIGhana`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  if (isLoading) {
    return (
      <PublicPageShell>
        <div className="blog-post-loading page-width">
          <Loader2 size={32} className="spin" />
          <p>Loading article story...</p>
        </div>
      </PublicPageShell>
    );
  }

  if (error || !post) {
    return (
      <PublicPageShell>
        <div className="blog-post-not-found page-width">
          <AlertCircle size={48} className="text-red" />
          <h1>Article Not Found</h1>
          <p>The essay or story you requested may have been archived or moved.</p>
          <Link href="/blog" className="reference-button blue-button">
            <ArrowLeft size={16} /> Back to Journal
          </Link>
        </div>
      </PublicPageShell>
    );
  }

  const postDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Published";

  const coverImg =
    post.coverImageUrl || "/ybi-assets/community/ybi-community.jpg";

  return (
    <PublicPageShell>
      <article className="blog-post-page">
        {/* Post Hero Header */}
        <header className="blog-post-header">
          <div className="page-width post-header-inner">
            <Link href="/blog" className="post-back-btn">
              <ArrowLeft size={15} /> Back to Journal
            </Link>

            <div className="post-header-meta">
              <span className="post-category-tag">{post.category}</span>
              <span className="post-read-time">
                <Clock size={14} /> 5 min read
              </span>
              <span className="post-date">
                <Calendar size={14} /> {postDate}
              </span>
            </div>

            <h1 className="post-title">{post.title}</h1>

            <p className="post-excerpt-lead">{post.excerpt}</p>

            {/* Author Bar & Share */}
            <div className="post-author-share-bar">
              <div className="post-author-profile">
                <div className="post-author-avatar">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <span className="author-name">{post.authorName}</span>
                  <span className="author-role">Young Beginners Inspiration</span>
                </div>
              </div>

              <div className="post-share-actions">
                <span className="share-label">Share:</span>
                <button
                  type="button"
                  onClick={() => handleShareSocial("whatsapp")}
                  className="share-icon-btn whatsapp"
                  aria-label="Share on WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleShareSocial("twitter")}
                  className="share-icon-btn twitter"
                  aria-label="Share on X / Twitter"
                  title="Twitter / X"
                >
                  <Twitter size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleShareSocial("linkedin")}
                  className="share-icon-btn linkedin"
                  aria-label="Share on LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleShareSocial("facebook")}
                  className="share-icon-btn facebook"
                  aria-label="Share on Facebook"
                  title="Facebook"
                >
                  <Facebook size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="share-icon-btn copy"
                  aria-label="Copy link"
                  title="Copy Link"
                >
                  {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="page-width post-cover-container">
          <div className="post-cover-frame">
            <img src={coverImg} alt={post.title} />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="page-width post-body-layout">
          <div className="post-body-content">
            <MarkdownBody content={post.body} />

            {/* End of Article Callout Box */}
            <div className="post-engagement-callout">
              <div className="callout-icon">
                <Sparkles size={24} />
              </div>
              <div className="callout-text">
                <h3>Join the Conversation</h3>
                <p>
                  Have thoughts or lived experiences related to this essay? YBI invites community
                  leaders, youth, and elders to share their perspectives in our upcoming dialogue circles.
                </p>
                <div className="callout-buttons">
                  <Link href="/get-involved" className="reference-button yellow-button">
                    Volunteer or Mentor
                  </Link>
                  <Link href="/events" className="reference-button outline-button">
                    Attend Next Gathering
                  </Link>
                </div>
              </div>
            </div>

            {/* Author Profile Footer */}
            <div className="post-author-bio-card">
              <div className="author-bio-avatar">{post.authorName.charAt(0)}</div>
              <div className="author-bio-details">
                <h4>Written by {post.authorName}</h4>
                <p>
                  Contributing thinker and practitioner at Young Beginners Inspiration (YBI),
                  advancing youth voice, intergenerational learning, and community leadership stewardship across Ghana.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related / Suggested Articles Section */}
        {otherPosts.length > 0 && (
          <section className="post-related-section">
            <div className="page-width">
              <div className="related-header">
                <h2>More from the YBI Journal</h2>
                <Link href="/blog" className="view-all-link">
                  <span>View all essays</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="related-grid">
                {otherPosts.map((related) => {
                  const relatedDate = related.publishedAt
                    ? new Date(related.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <article key={related.id} className="related-card">
                      <Link
                        href={`/blog/${related.slug}`}
                        className="related-media"
                      >
                        <img
                          src={
                            related.coverImageUrl ||
                            "/ybi-assets/programs/ybi-public-speaking.jpg"
                          }
                          alt={related.title}
                          loading="lazy"
                        />
                        <span className="related-cat">{related.category}</span>
                      </Link>

                      <div className="related-content">
                        <span className="related-date">{relatedDate}</span>
                        <h3>
                          <Link href={`/blog/${related.slug}`}>
                            {related.title}
                          </Link>
                        </h3>
                        <p>{related.excerpt}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </article>
    </PublicPageShell>
  );
}
