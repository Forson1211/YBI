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
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  Facebook,
  FileText,
  HandHeart,
  ImagePlus,
  Instagram,
  Key,
  LayoutDashboard,
  Linkedin,
  Loader2,
  Mail,
  MessageSquareHeart,
  Pencil,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Target,
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
    overview: "YBI dashboard", images: "Site image customizer", gallery: "Gallery manager", programs: "Program manager", updates: "Updates manager", content: "Site content", "assistant-settings": "Assistant quick questions",
    sessions: "Program calendar", inquiries: "Community inbox", opportunities: "Opportunity board", impact: "Impact tracker",
    team: "Team members", newsletter: "Newsletter subscribers", export: "Export data", settings: "Settings",
  };
  const descriptions: Record<string, string> = {
    overview: "A clear view of YBI's community work, content, and next actions.",
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
                  {m.imageUrl && <img src={m.imageUrl} alt={m.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
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
            <div className="admin-announcement-preview" style={{ borderLeft: `4px solid ${typeColors[form.type]}`, background: `${typeColors[form.type]}15`, padding: "12px 16px", borderRadius: "8px", fontSize: "14px" }}>
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
