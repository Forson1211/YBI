import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Expand,
  Filter,
  HandHeart,
  ImagePlus,
  Menu,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSiteImages } from "@/lib/useSiteImage";
import PublicNavigation from "@/components/PublicNavigation";
import { PublicFooter } from "@/components/PublicSiteChrome";

type GalleryPhoto = {
  id: string | number;
  src: string;
  title: string;
  caption: string;
  category?: string;
};

const seededPhotos: GalleryPhoto[] = [
  {
    id: "seed-hero",
    src: "/ybi-assets/homepage/ybi-hero.jpg",
    title: "A Voice in the Room",
    caption: "Public speaking creates room for possibility and confident self-expression.",
    category: "Workshops",
  },
  {
    id: "seed-speaking",
    src: "/ybi-assets/programs/ybi-public-speaking.jpg",
    title: "Practice Becomes Confidence",
    caption: "Small brave repetitions build strong, articulate voices across Ghana.",
    category: "Cohorts",
  },
  {
    id: "seed-enterprise",
    src: "/ybi-assets/programs/ybi-entrepreneurship.jpg",
    title: "Ideas Taking Shape",
    caption: "Youth entrepreneurship starts with noticing a community need and building solutions.",
    category: "Innovation",
  },
  {
    id: "seed-community",
    src: "/ybi-assets/community/ybi-community.jpg",
    title: "Generations in Conversation",
    caption: "Elder wisdom and youth perspective strengthen one another in open dialogue.",
    category: "Community",
  },
  {
    id: "seed-wall-1",
    src: "/ybi-assets/image-wall/ybi-wall-youth-leadership.jpg",
    title: "Youth Leadership Lab",
    caption: "Values-led leadership sessions preparing emerging change-makers.",
    category: "Leadership",
  },
  {
    id: "seed-wall-2",
    src: "/ybi-assets/image-wall/ybi-wall-intergenerational-mentoring.jpg",
    title: "Intergenerational Mentoring",
    caption: "One-on-one coaching connecting students with dedicated community mentors.",
    category: "Mentorship",
  },
  {
    id: "seed-wall-3",
    src: "/ybi-assets/image-wall/ybi-wall-community-circle.jpg",
    title: "Community Reflection Circle",
    caption: "Shared conversations that bring our neighborhoods and leaders together.",
    category: "Community",
  },
];

