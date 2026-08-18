import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { calculateProgress, formatSessionDate, toLocalDateTimeInput } from "@/lib/adminWorkflow";
import { startLogin } from "@/const";
import { COOKIE_NAME } from "@shared/const";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BotMessageSquare,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Coins,
  Download,
  ExternalLink,
  Facebook,
  FileText,
  HandHeart,
  HelpCircle,
  ImagePlus,
  Instagram,
  Key,
  LayoutDashboard,
  Linkedin,
  Loader2,
  Mail,
  MessageSquare,
  MessageSquareHeart,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Scale,
  Send,
  Settings,
  ShieldCheck,
  Target,
  Ticket,
  Trash2,
  TrendingUp,
  UploadCloud,
  Users,
  Youtube,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

type ProgramForm = { id?: number; title: string; category: string; summary: string; status: "draft" | "published"; sortOrder: number };
type UpdateForm = { id?: number; title: string; excerpt: string; body: string; status: "draft" | "published" };
type ContentForm = { contentKey: string; label: string; title: string; body: string; actionLabel: string; actionHref: string };
type SessionForm = { id?: number; title: string; focusArea: string; details: string; scheduledFor: string; venue: string; capacity: string; status: "draft" | "published" | "complete" };
type OpportunityForm = { id?: number; title: string; category: string; summary: string; commitment: string; status: "draft" | "published" | "closed"; sortOrder: number };
type ImpactForm = { id?: number; title: string; focusArea: string; description: string; currentValue: string; targetValue: string; unit: string; period: string; status: "active" | "archived" };
type TeamMemberForm = { id?: number; name: string; role: string; bio: string; imageUrl: string; email: string; linkedIn: string; sortOrder: number; isPublished: boolean };
type SocialLinksForm = { facebook: string; instagram: string; twitter: string; youtube: string; linkedin: string; tiktok: string };
type AnnouncementForm = { message: string; type: "info" | "warning" | "success"; isActive: boolean; link: string; linkLabel: string };
type DonationForm = { campaign: string; goal: string; raised: string; currency: string; description: string; isActive: boolean };
type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

type EventAdminForm = {
  id?: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  scheduledFor: string;
  location: string;
  capacity: string;
  isFree: boolean;
  priceGhs: string; // in GHS for the input
  status: "draft" | "published" | "cancelled";
};

type BlogPostAdminForm = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  authorName: string;
  coverImageUrl: string;
  category: string;
  status: "draft" | "published";
  publishedAt: string;
};

type FaqAdminForm = {
  id?: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
};

type SmsBroadcastForm = {
  message: string;
  target: "newsletter" | "events" | "all" | "custom";
  customPhones: string;
};

const blankProgram: ProgramForm = { title: "", category: "", summary: "", status: "draft", sortOrder: 0 };
const blankUpdate: UpdateForm = { title: "", excerpt: "", body: "", status: "draft" };
const blankContent: ContentForm = { contentKey: "", label: "", title: "", body: "", actionLabel: "", actionHref: "" };
const blankSession: SessionForm = { title: "", focusArea: "", details: "", scheduledFor: "", venue: "", capacity: "", status: "draft" };
const blankOpportunity: OpportunityForm = { title: "", category: "", summary: "", commitment: "", status: "draft", sortOrder: 0 };
const blankImpact: ImpactForm = { title: "", focusArea: "", description: "", currentValue: "0", targetValue: "", unit: "people", period: "This year", status: "active" };
const blankTeamMember: TeamMemberForm = { name: "", role: "", bio: "", imageUrl: "", email: "", linkedIn: "", sortOrder: 0, isPublished: true };
const blankSocialLinks: SocialLinksForm = { facebook: "", instagram: "", twitter: "", youtube: "", linkedin: "", tiktok: "" };
const blankAnnouncement: AnnouncementForm = { message: "", type: "info", isActive: false, link: "", linkLabel: "" };
const blankDonation: DonationForm = { campaign: "", goal: "0", raised: "0", currency: "GHS", description: "", isActive: true };
const blankPassword: PasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const blankEventAdmin: EventAdminForm = {
  slug: "",
  title: "",
  description: "",
  imageUrl: "",
  scheduledFor: "",
  location: "",
  capacity: "50",
  isFree: true,
  priceGhs: "0",
  status: "draft",
};

const blankBlogPostAdmin: BlogPostAdminForm = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  authorName: "YBI Editorial Team",
  coverImageUrl: "",
  category: "Mentorship",
  status: "draft",
  publishedAt: new Date().toISOString().slice(0, 10),
};

const blankFaqAdmin: FaqAdminForm = {
  question: "",
  answer: "",
  category: "General",
  sortOrder: 0,
  isPublished: true,
};

const blankSmsBroadcast: SmsBroadcastForm = {
  message: "",
  target: "all",
  customPhones: "",
};


function downloadCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return toast.error("No data to export.");
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const body = rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(",")).join("\n");
  const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function AdminAccessDenied() {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [localAdmin, setLocalAdmin] = useState<{ openId: string; role: string; name?: string } | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("manus-runtime-user-info");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.role === "admin") return parsed;
        }
      } catch {}
    }
    return null;
  });
  const utils = trpc.useUtils();

  const activeAdmin = (user && user.role === "admin") ? user : localAdmin;

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (result) => {
      if (result.token) {
        try {
          sessionStorage.setItem("manus-cookie", `${COOKIE_NAME}=${result.token}`);
          localStorage.setItem("manus-cookie", `${COOKIE_NAME}=${result.token}`);
          localStorage.setItem("manus-runtime-user-info", JSON.stringify(result.user));
          document.cookie = `${COOKIE_NAME}=${result.token}; path=/; max-age=31536000; SameSite=Lax`;
        } catch {}
      }
      setLocalAdmin(result.user);
      utils.auth.me.setData(undefined, result.user as any);
      toast.success("Welcome to YBI Admin Dashboard!");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid administrator password");
    },
  });

  if (loading && !activeAdmin) {
    return (
      <div className="admin-auth-state">
        <Loader2 className="spin" size={28} /> Loading your access…
      </div>
    );
  }

  if (!activeAdmin || activeAdmin.role !== "admin") {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-card">
          <div className="admin-auth-brand">
            <img src="/ybi-assets/brand/ybi-logo.png" alt="Young Beginners Inspiration" className="admin-auth-logo" />
            <div>
              <p className="admin-kicker">Protected Workspace</p>
              <h1>YBI Admin Sign-In</h1>
            </div>
          </div>
          <p className="admin-auth-subtitle">
            Enter the administrator security password to manage programs, updates, inquiries, gallery, and site content.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!password.trim()) return;
              loginMutation.mutate({ password });
            }}
            className="admin-auth-form"
          >
            <label htmlFor="admin-password">Administrator Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (default: ybi-admin-2026)"
              autoComplete="current-password"
              autoFocus
              required
            />

            <button
              type="submit"
              disabled={loginMutation.isPending || !password.trim()}
              className="admin-primary admin-auth-submit"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="spin" size={17} /> Unlocking Dashboard…
                </>
              ) : (
                <>
                  Sign In <ArrowUpRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="admin-auth-footer">
            <Link href="/" className="admin-secondary">
              ← Return to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminWorkspace />;
}

function AdminWorkspace() {
  const [location] = useLocation();
  const section = location.split("/")[2] || "overview";
  const views: Record<string, React.ReactNode> = {
    overview: <Overview />,
    events: <EventsManager />,
    registrations: <RegistrationsManager />,
    blog: <BlogManager />,
    donations: <DonationsManager />,
    sms: <SmsBroadcastManager />,
    faq: <FaqManager />,
    legal: <LegalPagesManager />,
    images: <SiteImagesManager />,
    gallery: <GalleryManager />,
    programs: <ProgramsManager />,
    updates: <UpdatesManager />,
    content: <ContentManager />,
    "assistant-settings": <AssistantQuickQuestionsManager />,
    sessions: <SessionsManager />,
    inquiries: <InquiriesManager />,
    opportunities: <OpportunitiesManager />,
    impact: <ImpactManager />,
    team: <TeamMembersManager />,
    newsletter: <NewsletterManager />,
    export: <ExportManager />,
    settings: <SettingsManager />,
  };
  return <DashboardLayout><div className="admin-page"><AdminPageHeader section={section} />{views[section] ?? <Overview />}</div></DashboardLayout>;
}

function AdminPageHeader({ section }: { section: string }) {
  const names: Record<string, string> = {
    overview: "YBI dashboard",
    events: "Events & Gatherings",
    registrations: "Event Registrations & RSVPs",
    blog: "Blog & News Editorial",
    donations: "Donations & Financial Pledges",
    sms: "SMS Broadcast & Messaging",
    faq: "FAQ & Help Center",
    legal: "Legal Pages (Privacy & Terms)",
    images: "Site image customizer",
    gallery: "Gallery manager",
    programs: "Program manager",
    updates: "Updates manager",
    content: "Site content",
    "assistant-settings": "Assistant quick questions",
    sessions: "Program calendar",
    inquiries: "Community inbox",
    opportunities: "Opportunity board",
    impact: "Impact tracker",
    team: "Team members",
    newsletter: "Newsletter subscribers",
    export: "Export data",
    settings: "Settings",
  };
  const descriptions: Record<string, string> = {
    overview: "A clear view of YBI's community work, content, and next actions.",
    events: "Create, schedule, edit, and publish community workshops, speech labs, and masterclasses.",
    registrations: "Track attendee registrations, payments, waitlists, and export CSV attendee lists.",
    blog: "Draft, edit, category-tag, and publish essays, field perspectives, and articles.",
    donations: "Track voluntary donations, Paystack payments, and export contribution records.",
    sms: "Broadcast SMS reminders and community announcements via Africa's Talking gateway.",
    faq: "Manage questions and answers across General, Programs, Mentorship, and Donations.",
    legal: "Update the Privacy Policy and Terms of Use documents displayed on the site.",
    images: "Edit, upload, and update pictures across every page and component of the website.",
    gallery: "Curate the moments that show YBI's work in action.",
    programs: "Shape learning pathways and keep programme information current.",
    updates: "Publish clear, timely stories from across the organisation.",
    content: "Keep essential public messages accurate and up to date.",
    "assistant-settings": "Manage the visitor assistant's suggested questions without editing site code.",
    sessions: "Plan and publish the next YBI learning experience.",
    inquiries: "Respond thoughtfully to messages from the YBI community.",
    opportunities: "Invite contributors into meaningful YBI opportunities.",
    impact: "Track progress with transparent, values-led indicators.",
    team: "Manage YBI team profiles shown on the public website.",
    newsletter: "View and manage email subscribers who signed up for YBI updates.",
    export: "Download your data as CSV files for reporting, backup, or analysis.",
    settings: "Configure social links, announcements, donation goals, and your admin password.",
  };
  const title = names[section] || "YBI dashboard";
  return <header className="admin-page-header"><div className="admin-page-heading"><p className="admin-kicker"><span aria-hidden="true" />Young Beginners Inspiration</p><h1>{title}</h1><p>{descriptions[section] || descriptions.overview}</p></div><div className="admin-page-actions"><span className="admin-header-status"><ShieldCheck size={15} /> Secure workspace</span><Link className="admin-public-link" href="/" target="_blank" rel="noreferrer">View public site <ArrowUpRight size={16} /></Link></div></header>;
}


