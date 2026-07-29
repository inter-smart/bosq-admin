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
  Layers,
  ShoppingBag,
  Grid,
  Sliders,
  PieChart,
  Star,
  Box,
  Inbox,
  Upload,
  Tag,
} from "lucide-react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/context/AuthContext";

const bosqLogo = "/bosq-logo-light.png";

const mainNavItems = [{ title: "Dashboard", url: "/", icon: LayoutDashboard }];

const ordersSection = [{ title: "All Orders", url: "/orders", icon: ShoppingBag }];

const enquiriesSection = [
  { title: "Contact Enquiries", url: "/contact-enquiries", icon: Mail },
  { title: "Product Enquiries", url: "/product-enquiries", icon: Package },
  { title: "General Enquiries", url: "/customization-enquiries", icon: Palette },
  { title: "Lead Generation", url: "/lead-generation", icon: Users },
  {
    title: "Newsletter Subscriptions",
    url: "/newsletter-subscriptions",
    icon: Newspaper,
  },
  { title: "Project Enquiries", url: "/project-enquiries", icon: Briefcase },
];

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
      { title: "Extra Materials", url: "/extra-materials", icon: Layers },
    ],
  },
  {
    title: "Delivery",
    icon: Truck,
    subItems: [
      { title: "Delivery CMS", url: "/delivery-cms", icon: FileText },
      { title: "Delivery Charges", url: "/delivery-charges", icon: Truck },
      { title: "Delivery Time", url: "/delivery-time", icon: List },
      { title: "Delivery Method", url: "/delivery-method", icon: Package },
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
  // {
  //   title: "Auth",
  //   icon: ShieldCheck,
  //   subItems: [
  //     {
  //       title: "Auth CMS",
  //       url: "/auth-cms",
  //       icon: FileText,
  //     },
  //   ],
  // },
  {
    title: "Ergonomics",
    icon: Award,
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
    title: "Master",
    icon: List,
    subItems: [{ title: "Enquiry Dropdown", url: "/master/enquiry-dropdown", icon: List }],
  },
];

const productsSection = [
  { title: "Categories", url: "/product-categories", icon: Grid },
  { title: "Attributes", url: "/product-attributes", icon: Sliders },
  { title: "Sectors", url: "/product-sectors", icon: PieChart },
  {
    title: "Selling Points",
    url: "/product-selling-points",
    icon: Star,
  },
  { title: "Base Product", url: "/base-products", icon: Box },
  { title: "All Models", url: "/product-models/all", icon: Layers },
  { title: "All Variants", url: "/product-variants/all", icon: Package },
  { title: "Product FAQs", url: "/product-faqs", icon: HelpCircle },
  { title: "Bulk Product Upload", url: "/product-bulk-upload", icon: Upload },
  { title: "Bulk Image Upload", url: "/product-bulk-image-upload", icon: Image },
  { title: "Variant Meta Tags", url: "/product-variant-meta-tags", icon: Tag },
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

const landingPagesSection = [
  { title: "Landing Pages", url: "/landing-page", icon: List },
];

const commonSection = [
  { title: "Site Settings", url: "/site-settings", icon: Settings },
  { title: "Social Media", url: "/social-media", icon: Share2 },
  { title: "Payment Methods", url: "/payment-methods", icon: List },
  { title: "Meta Tags", url: "/meta-tags", icon: Tags },
  { title: "Manage Mailers", url: "/mailer-settings", icon: Mail },
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

const usersSection = [{ title: "Users List", url: "/users", icon: Users }];
const adminAccessSection = [
  { title: "Staff Users", url: "/admin-users", icon: Users },
  { title: "Roles & Permissions", url: "/admin-roles", icon: ShieldCheck },
];
const couponsSection = [
  { title: "Coupons", url: "/coupons", icon: Tags },
  // { title: "Coupon Usage", url: "/coupon-usage", icon: PieChart },
];

export function AppSidebar() {
  const { state , isMobile} = useSidebar();
  const location = useLocation();
  const { hasPermission, isSuperAdmin } = useAuth();

  const [adminAccessOpen, setAdminAccessOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [enquiriesOpen, setEnquiriesOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [customisationOpen, setCustomisationOpen] = useState(false);
  const [sustainabilityOpen, setSustainabilityOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [loginRegisterOpen, setLoginRegisterOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [ergonomicOpen, setErgonomicOpen] = useState(false);
  const [masterOpen, setMasterOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [landingPagesOpen, setLandingPagesOpen] = useState(false);
  const [couponsOpen, setCouponsOpen] = useState(false);
  const [commonOpen, setCommonOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [warrantyOpen, setWarrantyOpen] = useState(false);
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false);

  const isCollapsed =!isMobile && state === "collapsed";

  // Helper function to close all sections
  const closeAllSections = () => {
    setAdminAccessOpen(false);
    setUsersOpen(false);
    setOrdersOpen(false);
    setProductsOpen(false);
    setEnquiriesOpen(false);
    setCmsOpen(false);
    setHomeOpen(false);
    setAboutOpen(false);
    setMaterialsOpen(false);
    setDeliveryOpen(false);
    setCustomisationOpen(false);
    setSustainabilityOpen(false);
    setFaqOpen(false);
    setContactOpen(false);
    setLoginRegisterOpen(false);
    setAuthOpen(false);
    setErgonomicOpen(false);
    setMasterOpen(false);
    setProjectsOpen(false);
    setBlogOpen(false);
    setNewsOpen(false);
    setLandingPagesOpen(false);
    setCouponsOpen(false);
    setCommonOpen(false);
    setPoliciesOpen(false);
    setPrivacyOpen(false);
    setTermsOpen(false);
    setWarrantyOpen(false);
    setReturnPolicyOpen(false);
  };

  // Auto-open based on current path and close others
  useEffect(() => {
    const path = location.pathname;

    // Close all first
    closeAllSections();

    // Admin Access
    if (["/admin-users", "/admin-roles"].some((r) => path.includes(r))) {
      setAdminAccessOpen(true);
      return;
    }

    // Users
    if (["/users"].some((r) => path.includes(r))) {
      setUsersOpen(true);
      return;
    }

    // Orders
    if (path.includes("/orders")) {
      setOrdersOpen(true);
      return;
    }

    // Products
    if (
      [
        "/product-categories",
        "/product-attributes",
        "/product-sectors",
        "/product-selling-points",
        "/base-products",
        "/product-models/all",
        "/product-variants/all",
        "/product-faqs",
        "/product-bulk-upload",
        "/product-bulk-image-upload",
        "/product-variant-meta-tags",
      ].some((r) => path.includes(r))
    ) {
      setProductsOpen(true);
      return;
    }

    // Enquiries
    if (
      [
        "/contact-enquiries",
        "/product-enquiries",
        "/customization-enquiries",
        "/lead-generation",
        "/newsletter-subscriptions",
        "/project-enquiries",
      ].some((r) => path.includes(r))
    ) {
      setEnquiriesOpen(true);
      return;
    }

    // Home (CMS)
    if (["/home-cms", "/home-banner-slider", "/home-brands", "/smart-space-calculator", "/find-your-fits"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setHomeOpen(true);
      return;
    }

    // About (CMS)
    if (["/about-cms", "/about-testimonials", "/about-journeys", "/about-our-clients", "/why-bosq"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setAboutOpen(true);
      return;
    }

    // Materials (CMS)
    if (["/materials-cms", "/materials-category", "/materials", "/extra-materials"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setMaterialsOpen(true);
      return;
    }

    // Delivery (CMS)
    if (["/delivery-cms", "/delivery-charges", "/delivery-time", "/delivery-method"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setDeliveryOpen(true);
      return;
    }

    // Customisation (CMS)
    if (["/customization-cms", "/customization-features", "/customization-process", "/customization-options"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setCustomisationOpen(true);
      return;
    }

    // Sustainability (CMS)
    if (["/sustainability-cms", "/sustainability"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setSustainabilityOpen(true);
      return;
    }

    // FAQ (CMS)
    if (["/faq-cms", "/faq-category", "/faq-list"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setFaqOpen(true);
      return;
    }

    // Contact (CMS)
    if (["/contact-cms"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setContactOpen(true);
      return;
    }

    // Login/Register (CMS)
    if (["/login-register-cms"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setLoginRegisterOpen(true);
      return;
    }

    // Auth (CMS)
    if (["/auth-cms"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setAuthOpen(true);
      return;
    }

    // Ergonomics (CMS)
    if (["/ergonomic-guide-cms", "/ergonomic-chair-features"].some((r) => path.includes(r))) {
      setCmsOpen(true);
      setErgonomicOpen(true);
      return;
    }

    // Master (CMS)
    if (path.includes("/master/enquiry-dropdown")) {
      setCmsOpen(true);
      setMasterOpen(true);
      return;
    }

    // Projects
    if (["/projects-cms", "/project-category", "/projects"].some((r) => path.includes(r))) {
      setProjectsOpen(true);
      return;
    }

    // Blog
    if (["/blog-cms", "/blogs"].some((r) => path.includes(r))) {
      setBlogOpen(true);
      return;
    }

    // News
    if (["/news-cms", "/news"].some((r) => path.includes(r))) {
      setNewsOpen(true);
      return;
    }

    // Landing Pages
    if (["/landing-page-cms", "/landing-pages", "/landing-page", "/product-types"].some((r) => path.includes(r))) {
      setLandingPagesOpen(true);
      return;
    }

    // Coupons
    if (["/coupons"].some((r) => path.includes(r))) {
      setCouponsOpen(true);
      return;
    }

    // Settings
    if (["/site-settings", "/social-media", "/payment-methods", "/meta-tags", "/mailer-settings"].some((r) => path.includes(r))) {
      setCommonOpen(true);
      return;
    }

    // Privacy Policy (Policies)
    if (["/privacy-policy-cms", "/privacy-policy"].some((r) => path.includes(r))) {
      setPoliciesOpen(true);
      setPrivacyOpen(true);
      return;
    }

    // Terms and Conditions (Policies)
    if (["/terms-and-conditions-cms", "/terms-and-conditions-faq"].some((r) => path.includes(r))) {
      setPoliciesOpen(true);
      setTermsOpen(true);
      return;
    }

    // Warranty Policy (Policies)
    if (["/warranty-policy"].some((r) => path.includes(r))) {
      setPoliciesOpen(true);
      setWarrantyOpen(true);
      return;
    }

    // Return Policy (Policies)
    if (["/return-policy-cms", "/return-policy"].some((r) => path.includes(r))) {
      setPoliciesOpen(true);
      setReturnPolicyOpen(true);
      return;
    }
  }, [location.pathname]);

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="py-4 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-3">
              <img src={bosqLogo} alt="BOSQ" className="h-8 w-auto object-contain" />
              <SidebarTrigger className="md:hidden" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
          )}
        </div>

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.url} className="data-[active=true]:!text-sidebar-primary">
                  <NavLink to={item.url} end>
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-3">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Admin Access (super admin only) */}
        {isSuperAdmin && (
        <SidebarCollapsibleSection
          title="Admin Access"
          icon={ShieldCheck}
          open={adminAccessOpen}
          setOpen={setAdminAccessOpen}
          items={adminAccessSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Users */}
        {hasPermission("users") && (
        <SidebarCollapsibleSection
          title="Users"
          icon={Users}
          open={usersOpen}
          setOpen={setUsersOpen}
          items={usersSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Orders */}
        {hasPermission("orders") && (
        <SidebarCollapsibleSection
          title="Orders"
          icon={ShoppingBag}
          open={ordersOpen}
          setOpen={setOrdersOpen}
          items={ordersSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Products */}
        {hasPermission("products") && (
        <SidebarCollapsibleSection
          title="Products"
          icon={ShoppingBag}
          open={productsOpen}
          setOpen={setProductsOpen}
          items={productsSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Enquiries */}
        {hasPermission("enquiries") && (
        <SidebarCollapsibleSection
          title="Enquiries"
          icon={Inbox}
          open={enquiriesOpen}
          setOpen={setEnquiriesOpen}
          items={enquiriesSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* CMS Section with Nested Structure */}
        {(hasPermission("cms") || hasPermission("master")) && (
        <SidebarGroup>
          <Collapsible open={!isCollapsed && cmsOpen} onOpenChange={setCmsOpen}>
            <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
              <FileText className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-2">CMS</span>
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${cmsOpen ? "rotate-90" : ""}`} />
                </>
              )}
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="ml-4 mt-1 space-y-1">
                {cmsSection.filter((section) => (section.title === "Master" ? hasPermission("master") : hasPermission("cms"))).map((section) => {
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
                  } else if (section.title === "Customisation") {
                    sectionOpen = customisationOpen;
                    setSectionOpen = setCustomisationOpen;
                  } else if (section.title === "Sustainability") {
                    sectionOpen = sustainabilityOpen;
                    setSectionOpen = setSustainabilityOpen;
                  } else if (section.title === "FAQ") {
                    sectionOpen = faqOpen;
                    setSectionOpen = setFaqOpen;
                  } else if (section.title === "Contact") {
                    sectionOpen = contactOpen;
                    setSectionOpen = setContactOpen;
                  } else if (section.title === "Login/Register") {
                    sectionOpen = loginRegisterOpen;
                    setSectionOpen = setLoginRegisterOpen;
                  } else if (section.title === "Auth") {
                    sectionOpen = authOpen;
                    setSectionOpen = setAuthOpen;
                  } else if (section.title === "Ergonomics") {
                    sectionOpen = ergonomicOpen;
                    setSectionOpen = setErgonomicOpen;
                  } else if (section.title === "Master") {
                    sectionOpen = masterOpen;
                    setSectionOpen = setMasterOpen;
                  }

                  return (
                    <NestedSection
                      key={section.title}
                      title={section.title}
                      icon={section.icon}
                      open={sectionOpen}
                      setOpen={setSectionOpen}
                      items={section.subItems}
                    />
                  );
                })}
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarGroup>
        )}

        {/* Projects */}
        {hasPermission("projects") && (
        <SidebarCollapsibleSection
          title="Projects"
          icon={Briefcase}
          open={projectsOpen}
          setOpen={setProjectsOpen}
          items={projectsSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Blog Section */}
        {hasPermission("blog") && (
        <SidebarCollapsibleSection
          title="Blog"
          icon={BookOpen}
          open={blogOpen}
          setOpen={setBlogOpen}
          items={blogsSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* News */}
        {hasPermission("news") && (
        <SidebarCollapsibleSection
          title="News"
          icon={Newspaper}
          open={newsOpen}
          setOpen={setNewsOpen}
          items={newsSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Landing Pages */}
        {hasPermission("landing_pages") && (
         <SidebarCollapsibleSection
          title="Landing Pages"
          icon={Layers}
          open={landingPagesOpen}
          setOpen={setLandingPagesOpen}
          items={landingPagesSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Coupons */}
        {hasPermission("coupons") && (
        <SidebarCollapsibleSection
          title="Coupons"
          icon={Tags}
          open={couponsOpen}
          setOpen={setCouponsOpen}
          items={couponsSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Settings */}
        {hasPermission("settings") && (
        <SidebarCollapsibleSection
          title="Settings & Content"
          icon={Settings}
          open={commonOpen}
          setOpen={setCommonOpen}
          items={commonSection}
          isCollapsed={isCollapsed}        />
        )}

        {/* Policies */}
        {hasPermission("policies") && (
        <SidebarGroup>
          <Collapsible open={!isCollapsed && policiesOpen} onOpenChange={setPoliciesOpen}>
            <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
              <ShieldCheck className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="ml-2">Policies</span>
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${policiesOpen ? "rotate-90" : ""}`} />
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
                />

                <NestedSection
                  title="Terms & Conditions"
                  icon={ScrollText}
                  open={termsOpen}
                  setOpen={setTermsOpen}
                  items={policiesSection[1].subItems}
                />

                <NestedSection
                  title="Warranty Policy"
                  icon={Award}
                  open={warrantyOpen}
                  setOpen={setWarrantyOpen}
                  items={policiesSection[2].subItems}
                />

                <NestedSection
                  title="Return Policy"
                  icon={RotateCcw}
                  open={returnPolicyOpen}
                  setOpen={setReturnPolicyOpen}
                  items={policiesSection[3].subItems}
                />
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

/**
 * Nested Section Component (for Home, FAQ, Contact under CMS)
 */
function NestedSection({ title, icon: Icon, open, setOpen, items }: any) {
  const location = useLocation();
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center w-full p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
        <Icon className="h-4 w-4" />
        <span className="ml-2">{title}</span>
        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${open ? "rotate-90" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6 mt-1 space-y-1">
        <SidebarMenu>
          {items.map((item: any) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm" isActive={location.pathname === item.url} className="data-[active=true]:!text-sidebar-primary">
                <NavLink to={item.url}>
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
 * Reusable Sidebar Section Component
 */
function SidebarCollapsibleSection({ title, icon: Icon, open, setOpen, items, isCollapsed }: any) {
  const location = useLocation();
  return (
    <SidebarGroup>
      <Collapsible open={!isCollapsed && open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md">
          <Icon className="h-4 w-4" />
          {!isCollapsed && (
            <>
              <span className="ml-2">{title}</span>
              <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${open ? "rotate-90" : ""}`} />
            </>
          )}
        </CollapsibleTrigger>
        {!isCollapsed && (
          <CollapsibleContent className="ml-6 mt-1 space-y-1">
            <SidebarMenu>
              {items.map((item: any) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" isActive={location.pathname === item.url} className="data-[active=true]:!text-sidebar-primary">
                    <NavLink to={item.url}>
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
