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
  Award,
  MessageSquareQuote,
  MapPin,
  Users,
  ShieldCheck,
  ScrollText,
  Package,
  Truck,
  Palette,
  LogIn,
  RotateCcw,
  Newspaper,
  Briefcase,
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

const mainNavItems = [{ title: "Dashboard", url: "/", icon: LayoutDashboard }];

const cmsSection = [
  {
    title: "Home",
    icon: Home,
    subItems: [
      { title: "Home CMS", url: "/home-cms", icon: FileText },
      { title: "Home Banner", url: "/home-banner-slider", icon: Image },
      { title: "Home Brands", url: "/home-brands", icon: Award },
      {
        title: "Smart Calculator",
        url: "/smart-space-calculator",
        icon: BookOpen,
      },
      { title: "Find Your Fits", url: "/find-your-fits", icon: Image },
    ],
  },
  {
    title: "About",
    icon: Info,
    subItems: [
      { title: "About CMS", url: "/about-cms", icon: FileText },
      { title: "About Journeys", url: "/about-journeys", icon: MapPin },
      { title: "Why BOSQ", url: "/why-bosq", icon: Award },
      {
        title: "About Testimonials",
        url: "/about-testimonials",
        icon: MessageSquareQuote,
      },
      { title: "About Our Clients", url: "/about-our-clients", icon: Users },
    ],
  },
  {
    title: "Materials",
    icon: Package,
    subItems: [
      { title: "Materials CMS", url: "/materials-cms", icon: FileText },
      {
        title: "Material Categories",
        url: "/materials-category",
        icon: FolderOpen,
      },
      { title: "Materials", url: "/materials", icon: List },
    ],
  },
  {
    title: "Delivery",
    icon: Truck,
    subItems: [
      { title: "Delivery CMS", url: "/delivery-cms", icon: FileText },
      { title: "Delivery Time", url: "/delivery-time", icon: List },
      { title: "Delivery Method", url: "/delivery-method", icon: Package },
    ],
  },
  {
    title: "Ergonomics",
    icon: Award, // or any icon you prefer
    subItems: [
      { title: "Ergonomics CMS", url: "/ergonomic-guide-cms", icon: FileText },
      {
        title: "Ergonomic Chair Features",
        url: "/ergonomic-chair-features",
        icon: List,
      },
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
    subItems: [{ title: "Contact CMS", url: "/contact-cms", icon: FileText }],
  },
  {
    title: "Login/Register",
    icon: LogIn,
    subItems: [
      {
        title: "Login/Register CMS",
        url: "/login-register-cms",
        icon: FileText,
      },
    ],
  },
  {
    title: "Customisation",
    icon: Palette,
    subItems: [
      { title: "Customisation CMS", url: "/customization-cms", icon: FileText },
      { title: "Features", url: "/customization-features", icon: List },
      { title: "Process", url: "/customization-process", icon: List },
      { title: "Options", url: "/customization-options", icon: List },
    ],
  },

  // Sustainability
  {
    title: "Sustainability",
    icon: Briefcase,
    subItems: [
      {
        title: "Sustainability CMS",
        url: "/sustainability-cms",
        icon: FileText,
      },
      { title: "Sustainability", url: "/sustainability", icon: List },
    ],
  },
];

const projectsSection = [
  { title: "Projects CMS", url: "/projects-cms", icon: FileText },
  { title: "Project Category", url: "/project-category", icon: FolderOpen },
  { title: "Projects", url: "/projects", icon: List },
];

const blogsSection = [
  { title: "Blog CMS", url: "/blog-cms", icon: FileText },
  { title: "Blogs", url: "/blogs", icon: List },
];

const newsSection = [
  { title: "News CMS", url: "/news-cms", icon: FileText },
  { title: "News", url: "/news", icon: List },
];

const commonSection = [
  { title: "Site Settings", url: "/site-settings", icon: Settings },
  { title: "Social Media", url: "/social-media", icon: Share2 },
  {title: "Payment Methods", url: "/payment-methods", icon: List },
  { title: "Meta Tags", url: "/meta-tags", icon: Tags },
];

const policiesSection = [
  {
    title: "Privacy Policy",
    icon: ShieldCheck,
    subItems: [
      {
        title: "Policy CMS",
        url: "/privacy-policy-cms",
        icon: FileText,
      },
      {
        title: "Privacy Policy",
        url: "/privacy-policy",
        icon: List,
      },
    ],
  },
  {
    title: "Terms & Conditions",
    icon: ScrollText,
    subItems: [
      {
        title: "T&C CMS",
        url: "/terms-and-conditions-cms",
        icon: FileText,
      },
      {
        title: "FAQ",
        url: "/terms-and-conditions-faq",
        icon: List,
      },
    ],
  },
  {
    title: "Warranty Policy",
    icon: Award,
    subItems: [
      {
        title: "Warranty Policy",
        url: "/warranty-policy",
        icon: List,
      },
    ],
  },
  {
    title: "Return Policy",
    icon: RotateCcw,
    subItems: [
      {
        title: "Policy CMS",
        url: "/return-policy-cms",
        icon: FileText,
      },
      {
        title: "Return Policy",
        url: "/return-policy",
        icon: List,
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const [cmsOpen, setCmsOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [ergonomicOpen, setErgonomicOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [loginRegisterOpen, setLoginRegisterOpen] = useState(false);
  const [customisationOpen, setCustomisationOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [commonOpen, setCommonOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [warrantyOpen, setWarrantyOpen] = useState(false);
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false);
  const [sustainabilityOpen, setSustainabilityOpen] = useState(false);
  const isCollapsed = state === "collapsed";

  // Auto-open based on current path
  useEffect(() => {
    const path = location.pathname;

    // Auto-open Home section
    if (
      ["/home-cms", "/home-banner-slider", "/home-brands"].some((r) =>
        path.includes(r)
      )
    ) {
      setCmsOpen(true);
      setHomeOpen(true);
    }

    // Auto-open About section
    if (
      [
        "/about-cms",
        "/about-testimonials",
        "/about-journeys",
        "/about-our-clients",
      ].some((r) => path.includes(r))
    ) {
      setCmsOpen(true);
      setAboutOpen(true);
    }

    // Auto-open Ergonomic section
    if (["/ergonomic-guide-cms", "/ergonomic-chair-features"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setErgonomicOpen(true);
    }

    // Auto-open Materials section
    if (
      ["/materials-cms", "/materials-category", "/materials"].some((r) =>
        path.includes(r)
      )
    ) {
      setCmsOpen(true);
      setMaterialsOpen(true);
    }

    // Auto-open Delivery section
    if (
      ["/delivery-cms", "/delivery-time", "/delivery-method"].some((r) =>
        path.includes(r)
      )
    ) {
      setCmsOpen(true);
      setDeliveryOpen(true);
    }

    // Auto-open FAQ section
    if (
      ["/faq-cms", "/faq-category", "/faq-list"].some((r) => path.includes(r))
    ) {
      setCmsOpen(true);
      setFaqOpen(true);
    }

    // Auto-open Contact section
    if (["/contact-cms"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setContactOpen(true);
    }

    // Auto-open Projects section
    if (
      ["/projects-cms", "/project-category", "/projects"].some((r) =>
        path.includes(r)
      )
    ) {
      setProjectsOpen(true);
    }

    // Auto-open Login/Register section
    if (["/login-register-cms"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setLoginRegisterOpen(true);
    }

    // Auto-open Customisation section
    if (
      [
        "/customization-cms",
        "/customization-features",
        "/customization-process",
      ].some((r) => path.includes(r))
    ) {
      setCmsOpen(true);
      setCustomisationOpen(true);
    }


    // Auto-open Sustainability section
    if (["/sustainability-cms", "/sustainability"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setSustainabilityOpen(true);
    }

    // Auto-open Blog section
    if (["/blog-cms", "/blogs"].some((r) => path.includes(r))) {
      setBlogOpen(true);
    }

    // Auto-open News section
    if (["/news-cms", "/news"].some((r) => path.includes(r))) {
      setNewsOpen(true);
    }

    // Auto-open Common section
    if (
      ["/site-settings", "/social-media", "/payment-methods", "/meta-tags"].some((r) =>
        path.includes(r)
      )
    ) {
      setCommonOpen(true);
    }

    // Auto-open Policies section
    if (
      ["/privacy-privacy-policy-cms", "/privacy-policy"].some((r) =>
        path.includes(r)
      )
    ) {
      setPoliciesOpen(true);
      setPrivacyOpen(true);
    }

    // Auto-open Terms and Conditions section
    if (
      ["/terms-and-conditions-cms", "/terms-and-conditions-faq"].some((r) =>
        path.includes(r)
      )
    ) {
      setPoliciesOpen(true);
      setTermsOpen(true);
    }

    // Auto-open Return Policy section
    if (
      ["/return-policy-cms", "/return-policy"].some((r) => path.includes(r))
    ) {
      setPoliciesOpen(true);
      setReturnPolicyOpen(true);
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
        <div className="py-4 border-b border-sidebar-border">
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
                  } else if (section.title === "Materials") {
                    sectionOpen = materialsOpen;
                    setSectionOpen = setMaterialsOpen;
                  } else if (section.title === "Delivery") {
                    sectionOpen = deliveryOpen;
                    setSectionOpen = setDeliveryOpen;
                  } else if (section.title === "FAQ") {
                    sectionOpen = faqOpen;
                    setSectionOpen = setFaqOpen;
                  } else if (section.title === "Ergonomics") {
                    sectionOpen = ergonomicOpen;
                    setSectionOpen = setErgonomicOpen;
                  } else if (section.title === "Contact") {
                    sectionOpen = contactOpen;
                    setSectionOpen = setContactOpen;
                  } else if (section.title === "Login/Register") {
                    sectionOpen = loginRegisterOpen;
                    setSectionOpen = setLoginRegisterOpen;
                  } else if (section.title === "Customisation") {
                    sectionOpen = customisationOpen;
                    setSectionOpen = setCustomisationOpen;
                  }
                  else if (section.title === "Sustainability") {
                    sectionOpen = sustainabilityOpen;
                    setSectionOpen = setSustainabilityOpen;
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

        {/* Projects */}
        <SidebarCollapsibleSection
          title="Projects"
          icon={Briefcase}
          open={projectsOpen}
          setOpen={setProjectsOpen}
          items={projectsSection}
          isCollapsed={isCollapsed}
          getNavCls={getNavCls}
        />

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

        {/* news */}
        <SidebarCollapsibleSection
          title="News"
          icon={Newspaper}
          open={newsOpen}
          setOpen={setNewsOpen}
          items={newsSection}
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

        <SidebarGroup>
          <Collapsible
            open={!isCollapsed && policiesOpen}
            onOpenChange={setPoliciesOpen}
          >
            <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
              <ShieldCheck className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-2">Policies</span>
                  <ChevronRight
                    className={`h-4 w-4 ml-auto transition-transform ${
                      policiesOpen ? "rotate-90" : ""
                    }`}
                  />
                </>
              )}
            </CollapsibleTrigger>

            {!isCollapsed && (
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                <NestedSection
                  title="Privacy Policy"
                  icon={ShieldCheck}
                  open={privacyOpen}
                  setOpen={setPrivacyOpen}
                  items={policiesSection[0].subItems}
                  getNavCls={getNavCls}
                />

                {/* Terms & Conditions */}
                <NestedSection
                  title="Terms & Conditions"
                  icon={ScrollText}
                  open={termsOpen}
                  setOpen={setTermsOpen}
                  items={policiesSection[1].subItems}
                  getNavCls={getNavCls}
                />

                {/* Warranty Policy */}
                <NestedSection
                  title="Warranty Policy"
                  icon={Award}
                  open={warrantyOpen}
                  setOpen={setWarrantyOpen}
                  items={policiesSection[2].subItems}
                  getNavCls={getNavCls}
                />

                {/* Return Policy */}
                <NestedSection
                  title="Return Policy"
                  icon={RotateCcw}
                  open={returnPolicyOpen}
                  setOpen={setReturnPolicyOpen}
                  items={policiesSection[3].subItems}
                  getNavCls={getNavCls}
                />
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarGroup>
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
