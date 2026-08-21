import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {


  BookOpen,
  BotMessageSquare,
  Calendar,
  CalendarDays,
  ChevronDown,
  Coins,
  Download,
  ExternalLink,
  FileText,
  HandHeart,
  HelpCircle,
  Image,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  MessageSquareHeart,
  Newspaper,
  PanelLeft,
  PanelsTopLeft,
  Scale,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";

import "../admin-dashboard.css";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Calendar, label: "Events & Cohorts", path: "/admin/events" },
  { icon: Ticket, label: "Registrations", path: "/admin/registrations" },
  { icon: Newspaper, label: "Articles & News CMS", path: "/admin/blog" },
  { icon: MessageSquareHeart, label: "Community Inbox", path: "/admin/inquiries" },
  { icon: Coins, label: "Donations Tracker", path: "/admin/donations" },
  { icon: Send, label: "SMS Broadcast", path: "/admin/sms" },
  { icon: Users, label: "Team Members", path: "/admin/team" },
  { icon: Target, label: "Impact Tracker", path: "/admin/impact" },
  { icon: ImagePlus, label: "Site Images", path: "/admin/images" },
  { icon: Image, label: "Gallery", path: "/admin/gallery" },
  { icon: BookOpen, label: "Programs", path: "/admin/programs" },
  { icon: PanelsTopLeft, label: "Site Content", path: "/admin/content" },
  { icon: HelpCircle, label: "FAQ Manager", path: "/admin/faq" },
  { icon: Scale, label: "Legal Pages", path: "/admin/legal" },
  { icon: Mail, label: "Newsletter", path: "/admin/newsletter" },
  { icon: Download, label: "Export Data", path: "/admin/export" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];


const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
const ybiMark = "/ybi-assets/brand/ybi-logo.png";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user || user.role !== "admin") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find((item) => item.path === location);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {}
    setLocation("/admin");
  };

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const handleNavigation = (path: string) => {
    setLocation(path);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* ── 1. Bulletproof Self-Contained Mobile Sliding Navigation Drawer ── */}
      <div
        className={`admin-mobile-drawer-root ${mobileDrawerOpen ? "open" : ""}`}
        aria-hidden={!mobileDrawerOpen}
      >
        {/* Backdrop overlay */}
        <div
          className="admin-mobile-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        />

        {/* Sliding Panel */}
        <aside className="admin-mobile-drawer-panel" role="dialog" aria-label="YBI Admin Navigation">
          <div className="admin-drawer-header">
            <div className="admin-drawer-header-inner">
              <div className="admin-drawer-brand">
                <img src={ybiMark} alt="Young Beginners Inspiration" />
                <div>
                  <strong>YBI Admin</strong>
                  <span>Control Center</span>
                </div>
              </div>
              <button
                type="button"
                className="admin-drawer-close"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <nav className="admin-drawer-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  className={`admin-drawer-item ${isActive ? "active" : ""}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="admin-drawer-footer">
            <div className="admin-drawer-user-row">
              <div className="relative shrink-0">
                <div className="admin-profile-avatar-styled">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "Y"}
                </div>
                <span className="admin-profile-status-dot" title="Online" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-white truncate">{user?.name || "YBI Administrator"}</p>
                  <span className="admin-profile-role-badge">Admin</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email || "admin@ybi.org"}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="admin-drawer-logout-btn"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── 2. Desktop Sidebar ── */}
      <div className="relative hidden md:block" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0 admin-sidebar"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center px-4 py-2 transition-all w-full">
              <div className="admin-sidebar-brand flex items-center gap-3">
                <img src={ybiMark} alt="Young Beginners Inspiration" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                {!isCollapsed ? (
                  <div className="flex flex-col">
                    <strong style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1 }}>YBI Admin</strong>
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "2px" }}>Control Center</span>
                  </div>
                ) : null}
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="admin-sidebar-content gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleNavigation(item.path)}
                      tooltip={item.label}
                      className="h-10 transition-all font-normal"
                    >
                      <item.icon
                        className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="admin-profile-card flex items-center gap-3 w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none"
                  aria-label="Admin profile menu"
                >
                  <div className="relative shrink-0">
                    <div className="admin-profile-avatar-styled">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "Y"}
                    </div>
                    <span className="admin-profile-status-dot" title="Authorized Admin" />
                  </div>

                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-white truncate">
                        {user?.name || "YBI Administrator"}
                      </p>
                      <span className="admin-profile-role-badge">Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {user?.email || "admin@ybi.org"}
                    </p>
                  </div>

                  <ChevronDown
                    size={14}
                    className="text-slate-400 shrink-0 group-data-[collapsible=icon]:hidden"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="admin-dropdown-menu w-56" sideOffset={8}>
                <div className="admin-dropdown-header">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="admin-profile-avatar-mini">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "Y"}
                    </div>
                    <div className="min-w-0">
                      <p className="admin-dropdown-user-name truncate">{user?.name || "YBI Administrator"}</p>
                      <p className="admin-dropdown-user-email truncate">{user?.email || "admin@ybi.org"}</p>
                    </div>
                  </div>
                  <span className="admin-dropdown-badge">
                    <ShieldCheck size={12} /> Full Management Access
                  </span>
                </div>
                <DropdownMenuItem
                  onClick={() => window.open("/", "_blank")}
                  className="admin-dropdown-item"
                >
                  <ExternalLink size={14} />
                  <span>Visit Live Website</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/admin/images")}
                  className="admin-dropdown-item"
                >
                  <Sparkles size={14} />
                  <span>Site Images & Media</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/admin/settings")}
                  className="admin-dropdown-item"
                >
                  <Settings size={14} />
                  <span>Admin Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="admin-dropdown-item danger"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      {/* ── 3. Main Inset Content with Mobile Header Bar ── */}
      <SidebarInset className="admin-content-inset">
        <div className="admin-mobile-topbar md:hidden">
          <div className="admin-mobile-topbar-inner">
            <button
              type="button"
              className="admin-mobile-menu-button"
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              aria-label="Open YBI Admin navigation"
              aria-expanded={mobileDrawerOpen}
            >
              <Menu size={20} strokeWidth={2.2} />
              <span className="sr-only">Open management menu</span>
            </button>
            <div className="admin-mobile-brand">
              <img className="admin-mobile-mark" src={ybiMark} alt="Young Beginners Inspiration" />
              <div>
                <strong>YBI Admin</strong>
                <span>{activeMenuItem?.label ?? "Overview"}</span>
              </div>
            </div>
          </div>

          {/* Meaningful Admin Profile & Action Menu */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="admin-mobile-user-btn"
                  aria-label="Admin account menu"
                >
                  <div className="admin-mobile-avatar-circle">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="admin-dropdown-menu" sideOffset={8}>
                <div className="admin-dropdown-header">
                  <p className="admin-dropdown-user-name">{user?.name || "YBI Administrator"}</p>
                  <p className="admin-dropdown-user-email">{user?.email || "admin@ybi.org"}</p>
                  <span className="admin-dropdown-badge">
                    Admin Active
                  </span>
                </div>
                <DropdownMenuItem
                  onClick={() => window.open("/", "_blank")}
                  className="admin-dropdown-item"
                >
                  <ExternalLink size={14} />
                  <span>Visit Live Website</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/admin/settings")}
                  className="admin-dropdown-item"
                >
                  <Settings size={14} />
                  <span>Admin Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="admin-dropdown-item danger"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <main className="admin-shell-main">{children}</main>
      </SidebarInset>
    </>
  );
}
