import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const customizationCmsSchema = z.object({
  // Page Title Fields
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Arabic Title"),

  // Banner Section Fields
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredString("Arabic Banner Title"),
  banner_description: commonValidations.requiredText("Banner Description"),
  banner_description_ar: commonValidations.requiredText("Arabic Banner Description"),
  banner_media_type: commonValidations.requiredString("Media Type"),
  banner_media_desktop_path: commonValidations.validateFileUpload("Banner Desktop Media"),
  banner_media_mobile_path: commonValidations.validateFileUpload("Banner Mobile Media"),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString("Arabic Banner Media Alt Text"),

  // Process Section Fields
  process_title: commonValidations.requiredString("Process Title"),
  process_title_ar: commonValidations.requiredString("Arabic Process Title"),
  process_description: commonValidations.requiredText("Process Description"),
  process_description_ar: commonValidations.requiredText("Arabic Process Description"),
  process_media_path: commonValidations.validateFileUpload("Process Media"),
  process_media_alt: commonValidations.requiredString("Process Media Alt Text"),
  process_media_alt_ar: commonValidations.requiredString("Arabic Process Media Alt Text"),

  // Options Section Fields
  options_title: commonValidations.requiredString("Options Title"),
  options_title_ar: commonValidations.requiredString("Arabic Options Title"),
  options_description: commonValidations.requiredText("Options Description"),
  options_description_ar: commonValidations.requiredText("Arabic Options Description"),

  // Form Section Fields
  form_title: commonValidations.requiredString("Form Title"),
  form_title_ar: commonValidations.requiredString("Arabic Form Title"),
  form_description: commonValidations.requiredText("Form Description"),
  form_description_ar: commonValidations.requiredText("Arabic Form Description"),
  form_media_path: commonValidations.validateFileUpload("Form Media"),
  form_media_alt: commonValidations.requiredString("Form Media Alt Text"),
  form_media_alt_ar: commonValidations.requiredString("Arabic Form Media Alt Text"),
});

export const customizationFeatureSchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title is required"),
  description: commonValidations.requiredText("Description is required"),

  // Arabic fields (required)
  title_ar: commonValidations.requiredString("Arabic Title is required"),
  description_ar: commonValidations.requiredText("Arabic Description is required"),

  // Media fields
  media_path: commonValidations.validateFileUpload("Image is required"),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export const customizationProcessSchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title is required"),
  description: commonValidations.requiredText("Description is required"),

  // Arabic fields (required)
  title_ar: commonValidations.requiredString("Arabic Title is required"),
  description_ar: commonValidations.requiredText("Arabic Description is required"),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type CustomizationCmsFormData = z.infer<typeof customizationCmsSchema>;
export type CustomizationFeatureFormData = z.infer<typeof customizationFeatureSchema>;
export type CustomizationProcessFormData = z.infer<typeof customizationProcessSchema>;
