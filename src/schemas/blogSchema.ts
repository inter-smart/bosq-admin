import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const blogCmsSchema = z.object({
  // English fields
  title: commonValidations.requiredString("Title"),
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_description: commonValidations.requiredText("Banner Description"),
  media_alt: commonValidations.requiredString("Media Alt Text"),
  popular_blogs_title: commonValidations.requiredString("Popular Blogs Title"),
  related_blogs_title: commonValidations.requiredString("Related Blogs Title"),

  // Arabic fields
  title_ar: commonValidations.requiredString("Arabic Title"),
  banner_title_ar: commonValidations.requiredString("Arabic Banner Title"),
  banner_description_ar: commonValidations.requiredText(
    "Arabic Banner Description"
  ),
  media_alt_ar: commonValidations.requiredString("Arabic Media Alt Text"),
  popular_blogs_title_ar: commonValidations.requiredString(
    "Arabic Popular Blogs Title"
  ),
  related_blogs_title_ar: commonValidations.requiredString(
    "Arabic Related Blogs Title"
  ),

  // File uploads
  media_desktop_path: commonValidations.validateFileUpload("Desktop media"),
  media_mobile_path: commonValidations.validateFileUpload("Mobile media"),
  media_desktop_path_ar: commonValidations.validateFileUpload("Desktop media (Arabic)"),
  media_mobile_path_ar: commonValidations.validateFileUpload("Mobile media (Arabic)"),
});

export const blogSchema = z.object({
  // English fields
  title: commonValidations.requiredString("Title"),
  meta_title: commonValidations.optionalString("Meta Title"),
  meta_description: commonValidations.optionalString("Meta Description"),
  meta_keywords: commonValidations.optionalString("Meta Keywords"),
  other_meta: commonValidations.optionalString("Other Meta"),
  description: commonValidations.requiredText("Description"),
  media_alt: commonValidations.optionalString("Media Alt Text"),
  thumbnail_alt: commonValidations.optionalString("Thumbnail Alt Text"),
  slug: commonValidations.requiredString("Slug"),

  // Arabic fields
  title_ar: commonValidations.requiredString("Arabic Title"),
  description_ar: commonValidations.requiredText("Arabic Description"),
  meta_title_ar: commonValidations.optionalString("Arabic Meta Title"),
  meta_description_ar: commonValidations.optionalString(
    "Arabic Meta Description"
  ),
  meta_keywords_ar: commonValidations.optionalString("Arabic Meta Keywords"),
  other_meta_ar: commonValidations.optionalString("Arabic Other Meta"),
  media_alt_ar: commonValidations.optionalString("Arabic Media Alt Text"),
  thumbnail_alt_ar: commonValidations.optionalString(
    "Arabic Thumbnail Alt Text"
  ),

  // File uploads
  media_desktop_path: commonValidations.validateImageUpload("Desktop image"),
  media_mobile_path: commonValidations.validateImageUpload("Mobile image"),
  media_desktop_path_ar: commonValidations.validateImageUpload("Desktop image (Arabic)"),
  media_mobile_path_ar: commonValidations.validateImageUpload("Mobile image (Arabic)"),
  thumbnail: commonValidations.validateImageUpload("Thumbnail image"),

  // Other fields
  published_date: z.string().min(1, "Published date is required"),
  status: commonValidations.booleanStatus(),
});

export type BlogCmsFormData = z.infer<typeof blogCmsSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
