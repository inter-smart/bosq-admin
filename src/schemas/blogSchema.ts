import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const blogCmsSchema = z.object({
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  media_desktop_path: commonValidations.fileUpload,
  media_mobile_path: commonValidations.fileUpload,
  media_alt: commonValidations.optionalString("Media Alt Text"),
});

export const blogSchema = z.object({
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  media_desktop_path: commonValidations.fileUpload,
  media_mobile_path: commonValidations.fileUpload,
  media_alt: commonValidations.requiredString("Media Alt Text"),
  thumbnail: commonValidations.fileUpload.optional(),
  thumbnail_alt: commonValidations.optionalString("Thumbnail Alt Text"),
  published_date: z.string().min(1, "Published date is required"),
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type BlogCmsFormData = z.infer<typeof blogCmsSchema>;
export type BlogFormData = z.infer<typeof blogSchema>;
