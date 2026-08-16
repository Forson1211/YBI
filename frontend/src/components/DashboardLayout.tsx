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
import { BookOpen, BotMessageSquare, CalendarDays, Download, HandHeart, Image, ImagePlus, LayoutDashboard, LogOut, Mail, Menu, MessageSquareHeart, Newspaper, PanelLeft, PanelsTopLeft, Settings, Target, Users, X } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: ImagePlus, label: "Site images", path: "/admin/images" },
  { icon: Image, label: "Gallery", path: "/admin/gallery" },
  { icon: BookOpen, label: "Programs", path: "/admin/programs" },
  { icon: Newspaper, label: "Updates", path: "/admin/updates" },
  { icon: PanelsTopLeft, label: "Site content", path: "/admin/content" },
  { icon: BotMessageSquare, label: "Assistant questions", path: "/admin/assistant-settings" },
  { icon: CalendarDays, label: "Program calendar", path: "/admin/sessions" },
  { icon: MessageSquareHeart, label: "Community inbox", path: "/admin/inquiries" },
  { icon: HandHeart, label: "Opportunities", path: "/admin/opportunities" },
  { icon: Target, label: "Impact tracker", path: "/admin/impact" },
  { icon: Users, label: "Team members", path: "/admin/team" },
  { icon: Mail, label: "Newsletter", path: "/admin/newsletter" },
  { icon: Download, label: "Export data", path: "/admin/export" },
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
  const { state, toggleSidebar, setOpenMobile, openMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

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
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0 admin-sidebar"
          disableTransition={isResizing}
        >
          <SidebarHeader className={isMobile ? "admin-drawer-header" : "h-16 justify-center"}>
            {isMobile ? (
              <div className="admin-drawer-header-inner">
                <div className="admin-drawer-brand">
                  <img src={ybiMark} alt="Young Beginners Inspiration" />
                  <div><strong>YBI Admin</strong><span>Management workspace</span></div>
                </div>
                <button onClick={() => setOpenMobile(false)} className="admin-drawer-close" aria-label="Close management menu"><X size={18} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-2 transition-all w-full">
                <button
                  onClick={toggleSidebar}
                  className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                  aria-label="Toggle navigation"
                >
                  <PanelLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="admin-sidebar-brand">
                  <img src={ybiMark} alt="Young Beginners Inspiration" />
                  {!isCollapsed ? <span>YBI Admin</span> : null}
                </div>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent className="admin-sidebar-content gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleNavigation(item.path)}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal`}
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
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        {!isMobile && <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />}
      </div>

      <SidebarInset className="admin-content-inset">
        {isMobile && (
          <div className="admin-mobile-topbar">
            <div className="admin-mobile-topbar-inner">
              <button
                type="button"
                className="admin-mobile-menu-button"
                onClick={toggleSidebar}
                aria-label="Open YBI Admin navigation"
                aria-expanded={openMobile}
              >
                <Menu size={20} strokeWidth={2.2} />
                <span className="sr-only">Open management menu</span>
              </button>
              <div className="admin-mobile-brand">
                <img className="admin-mobile-mark" src={ybiMark} alt="Young Beginners Inspiration" />
                <div><strong>YBI Admin</strong><span>{activeMenuItem?.label ?? "Overview"}</span></div>
              </div>
            </div>
            <span className="admin-mobile-status"><span aria-hidden="true" />Secure</span>
          </div>
        )}
        <main className="admin-shell-main">{children}</main>
      </SidebarInset>
    </>
  );
}
