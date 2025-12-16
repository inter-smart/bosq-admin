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
