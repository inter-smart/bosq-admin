import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const newsCmsSchema = z.object({
  // English fields
  title: commonValidations.requiredString("Title"),
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_description: commonValidations.requiredText("Banner Description"),
  media_alt: commonValidations.optionalString("Media Alt Text"),
  popular_news_title: commonValidations.requiredString("Popular News Title"),
  related_news_title: commonValidations.requiredString("Related News Title"),

  // Arabic fields
  title_ar: commonValidations.requiredString("Arabic Title"),
  banner_title_ar: commonValidations.requiredString("Arabic Banner Title"),
  banner_description_ar: commonValidations.requiredText(
    "Arabic Banner Description"
  ),
  media_alt_ar: commonValidations.optionalString("Arabic Media Alt Text"),
  popular_news_title_ar: commonValidations.requiredString(
    "Arabic Popular News Title"
  ),
  related_news_title_ar: commonValidations.requiredString(
    "Arabic Related News Title"
  ),

  // File uploads (no Arabic versions needed)
  media_desktop_path: commonValidations.validateFileUpload("Desktop media"),
  media_mobile_path: commonValidations.validateFileUpload("Mobile media"),
});

export const newsSchema = z.object({
  // English fields
  title: commonValidations.requiredString("Title"),
  name: commonValidations.requiredString("Name"),
  meta_title: commonValidations.requiredString("Meta Title"),
  meta_description: commonValidations.requiredText("Meta Description"),
  meta_keywords: commonValidations.requiredString("Meta Keywords"),
  description: commonValidations.requiredText("Description"),
  media_alt: commonValidations.optionalString("Media Alt Text"),
  thumbnail_alt: commonValidations.optionalString("Thumbnail Alt Text"),
  slug: commonValidations.requiredString("Slug"),

  // Arabic fields
  title_ar: commonValidations.requiredString("Arabic Title"),
  name_ar: commonValidations.requiredString("Arabic Name"),
  description_ar: commonValidations.requiredText("Arabic Description"),
  meta_title_ar: commonValidations.requiredString("Arabic Meta Title"),
  meta_description_ar: commonValidations.requiredText(
    "Arabic Meta Description"
  ),
  meta_keywords_ar: commonValidations.requiredString("Arabic Meta Keywords"),
  media_alt_ar: commonValidations.optionalString("Arabic Media Alt Text"),
  thumbnail_alt_ar: commonValidations.optionalString(
    "Arabic Thumbnail Alt Text"
  ),

  // File uploads
  media_desktop_path: commonValidations.validateImageUpload("Desktop image"),
  media_mobile_path: commonValidations.validateImageUpload("Mobile image"),
  thumbnail: commonValidations.validateImageUpload("Thumbnail image"),

  // Other fields
  published_date: z.string().min(1, "Published date is required"),
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type NewsCmsFormData = z.infer<typeof newsCmsSchema>;
export type NewsFormData = z.infer<typeof newsSchema>;
