// Gallery direction: reference-inspired documentary storytelling with YBI color blocks,
// Lato typography, animated image reveals, and a calm, accessible upload flow.
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, HandHeart, ImagePlus, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PublicNavigation from "@/components/PublicNavigation";
import { PublicFooter } from "@/components/PublicSiteChrome";

const mark = "/manus-storage/ybi-logo_a28c9057.png";
const hero = "/manus-storage/ybi-hero_42b78e95.jpg";
const publicSpeaking = "/manus-storage/ybi-public-speaking_08161e85.jpg";
const entrepreneurship = "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg";
const community = "/manus-storage/ybi-community_b2ad3c56.jpg";
type GalleryPhoto = { id: string | number; src: string; title: string; caption: string };

const seededPhotos: GalleryPhoto[] = [
  { id: "seed-hero", src: hero, title: "A voice in the room", caption: "Public speaking creates room for possibility." },
  { id: "seed-speaking", src: publicSpeaking, title: "Practice becomes confidence", caption: "Small brave repetitions build strong voices." },
  { id: "seed-enterprise", src: entrepreneurship, title: "Ideas taking shape", caption: "Entrepreneurship starts with noticing a need." },
  { id: "seed-community", src: community, title: "Generations in conversation", caption: "Experience and fresh perspective strengthen one another." },
];

export default function Gallery() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const { data: managedPhotos } = trpc.publicSite.gallery.useQuery();
  const photos = useMemo(() => {
    const saved = (managedPhotos ?? []).map((photo) => ({ id: photo.id, src: photo.imageUrl, title: photo.title, caption: photo.altText }));
    return saved.length ? saved : seededPhotos;
  }, [managedPhotos]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activePhoto === null) return;
      if (event.key === "Escape") setActivePhoto(null);
      if (event.key === "ArrowLeft") setActivePhoto((activePhoto - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight") setActivePhoto((activePhoto + 1) % photos.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, photos.length]);

  const previousPhoto = () => setActivePhoto((current) => current === null ? null : (current - 1 + photos.length) % photos.length);
  const nextPhoto = () => setActivePhoto((current) => current === null ? null : (current + 1) % photos.length);

  return <div className="reference-site-shell">
    <header className="reference-header"><div className="reference-header-inner"><button className="mobile-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={27} /> : <Menu size={29} />}</button><a className="reference-brand" href="/" aria-label="Young Beginners Inspiration home"><img src={mark} alt="Young Beginners Inspiration logo" /><span>Young Beginners<br />Inspiration</span></a><PublicNavigation menuOpen={menuOpen} onNavigate={() => setMenuOpen(false)} /><a className="header-support" href="/join-us" onClick={() => setMenuOpen(false)}><HandHeart size={22} /><span>Support Us</span></a></div></header>
    <main>
      <section className="gallery-hero section-blue"><div className="page-width gallery-hero-inner"><p className="reference-eyebrow light"><span /> From the platform</p><h1>Moments worth<br /><span>holding onto.</span></h1><p>See the conversations, courage, and connections that give Young Beginners Inspiration its heartbeat.</p></div></section>
      <section className="gallery-content section-cream"><div className="page-width"><div className="gallery-intro-grid"><div><p className="reference-eyebrow"><span /> The YBI gallery</p><h2>Every picture<br /><span>holds a beginning.</span></h2></div><div className="gallery-upload-card"><div className="gallery-upload-icon"><ImagePlus size={25} /></div><div><h3>Share a moment</h3><p>New gallery photos are curated and published by the Young Beginners Inspiration team.</p></div><a className="reference-button blue-button gallery-upload-button" href="/admin/gallery">Manage gallery <ArrowUpRight size={16} /></a><small>Published gallery moments are shared with every visitor.</small></div></div><div className="gallery-grid">{photos.map((photo, index) => <article className={`gallery-card ${index === 0 ? "gallery-card-featured" : ""}`} key={photo.id} style={{ "--gallery-index": index } as React.CSSProperties}><button type="button" className="gallery-image-button" onClick={() => setActivePhoto(index)} aria-label={`Open ${photo.title}`}><img src={photo.src} alt={photo.title} /><span className="gallery-card-shade" /><span className="gallery-card-open"><Expand size={18} /></span></button><div className="gallery-card-caption"><p>{photo.title}</p><span>{photo.caption}</span></div></article>)}</div></div></section>
      <section className="gallery-cta section-red"><div className="page-width gallery-cta-inner"><div><p className="reference-eyebrow light"><span /> Keep the story moving</p><h2>Bring the next<br /><span>moment with you.</span></h2></div><div><p>When people gather, learn, and make room for one another, there is always another story worth sharing.</p><a className="reference-button white-button" href="/join-us">Join the platform <ArrowUpRight size={18} /></a></div></div></section>
    </main>
    <PublicFooter />
    {activePhoto !== null ? <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer" onClick={() => setActivePhoto(null)}><div className="gallery-lightbox-inner" onClick={(event) => event.stopPropagation()}><button type="button" className="gallery-lightbox-close" onClick={() => setActivePhoto(null)} aria-label="Close image viewer"><X size={24} /></button><img src={photos[activePhoto].src} alt={photos[activePhoto].title} /><div className="gallery-lightbox-caption"><div><p>{photos[activePhoto].title}</p><span>{photos[activePhoto].caption}</span></div><div className="gallery-lightbox-controls"><button type="button" onClick={previousPhoto} aria-label="Previous photo"><ArrowLeft size={20} /></button><button type="button" onClick={nextPhoto} aria-label="Next photo"><ArrowRight size={20} /></button></div></div></div></div> : null}
  </div>;
}