function Overview() {
  const { data, isLoading, isError } = trpc.admin.overview.useQuery();
  const cards = [
    { label: "Site images", value: "22 slots", href: "/admin/images", icon: ImagePlus, tone: "blue", note: "Edit photos across pages" },
    { label: "Community enquiries", value: data?.inquiries ?? 0, href: "/admin/inquiries", icon: MessageSquareHeart, tone: "red", note: "Respond to community voices" },
    { label: "Scheduled sessions", value: data?.sessions ?? 0, href: "/admin/sessions", icon: CalendarDays, tone: "yellow", note: "Plan the next learning space" },
    { label: "Open opportunities", value: data?.opportunities ?? 0, href: "/admin/opportunities", icon: HandHeart, tone: "orange", note: "Invite people to contribute" },
    { label: "Impact indicators", value: data?.impactMetrics ?? 0, href: "/admin/impact", icon: Target, tone: "blue", note: "Track the difference made" },
    { label: "Gallery photos", value: data?.gallery ?? 0, href: "/admin/gallery", icon: ImagePlus, tone: "yellow", note: "Protect and share moments" },
    { label: "Programs", value: data?.programs ?? 0, href: "/admin/programs", icon: LayoutDashboard, tone: "orange", note: "Keep learning pathways clear" },
    { label: "Updates", value: data?.updates ?? 0, href: "/admin/updates", icon: FileText, tone: "red", note: "Publish the organization’s story" },
    { label: "Content blocks", value: data?.content ?? 0, href: "/admin/content", icon: Pencil, tone: "blue", note: "Maintain the public message" },
  ];
  return <div className="admin-overview">
    <div className="admin-welcome"><div><p className="admin-kicker">Your YBI control room</p><h2>Turn participation<br />into <span>lasting impact.</span></h2></div><p>Bring community messages, learning sessions, opportunities, impact measures, and public stories together in one protected space. Each tool is designed for YBI’s commitment to leadership, education, entrepreneurship, and intergenerational growth.</p></div>
    {isError ? <div className="admin-error-state">Dashboard data could not be loaded. Refresh the page and try again.</div> : <>
      <div className="admin-metric-grid admin-metric-grid-expanded">{cards.map(({ label, value, href, icon: Icon, tone, note }) => <Link href={href} className="admin-metric-card" key={label}><div className={`admin-metric-icon ${tone}`}><Icon size={21} /></div><span>{label}</span><strong>{isLoading ? "—" : value}</strong><small>{note} <ArrowUpRight size={13} /></small></Link>)}</div>
      <section className="admin-action-strip"><div><CheckCircle2 size={24} /><div><h3>Values-led operating rhythm</h3><p>Capture enquiries with care, make learning spaces practical, invite contribution, and report real progress without inventing data.</p></div></div><div className="admin-quick-links"><Link href="/admin/images">Manage site images</Link><Link href="/admin/inquiries">Review inbox</Link><Link href="/admin/sessions">Schedule a session</Link><Link href="/admin/impact">Update impact</Link></div></section>
    </>}</div>;
}

