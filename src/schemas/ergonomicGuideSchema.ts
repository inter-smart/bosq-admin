import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const ergonomicGuideSchema = z.object({
  // Basic Content (Bilingual)
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredText("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),

  // Media Section
  media_desktop_path: commonValidations.validateFileUpload("Desktop Media"),
  media_mobile_path: commonValidations.validateFileUpload("Mobile Media"),
  media_alt: commonValidations.requiredText("Media Alt Text"),
  media_alt_ar: commonValidations.requiredText("Media Alt Text (Arabic)"),
  media_type: z.enum(["image", "video"]).default("image").nullable(),
});


export const ergonomicFeatureSchema = z.object({
  // Basic Content (Bilingual)
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredText("Title (Arabic)"),

  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),

  // Media Section (Single Image)
  media_path: commonValidations.validateFileUpload("Feature Image"),

  media_alt: commonValidations.requiredString("Media Alt Text"),
  media_alt_ar: commonValidations.requiredString("Media Alt Text (Arabic)"),

  // Settings
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});



export type ErgonomicGuideFormData = z.infer<typeof ergonomicGuideSchema>;

export type ErgonomicFeatureFormData = z.infer<
typeof ergonomicFeatureSchema
>;

