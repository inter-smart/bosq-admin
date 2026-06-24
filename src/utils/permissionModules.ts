// Maps a route path (or sidebar item) to the backend permission `module` key
// it belongs to. Mirrors the sections in AppSidebar.tsx and the route-level
// `requirePermission(module)` gating in bosq-api. Keep both in sync.
export const PATH_MODULE_RULES: { module: string; prefixes: string[] }[] = [
  { module: "dashboard", prefixes: ["/"] },
  { module: "orders", prefixes: ["/orders"] },
  {
    module: "enquiries",
    prefixes: [
      "/contact-enquiries",
      "/product-enquiries",
      "/customization-enquiries",
      "/lead-generation",
      "/newsletter-subscriptions",
      "/project-enquiries",
    ],
  },
  { module: "master", prefixes: ["/master"] },
  {
    module: "cms",
    prefixes: [
      "/home-cms",
      "/home-banner-slider",
      "/home-brands",
      "/smart-space-calculator",
      "/find-your-fits",
      "/about-cms",
      "/about-journeys",
      "/why-bosq",
      "/about-testimonials",
      "/about-our-clients",
      "/materials-cms",
      "/materials-category",
      "/materials",
      "/extra-materials",
      "/delivery-cms",
      "/delivery-charges",
      "/delivery-time",
      "/delivery-method",
      "/ergonomic-guide-cms",
      "/ergonomic-chair-features",
      "/faq-cms",
      "/faq-category",
      "/faq-list",
      "/contact-cms",
      "/login-register-cms",
      "/auth-cms",
      "/customization-cms",
      "/customization-features",
      "/customization-process",
      "/customization-options",
      "/sustainability-cms",
      "/sustainability",
    ],
  },
  {
    module: "products",
    prefixes: [
      "/product-categories",
      "/product-attributes",
      "/product-sectors",
      "/product-selling-points",
      "/base-products",
      "/product-models",
      "/product-variants",
      "/product-faqs",
      "/product-bulk-upload",
      "/product-bulk-image-upload",
      "/product-variant-images",
      "/product-project-images",
    ],
  },
  { module: "projects", prefixes: ["/projects-cms", "/project-category", "/projects"] },
  { module: "blog", prefixes: ["/blog-cms", "/blogs"] },
  { module: "news", prefixes: ["/news-cms", "/news"] },
  { module: "landing_pages", prefixes: ["/landing-page", "/product-types"] },
  {
    module: "settings",
    prefixes: ["/site-settings", "/social-media", "/payment-methods", "/meta-tags", "/mailer-settings"],
  },
  { module: "users", prefixes: ["/users"] },
  { module: "coupons", prefixes: ["/coupons"] },
  {
    module: "policies",
    prefixes: [
      "/privacy-policy-cms",
      "/privacy-policy",
      "/terms-and-conditions-cms",
      "/terms-and-conditions-faq",
      "/warranty-policy",
      "/return-policy-cms",
      "/return-policy",
    ],
  },
];

// Resolves which permission module a given route path belongs to.
// Routes not matched here (e.g. the new Admin Access pages) are super-admin only.
export function getModuleForPath(pathname: string): string | undefined {
  if (pathname === "/") return "dashboard";

  const match = PATH_MODULE_RULES.filter((rule) => rule.module !== "dashboard").find((rule) =>
    rule.prefixes.some((prefix) => pathname.startsWith(prefix)),
  );

  return match?.module;
}
