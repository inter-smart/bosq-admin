import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const homeSchema = z.object({
  // About Section
  about_media_path: commonValidations.validateFileUpload("About Media"),
  about_media_alt: commonValidations.requiredString("About Media Alt Text"),
  about_media_alt_ar: commonValidations.requiredString(
    "About Media Alt Text (Arabic)"
  ),
  about_title: commonValidations.requiredString("About Title"),
  about_title_ar: commonValidations.requiredString("About Title (Arabic)"),
  about_description: commonValidations.requiredText("About Description"),
  about_description_ar: commonValidations.requiredString(
    "About Description (Arabic)"
  ),

  // FEATURED PRODUCTS
  featured_title: commonValidations.requiredString("Featured Title"),
  featured_title_ar: commonValidations.requiredString(
    "Featured Title (Arabic)"
  ),

  // JOURNEY SECTION
  journey_title: commonValidations.requiredString("Journey Title"),
  journey_title_ar: commonValidations.requiredString("Journey Title (Arabic)"),
  journey_description: commonValidations.requiredText("Journey Description"),
  journey_description_ar: commonValidations.requiredString(
    "Journey Description (Arabic)"
  ),
  journey_media_type: commonValidations.requiredString("Media Type"),
  journey_media_desktop_path: commonValidations.validateFileUpload("Journey Media"),
  journey_media_mobile_path: commonValidations.validateFileUpload("Journey Media Mobile"),
  journey_media_alt: commonValidations.requiredString("Journey Media Alt Text"),
  journey_media_alt_ar: commonValidations.requiredString(
    "Journey Media Alt Text (Arabic)"
  ),

  // PROJECT SECTION
  project_title: commonValidations.requiredString("Project Title"),
  project_title_ar: commonValidations.requiredString("Project Title (Arabic)"),

  // FITS SECTION
  fits_title: commonValidations.requiredString("Fits Title"),
  fits_title_ar: commonValidations.requiredString("Fits Title (Arabic)"),
  fits_description: commonValidations.requiredText("Fits Description"),
  fits_description_ar: commonValidations.requiredString(
    "Fits Description (Arabic)"
  ),

  // BRANDS SECTION
  brands_title: commonValidations.requiredString("Brands Title"),
  brands_title_ar: commonValidations.requiredString("Brands Title (Arabic)"),

  // FORM SECTION
  form_title: commonValidations.requiredString("Form Title"),
  form_title_ar: commonValidations.requiredString("Form Title (Arabic)"),
  form_description: commonValidations.requiredText("Form Description"),
  form_description_ar: commonValidations.requiredString(
    "Form Description (Arabic)"
  ),
  form_media_path: commonValidations.validateFileUpload("Form Media"),
  form_media_alt: commonValidations.requiredString("Form Media Alt Text"),
  form_media_alt_ar: commonValidations.requiredString(
    "Form Media Alt Text (Arabic)"
  ),
});

export const homeBannerSchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  link: commonValidations.requiredUrl("Link"),
  button_text: commonValidations.requiredString("Button Text"),
  media_alt: commonValidations.requiredString("Media Alt Text"),

  // Arabic fields (optional)
  title_ar: commonValidations.requiredString("Arabic Title"),
  description_ar: commonValidations.requiredString("Arabic Description"),
  button_text_ar: commonValidations.requiredString("Arabic Button Text"),
  media_alt_ar: commonValidations.requiredString("Arabic Media Alt Text"),

  // File uploads
  media_desktop_path: commonValidations.validateFileUpload("Desktop Media"),
  media_mobile_path: commonValidations.validateFileUpload("Mobile Media"),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export const homeBrandSchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title"),

  // Arabic fields (required)
  title_ar: commonValidations.requiredString("Arabic Title"),

  // File upload (required)
  media_path: commonValidations.validateFileUpload("Brand Logo"),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export const smartSpaceCalculatorSchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),
  link: commonValidations.externalUrl("Link"),
  button_text: commonValidations.requiredString("Button Text"),
  media_alt: commonValidations.requiredString("Media Alt Text"),

  // Arabic fields (required)
  title_ar: commonValidations.requiredString("Arabic Title"),
  description_ar: commonValidations.requiredString("Arabic Description"),
  button_text_ar: commonValidations.requiredString("Arabic Button Text"),
  media_alt_ar: commonValidations.requiredString("Arabic Media Alt Text"),

  // File upload (single image)
  media_path: commonValidations.validateFileUpload("Calculator Image"),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export const findYourFitSchema = z.object({
  // English fields (required)
  title:commonValidations.requiredString("Title is required"),
  description:commonValidations.requiredString("Description is required"),

  // Arabic fields (required)
  title_ar:commonValidations.requiredString("Arabic Title is required"),
  description_ar:commonValidations.requiredString("Arabic Description is required"),

  // Media fields
  media_path:commonValidations.validateFileUpload("Image is required"),
  media_alt:commonValidations.requiredString("Image Alt Text is required"),
  media_alt_ar:commonValidations.requiredString("Arabic Image Alt Text is required"),

  // Link (optional)
  link: commonValidations.requiredUrl("Link"),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type HomeBannerFormData = z.infer<typeof homeBannerSchema>;
export type HomeBrandFormData = z.infer<typeof homeBrandSchema>;
export type SmartSpaceCalculatorFormData = z.infer<
  typeof smartSpaceCalculatorSchema
>;
export type HomeCmsFormData = z.infer<typeof homeSchema>;
export type FindYourFitFormData = z.infer<typeof findYourFitSchema>;
