import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";
import { isReservedSlug } from "@/constants/reservedSlugs";

export const landingPageSchema = z.object({
  // English fields
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  button_label: commonValidations.optionalString("Button Label"),
  link: commonValidations.optionalString("Link"),
  slug: commonValidations.slug.refine((slug) => !isReservedSlug(slug), {
    message: "This slug is reserved for an existing site page — choose a different one.",
  }),
  media_alt: commonValidations.optionalString("Media Alt Text"),

  // Arabic fields
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  button_label_ar: commonValidations.optionalString("Button Label (Arabic)"),
  media_alt_ar: commonValidations.optionalString("Media Alt Text (Arabic)"),

  // File uploads
  media_desktop_path:commonValidations.validateFileUpload("Desktop Image"),
  media_mobile_path:commonValidations.validateFileUpload("Mobile Image"),

  // Form Section
  form_title: commonValidations.optionalString("Form Title"),
  form_title_ar: commonValidations.optionalString("Form Title (Arabic)"),
  form_description: commonValidations.optionalString("Form Description"),
  form_description_ar: commonValidations.optionalString("Form Description (Arabic)"),
  form_media_path: commonValidations.fileUpload,
  form_media_alt: commonValidations.optionalString("Form Media Alt Text"),
  form_media_alt_ar: commonValidations.optionalString("Form Media Alt Text (Arabic)"),

  // SEO Meta
  meta_title: commonValidations.optionalString("Meta Title"),
  meta_description: commonValidations.optionalString("Meta Description"),
  meta_keywords: commonValidations.optionalString("Meta Keywords"),
  other_meta: commonValidations.optionalString("Other Meta"),
  meta_title_ar: commonValidations.optionalString("Meta Title (Arabic)"),
  meta_description_ar: commonValidations.optionalString("Meta Description (Arabic)"),
  meta_keywords_ar: commonValidations.optionalString("Meta Keywords (Arabic)"),
  other_meta_ar: commonValidations.optionalString("Other Meta (Arabic)"),

  // Settings
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
  show_in_footer: z.boolean(),
});

export type LandingPageFormData = z.infer<typeof landingPageSchema>;
