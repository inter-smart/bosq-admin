import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  ChevronRight,
  Share2,
  Tags,
  Home,
  Image,
  FileText,
  HelpCircle,
  Mail,
  Info,
  List,
  FolderOpen,
  BookOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const bosqLogo = "/bosq-logo-light.png";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard }
];

const cmsSection = [
  {
    title: "Home",
    icon: Home,
    subItems: [
      { title: "Home CMS", url: "/home-cms", icon: FileText },
      { title: "Home Banner", url: "/home-banner-slider", icon: Image },
    ],
  },
  {
    title: "About",
    icon: Info,
    subItems: [
      { title: "About CMS", url: "/about-cms", icon: FileText },
    ],
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    subItems: [
      { title: "FAQ CMS", url: "/faq-cms", icon: FileText },
      { title: "FAQ Category", url: "/faq-category", icon: FolderOpen },
      { title: "FAQ List", url: "/faq-list", icon: List },
    ],
  },
  {
    title: "Contact",
    icon: Mail,
    subItems: [
      { title: "Contact CMS", url: "/contact-cms", icon: FileText },
    ],
  },
];

const blogsSection = [
  { title: "Blog CMS", url: "/blog-cms", icon: FileText },
  { title: "Blogs", url: "/blogs", icon: List },
];

const commonSection = [
  { title: "Site Settings", url: "/site-settings", icon: Settings },
  { title: "Social Media", url: "/social-media", icon: Share2 },
  { title: "Meta Tags", url: "/meta-tags", icon: Tags },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const [cmsOpen, setCmsOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [commonOpen, setCommonOpen] = useState(false);

  const isCollapsed = state === "collapsed";

  // Auto-open based on current path
  useEffect(() => {
    const path = location.pathname;

    // Auto-open Home section
    if (["/home-cms", "/home-banner-slider"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setHomeOpen(true);
    }

    // Auto-open About section
    if (["/about-cms"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setAboutOpen(true);
    }

    // Auto-open FAQ section
    if (["/faq-cms", "/faq-category", "/faq-list"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setFaqOpen(true);
    }

    // Auto-open Contact section
    if (["/contact-cms"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setContactOpen(true);
    }

    // Auto-open Blog section
    if (["/blog-cms", "/blogs"].some((r) => path.includes(r))) {
      setBlogOpen(true);
    }

    // Auto-open Common section
    if (
      ["/site-settings", "/social-media", "/meta-tags", "/policy"].some((r) =>
        path.includes(r)
      )
    ) {
      setCommonOpen(true);
    }
  }, [location.pathname]);

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center w-full text-left ${
      isActive
        ? "bg-sidebar-accent text-sidebar-primary focus:text-sidebar-foreground focus:bg-sidebar-accent/50 font-medium"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    }`;

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center justify-center">
              <img
                src={bosqLogo}
                alt="BOSQ"
                className="h-8 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-sm">
                B
              </span>
            </div>
          )}
        </div>

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} end className={getNavCls}>
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-3">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* CMS Section with Nested Structure */}
        <SidebarGroup>
          <Collapsible open={!isCollapsed && cmsOpen} onOpenChange={setCmsOpen}>
            <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
              <FileText className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-2">CMS</span>
                  <ChevronRight
                    className={`h-4 w-4 ml-auto transition-transform ${
                      cmsOpen ? "rotate-90" : ""
                    }`}
                  />
                </>
              )}
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {cmsSection.map((section) => {
                  let sectionOpen = homeOpen;
                  let setSectionOpen = setHomeOpen;

                  if (section.title === "About") {
                    sectionOpen = aboutOpen;
                    setSectionOpen = setAboutOpen;
                  } else if (section.title === "FAQ") {
                    sectionOpen = faqOpen;
                    setSectionOpen = setFaqOpen;
                  } else if (section.title === "Contact") {
                    sectionOpen = contactOpen;
                    setSectionOpen = setContactOpen;
                  }

                  return (
                    <NestedSection
                      key={section.title}
                      title={section.title}
                      icon={section.icon}
                      open={sectionOpen}
                      setOpen={setSectionOpen}
                      items={section.subItems}
                      getNavCls={getNavCls}
                    />
                  );
                })}
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarGroup>

        {/* Blog Section - Standalone */}
        <SidebarCollapsibleSection
          title="Blog"
          icon={BookOpen}
          open={blogOpen}
          setOpen={setBlogOpen}
          items={blogsSection}
          isCollapsed={isCollapsed}
          getNavCls={getNavCls}
        />

        {/* Settings */}
        <SidebarCollapsibleSection
          title="Settings & Content"
          icon={Settings}
          open={commonOpen}
          setOpen={setCommonOpen}
          items={commonSection}
          isCollapsed={isCollapsed}
          getNavCls={getNavCls}
        />
      </SidebarContent>
    </Sidebar>
  );
}

/**
 * 🧱 Nested Section Component (for Home, FAQ, Contact under CMS)
 */
function NestedSection({
  title,
  icon: Icon,
  open,
  setOpen,
  items,
  getNavCls,
}: any) {
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center w-full p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
        <Icon className="h-4 w-4" />
        <span className="ml-2">{title}</span>
        <ChevronRight
          className={`h-4 w-4 ml-auto transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6 mt-1 space-y-1">
        <SidebarMenu>
          {items.map((item: any) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <NavLink to={item.url} className={getNavCls}>
                  <item.icon className="h-4 w-4" />
                  <span className="ml-2">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * 🧱 Reusable Sidebar Section Component
 */
function SidebarCollapsibleSection({
  title,
  icon: Icon,
  open,
  setOpen,
  items,
  isCollapsed,
  getNavCls,
}: any) {
  return (
    <SidebarGroup>
      <Collapsible open={!isCollapsed && open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
          <Icon className="h-4 w-4" />
          {!isCollapsed && (
            <>
              <span className="ml-2">{title}</span>
              <ChevronRight
                className={`h-4 w-4 ml-auto transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />
            </>
          )}
        </CollapsibleTrigger>
        {!isCollapsed && (
          <CollapsibleContent className="ml-6 mt-1 space-y-1">
            <SidebarMenu>
              {items.map((item: any) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      <span className="ml-2">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        )}
      </Collapsible>
    </SidebarGroup>
  );
}