export default function Gallery() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Moments");
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { getImage } = useSiteImages();
  const brandLogo = getImage(
    "brand_logo",
    "/ybi-assets/brand/ybi-logo.png",
    "Young Beginners Inspiration logo"
  );

  const { data: managedPhotos } = trpc.publicSite.gallery.useQuery();

  const allPhotos: GalleryPhoto[] = useMemo(() => {
    const saved = (managedPhotos ?? []).map((photo) => ({
      id: photo.id,
      src: photo.imageUrl,
      title: photo.title,
      caption: photo.altText || "",
      category: photo.category || "Community",
    }));
    return saved.length ? saved : seededPhotos;
  }, [managedPhotos]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allPhotos.map((p) => p.category || "Community")));
    return ["All Moments", ...cats];
  }, [allPhotos]);

  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((photo) => {
      const matchCat =
        selectedCategory === "All Moments" || photo.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.category && photo.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [allPhotos, selectedCategory, searchQuery]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (event.key === "Escape") setActivePhotoIndex(null);
      if (event.key === "ArrowLeft") {
        setActivePhotoIndex(
          (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      }
      if (event.key === "ArrowRight") {
        setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  const previousPhoto = () =>
    setActivePhotoIndex((current) =>
      current === null ? null : (current - 1 + filteredPhotos.length) % filteredPhotos.length
    );

  const nextPhoto = () =>
    setActivePhotoIndex((current) =>
      current === null ? null : (current + 1) % filteredPhotos.length
    );

  return (
    <div className="reference-site-shell">
      {/* Header */}
      <header className="reference-header">
        <div className="reference-header-inner">
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={27} /> : <Menu size={29} />}
          </button>
          <Link
            className="reference-brand"
            href="/"
            aria-label="Young Beginners Inspiration home"
          >
            <img src={brandLogo.src} alt={brandLogo.alt} />
            <span>
              Young Beginners
              <br />
              Inspiration
            </span>
          </Link>
          <PublicNavigation menuOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
          <Link
            className="header-support"
            href="/get-involved#donate"
            onClick={() => setMenuOpen(false)}
          >
            <HandHeart size={22} />
            <span>Support Us</span>
          </Link>
        </div>
      </header>

      <main className="public-route-enter">
        {/* Hero Section */}
        <section className="gallery-hero section-blue">
          <div className="page-width gallery-hero-inner">
            <p className="reference-eyebrow light">
              <span /> From the YBI Community
            </p>
            <h1>
              Moments worth
              <br />
              <span>holding onto.</span>
            </h1>
            <p>
              Explore authentic photographs from our public speaking workshops, intergenerational
              mentorship circles, youth entrepreneurship cohorts, and community gatherings across
              Ghana.
            </p>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="gallery-content section-cream">
          <div className="page-width">
            {/* Header / Filter Toolbar */}
            <div className="gallery-toolbar-wrapper">
              <div className="gallery-toolbar-top">
                <div>
                  <p className="reference-eyebrow">
                    <span /> Photographic Documentary
                  </p>
                  <h2 className="gallery-section-title">
                    Every picture <span>holds a beginning.</span>
                  </h2>
                </div>

                {/* Admin Quick Action (ONLY visible if logged in as admin) */}
                {isAdmin && (
                  <Link className="gallery-admin-badge" href="/admin/gallery">
                    <Sparkles size={16} /> Manage Gallery (Admin) <ArrowUpRight size={15} />
                  </Link>
                )}
              </div>

              {/* Controls Bar: Category Pills & Search */}
              <div className="gallery-controls-bar">
                <div className="gallery-category-pills" role="tablist">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={selectedCategory === cat}
                      className={`gallery-category-pill ${
                        selectedCategory === cat ? "is-active" : ""
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="gallery-search-wrap">
                  <Search size={16} className="gallery-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search moments..."
                    className="gallery-search-input"
                    aria-label="Search gallery moments"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="gallery-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="gallery-count-strip">
                <span>
                  Showing <strong>{filteredPhotos.length}</strong> photo
                  {filteredPhotos.length === 1 ? "" : "s"}
                  {selectedCategory !== "All Moments" ? ` in "${selectedCategory}"` : ""}
                </span>
              </div>
            </div>

            {/* Natural-Proportions Masonry Grid */}
            {filteredPhotos.length > 0 ? (
              <div className="gallery-masonry-grid">
                {filteredPhotos.map((photo, index) => (
                  <article
                    className="gallery-masonry-card"
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActivePhotoIndex(index);
                      }
                    }}
                    aria-label={`View photo: ${photo.title}`}
                  >
                    <div className="gallery-card-media-wrapper">
                      <img
                        src={photo.src}
                        alt={photo.caption || photo.title}
                        loading="lazy"
                        decoding="async"
                        className="gallery-card-image"
                      />
                      <div className="gallery-card-hover-overlay">
                        {photo.category && (
                          <span className="gallery-card-cat-badge">
                            <Tag size={11} /> {photo.category}
                          </span>
                        )}
                        <div className="gallery-card-details">
                          <h3 className="gallery-card-title">{photo.title}</h3>
                          {photo.caption && (
                            <p className="gallery-card-caption-text">{photo.caption}</p>
                          )}
                        </div>
                        <span className="gallery-card-expand-btn" aria-hidden="true">
                          <Expand size={18} />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="gallery-empty-state">
                <Camera size={44} />
                <h3>No photos found</h3>
                <p>Try selecting a different category or clearing your search term.</p>
                <button
                  type="button"
                  className="reference-button blue-button"
                  onClick={() => {
                    setSelectedCategory("All Moments");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="gallery-cta section-red">
          <div className="page-width gallery-cta-inner">
            <div>
              <p className="reference-eyebrow light">
                <span /> Keep the story moving
              </p>
              <h2>
                Bring the next
                <br />
                <span>moment with you.</span>
              </h2>
            </div>
            <div>
              <p>
                When people gather, learn, and make room for one another, there is always another
                story worth sharing.
              </p>
              <Link className="reference-button white-button" href="/get-involved">
                Join the Platform <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* Fullscreen High-Resolution Lightbox Viewer */}
      {activePhotoIndex !== null && filteredPhotos[activePhotoIndex] && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="gallery-lightbox-container"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Close image viewer"
            >
              <X size={26} />
            </button>

            {/* Navigation Arrow Left */}
            <button
              type="button"
              className="gallery-lightbox-nav prev"
              onClick={previousPhoto}
              aria-label="Previous photo"
            >
              <ArrowLeft size={24} />
            </button>

            {/* Main Stage Image in True Native Size */}
            <div className="gallery-lightbox-stage">
              <img
                src={filteredPhotos[activePhotoIndex].src}
                alt={
                  filteredPhotos[activePhotoIndex].caption ||
                  filteredPhotos[activePhotoIndex].title
                }
                className="gallery-lightbox-image"
              />
            </div>

            {/* Navigation Arrow Right */}
            <button
              type="button"
              className="gallery-lightbox-nav next"
              onClick={nextPhoto}
              aria-label="Next photo"
            >
              <ArrowRight size={24} />
            </button>

            {/* Lightbox Footer Bar */}
            <div className="gallery-lightbox-bar">
              <div className="gallery-lightbox-info">
                <div className="gallery-lightbox-meta">
                  {filteredPhotos[activePhotoIndex].category && (
                    <span className="gallery-lightbox-cat">
                      {filteredPhotos[activePhotoIndex].category}
                    </span>
                  )}
                  <span className="gallery-lightbox-counter">
                    {activePhotoIndex + 1} / {filteredPhotos.length}
                  </span>
                </div>
                <h3 className="gallery-lightbox-title">
                  {filteredPhotos[activePhotoIndex].title}
                </h3>
                {filteredPhotos[activePhotoIndex].caption && (
                  <p className="gallery-lightbox-desc">
                    {filteredPhotos[activePhotoIndex].caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
