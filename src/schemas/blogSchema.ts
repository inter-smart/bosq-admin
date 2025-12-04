import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const blogCmsSchema = z.object({
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  media_desktop_path: commonValidations.validateFileUpload("Desktop media"),
  media_mobile_path: commonValidations.validateFileUpload("Mobile media"),
  media_alt: commonValidations.optionalString("Media Alt Text"),
});

export const blogSchema = z.object({
  // English fields
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  media_alt: commonValidations.requiredString("Media Alt Text"),
  thumbnail_alt: commonValidations.optionalString("Thumbnail Alt Text"),

  // Arabic fields
  title_ar: commonValidations.requiredString("Arabic Title"),
  description_ar: commonValidations.requiredString("Arabic Description"),
  media_alt_ar: commonValidations.requiredString("Arabic Media Alt Text"),
  thumbnail_alt_ar: commonValidations.optionalString("Arabic Thumbnail Alt Text"),

  // File uploads
  media_desktop_path: commonValidations.validateImageUpload("Desktop image"),
  media_mobile_path: commonValidations.validateImageUpload("Mobile image"),
  thumbnail: commonValidations.validateImageUpload("Thumbnail image"),

  // Other fields
  published_date: z.string().min(1, "Published date is required"),
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type BlogCmsFormData = z.infer<typeof blogCmsSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
