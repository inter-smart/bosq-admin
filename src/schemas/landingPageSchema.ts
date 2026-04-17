import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const landingPageSchema = z.object({
  // English fields
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  button_label: commonValidations.optionalString("Button Label"),
  link: commonValidations.optionalString("Link"),
  slug: commonValidations.slug,
  media_alt: commonValidations.optionalString("Media Alt Text"),

  // Arabic fields
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  button_label_ar: commonValidations.optionalString("Button Label (Arabic)"),
  media_alt_ar: commonValidations.optionalString("Media Alt Text (Arabic)"),

  // File uploads
  media_desktop_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  media_mobile_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),

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
});

export type LandingPageFormData = z.infer<typeof landingPageSchema>;
