import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";


export const homeSchema = z.object({
  // About Section
  about_media_path: commonValidations.requiredFileUpload,
  about_media_alt: commonValidations.requiredString("About Media Alt Text"),
  about_media_alt_ar: commonValidations.requiredString("About Media Alt Text (Arabic)"),
  about_title: commonValidations.requiredString("About Title"),
  about_title_ar: commonValidations.requiredString("About Title (Arabic)"),
  about_description: commonValidations.requiredText("About Description"),
  about_description_ar: commonValidations.requiredString("About Description (Arabic)"),

  // FEATURED PRODUCTS
  featured_title: commonValidations.requiredString("Featured Title"),
  featured_title_ar: commonValidations.requiredString("Featured Title (Arabic)"),

  // JOURNEY SECTION
  journy_title: commonValidations.requiredString("Journey Title"),
  journy_title_ar: commonValidations.requiredString("Journey Title (Arabic)"),
  journy_description: commonValidations.requiredText("Journey Description"),
  journy_description_ar: commonValidations.requiredString("Journey Description (Arabic)"),
  journey_media_type: commonValidations.requiredString("Media Type"),
  journy_media_path: commonValidations.requiredFileUpload,
  journy_media_alt: commonValidations.requiredString("Journey Media Alt Text"),
  journy_media_alt_ar: commonValidations.requiredString("Journey Media Alt Text (Arabic)"),

  // PROJECT SECTION
  project_title: commonValidations.requiredString("Project Title"),
  project_title_ar: commonValidations.requiredString("Project Title (Arabic)"),

  // CALCULATOR SECTION
  calculator_title: commonValidations.requiredString("Calculator Title"),
  calculator_title_ar: commonValidations.requiredString("Calculator Title (Arabic)"),
  calculator_description: commonValidations.requiredText(
    "Calculator Description"
  ),
  calculator_description_ar: commonValidations.requiredString("Calculator Description (Arabic)"),
  calculator_media_path: commonValidations.requiredFileUpload,
  calculator_media_alt: commonValidations.requiredString(
    "Calculator Media Alt Text"
  ),
  calculator_media_alt_ar: commonValidations.requiredString("Calculator Media Alt Text (Arabic)"),

  // CUSTOMIZE SECTION
  customize_title: commonValidations.requiredString("Customize Title"),
  customize_title_ar: commonValidations.requiredString("Customize Title (Arabic)"),
  customize_description: commonValidations.requiredText(
    "Customize Description"
  ),
  customize_description_ar: commonValidations.requiredString("Customize Description (Arabic)"),
  customize_media_path: commonValidations.requiredFileUpload,
  customize_media_alt: commonValidations.requiredString(
    "Customize Media Alt Text"
  ),
  customize_media_alt_ar: commonValidations.requiredString("Customize Media Alt Text (Arabic)"),

  // FITS SECTION
  fits_title: commonValidations.requiredString("Fits Title"),
  fits_title_ar: commonValidations.requiredString("Fits Title (Arabic)"),
  fits_description: commonValidations.requiredText("Fits Description"),
  fits_description_ar: commonValidations.requiredString("Fits Description (Arabic)"),

  // BRANDS SECTION
  brands_title: commonValidations.requiredString("Brands Title"),
  brands_title_ar: commonValidations.requiredString("Brands Title (Arabic)"),

  // FORM SECTION
  form_title: commonValidations.requiredString("Form Title"),
  form_title_ar: commonValidations.requiredString("Form Title (Arabic)"),
  form_description: commonValidations.requiredText("Form Description"),
  form_description_ar: commonValidations.requiredString("Form Description (Arabic)"),
  form_media_path: commonValidations.requiredFileUpload,
  form_media_alt: commonValidations.requiredString("Form Media Alt Text"),
  form_media_alt_ar: commonValidations.requiredString("Form Media Alt Text (Arabic)"),
});



export const homeBannerSchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  link: commonValidations.requiredString("Link"),
  button_text: commonValidations.requiredString("Button Text"),
  media_alt: commonValidations.requiredString("Media Alt Text"),

  // Arabic fields (optional)
  title_ar: commonValidations.requiredString("Arabic Title"),
  description_ar: commonValidations.requiredString("Arabic Description"),
  button_text_ar: commonValidations.requiredString("Arabic Button Text"),
  media_alt_ar: commonValidations.requiredString("Arabic Media Alt Text"),

  // File uploads
  media_desktop_path: commonValidations.requiredFileUpload,
  media_mobile_path: commonValidations.requiredFileUpload,

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});





export type HomeBannerFormData = z.infer<typeof homeBannerSchema>;
export type HomeCmsFormData = z.infer<typeof homeSchema>;