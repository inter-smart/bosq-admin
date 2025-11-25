import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";


export const homeSchema = z.object({
  // About Section
  about_media_path: commonValidations.fileUpload,
  about_media_alt: commonValidations.optionalString("About Media Alt Text"),
  about_media_alt_ar: commonValidations.optionalString("About Media Alt Text (Arabic)"),
  about_title: commonValidations.requiredString("About Title"),
  about_title_ar: commonValidations.optionalString("About Title (Arabic)"),
  about_description: commonValidations.requiredText("About Description"),
  about_description_ar: commonValidations.optionalString("About Description (Arabic)"),

  // FEATURED PRODUCTS
  featured_title: commonValidations.requiredString("Featured Title"),
  featured_title_ar: commonValidations.optionalString("Featured Title (Arabic)"),

  // JOURNEY SECTION
  journy_title: commonValidations.requiredString("Journey Title"),
  journy_title_ar: commonValidations.optionalString("Journey Title (Arabic)"),
  journy_description: commonValidations.requiredText("Journey Description"),
  journy_description_ar: commonValidations.optionalString("Journey Description (Arabic)"),
  journey_media_type: commonValidations.requiredString("Media Type"),
  journy_media_path: commonValidations.fileUpload,
  journy_media_alt: commonValidations.optionalString("Journey Media Alt Text"),
  journy_media_alt_ar: commonValidations.optionalString("Journey Media Alt Text (Arabic)"),

  // PROJECT SECTION
  project_title: commonValidations.requiredString("Project Title"),
  project_title_ar: commonValidations.optionalString("Project Title (Arabic)"),

  // CALCULATOR SECTION
  calculator_title: commonValidations.requiredString("Calculator Title"),
  calculator_title_ar: commonValidations.optionalString("Calculator Title (Arabic)"),
  calculator_description: commonValidations.requiredText(
    "Calculator Description"
  ),
  calculator_description_ar: commonValidations.optionalString("Calculator Description (Arabic)"),
  calculator_media_path: commonValidations.fileUpload,
  calculator_media_alt: commonValidations.optionalString(
    "Calculator Media Alt Text"
  ),
  calculator_media_alt_ar: commonValidations.optionalString("Calculator Media Alt Text (Arabic)"),

  // CUSTOMIZE SECTION
  customize_title: commonValidations.requiredString("Customize Title"),
  customize_title_ar: commonValidations.optionalString("Customize Title (Arabic)"),
  customize_description: commonValidations.requiredText(
    "Customize Description"
  ),
  customize_description_ar: commonValidations.optionalString("Customize Description (Arabic)"),
  customize_media_path: commonValidations.fileUpload,
  customize_media_alt: commonValidations.optionalString(
    "Customize Media Alt Text"
  ),
  customize_media_alt_ar: commonValidations.optionalString("Customize Media Alt Text (Arabic)"),

  // FITS SECTION
  fits_title: commonValidations.requiredString("Fits Title"),
  fits_title_ar: commonValidations.optionalString("Fits Title (Arabic)"),
  fits_description: commonValidations.requiredText("Fits Description"),
  fits_description_ar: commonValidations.optionalString("Fits Description (Arabic)"),

  // BRANDS SECTION
  brands_title: commonValidations.requiredString("Brands Title"),
  brands_title_ar: commonValidations.optionalString("Brands Title (Arabic)"),

  // FORM SECTION
  form_title: commonValidations.requiredString("Form Title"),
  form_title_ar: commonValidations.optionalString("Form Title (Arabic)"),
  form_description: commonValidations.requiredText("Form Description"),
  form_description_ar: commonValidations.optionalString("Form Description (Arabic)"),
  form_media_path: commonValidations.fileUpload,
  form_media_alt: commonValidations.requiredString("Form Media Alt Text"),
  form_media_alt_ar: commonValidations.optionalString("Form Media Alt Text (Arabic)"),
});



export const homeBannerSchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  link: commonValidations.requiredString("Link"),
  button_text: commonValidations.requiredString("Button Text"),
  media_alt: commonValidations.optionalString("Media Alt Text"),

  // Arabic fields (optional)
  title_ar: commonValidations.optionalString("Arabic Title"),
  description_ar: commonValidations.optionalString("Arabic Description"),
  button_text_ar: commonValidations.optionalString("Arabic Button Text"),
  media_alt_ar: commonValidations.optionalString("Arabic Media Alt Text"),

  // File uploads
  media_desktop_path: commonValidations.fileUpload.optional(),
  media_mobile_path: commonValidations.fileUpload.optional(),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});





export type HomeBannerFormData = z.infer<typeof homeBannerSchema>;
export type HomeCmsFormData = z.infer<typeof homeSchema>;