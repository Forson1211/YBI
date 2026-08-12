// Gallery direction: reference-inspired documentary storytelling with YBI color blocks,
// Lato typography, animated image reveals, and a calm, accessible upload flow.
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, HandHeart, ImagePlus, Menu, Trash2, Upload, X } from "lucide-react";

const mark = "/manus-storage/ybi-logo_a28c9057.png";
const hero = "/manus-storage/ybi-hero_42b78e95.jpg";
const publicSpeaking = "/manus-storage/ybi-public-speaking_08161e85.jpg";
const entrepreneurship = "/manus-storage/ybi-entrepreneurship_d7a3f3ed.jpg";
const community = "/manus-storage/ybi-community_b2ad3c56.jpg";
const storageKey = "ybi-gallery-uploads";

type GalleryPhoto = { id: string; src: string; title: string; caption: string };

const seededPhotos: GalleryPhoto[] = [
  { id: "seed-hero", src: hero, title: "A voice in the room", caption: "Public speaking creates room for possibility." },
  { id: "seed-speaking", src: publicSpeaking, title: "Practice becomes confidence", caption: "Small brave repetitions build strong voices." },
  { id: "seed-enterprise", src: entrepreneurship, title: "Ideas taking shape", caption: "Entrepreneurship starts with noticing a need." },
  { id: "seed-community", src: community, title: "Generations in conversation", caption: "Experience and fresh perspective strengthen one another." },
];

function readStoredUploads(): GalleryPhoto[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as GalleryPhoto[];
    return Array.isArray(parsed) ? parsed.filter((photo) => photo?.id && photo?.src && photo?.title) : [];
  } catch {
    return [];
  }
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const navItems = [["About", "/about"], ["Focus Areas", "/focus-areas"], ["Programs", "/programs"], ["Join Us", "/join-us"], ["Media", "/media"], ["Gallery", "/gallery"]];

