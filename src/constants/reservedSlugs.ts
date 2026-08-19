/**
 * Top-level static route segments already used by the bosq storefront
 * (bosq/src/app/[locale]/...). Landing pages are served at the site root
 * (bosq.ae/<slug>), so a landing page slug that matches one of these names
 * would always resolve to the existing static page instead — the landing
 * page would be created but never reachable.
 *
 * Keep this list in sync with the folder names under every route group in
 * bosq/src/app/[locale] ((public), (public)/(shop), (public)/(legal), (auth)).
 */
export const RESERVED_SLUGS = [
  "about",
  "account",
  "blogs",
  "cart",
  "checkout",
  "contact",
  "create-password",
  "customization",
  "delivery-policy",
  "ergonomic-chair-guide",
  "faqs",
  "forgot-password",
  "login",
  "material-guide",
  "news",
  "order",
  "otp-submission",
  "privacy-policy",
  "products",
  "projects",
  "return-policy",
  "search-results",
  "signup",
  "sustainability",
  "terms-and-conditions",
  "warranty-policy",
] as const;

export const isReservedSlug = (slug: string) =>
  RESERVED_SLUGS.includes(slug?.toLowerCase().trim() as (typeof RESERVED_SLUGS)[number]);
