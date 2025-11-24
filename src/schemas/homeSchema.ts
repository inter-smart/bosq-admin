import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";


export const homeSchema = z.object({
  // About Section
  about_media_path: commonValidations.fileUpload,
  about_media_alt: commonValidations.optionalString("About Media Alt Text"),
  about_title: commonValidations.requiredString("About Title"),
  about_description: commonValidations.requiredText("About Description"),

  // FEATURED PRODUCTS
  featured_title: commonValidations.requiredString("Featured Title"),

  // JOURNEY SECTION
  journy_title: commonValidations.requiredString("Journey Title"),
  journy_description: commonValidations.requiredText("Journey Description"),
  journey_media_type: commonValidations.requiredString("Media Type"),
  journy_media_path: commonValidations.fileUpload,
  journy_media_alt: commonValidations.optionalString("Journey Media Alt Text"),

  // PROJECT SECTION
  project_title: commonValidations.requiredString("Project Title"),

  // CALCULATOR SECTION
  calculator_title: commonValidations.requiredString("Calculator Title"),
  calculator_description: commonValidations.requiredText(
    "Calculator Description"
  ),
  calculator_media_path: commonValidations.fileUpload,
  calculator_media_alt: commonValidations.optionalString(
    "Calculator Media Alt Text"
  ),

  // CUSTOMIZE SECTION
  customize_title: commonValidations.requiredString("Customize Title"),
  customize_description: commonValidations.requiredText(
    "Customize Description"
  ),
  customize_media_path: commonValidations.fileUpload,
  customize_media_alt: commonValidations.optionalString(
    "Customize Media Alt Text"
  ),

  // FITS SECTION
  fits_title: commonValidations.requiredString("Fits Title"),
  fits_description: commonValidations.requiredText("Fits Description"),

  // BRANDS SECTION
  brands_title: commonValidations.requiredString("Brands Title"),

  // FORM SECTION
  form_title: commonValidations.requiredString("Form Title"),
  form_description: commonValidations.requiredText("Form Description"),
  form_media_path: commonValidations.fileUpload,
  form_media_alt: commonValidations.requiredString("Form Media Alt Text"),
});



export const homeBannerSchema = z.object({
  // Required string fields
  title: commonValidations.requiredString("Title"),

  // Optional string fields (backend allows empty strings)
  description: commonValidations.requiredText("Description"),

  link: commonValidations.requiredString("Link"),

  button_text: commonValidations.requiredString("Button Text"),

  media_alt:commonValidations.optionalString("Media Alt Text"),

  // File uploads
  media_desktop_path: commonValidations.fileUpload.optional(),
  media_mobile_path: commonValidations.fileUpload.optional(),

  // Sort order + status
  sort_order: commonValidations.sortOrder,
  status: commonValidations.booleanStatus,
});





export type HomeBannerFormData = z.infer<typeof homeBannerSchema>;
export type HomeCmsFormData = z.infer<typeof homeSchema>;