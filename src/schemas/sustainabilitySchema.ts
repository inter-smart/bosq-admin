import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const sustainabilityCmsSchema = z.object({
  // Page Title Section
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  // Banner Section
  banner_media_desktop_path: commonValidations.validateFileUpload(
    "Banner Desktop Media"
  ),
  banner_media_mobile_path: commonValidations.validateFileUpload(
    "Banner Mobile Media"
  ),
  banner_media_desktop_path_ar: commonValidations.validateFileUpload(
    "Banner Desktop Media (Arabic)"
  ),
  banner_media_mobile_path_ar: commonValidations.validateFileUpload(
    "Banner Mobile Media (Arabic)"
  ),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString(
    "Banner Media Alt Text (Arabic)"
  ),
  banner_media_type: z.enum(["image", "video"]).optional().nullable(),

  // Section 1
  section1_title: commonValidations.requiredString("Section 1 Title"),
  section1_title_ar: commonValidations.requiredString(
    "Section 1 Title (Arabic)"
  ),
  section1_description: commonValidations.requiredString(
    "Section 1 Description"
  ),
  section1_description_ar: commonValidations.requiredString(
    "Section 1 Description (Arabic)"
  ),
  section1_media_path: commonValidations.validateFileUpload(
    "Section 1 Media"
  ),
  section1_media_alt: commonValidations.requiredString(
    "Section 1 Media Alt Text"
  ),
  section1_media_alt_ar: commonValidations.requiredString(
    "Section 1 Media Alt Text (Arabic)"
  ),
});

export type SustainabilityCmsFormData = z.infer<typeof sustainabilityCmsSchema>;

export const sustainabilityItemSchema = z.object({
  // Content (Bilingual)
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),

  // Bullet Points (stored as JSON array) - Commented out as not needed
  // points: commonValidations.optionalString("Points is required"),
  // points_ar: commonValidations.optionalString("Points (Arabic) is required"),

  // Image 1
  img1_path: commonValidations.validateFileUpload("Image 1"),
  img1_alt: commonValidations.requiredString("Image 1 Alt Text"),
  img1_alt_ar: commonValidations.requiredString("Image 1 Alt Text (Arabic)"),

  // Image 2 - Commented out as not needed
  // img2_path: commonValidations.fileUpload,
  // img2_alt: commonValidations.optionalString("Image 2 Alt Text"),
  // img2_alt_ar: commonValidations.optionalString("Image 2 Alt Text (Arabic)"),

  // Settings
  sort_order: commonValidations.sortOrder(),

  status: commonValidations.booleanStatus(),
});

export type SustainabilityItemFormData = z.infer<
  typeof sustainabilityItemSchema
>;