export default function Gallery() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploads, setUploads] = useState<GalleryPhoto[]>(readStoredUploads);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const photos = useMemo(() => [...seededPhotos, ...uploads], [uploads]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(uploads));
    } catch {
      toast.error("This photo could not be saved in this browser.");
    }
  }, [uploads]);

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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    try {
      const newPhotos = await Promise.all(files.map(async (file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        src: await fileToDataUrl(file),
        title: file.name.replace(/\.[^/.]+$/, "") || "New YBI moment",
        caption: "A moment from the Young Beginners Inspiration community.",
      })));
      setUploads((current) => [...newPhotos, ...current]);
      toast.success(`${newPhotos.length} photo${newPhotos.length === 1 ? "" : "s"} added to your gallery.`);
    } catch {
      toast.error("We could not read one of those photos. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  const removeUpload = (id: string) => {
    setUploads((current) => current.filter((photo) => photo.id !== id));
    if (activePhoto !== null && photos[activePhoto]?.id === id) setActivePhoto(null);
    toast.success("Photo removed from this browser gallery.");
  };

  const previousPhoto = () => setActivePhoto((current) => current === null ? null : (current - 1 + photos.length) % photos.length);
  const nextPhoto = () => setActivePhoto((current) => current === null ? null : (current + 1) % photos.length);

  return <div className="reference-site-shell">
    <header className="reference-header"><div className="reference-header-inner"><button className="mobile-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={27} /> : <Menu size={29} />}</button><a className="reference-brand" href="/" aria-label="Young Beginners Inspiration home"><img src={mark} alt="Young Beginners Inspiration logo" /><span>Young Beginners<br />Inspiration</span></a><nav className={`reference-nav ${menuOpen ? "is-open" : ""}`}>{navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav><a className="header-support" href="/join-us" onClick={() => setMenuOpen(false)}><HandHeart size={22} /><span>Support Us</span></a></div></header>
    <main>
      <section className="gallery-hero section-blue"><div className="page-width gallery-hero-inner"><p className="reference-eyebrow light"><span /> From the platform</p><h1>Moments worth<br /><span>holding onto.</span></h1><p>See the conversations, courage, and connections that give Young Beginners Inspiration its heartbeat.</p></div></section>
      <section className="gallery-content section-cream"><div className="page-width"><div className="gallery-intro-grid"><div><p className="reference-eyebrow"><span /> The YBI gallery</p><h2>Every picture<br /><span>holds a beginning.</span></h2></div><div className="gallery-upload-card"><div className="gallery-upload-icon"><ImagePlus size={25} /></div><div><h3>Add a moment</h3><p>Upload photos from your YBI activities and keep them together in this browser.</p></div><label className="reference-button blue-button gallery-upload-button"><Upload size={16} /> Upload photos<input type="file" accept="image/*" multiple onChange={handleUpload} /></label><small>Photos stay saved on this device until a shared gallery is connected.</small></div></div><div className="gallery-grid">{photos.map((photo, index) => <article className={`gallery-card ${index === 0 ? "gallery-card-featured" : ""}`} key={photo.id} style={{ "--gallery-index": index } as React.CSSProperties}><button type="button" className="gallery-image-button" onClick={() => setActivePhoto(index)} aria-label={`Open ${photo.title}`}><img src={photo.src} alt={photo.title} /><span className="gallery-card-shade" /><span className="gallery-card-open"><Expand size={18} /></span></button><div className="gallery-card-caption"><p>{photo.title}</p><span>{photo.caption}</span>{index >= seededPhotos.length ? <button type="button" className="gallery-remove" onClick={() => removeUpload(photo.id)} aria-label={`Remove ${photo.title}`}><Trash2 size={15} /></button> : null}</div></article>)}</div></div></section>
      <section className="gallery-cta section-red"><div className="page-width gallery-cta-inner"><div><p className="reference-eyebrow light"><span /> Keep the story moving</p><h2>Bring the next<br /><span>moment with you.</span></h2></div><div><p>When people gather, learn, and make room for one another, there is always another story worth sharing.</p><a className="reference-button white-button" href="/join-us">Join the platform <ArrowUpRight size={18} /></a></div></div></section>
    </main>
    <footer className="reference-footer"><div className="page-width footer-reference-grid"><div className="footer-reference-brand"><a className="reference-brand footer-brand" href="/"><img src={mark} alt="Young Beginners Inspiration logo" /><span>Young Beginners<br />Inspiration</span></a><p>Equipping the young and the aged to inspire, learn, and become responsible leaders.</p><a className="reference-button yellow-button" href="/join-us">Support us <ArrowUpRight size={17} /></a></div><div className="footer-reference-links"><div><h4>Explore</h4>{navItems.slice(0, 3).map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div><div><h4>Join us</h4><a href="/join-us">Volunteer</a><a href="/join-us">Partner with us</a><a href="/media">Media</a></div></div><div className="footer-reference-note"><h4>Our belief</h4><p>“Every generation has something valuable to share.”</p><div className="footer-socials"><a href="/join-us" aria-label="Facebook">f</a><a href="/join-us" aria-label="Instagram">◎</a><a href="/join-us" aria-label="LinkedIn">in</a></div></div></div><div className="page-width footer-reference-bottom"><span>© 2026 Young Beginners Inspiration</span><span>Leadership · Education · Business</span><a href="/">Back home <ArrowUpRight size={14} /></a></div></footer>
    {activePhoto !== null ? <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer" onClick={() => setActivePhoto(null)}><div className="gallery-lightbox-inner" onClick={(event) => event.stopPropagation()}><button type="button" className="gallery-lightbox-close" onClick={() => setActivePhoto(null)} aria-label="Close image viewer"><X size={24} /></button><img src={photos[activePhoto].src} alt={photos[activePhoto].title} /><div className="gallery-lightbox-caption"><div><p>{photos[activePhoto].title}</p><span>{photos[activePhoto].caption}</span></div><div className="gallery-lightbox-controls"><button type="button" onClick={previousPhoto} aria-label="Previous photo"><ArrowLeft size={20} /></button><button type="button" onClick={nextPhoto} aria-label="Next photo"><ArrowRight size={20} /></button></div></div></div></div> : null}
  </div>;
}
