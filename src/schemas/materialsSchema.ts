import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const materialsCmsSchema = z.object({
  // Page Title Section
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredString("Banner Title (Arabic)"),
  banner_media_desktop_path: commonValidations.validateFileUpload("Banner Desktop Media"),
  banner_media_mobile_path: commonValidations.validateFileUpload("Banner Mobile Media"),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString("Banner Media Alt Text (Arabic)"),
});


// Material Category Schema
export const materialsCategorySchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});


// Materials Item Schema
export const materialsItemSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  category: commonValidations.requiredNumber(""),
  media_path: commonValidations.validateFileUpload("Main Image"),
  media_alt: commonValidations.requiredString("Media Alt Text"),
  media_alt_ar: commonValidations.requiredString("Media Alt Text (Arabic)"),
  icon_path: commonValidations.fileUpload,
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});


// Extra Materials Item Schema
export const extraMaterialsItemSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  media_path: commonValidations.validateFileUpload("Main Image"),
  media_alt: commonValidations.requiredString("Media Alt Text"),
  media_alt_ar: commonValidations.requiredString("Media Alt Text (Arabic)"),
  icon_path: commonValidations.fileUpload,
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type MaterialsCmsFormData = z.infer<typeof materialsCmsSchema>;
export type MaterialsCategoryFormData = z.infer<typeof materialsCategorySchema>;
export type MaterialsItemFormData = z.infer<typeof materialsItemSchema>;
export type ExtraMaterialsItemFormData = z.infer<typeof extraMaterialsItemSchema>;