function SiteImagesManager() {
  const utils = trpc.useUtils();
  const { data: slots, isLoading, isError } = trpc.admin.siteImages.list.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const saveMutation = trpc.admin.siteImages.save.useMutation({
    onSuccess: () => {
      utils.admin.siteImages.list.invalidate();
      utils.publicSite.siteImages.getAll.invalidate();
      toast.success("Site image successfully updated!");
    },
    onError: (err) => toast.error(err.message || "Failed to save image"),
  });

  const uploadMutation = trpc.admin.siteImages.upload.useMutation({
    onSuccess: () => {
      utils.admin.siteImages.list.invalidate();
      utils.publicSite.siteImages.getAll.invalidate();
      toast.success("New image uploaded and published to website!");
    },
    onError: (err) => toast.error(err.message || "Failed to upload image"),
  });

  const resetMutation = trpc.admin.siteImages.reset.useMutation({
    onSuccess: () => {
      utils.admin.siteImages.list.invalidate();
      utils.publicSite.siteImages.getAll.invalidate();
      toast.success("Reset to default image asset.");
    },
    onError: (err) => toast.error(err.message || "Failed to reset image"),
  });

  const categories = useMemo(() => {
    if (!slots) return ["All"];
    const cats = Array.from(new Set(slots.map((s) => s.category)));
    return ["All", ...cats];
  }, [slots]);

  const filteredSlots = useMemo(() => {
    if (!slots) return [];
    return slots.filter((slot) => {
      const matchCat = selectedCategory === "All" || slot.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        slot.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slot.key.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [slots, selectedCategory, searchQuery]);

  if (isLoading) return <LoadingCopy text="Loading site image slots…" />;
  if (isError) return <ErrorCopy text="Failed to load site image slots. Please refresh." />;

  return (
    <div className="admin-site-images-container">
      <div className="admin-site-images-header">
        <div className="admin-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`admin-category-pill ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search image slots..."
          className="admin-search-input"
        />
      </div>

      <div className="admin-site-images-grid">
        {filteredSlots.map((slot) => (
          <SiteImageSlotCard
            key={slot.key}
            slot={slot}
            onSave={(imageUrl, altText) => saveMutation.mutate({ slotKey: slot.key, imageUrl, altText })}
            onUpload={async (file, altText) => {
              const base64 = await fileToBase64(file);
              uploadMutation.mutate({
                slotKey: slot.key,
                fileName: file.name,
                mimeType: file.type as any,
                base64,
                altText,
              });
            }}
            onReset={() => resetMutation.mutate({ slotKey: slot.key })}
            isSaving={saveMutation.isPending || uploadMutation.isPending || resetMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}

function SiteImageSlotCard({
  slot,
  onSave,
  onUpload,
  onReset,
  isSaving,
}: {
  slot: any;
  onSave: (imageUrl: string, altText: string) => void;
  onUpload: (file: File, altText: string) => void;
  onReset: () => void;
  isSaving: boolean;
}) {
  const currentSrc = slot.customSrc || slot.defaultSrc;
  const currentAlt = slot.customAlt || slot.defaultAlt;
  const [urlInput, setUrlInput] = useState(slot.customSrc || "");
  const [altInput, setAltInput] = useState(slot.customAlt || slot.defaultAlt || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setUrlInput(slot.customSrc || "");
    setAltInput(slot.customAlt || slot.defaultAlt || "");
  }, [slot.customSrc, slot.customAlt, slot.defaultAlt]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/[jpeg|jpg|png|webp|svg]/.test(file.type)) {
      toast.error("Please upload a JPG, PNG, WEBP, or SVG image.");
      return;
    }
    setUploading(true);
    try {
      await onUpload(file, altInput);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <article className="admin-image-slot-card">
      <div className="admin-image-preview-box">
        <img
          src={currentSrc}
          alt={currentAlt}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = slot.defaultSrc;
          }}
        />
        <div className="admin-image-badge-group">
          <span className="admin-slot-aspect">{slot.aspectRatio}</span>
          <span className={`admin-slot-status-pill ${slot.isCustomized ? "custom" : "default"}`}>
            {slot.isCustomized ? "Customized" : "Default"}
          </span>
        </div>
      </div>

      <div className="admin-image-card-body">
        <h3>{slot.label}</h3>
        <p>{slot.description}</p>

        <form
          className="admin-image-edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!urlInput.trim()) return;
            onSave(urlInput.trim(), altInput.trim());
          }}
        >
          <label>
            Image URL / File Upload
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste direct image URL or upload below..."
            />
          </label>

          <label>
            Alt Text (for accessibility & SEO)
            <input
              type="text"
              value={altInput}
              onChange={(e) => setAltInput(e.target.value)}
              placeholder="Describe this image..."
            />
          </label>

          <div className="admin-image-button-row">
            <label className="admin-upload-btn">
              <UploadCloud size={15} />
              {uploading ? "Uploading…" : "Upload File"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                disabled={isSaving || uploading}
                style={{ display: "none" }}
              />
            </label>

            <button
              type="submit"
              disabled={isSaving || uploading || !urlInput.trim()}
              className="admin-primary"
            >
              <Save size={15} /> Save URL
            </button>

            {slot.isCustomized && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Reset "${slot.label}" back to the default image?`)) {
                    onReset();
                  }
                }}
                disabled={isSaving || uploading}
                className="admin-secondary"
                style={{ color: "#a83d38", borderColor: "#f1c9c6" }}
              >
                Reset Default
              </button>
            )}
          </div>
        </form>
      </div>
    </article>
  );
}

function GalleryManager() {
  const utils = trpc.useUtils();
  const { data: photos, isLoading, isError } = trpc.admin.gallery.list.useQuery();
  const upload = trpc.admin.gallery.upload.useMutation({ onSuccess: () => { utils.admin.gallery.list.invalidate(); utils.admin.overview.invalidate(); utils.publicSite.gallery.invalidate(); toast.success("Photo uploaded and saved to the shared gallery."); }, onError: (error) => toast.error("Photo upload failed.", { description: error.message }) });
  const save = trpc.admin.gallery.save.useMutation({ onSuccess: () => { utils.admin.gallery.list.invalidate(); utils.publicSite.gallery.invalidate(); toast.success("Gallery photo updated."); }, onError: (error) => toast.error("Gallery photo could not be updated.", { description: error.message }) });
  const remove = trpc.admin.gallery.remove.useMutation({ onSuccess: () => { utils.admin.gallery.list.invalidate(); utils.admin.overview.invalidate(); utils.publicSite.gallery.invalidate(); toast.success("Gallery photo removed from the site."); }, onError: (error) => toast.error("Gallery photo could not be removed.", { description: error.message }) });
  const [file, setFile] = useState<File | null>(null); const [title, setTitle] = useState(""); const [altText, setAltText] = useState(""); const [isPublished, setIsPublished] = useState(true);
  const uploadPhoto = async (event: React.FormEvent) => { event.preventDefault(); if (!file) return toast.error("Choose a JPG, PNG, or WEBP photo first."); if (!/[jpeg|png|webp]/.test(file.type)) return toast.error("Use a JPG, PNG, or WEBP photo."); try { const base64 = await fileToBase64(file); upload.mutate({ title: title || file.name.replace(/\.[^/.]+$/, ""), altText: altText || "Young Beginners Inspiration community moment", fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", base64, isPublished, sortOrder: (photos?.length ?? 0) + 1 }); setFile(null); setTitle(""); setAltText(""); } catch { toast.error("The image could not be read. Please try again."); } };
  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="Persistent storage" title="Upload a gallery moment" icon={<UploadCloud size={25} />} /><form className="admin-form" onSubmit={uploadPhoto}><label>Photo file<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /></label><label>Photo title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Community workshop" /></label><label>Accessible description<input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Participants sharing ideas at a YBI workshop" /></label><label className="admin-check"><input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} /> Publish this photo immediately</label><button disabled={upload.isPending} className="admin-primary" type="submit">{upload.isPending ? "Uploading…" : "Upload to shared gallery"} <UploadCloud size={17} /></button></form><p className="admin-help">JPG, PNG, or WEBP only. Photos can be published or hidden later.</p></section><section className="admin-panel admin-list-panel"><PanelHeading eyebrow="Current collection" title="Manage photos" count={photos?.length ?? 0} />{isLoading ? <LoadingCopy text="Loading gallery…" /> : isError ? <ErrorCopy text="Gallery data could not be loaded. Refresh and try again." /> : !photos?.length ? <EmptyCopy text="No shared photos yet. Upload the first one from this screen." /> : <div className="admin-photo-list">{photos.map((photo) => <article className="admin-photo-row" key={photo.id}><img src={photo.imageUrl} alt={photo.altText} /><div><h3>{photo.title}</h3><p>{photo.altText}</p><span className={photo.isPublished ? "admin-status published" : "admin-status draft"}>{photo.isPublished ? "Published" : "Hidden"}</span></div><div className="admin-row-actions"><button onClick={() => save.mutate({ id: photo.id, title: photo.title, altText: photo.altText, isPublished: !photo.isPublished, sortOrder: photo.sortOrder })}>{photo.isPublished ? "Hide" : "Publish"}</button><button className="danger" onClick={() => { if (window.confirm(`Remove “${photo.title}” from the gallery?`)) remove.mutate({ id: photo.id }); }}><Trash2 size={15} /></button></div></article>)}</div>}</section></div>;
}

function AssistantQuickQuestionsManager() {
  const utils = trpc.useUtils();
  const { data: savedQuestions, isLoading, isError } = trpc.admin.assistantSettings.get.useQuery();
  const [questions, setQuestions] = useState<string[]>([]);
  const save = trpc.admin.assistantSettings.save.useMutation({
    onSuccess: () => {
      utils.admin.assistantSettings.get.invalidate();
      utils.publicSite.assistant.quickQuestions.invalidate();
      toast.success("Visitor assistant quick questions updated.");
    },
    onError: (error) => toast.error("Quick questions could not be saved.", { description: error.message }),
  });

  useEffect(() => {
    if (savedQuestions) setQuestions(savedQuestions);
  }, [savedQuestions]);

  const updateQuestion = (index: number, value: string) => setQuestions((current) => current.map((question, questionIndex) => questionIndex === index ? value : question));
  const moveQuestion = (index: number, direction: -1 | 1) => setQuestions((current) => {
    const destination = index + direction;
    if (destination < 0 || destination >= current.length) return current;
    const next = [...current];
    [next[index], next[destination]] = [next[destination], next[index]];
    return next;
  });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = questions.map((question) => question.trim()).filter(Boolean);
    if (cleaned.length < 2 || cleaned.length > 6) return toast.error("Use between 2 and 6 clear quick questions.");
    if (new Set(cleaned.map((question) => question.toLowerCase())).size !== cleaned.length) return toast.error("Each quick question should be unique.");
    save.mutate({ questions: cleaned });
  };

  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="Visitor assistant" title="Edit quick questions" icon={<BotMessageSquare size={25} />} /><form className="admin-form" onSubmit={submit}><p className="admin-help">Visitors see these questions when they open the YBI assistant. Keep each one practical, clear, and focused on a single need.</p>{isLoading ? <LoadingCopy text="Loading assistant questions…" /> : isError ? <ErrorCopy text="Assistant questions could not be loaded. Refresh and try again." /> : <div className="admin-assistant-question-fields">{questions.map((question, index) => <div className="admin-assistant-question" key={`${index}-${question}`}><span aria-hidden="true">{index + 1}</span><input aria-label={`Quick question ${index + 1}`} value={question} maxLength={160} onChange={(event) => updateQuestion(index, event.target.value)} placeholder="For example: Which program should I explore?" /><div className="admin-assistant-question-actions"><button type="button" aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => moveQuestion(index, -1)}><ArrowUp size={15} /></button><button type="button" aria-label={`Move question ${index + 1} down`} disabled={index === questions.length - 1} onClick={() => moveQuestion(index, 1)}><ArrowDown size={15} /></button><button type="button" className="danger" aria-label={`Remove question ${index + 1}`} disabled={questions.length <= 2} onClick={() => setQuestions((current) => current.filter((_, questionIndex) => questionIndex !== index))}><Trash2 size={15} /></button></div></div>)}</div>}<button type="button" className="admin-secondary" disabled={questions.length >= 6} onClick={() => setQuestions((current) => [...current, ""])}><Plus size={16} /> Add question</button><SaveButton pending={save.isPending} label="Save quick questions" /></form></section><section className="admin-panel admin-list-panel"><PanelHeading eyebrow="Public experience" title="What visitors will see" count={questions.filter((question) => question.trim()).length} /><div className="admin-assistant-preview"><BotMessageSquare size={23} /><h3>Suggested questions</h3><p>The order below is the exact order used in the public YBI assistant.</p><ol>{questions.filter((question) => question.trim()).map((question) => <li key={question}>{question}</li>)}</ol></div></section></div>;
}

function ProgramsManager() {
  const utils = trpc.useUtils(); const { data: programs, isLoading, isError } = trpc.admin.programs.list.useQuery(); const save = trpc.admin.programs.save.useMutation({ onSuccess: () => { utils.admin.programs.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Program saved."); }, onError: (error) => toast.error("Program could not be saved.", { description: error.message }) }); const remove = trpc.admin.programs.remove.useMutation({ onSuccess: () => { utils.admin.programs.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Program removed."); }, onError: (error) => toast.error("Program could not be removed.", { description: error.message }) }); const [form, setForm] = useState<ProgramForm>(blankProgram); const update = <K extends keyof ProgramForm>(key: K, value: ProgramForm[K]) => setForm(current => ({ ...current, [key]: value }));
  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="Programs" title={form.id ? "Edit program" : "Add a program"} icon={<Plus size={24} />} /><form className="admin-form" onSubmit={(event) => { event.preventDefault(); save.mutate(form, { onSuccess: () => setForm(blankProgram) }); }}><label>Program title<input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Public Speaking" /></label><label>Category<input required value={form.category} onChange={(event) => update("category", event.target.value)} placeholder="Leadership development" /></label><label>Summary<textarea required value={form.summary} onChange={(event) => update("summary", event.target.value)} placeholder="Describe the practical benefit and audience." /></label><div className="admin-form-split"><label>Status<select value={form.status} onChange={(event) => update("status", event.target.value as ProgramForm["status"])}><option value="draft">Draft</option><option value="published">Published</option></select></label><label>Order<input type="number" min="0" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /></label></div><SaveButton pending={save.isPending} label={form.id ? "Save program" : "Create program"} />{form.id ? <CancelEdit onClick={() => setForm(blankProgram)} /> : null}</form></section>{isError ? <section className="admin-panel"><ErrorCopy text="Programs could not be loaded. Refresh and try again." /></section> : <RecordsList title="Programs" items={programs ?? []} loading={isLoading} onEdit={(program) => setForm({ id: program.id, title: program.title, category: program.category, summary: program.summary, status: program.status, sortOrder: program.sortOrder })} onRemove={(id, title) => { if (window.confirm(`Remove “${title}”?`)) remove.mutate({ id }); }} />}</div>;
}

function UpdatesManager() {
  const utils = trpc.useUtils(); const { data: updates, isLoading, isError } = trpc.admin.updates.list.useQuery(); const save = trpc.admin.updates.save.useMutation({ onSuccess: () => { utils.admin.updates.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Update saved."); }, onError: (error) => toast.error("Update could not be saved.", { description: error.message }) }); const remove = trpc.admin.updates.remove.useMutation({ onSuccess: () => { utils.admin.updates.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Update removed."); }, onError: (error) => toast.error("Update could not be removed.", { description: error.message }) }); const [form, setForm] = useState<UpdateForm>(blankUpdate); const update = <K extends keyof UpdateForm>(key: K, value: UpdateForm[K]) => setForm(current => ({ ...current, [key]: value }));
  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="News & notes" title={form.id ? "Edit update" : "Create an update"} icon={<FileText size={24} />} /><form className="admin-form" onSubmit={(event) => { event.preventDefault(); save.mutate(form, { onSuccess: () => setForm(blankUpdate) }); }}><label>Headline<input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Start with the room you are in" /></label><label>Short introduction<textarea required value={form.excerpt} onChange={(event) => update("excerpt", event.target.value)} placeholder="A summary for update listings." /></label><label>Full text<textarea className="admin-tall-textarea" required value={form.body} onChange={(event) => update("body", event.target.value)} placeholder="Write the full update here." /></label><label>Status<select value={form.status} onChange={(event) => update("status", event.target.value as UpdateForm["status"])}><option value="draft">Draft</option><option value="published">Published</option></select></label><SaveButton pending={save.isPending} label={form.id ? "Save update" : "Create update"} />{form.id ? <CancelEdit onClick={() => setForm(blankUpdate)} /> : null}</form></section>{isError ? <section className="admin-panel"><ErrorCopy text="Updates could not be loaded. Refresh and try again." /></section> : <RecordsList title="Updates" items={updates ?? []} loading={isLoading} onEdit={(item) => setForm({ id: item.id, title: item.title, excerpt: item.excerpt, body: item.body, status: item.status })} onRemove={(id, title) => { if (window.confirm(`Remove “${title}”?`)) remove.mutate({ id }); }} />}</div>;
}

function ContentManager() {
  const utils = trpc.useUtils(); const { data: blocks, isLoading, isError } = trpc.admin.content.list.useQuery(); const save = trpc.admin.content.save.useMutation({ onSuccess: () => { utils.admin.content.list.invalidate(); utils.publicSite.content.invalidate(); toast.success("Site content saved."); }, onError: (error) => toast.error("Site content could not be saved.", { description: error.message }) }); const [form, setForm] = useState<ContentForm>(blankContent); const update = <K extends keyof ContentForm>(key: K, value: ContentForm[K]) => setForm(current => ({ ...current, [key]: value }));
  const preparedBlocks = useMemo(() => [{ contentKey: "homepage-hero", label: "Homepage hero", title: "Inspiring Voices,\nBuilding Leaders,\nShaping Futures.", body: "We create a platform where the young and the aged inspire one another, build practical capability, and use their gifts to make a positive difference in the world.", actionLabel: "Support us", actionHref: "/join-us" }, ...(blocks ?? [])], [blocks]);
  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="Public website" title={form.contentKey ? "Edit content block" : "Add content block"} icon={<Pencil size={24} />} /><form className="admin-form" onSubmit={(event) => { event.preventDefault(); save.mutate({ ...form, actionLabel: form.actionLabel || null, actionHref: form.actionHref || null }); }}><label>Content key<input required value={form.contentKey} onChange={(event) => update("contentKey", event.target.value)} placeholder="homepage-hero" /></label><label>Admin label<input required value={form.label} onChange={(event) => update("label", event.target.value)} placeholder="Homepage hero" /></label><label>Heading<textarea required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Use line breaks if needed." /></label><label>Body<textarea className="admin-tall-textarea" required value={form.body} onChange={(event) => update("body", event.target.value)} placeholder="Write the public-facing copy." /></label><div className="admin-form-split"><label>Button label<input value={form.actionLabel} onChange={(event) => update("actionLabel", event.target.value)} placeholder="Support us" /></label><label>Button destination<input value={form.actionHref} onChange={(event) => update("actionHref", event.target.value)} placeholder="/join-us" /></label></div><SaveButton pending={save.isPending} label="Save content" /></form></section><section className="admin-panel admin-list-panel"><PanelHeading eyebrow="Available blocks" title="Site content" count={blocks?.length ?? 0} />{isLoading ? <LoadingCopy text="Loading content…" /> : isError ? <ErrorCopy text="Site content could not be loaded. Refresh and try again." /> : <div className="admin-record-list">{preparedBlocks.map((block) => <article className="admin-record-row" key={block.contentKey}><div><span className="admin-status published">{block.contentKey}</span><h3>{block.label}</h3><p>{block.body}</p></div><div className="admin-row-actions"><button onClick={() => setForm({ contentKey: block.contentKey, label: block.label, title: block.title, body: block.body, actionLabel: block.actionLabel ?? "", actionHref: block.actionHref ?? "" })}><Pencil size={15} /> Edit</button></div></article>)}</div>}</section></div>;
}

function InquiriesManager() {
  const utils = trpc.useUtils(); const { data: inquiries, isLoading, isError } = trpc.admin.inquiries.list.useQuery(); const save = trpc.admin.inquiries.save.useMutation({ onSuccess: () => { utils.admin.inquiries.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Community enquiry updated."); }, onError: (error) => toast.error("Enquiry could not be updated.", { description: error.message }) }); const remove = trpc.admin.inquiries.remove.useMutation({ onSuccess: () => { utils.admin.inquiries.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Enquiry removed."); }, onError: (error) => toast.error("Enquiry could not be removed.", { description: error.message }) }); const [activeId, setActiveId] = useState<number | null>(null); const active = inquiries?.find(item => item.id === activeId) ?? inquiries?.[0];
  return <div className="admin-inbox-layout"><section className="admin-panel admin-list-panel"><PanelHeading eyebrow="Community care" title="Inbox" count={inquiries?.length ?? 0} />{isLoading ? <LoadingCopy text="Loading enquiries…" /> : isError ? <ErrorCopy text="Community enquiries could not be loaded. Refresh and try again." /> : !inquiries?.length ? <EmptyCopy text="New Contact Us messages will appear here for your team to respond to." /> : <div className="admin-inbox-list">{inquiries.map(item => <button className={`admin-inquiry-preview ${active?.id === item.id ? "active" : ""}`} onClick={() => setActiveId(item.id)} key={item.id}><span className={`admin-status ${item.status}`}>{item.status.replace("_", " ")}</span><strong>{item.name}</strong><small>{item.interest}</small><p>{item.message}</p></button>)}</div>}</section>{active ? <section className="admin-panel admin-inquiry-detail"><PanelHeading eyebrow="Selected enquiry" title={active.name} icon={<MessageSquareHeart size={24} />} /><div className="admin-detail-meta"><a href={`mailto:${active.email}`}>{active.email}</a><span>{active.interest}</span><span>{new Date(active.createdAt).toLocaleDateString()}</span></div><blockquote>{active.message}</blockquote><label className="admin-field-label">Response status<select value={active.status} onChange={(event) => save.mutate({ id: active.id, status: event.target.value as "new" | "in_progress" | "responded" | "closed", adminNotes: active.adminNotes })}><option value="new">New</option><option value="in_progress">In progress</option><option value="responded">Responded</option><option value="closed">Closed</option></select></label><label className="admin-field-label">Private staff notes<textarea value={active.adminNotes ?? ""} onChange={(event) => { const adminNotes = event.target.value; utils.admin.inquiries.list.setData(undefined, current => current?.map(item => item.id === active.id ? { ...item, adminNotes } : item)); }} onBlur={(event) => save.mutate({ id: active.id, status: active.status, adminNotes: event.target.value || null })} placeholder="Capture a follow-up, referral, or response summary for the YBI team." /></label><div className="admin-row-actions"><a href={`mailto:${active.email}`}>Reply by email <ArrowUpRight size={15} /></a><button className="danger" onClick={() => { if (window.confirm(`Remove the enquiry from ${active.name}?`)) { remove.mutate({ id: active.id }); setActiveId(null); } }}><Trash2 size={15} /> Delete</button></div></section> : <section className="admin-panel"><EmptyCopy text="Select an enquiry to view its details and follow up." /></section>}</div>;
}

function SessionsManager() {
  const utils = trpc.useUtils(); const { data: sessions, isLoading, isError } = trpc.admin.sessions.list.useQuery(); const save = trpc.admin.sessions.save.useMutation({ onSuccess: () => { utils.admin.sessions.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Program session saved."); }, onError: (error) => toast.error("Session could not be saved.", { description: error.message }) }); const remove = trpc.admin.sessions.remove.useMutation({ onSuccess: () => { utils.admin.sessions.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Program session removed."); }, onError: (error) => toast.error("Program session could not be removed.", { description: error.message }) }); const [form, setForm] = useState<SessionForm>(blankSession); const update = <K extends keyof SessionForm>(key: K, value: SessionForm[K]) => setForm(current => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); save.mutate({ id: form.id, title: form.title, focusArea: form.focusArea, details: form.details, scheduledFor: new Date(form.scheduledFor).toISOString(), venue: form.venue, capacity: form.capacity ? Number(form.capacity) : null, status: form.status }, { onSuccess: () => setForm(blankSession) }); };
  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="Practical learning" title={form.id ? "Edit program session" : "Schedule a session"} icon={<CalendarDays size={24} />} /><form className="admin-form" onSubmit={submit}><label>Session title<input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Leading with purpose" /></label><label>Focus area<input required value={form.focusArea} onChange={(event) => update("focusArea", event.target.value)} placeholder="Leadership" /></label><label>Session details<textarea required value={form.details} onChange={(event) => update("details", event.target.value)} placeholder="Describe the participants, outcomes, and practical activity." /></label><div className="admin-form-split"><label>Date and time<input required type="datetime-local" value={form.scheduledFor} onChange={(event) => update("scheduledFor", event.target.value)} /></label><label>Capacity<input type="number" min="1" value={form.capacity} onChange={(event) => update("capacity", event.target.value)} placeholder="Optional" /></label></div><label>Venue or online link<input required value={form.venue} onChange={(event) => update("venue", event.target.value)} placeholder="YBI community room" /></label><label>Status<select value={form.status} onChange={(event) => update("status", event.target.value as SessionForm["status"])}><option value="draft">Draft</option><option value="published">Published</option><option value="complete">Complete</option></select></label><SaveButton pending={save.isPending} label={form.id ? "Save session" : "Schedule session"} />{form.id ? <CancelEdit onClick={() => setForm(blankSession)} /> : null}</form></section><section className="admin-panel admin-list-panel"><PanelHeading eyebrow="Program rhythm" title="Upcoming and past sessions" count={sessions?.length ?? 0} />{isLoading ? <LoadingCopy text="Loading sessions…" /> : isError ? <ErrorCopy text="Program sessions could not be loaded. Refresh and try again." /> : !sessions?.length ? <EmptyCopy text="Schedule the first YBI learning space from this screen." /> : <div className="admin-session-list">{sessions.map(item => <article className="admin-session-row" key={item.id}><div className="admin-session-date"><strong>{new Date(item.scheduledFor).getDate()}</strong><span>{new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(item.scheduledFor))}</span></div><div><span className={`admin-status ${item.status}`}>{item.status}</span><h3>{item.title}</h3><p>{item.focusArea} · {formatSessionDate(item.scheduledFor)}</p><small>{item.venue}{item.capacity ? ` · capacity ${item.capacity}` : ""}</small></div><div className="admin-row-actions"><button onClick={() => setForm({ id: item.id, title: item.title, focusArea: item.focusArea, details: item.details, scheduledFor: toLocalDateTimeInput(item.scheduledFor), venue: item.venue, capacity: item.capacity?.toString() ?? "", status: item.status })}><Pencil size={15} /> Edit</button><button className="danger" onClick={() => { if (window.confirm(`Remove “${item.title}”?`)) remove.mutate({ id: item.id }); }}><Trash2 size={15} /></button></div></article>)}</div>}</section></div>;
}

function OpportunitiesManager() {
  const utils = trpc.useUtils(); const { data: opportunities, isLoading, isError } = trpc.admin.opportunities.list.useQuery(); const save = trpc.admin.opportunities.save.useMutation({ onSuccess: () => { utils.admin.opportunities.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Opportunity saved."); }, onError: (error) => toast.error("Opportunity could not be saved.", { description: error.message }) }); const remove = trpc.admin.opportunities.remove.useMutation({ onSuccess: () => { utils.admin.opportunities.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Opportunity removed."); }, onError: (error) => toast.error("Opportunity could not be removed.", { description: error.message }) }); const [form, setForm] = useState<OpportunityForm>(blankOpportunity); const update = <K extends keyof OpportunityForm>(key: K, value: OpportunityForm[K]) => setForm(current => ({ ...current, [key]: value }));
  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="Ways to contribute" title={form.id ? "Edit opportunity" : "Create opportunity"} icon={<HandHeart size={24} />} /><form className="admin-form" onSubmit={(event) => { event.preventDefault(); save.mutate(form, { onSuccess: () => setForm(blankOpportunity) }); }}><label>Opportunity title<input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Mentor emerging leaders" /></label><div className="admin-form-split"><label>Category<input required value={form.category} onChange={(event) => update("category", event.target.value)} placeholder="Mentoring" /></label><label>Commitment<input required value={form.commitment} onChange={(event) => update("commitment", event.target.value)} placeholder="Two hours monthly" /></label></div><label>Description<textarea required value={form.summary} onChange={(event) => update("summary", event.target.value)} placeholder="Explain the contribution, who benefits, and the first step." /></label><div className="admin-form-split"><label>Status<select value={form.status} onChange={(event) => update("status", event.target.value as OpportunityForm["status"])}><option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option></select></label><label>Order<input type="number" min="0" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /></label></div><SaveButton pending={save.isPending} label={form.id ? "Save opportunity" : "Create opportunity"} />{form.id ? <CancelEdit onClick={() => setForm(blankOpportunity)} /> : null}</form></section>{isError ? <section className="admin-panel"><ErrorCopy text="Opportunities could not be loaded. Refresh and try again." /></section> : <RecordsList title="Current opportunities" items={opportunities ?? []} loading={isLoading} onEdit={(item) => setForm({ id: item.id, title: item.title, category: item.category, summary: item.summary, commitment: item.commitment, status: item.status, sortOrder: item.sortOrder })} onRemove={(id, title) => { if (window.confirm(`Remove “${title}”?`)) remove.mutate({ id }); }} />}</div>;
}

function ImpactManager() {
  const utils = trpc.useUtils(); const { data: metrics, isLoading, isError } = trpc.admin.impact.list.useQuery(); const save = trpc.admin.impact.save.useMutation({ onSuccess: () => { utils.admin.impact.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Impact indicator saved."); }, onError: (error) => toast.error("Impact indicator could not be saved.", { description: error.message }) }); const remove = trpc.admin.impact.remove.useMutation({ onSuccess: () => { utils.admin.impact.list.invalidate(); utils.admin.overview.invalidate(); toast.success("Impact indicator removed."); }, onError: (error) => toast.error("Impact indicator could not be removed.", { description: error.message }) }); const [form, setForm] = useState<ImpactForm>(blankImpact); const update = <K extends keyof ImpactForm>(key: K, value: ImpactForm[K]) => setForm(current => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); save.mutate({ id: form.id, title: form.title, focusArea: form.focusArea, description: form.description, currentValue: Number(form.currentValue), targetValue: form.targetValue ? Number(form.targetValue) : null, unit: form.unit, period: form.period, status: form.status }, { onSuccess: () => setForm(blankImpact) }); };
  return <div className="admin-manager-grid"><section className="admin-panel"><PanelHeading eyebrow="Evidence of change" title={form.id ? "Edit impact indicator" : "Create impact indicator"} icon={<Target size={24} />} /><form className="admin-form" onSubmit={submit}><label>Indicator title<input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="People completing leadership sessions" /></label><label>Focus area<input required value={form.focusArea} onChange={(event) => update("focusArea", event.target.value)} placeholder="Leadership" /></label><label>Why this matters<textarea required value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe what this measure tells YBI about its progress." /></label><div className="admin-form-split"><label>Current value<input required type="number" min="0" value={form.currentValue} onChange={(event) => update("currentValue", event.target.value)} /></label><label>Target value<input type="number" min="0" value={form.targetValue} onChange={(event) => update("targetValue", event.target.value)} placeholder="Optional" /></label></div><div className="admin-form-split"><label>Unit<input required value={form.unit} onChange={(event) => update("unit", event.target.value)} placeholder="people" /></label><label>Reporting period<input required value={form.period} onChange={(event) => update("period", event.target.value)} placeholder="This year" /></label></div><label>Status<select value={form.status} onChange={(event) => update("status", event.target.value as ImpactForm["status"])}><option value="active">Active</option><option value="archived">Archived</option></select></label><SaveButton pending={save.isPending} label={form.id ? "Save indicator" : "Create indicator"} />{form.id ? <CancelEdit onClick={() => setForm(blankImpact)} /> : null}</form></section><section className="admin-panel admin-list-panel"><PanelHeading eyebrow="Real progress" title="Impact indicators" count={metrics?.length ?? 0} />{isLoading ? <LoadingCopy text="Loading indicators…" /> : isError ? <ErrorCopy text="Impact indicators could not be loaded. Refresh and try again." /> : !metrics?.length ? <EmptyCopy text="Add an indicator when YBI is ready to track a real result. No placeholder figures are used." /> : <div className="admin-impact-list">{metrics.map(item => { const progress = calculateProgress(item.currentValue, item.targetValue); return <article className="admin-impact-row" key={item.id}><div><span className={`admin-status ${item.status}`}>{item.status}</span><h3>{item.title}</h3><p>{item.description}</p><small>{item.focusArea} · {item.period}</small></div><div className="admin-impact-number"><strong>{item.currentValue.toLocaleString()}<small> {item.unit}</small></strong>{item.targetValue ? <span>of {item.targetValue.toLocaleString()}</span> : <span>No target set</span>}{progress !== null ? <div className="admin-progress"><span style={{ width: `${progress}%` }} /><small>{progress}%</small></div> : null}</div><div className="admin-row-actions"><button onClick={() => setForm({ id: item.id, title: item.title, focusArea: item.focusArea, description: item.description, currentValue: item.currentValue.toString(), targetValue: item.targetValue?.toString() ?? "", unit: item.unit, period: item.period, status: item.status })}><Pencil size={15} /> Edit</button><button className="danger" onClick={() => { if (window.confirm(`Remove “${item.title}”?`)) remove.mutate({ id: item.id }); }}><Trash2 size={15} /></button></div></article>; })}</div>}</section></div>;
}

function PanelHeading({ eyebrow, title, icon, count }: { eyebrow: string; title: string; icon?: React.ReactNode; count?: number }) { return <div className="admin-panel-heading"><div><p className="admin-kicker">{eyebrow}</p><h2>{title}</h2></div>{icon ?? (count !== undefined ? <span className="admin-count">{count}</span> : null)}</div>; }
function SaveButton({ pending, label }: { pending: boolean; label: string }) { return <button disabled={pending} className="admin-primary" type="submit"><Save size={17} /> {pending ? "Saving…" : label}</button>; }
function CancelEdit({ onClick }: { onClick: () => void }) { return <button type="button" className="admin-text-button" onClick={onClick}>Cancel editing</button>; }
function LoadingCopy({ text }: { text: string }) { return <div className="admin-empty"><Loader2 className="spin" /> {text}</div>; }
function EmptyCopy({ text }: { text: string }) { return <div className="admin-empty">{text}</div>; }
function ErrorCopy({ text }: { text: string }) { return <div className="admin-error-state">{text}</div>; }

function RecordsList({ title, items, loading, onEdit, onRemove }: { title: string; items: Array<{ id: number; title: string; summary?: string; excerpt?: string; status: string }>; loading: boolean; onEdit: (item: any) => void; onRemove: (id: number, title: string) => void; }) {
  return <section className="admin-panel admin-list-panel"><PanelHeading eyebrow="Saved records" title={title} count={items.length} />{loading ? <LoadingCopy text="Loading…" /> : !items.length ? <EmptyCopy text="Nothing has been created yet." /> : <div className="admin-record-list">{items.map((item) => <article className="admin-record-row" key={item.id}><div><span className={`admin-status ${item.status}`}>{item.status}</span><h3>{item.title}</h3><p>{item.summary ?? item.excerpt}</p></div><div className="admin-row-actions"><button onClick={() => onEdit(item)}><Pencil size={15} /> Edit</button><button className="danger" onClick={() => onRemove(item.id, item.title)}><Trash2 size={15} /></button></div></article>)}</div>}</section>;
}

// ─── Team Members Manager ──────────────────────────────────────────────────

function TeamMembersManager() {
  const utils = trpc.useUtils();
  const { data: members, isLoading, isError } = trpc.admin.team.list.useQuery();
  const save = trpc.admin.team.save.useMutation({
    onSuccess: () => { utils.admin.team.list.invalidate(); toast.success("Team member saved."); },
    onError: (err) => toast.error("Team member could not be saved.", { description: err.message }),
  });
  const remove = trpc.admin.team.remove.useMutation({
    onSuccess: () => { utils.admin.team.list.invalidate(); toast.success("Team member removed."); },
    onError: (err) => toast.error("Team member could not be removed.", { description: err.message }),
  });
  const [form, setForm] = useState<TeamMemberForm>(blankTeamMember);
  const upd = <K extends keyof TeamMemberForm>(key: K, value: TeamMemberForm[K]) => setForm(c => ({ ...c, [key]: value }));

  return (
    <div className="admin-manager-grid">
      <section className="admin-panel">
        <PanelHeading eyebrow="Leadership &amp; Team" title={form.id ? "Edit team member" : "Add team member"} icon={<Users size={24} />} />
        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save.mutate(form as any, { onSuccess: () => setForm(blankTeamMember) }); }}>
          <label>Full name<input required value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="Dr. Abena Mensah" /></label>
          <label>Role / Title<input required value={form.role} onChange={(e) => upd("role", e.target.value)} placeholder="Executive Director" /></label>
          <label>Short bio<textarea required value={form.bio} onChange={(e) => upd("bio", e.target.value)} placeholder="Describe their background and contribution to YBI." /></label>
          <label>Photo URL<input value={form.imageUrl} onChange={(e) => upd("imageUrl", e.target.value)} placeholder="/ybi-assets/team/photo.jpg" /></label>
          <div className="admin-form-split">
            <label>Email (optional)<input type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} placeholder="member@ybi.org" /></label>
            <label>LinkedIn URL<input value={form.linkedIn} onChange={(e) => upd("linkedIn", e.target.value)} placeholder="https://linkedin.com/in/..." /></label>
          </div>
          <div className="admin-form-split">
            <label>Sort order<input type="number" min="0" value={form.sortOrder} onChange={(e) => upd("sortOrder", Number(e.target.value))} /></label>
            <label className="admin-check"><input type="checkbox" checked={form.isPublished} onChange={(e) => upd("isPublished", e.target.checked)} /> Published</label>
          </div>
          <SaveButton pending={save.isPending} label={form.id ? "Save changes" : "Add team member"} />
          {form.id ? <CancelEdit onClick={() => setForm(blankTeamMember)} /> : null}
        </form>
      </section>
      <section className="admin-panel admin-list-panel">
        <PanelHeading eyebrow="YBI team" title="Team profiles" count={members?.length ?? 0} />
        {isLoading ? <LoadingCopy text="Loading team…" /> : isError ? <ErrorCopy text="Team data could not be loaded." /> : !members?.length ? <EmptyCopy text="No team members added yet." /> :
          <div className="admin-record-list">
            {members.map(m => (
              <article className="admin-record-row" key={m.id}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  {m.imageUrl && <img src={m.imageUrl} alt={m.name} style={{ width: 48, height: 48, borderRadius: "0px", objectFit: "cover", flexShrink: 0 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
                  <div>
                    <span className={`admin-status ${m.isPublished ? "published" : "draft"}`}>{m.isPublished ? "Published" : "Hidden"}</span>
                    <h3>{m.name}</h3>
                    <p>{m.role}</p>
                    <small>{m.email && <><a href={`mailto:${m.email}`}>{m.email}</a> · </>}{m.bio.slice(0, 80)}{m.bio.length > 80 ? "…" : ""}</small>
                  </div>
                </div>
                <div className="admin-row-actions">
                  <button onClick={() => setForm({ id: m.id, name: m.name, role: m.role, bio: m.bio, imageUrl: m.imageUrl || "", email: m.email || "", linkedIn: m.linkedIn || "", sortOrder: m.sortOrder, isPublished: m.isPublished })}><Pencil size={15} /> Edit</button>
                  <button className="danger" onClick={() => { if (window.confirm(`Remove ${m.name}?`)) remove.mutate({ id: m.id }); }}><Trash2 size={15} /></button>
                </div>
              </article>
            ))}
          </div>
        }
      </section>
    </div>
  );
}

// ─── Newsletter Manager ────────────────────────────────────────────────────────

function NewsletterManager() {
  const utils = trpc.useUtils();
  const { data: subscribers, isLoading, isError } = trpc.admin.newsletter.list.useQuery();
  const remove = trpc.admin.newsletter.remove.useMutation({
    onSuccess: () => { utils.admin.newsletter.list.invalidate(); toast.success("Subscriber removed."); },
    onError: (err) => toast.error("Could not remove subscriber.", { description: err.message }),
  });

  const handleExport = () => {
    if (!subscribers?.length) return toast.error("No subscribers to export.");
    downloadCsv("ybi-newsletter-subscribers.csv", subscribers.map(s => ({ name: s.name, email: s.email, date: new Date(s.createdAt).toISOString().slice(0, 10) })));
  };

  return (
    <div className="admin-manager-grid">
      <section className="admin-panel">
        <PanelHeading eyebrow="Email list" title="Newsletter overview" icon={<Mail size={24} />} />
        <div className="admin-form">
          <div className="admin-stat-row">
            <div className="admin-stat-card"><strong>{subscribers?.length ?? 0}</strong><span>Total subscribers</span></div>
            <div className="admin-stat-card"><strong>{subscribers?.filter(s => { const d = new Date(s.createdAt); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length ?? 0}</strong><span>Joined this month</span></div>
          </div>
          <p className="admin-help">Subscribers are collected when visitors sign up via the newsletter form on the website. You can remove individual subscribers or export the full list as CSV for use in email tools.</p>
          <button className="admin-primary" onClick={handleExport} type="button"><Download size={17} /> Export as CSV</button>
        </div>
      </section>
      <section className="admin-panel admin-list-panel">
        <PanelHeading eyebrow="Email subscribers" title="Subscriber list" count={subscribers?.length ?? 0} />
        {isLoading ? <LoadingCopy text="Loading subscribers…" /> : isError ? <ErrorCopy text="Subscriber list could not be loaded." /> : !subscribers?.length ? <EmptyCopy text="No subscribers yet. Once people sign up via the website, they'll appear here." /> :
          <div className="admin-record-list">
            {subscribers.map(s => (
              <article className="admin-record-row" key={s.id}>
                <div>
                  <h3>{s.name || "(No name)"}</h3>
                  <p><a href={`mailto:${s.email}`}>{s.email}</a></p>
                  <small>Joined {new Date(s.createdAt).toLocaleDateString()}</small>
                </div>
                <div className="admin-row-actions">
                  <a href={`mailto:${s.email}`} className="admin-secondary" style={{ fontSize: "13px" }}>Email</a>
                  <button className="danger" onClick={() => { if (window.confirm(`Remove ${s.email}?`)) remove.mutate({ id: s.id }); }}><Trash2 size={15} /></button>
                </div>
              </article>
            ))}
          </div>
        }
      </section>
    </div>
  );
}

// ─── Export Manager ───────────────────────────────────────────────────────────

function ExportManager() {
  const { data: inquiries, isLoading: loadingInq } = trpc.admin.export.inquiries.useQuery();
  const { data: metrics, isLoading: loadingMet } = trpc.admin.export.impactMetrics.useQuery();
  const { data: subs, isLoading: loadingSubs } = trpc.admin.export.subscribers.useQuery();

  const exports = [
    {
      title: "Community Inquiries", desc: "All messages received through the YBI Contact form.", count: inquiries?.length ?? 0,
      loading: loadingInq, icon: <MessageSquareHeart size={22} />, tone: "red",
      onExport: () => inquiries && downloadCsv(`ybi-inquiries-${new Date().toISOString().slice(0,10)}.csv`, inquiries),
    },
    {
      title: "Impact Metrics", desc: "All impact indicators with current and target values.", count: metrics?.length ?? 0,
      loading: loadingMet, icon: <Target size={22} />, tone: "blue",
      onExport: () => metrics && downloadCsv(`ybi-impact-${new Date().toISOString().slice(0,10)}.csv`, metrics),
    },
    {
      title: "Newsletter Subscribers", desc: "All email addresses collected through the site.", count: subs?.length ?? 0,
      loading: loadingSubs, icon: <Mail size={22} />, tone: "yellow",
      onExport: () => subs && downloadCsv(`ybi-subscribers-${new Date().toISOString().slice(0,10)}.csv`, subs),
    },
  ];

  return (
    <div className="admin-export-grid">
      {exports.map(({ title, desc, count, loading, icon, tone, onExport }) => (
        <article className="admin-export-card" key={title}>
          <div className={`admin-metric-icon ${tone}`}>{icon}</div>
          <div>
            <h3>{title}</h3>
            <p>{desc}</p>
            <span className="admin-count">{loading ? "—" : count} records</span>
          </div>
          <button className="admin-primary" onClick={onExport} disabled={loading || count === 0} type="button">
            <Download size={16} /> Download CSV
          </button>
        </article>
      ))}
      <div className="admin-export-note">
        <strong>About exports</strong>
        <p>CSV files open in Excel, Google Sheets, and most data tools. All exports include timestamps and are generated live from the current database.</p>
      </div>
    </div>
  );
}

// ─── Settings Manager ─────────────────────────────────────────────────────────

function SettingsManager() {
  return (
    <div className="admin-settings-layout">
      <SocialLinksSettings />
      <AnnouncementSettings />
      <DonationSettings />
      <PasswordSettings />
    </div>
  );
}

function SocialLinksSettings() {
  const utils = trpc.useUtils();
  const { data: saved, isLoading } = trpc.admin.settings.getSocialLinks.useQuery();
  const save = trpc.admin.settings.saveSocialLinks.useMutation({
    onSuccess: () => { utils.admin.settings.getSocialLinks.invalidate(); toast.success("Social media links saved!"); },
    onError: (err) => toast.error("Could not save social links.", { description: err.message }),
  });
  const [form, setForm] = useState<SocialLinksForm>(blankSocialLinks);
  const upd = (k: keyof SocialLinksForm, v: string) => setForm(c => ({ ...c, [k]: v }));

  useEffect(() => { if (saved) setForm({ facebook: saved.facebook || "", instagram: saved.instagram || "", twitter: saved.twitter || "", youtube: saved.youtube || "", linkedin: saved.linkedin || "", tiktok: saved.tiktok || "" }); }, [saved]);

  const socialFields = [
    { key: "facebook" as const, label: "Facebook", icon: <Facebook size={18} />, placeholder: "https://facebook.com/ybighana" },
    { key: "instagram" as const, label: "Instagram", icon: <Instagram size={18} />, placeholder: "https://instagram.com/ybighana" },
    { key: "twitter" as const, label: "Twitter / X", icon: <ExternalLink size={18} />, placeholder: "https://twitter.com/ybighana" },
    { key: "youtube" as const, label: "YouTube", icon: <Youtube size={18} />, placeholder: "https://youtube.com/@ybighana" },
    { key: "linkedin" as const, label: "LinkedIn", icon: <Linkedin size={18} />, placeholder: "https://linkedin.com/company/ybi" },
    { key: "tiktok" as const, label: "TikTok", icon: <ExternalLink size={18} />, placeholder: "https://tiktok.com/@ybighana" },
  ];

  return (
    <section className="admin-panel">
      <PanelHeading eyebrow="Online presence" title="Social media links" icon={<ExternalLink size={24} />} />
      {isLoading ? <LoadingCopy text="Loading social links…" /> : (
        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save.mutate(form); }}>
          <p className="admin-help">These links appear in the website footer and on relevant pages. Leave blank to hide a platform.</p>
          {socialFields.map(({ key, label, icon, placeholder }) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {icon}
              <span style={{ minWidth: 100 }}>{label}</span>
              <input style={{ flex: 1 }} value={form[key]} onChange={(e) => upd(key, e.target.value)} placeholder={placeholder} />
            </label>
          ))}
          <SaveButton pending={save.isPending} label="Save social links" />
        </form>
      )}
    </section>
  );
}

function AnnouncementSettings() {
  const utils = trpc.useUtils();
  const { data: saved, isLoading } = trpc.admin.settings.getAnnouncement.useQuery();
  const save = trpc.admin.settings.saveAnnouncement.useMutation({
    onSuccess: () => { utils.admin.settings.getAnnouncement.invalidate(); toast.success("Announcement saved!"); },
    onError: (err) => toast.error("Could not save announcement.", { description: err.message }),
  });
  const [form, setForm] = useState<AnnouncementForm>(blankAnnouncement);
  const upd = <K extends keyof AnnouncementForm>(k: K, v: AnnouncementForm[K]) => setForm(c => ({ ...c, [k]: v }));

  useEffect(() => { if (saved) setForm({ message: saved.message || "", type: saved.type || "info", isActive: saved.isActive ?? false, link: saved.link || "", linkLabel: saved.linkLabel || "" }); }, [saved]);

  const typeColors: Record<string, string> = { info: "#2563eb", warning: "#d97706", success: "#16a34a" };

  return (
    <section className="admin-panel">
      <PanelHeading eyebrow="Site-wide notice" title="Announcement banner" icon={<FileText size={24} />} />
      {isLoading ? <LoadingCopy text="Loading announcement…" /> : (
        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save.mutate({ ...form, link: form.link || undefined, linkLabel: form.linkLabel || undefined }); }}>
          <p className="admin-help">A banner displayed at the top of every page when active. Use sparingly for important notices.</p>
          <label>Message<textarea required value={form.message} onChange={(e) => upd("message", e.target.value)} placeholder="Join us for the YBI Open Day on 15 September!" maxLength={400} /></label>
          <div className="admin-form-split">
            <label>Type
              <select value={form.type} onChange={(e) => upd("type", e.target.value as AnnouncementForm["type"])}>
                <option value="info">Info (blue)</option>
                <option value="warning">Warning (amber)</option>
                <option value="success">Success (green)</option>
              </select>
            </label>
            <label className="admin-check" style={{ alignItems: "center", marginTop: 20 }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => upd("isActive", e.target.checked)} /> Active (visible on site)
            </label>
          </div>
          <div className="admin-form-split">
            <label>Link URL (optional)<input value={form.link} onChange={(e) => upd("link", e.target.value)} placeholder="/join-us" /></label>
            <label>Link label<input value={form.linkLabel} onChange={(e) => upd("linkLabel", e.target.value)} placeholder="Learn more" /></label>
          </div>
          {form.message && (
            <div className="admin-announcement-preview" style={{ borderLeft: `4px solid ${typeColors[form.type]}`, background: `${typeColors[form.type]}15`, padding: "12px 16px", borderRadius: "0px", fontSize: "14px" }}>
              <strong style={{ color: typeColors[form.type] }}>Preview: </strong>{form.message}{form.link && form.linkLabel && <> — <a href={form.link} style={{ color: typeColors[form.type] }}>{form.linkLabel}</a></>}
            </div>
          )}
          <SaveButton pending={save.isPending} label="Save announcement" />
        </form>
      )}
    </section>
  );
}

function DonationSettings() {
  const utils = trpc.useUtils();
  const { data: saved, isLoading } = trpc.admin.settings.getDonation.useQuery();
  const save = trpc.admin.settings.saveDonation.useMutation({
    onSuccess: () => { utils.admin.settings.getDonation.invalidate(); toast.success("Donation tracker updated!"); },
    onError: (err) => toast.error("Could not save donation tracker.", { description: err.message }),
  });
  const [form, setForm] = useState<DonationForm>(blankDonation);
  const upd = <K extends keyof DonationForm>(k: K, v: DonationForm[K]) => setForm(c => ({ ...c, [k]: v }));

  useEffect(() => {
    if (saved) setForm({ campaign: saved.campaign || "", goal: String(saved.goal || 0), raised: String(saved.raised || 0), currency: saved.currency || "GHS", description: saved.description || "", isActive: saved.isActive ?? true });
  }, [saved]);

  const progress = form.goal && Number(form.goal) > 0 ? Math.min(100, Math.round((Number(form.raised) / Number(form.goal)) * 100)) : 0;

  return (
    <section className="admin-panel">
      <PanelHeading eyebrow="Fundraising" title="Donation / funding tracker" icon={<TrendingUp size={24} />} />
      {isLoading ? <LoadingCopy text="Loading donation tracker…" /> : (
        <form className="admin-form" onSubmit={(e) => { e.preventDefault(); save.mutate({ campaign: form.campaign, goal: Number(form.goal), raised: Number(form.raised), currency: form.currency, description: form.description || undefined, isActive: form.isActive }); }}>
          <p className="admin-help">Track your fundraising campaign and display live progress on the website. Enter actual figures — no placeholders.</p>
          <label>Campaign name<input required value={form.campaign} onChange={(e) => upd("campaign", e.target.value)} placeholder="YBI Innovation Hub Fund 2026" /></label>
          <label>Description (optional)<textarea value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Help us build the next YBI learning space." /></label>
          <div className="admin-form-split">
            <label>Goal amount<input required type="number" min="0" value={form.goal} onChange={(e) => upd("goal", e.target.value)} /></label>
            <label>Amount raised<input required type="number" min="0" value={form.raised} onChange={(e) => upd("raised", e.target.value)} /></label>
          </div>
          <div className="admin-form-split">
            <label>Currency<input value={form.currency} onChange={(e) => upd("currency", e.target.value)} placeholder="GHS" /></label>
            <label className="admin-check" style={{ alignItems: "center", marginTop: 20 }}><input type="checkbox" checked={form.isActive} onChange={(e) => upd("isActive", e.target.checked)} /> Show on website</label>
          </div>
          {form.campaign && (
            <div className="admin-donation-preview">
              <p><strong>{form.campaign}</strong></p>
              <div className="admin-progress" style={{ margin: "8px 0" }}><span style={{ width: `${progress}%` }} /><small>{progress}%</small></div>
              <small>{form.currency} {Number(form.raised).toLocaleString()} raised of {Number(form.goal).toLocaleString()}</small>
            </div>
          )}
          <SaveButton pending={save.isPending} label="Save donation tracker" />
        </form>
      )}
    </section>
  );
}

function EventsManager() {
  const utils = trpc.useUtils();
  const { data: events, isLoading, isError } = trpc.admin.events.list.useQuery();
  const save = trpc.admin.events.save.useMutation({
    onSuccess: () => {
      utils.admin.events.list.invalidate();
      utils.publicSite.events.list.invalidate();
      utils.admin.overview.invalidate();
      toast.success("Event saved successfully.");
      setForm(blankEventAdmin);
    },
    onError: (err) => toast.error("Could not save event.", { description: err.message }),
  });
  const remove = trpc.admin.events.remove.useMutation({
    onSuccess: () => {
      utils.admin.events.list.invalidate();
      utils.publicSite.events.list.invalidate();
      utils.admin.overview.invalidate();
      toast.success("Event removed.");
    },
    onError: (err) => toast.error("Could not remove event.", { description: err.message }),
  });

  const [form, setForm] = useState<EventAdminForm>(blankEventAdmin);
  const update = <K extends keyof EventAdminForm>(k: K, v: EventAdminForm[K]) =>
    setForm((curr) => ({ ...curr, [k]: v }));

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    update("title", val);
    if (!form.id && !form.slug) {
      update("slug", generateSlug(val));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceGhsNum = parseFloat(form.priceGhs) || 0;
    save.mutate({
      id: form.id,
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      description: form.description,
      imageUrl: form.imageUrl || "/ybi-assets/programs/ybi-public-speaking.jpg",
      scheduledFor: new Date(form.scheduledFor).toISOString(),
      location: form.location,
      capacity: parseInt(form.capacity) || 50,
      isFree: form.isFree,
      priceGhs: form.isFree ? 0 : Math.round(priceGhsNum * 100),
      status: form.status,
    });
  };

  return (
    <div className="admin-manager-grid">
      <section className="admin-panel">
        <PanelHeading
          eyebrow="Gatherings"
          title={form.id ? "Edit event" : "Create an event"}
          icon={<Calendar size={24} />}
        />
        <form className="admin-form" onSubmit={submit}>
          <label>
            Event title
            <input
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Masterclass: The Art of Youth Advocacy"
            />
          </label>
          <div className="admin-form-split">
            <label>
              URL Slug
              <input
                required
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="art-of-youth-advocacy"
              />
            </label>
            <label>
              Location / Venue
              <input
                required
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. British Council Hall, Accra / Zoom"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              required
              className="admin-tall-textarea"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Provide a compelling overview of what attendees will experience..."
            />
          </label>
          <div className="admin-form-split">
            <label>
              Date & Time
              <input
                required
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(e) => update("scheduledFor", e.target.value)}
              />
            </label>
            <label>
              Seat Capacity
              <input
                required
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => update("capacity", e.target.value)}
              />
            </label>
          </div>
          <div className="admin-form-split">
            <label className="admin-check" style={{ alignItems: "center", marginTop: 22 }}>
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => update("isFree", e.target.checked)}
              />{" "}
              Free Event (No payment required)
            </label>
            {!form.isFree && (
              <label>
                Ticket Price (GHS)
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={form.priceGhs}
                  onChange={(e) => update("priceGhs", e.target.value)}
                  placeholder="50.00"
                />
              </label>
            )}
          </div>
          <label>
            Cover Image URL
            <input
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://... or /ybi-assets/programs/..."
            />
          </label>
          <label>
            Publishing Status
            <select
              value={form.status}
              onChange={(e) =>
                update("status", e.target.value as EventAdminForm["status"])
              }
            >
              <option value="draft">Draft (Hidden from public)</option>
              <option value="published">Published (Live on website)</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <SaveButton
            pending={save.isPending}
            label={form.id ? "Save event changes" : "Publish event"}
          />
          {form.id ? <CancelEdit onClick={() => setForm(blankEventAdmin)} /> : null}
        </form>
      </section>

      <section className="admin-panel admin-list-panel">
        <PanelHeading
          eyebrow="Calendar"
          title="All events & masterclasses"
          count={events?.length ?? 0}
        />
        {isLoading ? (
          <LoadingCopy text="Loading events…" />
        ) : isError ? (
          <ErrorCopy text="Events could not be loaded." />
        ) : !events?.length ? (
          <EmptyCopy text="No events created yet. Use the form on the left to schedule your first gathering." />
        ) : (
          <div className="admin-record-list">
            {events.map((event) => (
              <article className="admin-record-row" key={event.id}>
                <div>
                  <span className={`admin-status ${event.status}`}>{event.status}</span>
                  <span className="admin-event-price-tag">
                    {event.isFree ? "Free" : `GHS ${(event.priceGhs / 100).toFixed(2)}`}
                  </span>
                  <h3>{event.title}</h3>
                  <p>
                    {new Date(event.scheduledFor).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    · {event.location} (Capacity: {event.capacity})
                  </p>
                </div>
                <div className="admin-row-actions">
                  <button
                    onClick={() =>
                      setForm({
                        id: event.id,
                        title: event.title,
                        slug: event.slug,
                        description: event.description,
                        imageUrl: event.imageUrl,
                        scheduledFor: toLocalDateTimeInput(event.scheduledFor),
                        location: event.location,
                        capacity: String(event.capacity),
                        isFree: event.isFree,
                        priceGhs: (event.priceGhs / 100).toString(),
                        status: event.status as any,
                      })
                    }
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      if (window.confirm(`Remove event "${event.title}"?`)) {
                        remove.mutate({ id: event.id });
                      }
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RegistrationsManager() {
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>(undefined);
  const { data: events } = trpc.admin.events.list.useQuery();
  const { data: registrations, isLoading, isError } = trpc.admin.events.registrations.useQuery({
    eventId: selectedEventId,
  });

  const handleExport = () => {
    if (!registrations || !registrations.length) {
      toast.error("No registrations to export.");
      return;
    }
    const rows = registrations.map((r) => ({
      ID: r.id,
      "Attendee Name": r.fullName,
      Email: r.email,
      Phone: r.phone,
      "Event ID": r.eventId,
      "Event Title": events?.find((e) => e.id === r.eventId)?.title || "Unknown",
      "SMS Opt-in": r.smsOptIn ? "Yes" : "No",
      "Payment Status": r.paymentStatus,
      "Waitlist?": r.isWaitlist ? "Waitlisted" : "Confirmed",
      "Paystack Ref": r.paystackRef || "N/A",
      "Registered At": new Date(r.createdAt).toLocaleString(),
    }));
    downloadCsv(`ybi_event_registrations_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <section className="admin-panel admin-full-panel">
      <div className="admin-toolbar-row">
        <div>
          <PanelHeading
            eyebrow="Attendance & RSVPs"
            title="Event Registrations"
            count={registrations?.length ?? 0}
          />
        </div>
        <div className="admin-toolbar-actions">
          <select
            value={selectedEventId || ""}
            onChange={(e) =>
              setSelectedEventId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="admin-select-filter"
          >
            <option value="">All Events</option>
            {(events ?? []).map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleExport} className="admin-secondary">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingCopy text="Loading attendee records…" />
      ) : isError ? (
        <ErrorCopy text="Registrations could not be loaded." />
      ) : !registrations?.length ? (
        <EmptyCopy text="No registrations recorded for this selection." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Contact</th>
                <th>Event</th>
                <th>SMS Opt-In</th>
                <th>Status</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => {
                const event = events?.find((e) => e.id === reg.eventId);
                return (
                  <tr key={reg.id}>
                    <td>
                      <strong>{reg.fullName}</strong>
                      {reg.isWaitlist && <span className="admin-tag waitlist">Waitlist</span>}
                    </td>
                    <td>
                      <div>{reg.email}</div>
                      <small>{reg.phone}</small>
                    </td>
                    <td>{event?.title || `Event #${reg.eventId}`}</td>
                    <td>
                      <span className={reg.smsOptIn ? "admin-tag yes" : "admin-tag no"}>
                        {reg.smsOptIn ? "Opted In" : "No"}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status ${reg.paymentStatus}`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function BlogManager() {
  const utils = trpc.useUtils();
  const { data: posts, isLoading, isError } = trpc.admin.blog.list.useQuery();
  const save = trpc.admin.blog.save.useMutation({
    onSuccess: () => {
      utils.admin.blog.list.invalidate();
      utils.publicSite.blog.list.invalidate();
      toast.success("Blog article saved.");
      setForm(blankBlogPostAdmin);
    },
    onError: (err) => toast.error("Could not save article.", { description: err.message }),
  });
  const remove = trpc.admin.blog.remove.useMutation({
    onSuccess: () => {
      utils.admin.blog.list.invalidate();
      utils.publicSite.blog.list.invalidate();
      toast.success("Article removed.");
    },
    onError: (err) => toast.error("Could not remove article.", { description: err.message }),
  });

  const [form, setForm] = useState<BlogPostAdminForm>(blankBlogPostAdmin);
  const update = <K extends keyof BlogPostAdminForm>(k: K, v: BlogPostAdminForm[K]) =>
    setForm((curr) => ({ ...curr, [k]: v }));

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    update("title", val);
    if (!form.id && !form.slug) {
      update("slug", generateSlug(val));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    save.mutate({
      id: form.id,
      slug: form.slug || generateSlug(form.title),
      title: form.title,
      excerpt: form.excerpt,
      body: form.body,
      authorName: form.authorName,
      coverImageUrl: form.coverImageUrl || "/ybi-assets/programs/ybi-public-speaking.jpg",
      category: form.category,
      status: form.status,
      publishedAt: new Date(form.publishedAt).toISOString(),
    });
  };

  return (
    <div className="admin-manager-grid">
      <section className="admin-panel">
        <PanelHeading
          eyebrow="Editorial CMS"
          title={form.id ? "Edit article" : "Write a blog post"}
          icon={<Newspaper size={24} />}
        />
        <form className="admin-form" onSubmit={submit}>
          <label>
            Article Title
            <input
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Why Youth Voice Belongs in Every Governance Room"
            />
          </label>
          <div className="admin-form-split">
            <label>
              URL Slug
              <input
                required
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="youth-voice-in-governance"
              />
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="Mentorship">Mentorship</option>
                <option value="Public Speaking">Public Speaking</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
                <option value="Leadership">Leadership</option>
                <option value="Community">Community</option>
                <option value="Reflections">Reflections</option>
              </select>
            </label>
          </div>
          <div className="admin-form-split">
            <label>
              Author Name
              <input
                required
                value={form.authorName}
                onChange={(e) => update("authorName", e.target.value)}
                placeholder="YBI Editorial Lead"
              />
            </label>
            <label>
              Publish Date
              <input
                type="date"
                required
                value={form.publishedAt}
                onChange={(e) => update("publishedAt", e.target.value)}
              />
            </label>
          </div>
          <label>
            Cover Image URL
            <input
              value={form.coverImageUrl}
              onChange={(e) => update("coverImageUrl", e.target.value)}
              placeholder="/ybi-assets/programs/ybi-public-speaking.jpg"
            />
          </label>
          <label>
            Short Excerpt (Summary for listings & SEO)
            <textarea
              required
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="A brief 1-2 sentence preview of this article..."
            />
          </label>
          <label>
            Article Body (Markdown supported: ## Headings, - Lists, **Bold**)
            <textarea
              required
              className="admin-tall-textarea"
              style={{ minHeight: "240px" }}
              value={form.body}
              onChange={(e) => update("body", e.target.value)}
              placeholder="Write the full narrative story here..."
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) =>
                update("status", e.target.value as BlogPostAdminForm["status"])
              }
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Live on Journal)</option>
            </select>
          </label>
          <SaveButton
            pending={save.isPending}
            label={form.id ? "Save article changes" : "Publish article"}
          />
          {form.id ? <CancelEdit onClick={() => setForm(blankBlogPostAdmin)} /> : null}
        </form>
      </section>

      <section className="admin-panel admin-list-panel">
        <PanelHeading
          eyebrow="Journal Archive"
          title="All articles & stories"
          count={posts?.length ?? 0}
        />
        {isLoading ? (
          <LoadingCopy text="Loading articles…" />
        ) : isError ? (
          <ErrorCopy text="Articles could not be loaded." />
        ) : !posts?.length ? (
          <EmptyCopy text="No articles published yet. Compose your first story on the left." />
        ) : (
          <div className="admin-record-list">
            {posts.map((post) => (
              <article className="admin-record-row" key={post.id}>
                <div>
                  <span className={`admin-status ${post.status}`}>{post.status}</span>
                  <span className="admin-event-price-tag">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>
                    By {post.authorName} ·{" "}
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "Unpublished"}
                  </p>
                </div>
                <div className="admin-row-actions">
                  <button
                    onClick={() =>
                      setForm({
                        id: post.id,
                        slug: post.slug,
                        title: post.title,
                        excerpt: post.excerpt,
                        body: post.body,
                        authorName: post.authorName,
                        coverImageUrl: post.coverImageUrl || "",
                        category: post.category,
                        status: post.status as any,
                        publishedAt: post.publishedAt
                          ? new Date(post.publishedAt).toISOString().slice(0, 10)
                          : new Date().toISOString().slice(0, 10),
                      })
                    }
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      if (window.confirm(`Delete article "${post.title}"?`)) {
                        remove.mutate({ id: post.id });
                      }
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DonationsManager() {
  const { data: summary } = trpc.admin.donations.summary.useQuery();
  const { data: donations, isLoading: listLoading } = trpc.admin.donations.list.useQuery();

  const handleExport = () => {
    if (!donations || !donations.length) {
      toast.error("No donations to export.");
      return;
    }
    const rows = donations.map((d) => ({
      ID: d.id,
      "Donor Name": d.donorName,
      Email: d.donorEmail,
      Phone: d.donorPhone || "N/A",
      "Amount GHS": (d.amountGhs / 100).toFixed(2),
      Status: d.status,
      "Paystack Ref": d.paystackRef || "N/A",
      "Message / Note": d.message || "",
      Date: new Date(d.createdAt).toLocaleString(),
    }));
    downloadCsv(`ybi_donations_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  const totalGhs = summary ? (summary.totalGhs / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";

  return (
    <div className="admin-donations-view">
      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card tone-green">
          <span className="kpi-label">Total Raised</span>
          <strong className="kpi-value">GHS {totalGhs}</strong>
          <small className="kpi-note">Direct contributions via Paystack</small>
        </div>
        <div className="admin-kpi-card tone-blue">
          <span className="kpi-label">Confirmed Donors</span>
          <strong className="kpi-value">{summary?.donationCount ?? 0}</strong>
          <small className="kpi-note">Successful transactions</small>
        </div>
        <div className="admin-kpi-card tone-yellow">
          <span className="kpi-label">Pending Pledges</span>
          <strong className="kpi-value">{summary?.pendingCount ?? 0}</strong>
          <small className="kpi-note">Awaiting confirmation</small>
        </div>
      </div>

      <section className="admin-panel admin-full-panel" style={{ marginTop: 24 }}>
        <div className="admin-toolbar-row">
          <PanelHeading
            eyebrow="Financial Records"
            title="Contributions & Donations"
            count={donations?.length ?? 0}
          />
          <button type="button" onClick={handleExport} className="admin-secondary">
            <Download size={15} /> Export CSV
          </button>
        </div>

        {listLoading ? (
          <LoadingCopy text="Loading donation records…" />
        ) : !donations?.length ? (
          <EmptyCopy text="No donation records yet. When visitors contribute on the Get Involved page, records will appear here." />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Contact</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paystack Ref</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.donorName}</strong>
                      {d.message && <div className="admin-donor-msg">“{d.message}”</div>}
                    </td>
                    <td>
                      <div>{d.donorEmail}</div>
                      <small>{d.donorPhone || "No phone"}</small>
                    </td>
                    <td>
                      <strong>GHS {(d.amountGhs / 100).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`admin-status ${d.status}`}>{d.status}</span>
                    </td>
                    <td>
                      <code>{d.paystackRef || "Manual"}</code>
                    </td>
                    <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function SmsBroadcastManager() {
  const utils = trpc.useUtils();
  const { data: logs, isLoading: logsLoading } = trpc.admin.sms.getLogs.useQuery();
  const broadcast = trpc.admin.sms.sendBroadcast.useMutation({
    onSuccess: (res) => {
      utils.admin.sms.getLogs.invalidate();
      toast.success("SMS broadcast completed!", {
        description: `Successfully sent: ${res.sent}, Failed: ${res.failed}`,
      });
      setForm(blankSmsBroadcast);
    },
    onError: (err) =>
      toast.error("SMS broadcast failed.", { description: err.message }),
  });

  const [form, setForm] = useState<SmsBroadcastForm>(blankSmsBroadcast);
  const update = <K extends keyof SmsBroadcastForm>(k: K, v: SmsBroadcastForm[K]) =>
    setForm((curr) => ({ ...curr, [k]: v }));

  const msgLen = form.message.length;
  const segments = Math.ceil(msgLen / 160) || 1;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) {
      return toast.error("Please enter a broadcast message.");
    }
    if (
      !window.confirm(
        `Are you sure you want to broadcast this SMS (${segments} segment${segments > 1 ? "s" : ""})?`
      )
    ) {
      return;
    }
    broadcast.mutate({
      message: form.message.trim(),
      target: form.target,
      customPhones:
        form.target === "custom"
          ? form.customPhones
              .split(/[\n,]/)
              .map((p) => p.trim())
              .filter(Boolean)
          : undefined,
    });
  };


  return (
    <div className="admin-manager-grid">
      <section className="admin-panel">
        <PanelHeading
          eyebrow="Africa's Talking Gateway"
          title="Compose SMS Broadcast"
          icon={<Send size={24} />}
        />
        <form className="admin-form" onSubmit={submit}>
          <label>Target Recipients</label>
          <div className="admin-radio-group">
            <label className="admin-radio">
              <input
                type="radio"
                name="target"
                value="all"
                checked={form.target === "all"}
                onChange={() => update("target", "all")}
              />
              <span>All Opted-In Contacts (Newsletter & Event Attendees)</span>
            </label>
            <label className="admin-radio">
              <input
                type="radio"
                name="target"
                value="newsletter"
                checked={form.target === "newsletter"}
                onChange={() => update("target", "newsletter")}
              />
              <span>Newsletter Subscribers (with Phone numbers)</span>
            </label>
            <label className="admin-radio">
              <input
                type="radio"
                name="target"
                value="events"
                checked={form.target === "events"}
                onChange={() => update("target", "events")}
              />
              <span>Event Registrants (with SMS Opt-in checked)</span>
            </label>
            <label className="admin-radio">
              <input
                type="radio"
                name="target"
                value="custom"
                checked={form.target === "custom"}
                onChange={() => update("target", "custom")}
              />
              <span>Custom Phone Number List</span>
            </label>
          </div>

          {form.target === "custom" && (
            <label>
              Custom Phone Numbers (one per line or comma-separated)
              <textarea
                required
                value={form.customPhones}
                onChange={(e) => update("customPhones", e.target.value)}
                placeholder="+233241234567&#10;+233501234567"
              />
            </label>
          )}

          <label>
            Message Content
            <textarea
              required
              maxLength={480}
              className="admin-tall-textarea"
              style={{ minHeight: "140px" }}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="e.g. YBI Alert: Our Public Speaking masterclass starts this Saturday at 10 AM. See venue directions at ybi.org/events."
            />
            <div className="admin-sms-counter">
              <span>
                {msgLen} / 160 chars · {segments} SMS segment{segments > 1 ? "s" : ""}
              </span>
              <span>Max 480 chars</span>
            </div>
          </label>

          <button
            type="submit"
            disabled={broadcast.isPending || !form.message.trim()}
            className="admin-primary"
          >
            {broadcast.isPending ? "Sending Broadcast…" : "Send SMS Broadcast"}{" "}
            <Send size={16} />
          </button>
        </form>
      </section>

      <section className="admin-panel admin-list-panel">
        <PanelHeading
          eyebrow="Delivery History"
          title="Recent SMS Delivery Logs"
          count={logs?.length ?? 0}
        />
        {logsLoading ? (
          <LoadingCopy text="Loading SMS logs…" />
        ) : !logs?.length ? (
          <EmptyCopy text="No SMS messages sent yet. Messages sent via broadcast or event confirmation will log here." />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <code>{log.phoneNumber}</code>
                    </td>
                    <td>
                      <span className="admin-log-snippet">{log.message}</span>
                    </td>
                    <td>
                      <span className={`admin-status ${log.status}`}>{log.status}</span>
                    </td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function FaqManager() {
  const utils = trpc.useUtils();
  const { data: faqs, isLoading, isError } = trpc.admin.faq.list.useQuery();
  const save = trpc.admin.faq.save.useMutation({
    onSuccess: () => {
      utils.admin.faq.list.invalidate();
      utils.publicSite.faq.list.invalidate();
      toast.success("FAQ item saved.");
      setForm(blankFaqAdmin);
    },
    onError: (err) => toast.error("Could not save FAQ.", { description: err.message }),
  });
  const remove = trpc.admin.faq.remove.useMutation({
    onSuccess: () => {
      utils.admin.faq.list.invalidate();
      utils.publicSite.faq.list.invalidate();
      toast.success("FAQ item removed.");
    },
    onError: (err) => toast.error("Could not remove FAQ.", { description: err.message }),
  });

  const [form, setForm] = useState<FaqAdminForm>(blankFaqAdmin);
  const update = <K extends keyof FaqAdminForm>(k: K, v: FaqAdminForm[K]) =>
    setForm((curr) => ({ ...curr, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    save.mutate(form);
  };

  return (
    <div className="admin-manager-grid">
      <section className="admin-panel">
        <PanelHeading
          eyebrow="Help Center"
          title={form.id ? "Edit Question" : "Add FAQ Question"}
          icon={<HelpCircle size={24} />}
        />
        <form className="admin-form" onSubmit={submit}>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="General">General</option>
              <option value="Programs">Programs & Workshops</option>
              <option value="Mentorship">Mentorship & Dialogue</option>
              <option value="Donations">Donations & Support</option>
              <option value="Volunteering">Volunteering</option>
            </select>
          </label>
          <label>
            Question
            <input
              required
              value={form.question}
              onChange={(e) => update("question", e.target.value)}
              placeholder="e.g. How are mentor-mentee matches determined?"
            />
          </label>
          <label>
            Answer
            <textarea
              required
              className="admin-tall-textarea"
              value={form.answer}
              onChange={(e) => update("answer", e.target.value)}
              placeholder="Provide a clear, helpful explanation..."
            />
          </label>
          <div className="admin-form-split">
            <label>
              Sort Order
              <input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(e) => update("sortOrder", Number(e.target.value))}
              />
            </label>
            <label className="admin-check" style={{ alignItems: "center", marginTop: 22 }}>
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => update("isPublished", e.target.checked)}
              />{" "}
              Published (Visible)
            </label>
          </div>
          <SaveButton
            pending={save.isPending}
            label={form.id ? "Save Question" : "Add Question"}
          />
          {form.id ? <CancelEdit onClick={() => setForm(blankFaqAdmin)} /> : null}
        </form>
      </section>

      <section className="admin-panel admin-list-panel">
        <PanelHeading
          eyebrow="Published Questions"
          title="All FAQ Items"
          count={faqs?.length ?? 0}
        />
        {isLoading ? (
          <LoadingCopy text="Loading FAQ items…" />
        ) : isError ? (
          <ErrorCopy text="FAQ items could not be loaded." />
        ) : !faqs?.length ? (
          <EmptyCopy text="No FAQ items yet. Add questions on the left." />
        ) : (
          <div className="admin-record-list">
            {faqs.map((faq) => (
              <article className="admin-record-row" key={faq.id}>
                <div>
                  <span className="admin-event-price-tag">{faq.category}</span>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer.slice(0, 120)}...</p>
                </div>
                <div className="admin-row-actions">
                  <button
                    onClick={() =>
                      setForm({
                        id: faq.id,
                        question: faq.question,
                        answer: faq.answer,
                        category: faq.category,
                        sortOrder: faq.sortOrder,
                        isPublished: faq.isPublished,
                      })
                    }
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      if (window.confirm(`Delete question "${faq.question}"?`)) {
                        remove.mutate({ id: faq.id });
                      }
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LegalPagesManager() {
  const utils = trpc.useUtils();
  const [selectedDoc, setSelectedDoc] = useState<"privacy" | "terms">("privacy");
  const contentKey = selectedDoc === "privacy" ? "legal:privacy-policy" : "legal:terms-of-use";
  const { data: record } = trpc.publicSite.content.useQuery({ contentKey });

  const save = trpc.admin.content.save.useMutation({
    onSuccess: () => {
      utils.publicSite.content.invalidate();
      toast.success("Legal document updated successfully.");
    },
    onError: (err) => toast.error("Could not save legal document.", { description: err.message }),
  });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (record) {
      setTitle(record.title || (selectedDoc === "privacy" ? "Privacy Policy & Data Protection" : "Terms of Use & Guidelines"));
      setBody(record.body || "");
    } else {
      setTitle(selectedDoc === "privacy" ? "Privacy Policy & Data Protection" : "Terms of Use & Guidelines");
      setBody("");
    }
  }, [record, selectedDoc]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    save.mutate({
      contentKey,
      label: selectedDoc === "privacy" ? "Privacy Policy" : "Terms of Use",
      title,
      body,
    });
  };

  return (
    <section className="admin-panel admin-full-panel">
      <PanelHeading
        eyebrow="Compliance & Governance"
        title="Legal Documents & Safeguards"
        icon={<Scale size={24} />}
      />
      <div className="admin-category-pills" style={{ marginBottom: 20 }}>
        <button
          type="button"
          className={`admin-category-pill ${selectedDoc === "privacy" ? "active" : ""}`}
          onClick={() => setSelectedDoc("privacy")}
        >
          Privacy Policy (/privacy-policy)
        </button>
        <button
          type="button"
          className={`admin-category-pill ${selectedDoc === "terms" ? "active" : ""}`}
          onClick={() => setSelectedDoc("terms")}
        >
          Terms of Use (/terms-of-use)
        </button>
      </div>

      <form className="admin-form" onSubmit={submit}>
        <label>
          Page Heading
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Legal Text Body (Paragraphs separated by double line breaks. Leave blank to use authoritative NGO default text)
          <textarea
            className="admin-tall-textarea"
            style={{ minHeight: "300px" }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Custom legal copy..."
          />
        </label>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "16px" }}>
          <SaveButton pending={save.isPending} label={`Save ${selectedDoc === "privacy" ? "Privacy Policy" : "Terms of Use"}`} />
          <Link
            href={selectedDoc === "privacy" ? "/privacy-policy" : "/terms-of-use"}
            target="_blank"
            className="admin-secondary"
          >
            Preview Public Page <ExternalLink size={15} />
          </Link>
        </div>
      </form>
    </section>
  );
}

function PasswordSettings() {

  const save = trpc.admin.settings.changePassword.useMutation({
    onSuccess: () => { setForm(blankPassword); toast.success("Admin password changed successfully!"); },
    onError: (err) => toast.error("Password change failed.", { description: err.message }),
  });
  const [form, setForm] = useState<PasswordForm>(blankPassword);
  const upd = <K extends keyof PasswordForm>(k: K, v: string) => setForm(c => ({ ...c, [k]: v }));

  return (
    <section className="admin-panel">
      <PanelHeading eyebrow="Security" title="Change admin password" icon={<Key size={24} />} />
      <form className="admin-form" onSubmit={(e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) return toast.error("New password and confirmation do not match.");
        if (form.newPassword.length < 8) return toast.error("New password must be at least 8 characters.");
        save.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      }}>
        <p className="admin-help">The default password is <code>ybi-admin-2026</code>. Change it to something strong and memorable. You will need it to log back in.</p>
        <label>Current password<input required type="password" value={form.currentPassword} onChange={(e) => upd("currentPassword", e.target.value)} autoComplete="current-password" /></label>
        <label>New password (min 8 chars)<input required type="password" value={form.newPassword} onChange={(e) => upd("newPassword", e.target.value)} autoComplete="new-password" /></label>
        <label>Confirm new password<input required type="password" value={form.confirmPassword} onChange={(e) => upd("confirmPassword", e.target.value)} autoComplete="new-password" /></label>
        <SaveButton pending={save.isPending} label="Update password" />
      </form>
    </section>
  );
}

export default function AdminDashboard() { return <AdminAccessDenied />; }
