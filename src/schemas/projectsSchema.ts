import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const projectsCmsSchema = z.object({
  // Page Title Section
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredText("Title (Arabic)"),

  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredText("Banner Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),

  // Banner Media Section
  media_desktop_path: commonValidations.validateFileUpload("Desktop Banner"),
  media_mobile_path: commonValidations.validateFileUpload("Mobile Banner"),
  media_alt: commonValidations.requiredText("Media Alt Text"),
  media_alt_ar: commonValidations.requiredText("Media Alt Text (Arabic)"),
  media_type: z.enum(["image", "video"]).default("image"),

  // Form Section
  form_title: commonValidations.requiredString("Form Title"),
  form_title_ar: commonValidations.requiredText("Form Title (Arabic)"),
  form_description: commonValidations.requiredText("Form Description"),
  form_description_ar: commonValidations.requiredText("Form Description (Arabic)"),

  // Form Media Section
  form_media_path: commonValidations.validateFileUpload("Form Image"),
  form_media_alt: commonValidations.requiredText("Form Media Alt Text"),
  form_media_alt_ar: commonValidations.requiredText("Form Media Alt Text (Arabic)"),
});

export type ProjectsCmsFormData = z.infer<typeof projectsCmsSchema>;

export const projectCategorySchema = z.object({
  name: commonValidations.requiredString("Name"),
  name_ar: commonValidations.requiredString("Name (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProjectCategoryFormData = z.infer<typeof projectCategorySchema>;

export const projectSchema = z.object({
  // Category relationship
  category_id: z.number().optional().nullable(),

  // Basic content (bilingual)
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),

  // Thumbnail
  thumbnail: commonValidations.validateFileUpload("Thumbnail"),

  // Section 1 - Hero Media
  section1_desktop_media_path: commonValidations.validateFileUpload("Section 1 Desktop Media"),
  section1_mobile_media_path: commonValidations.validateFileUpload("Section 1 Mobile Media"),
  section1_media_alt: commonValidations.requiredString("Section 1 Media Alt"),
  section1_media_alt_ar: commonValidations.requiredString("Section 1 Media Alt (Arabic)"),

  // Section 3 - Content Block
  section3_title: commonValidations.requiredString("Section 3 Title"),
  section3_title_ar: commonValidations.requiredString("Section 3 Title (Arabic)"),
  section3_description: commonValidations.requiredText("Section 3 Description"),
  section3_description_ar: commonValidations.requiredText("Section 3 Description (Arabic)"),
  section3_media_path: commonValidations.validateFileUpload("Section 3 Media"),
  section3_media_alt: commonValidations.requiredString("Section 3 Media Alt"),
  section3_media_alt_ar: commonValidations.requiredString("Section 3 Media Alt (Arabic)"),

  // Section 4
  section4_title: commonValidations.requiredString("Section 4 Title"),
  section4_title_ar: commonValidations.requiredString("Section 4 Title (Arabic)"),

  // SEO & Slug
  slug: commonValidations.requiredString("Slug"),
  meta_title: commonValidations.requiredString("Meta Title"),
  meta_description: commonValidations.requiredText("Meta Description"),
  meta_keywords: commonValidations.requiredString("Meta Keywords"),
  meta_title_ar: commonValidations.requiredString("Meta Title (Arabic)"),
  meta_description_ar: commonValidations.requiredText("Meta Description (Arabic)"),
  meta_keywords_ar: commonValidations.requiredString("Meta Keywords (Arabic)"),

  // JSONB Arrays - validate as arrays of strings
  tags: z.array(z.string()).min(1, "At least one tag is required").default([]),
  tags_ar: z.array(z.string()).min(1, "At least one Arabic tag is required").default([]),
  // JSONB Objects - validate as key-value pairs (Record<string, string>)
  features: z.record(z.string(), z.string()).refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one feature key-value pair is required",
  }).default({}),
  features_ar: z.record(z.string(), z.string()).refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one Arabic feature key-value pair is required",
  }).default({}),

  // Settings
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
  show_in_home: z.boolean()
});

export type ProjectFormData = z.infer<typeof projectSchema>;
