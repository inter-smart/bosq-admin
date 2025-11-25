import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const aboutCmsSchema = z.object({
  // Optional title field
  title: commonValidations.optionalString("Title"),
  title_ar: commonValidations.optionalString("Title (Arabic)"),

  // Banner Section
  banner_media_type: commonValidations.requiredString("Banner Media Type"),
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.optionalString("Banner Title (Arabic)"),
  banner_description: commonValidations.requiredText("Banner Description"),
  banner_description_ar: commonValidations.optionalString("Banner Description (Arabic)"),
  banner_media_desktop_path: commonValidations.fileUpload.optional(),
  banner_media_mobile_path: commonValidations.fileUpload.optional(),
  banner_media_alt: commonValidations.optionalString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.optionalString("Banner Media Alt Text (Arabic)"),
  banner_button_text: commonValidations.requiredString("Banner Button Text"),
  banner_button_text_ar: commonValidations.optionalString("Banner Button Text (Arabic)"),
  banner_button_link: commonValidations.requiredString("Banner Button Link"),

  // Journey Section
  journey_title: commonValidations.requiredString("Journey Title"),
  journey_title_ar: commonValidations.optionalString("Journey Title (Arabic)"),
  journey_description: commonValidations.requiredText("Journey Description"),
  journey_description_ar: commonValidations.optionalString("Journey Description (Arabic)"),
  journey_one_media_path: commonValidations.fileUpload.optional(),
  journey_two_media_path: commonValidations.fileUpload.optional(),
  journey_three_media_path: commonValidations.fileUpload.optional(),
  journey_one_media_alt: commonValidations.optionalString("Journey Image 1 Alt Text"),
  journey_one_media_alt_ar: commonValidations.optionalString("Journey Image 1 Alt Text (Arabic)"),
  journey_two_media_alt: commonValidations.optionalString("Journey Image 2 Alt Text"),
  journey_two_media_alt_ar: commonValidations.optionalString("Journey Image 2 Alt Text (Arabic)"),
  journey_three_media_alt: commonValidations.optionalString("Journey Image 3 Alt Text"),
  journey_three_media_alt_ar: commonValidations.optionalString("Journey Image 3 Alt Text (Arabic)"),

  // Why Choose Us Section
  why_choose_us_title: commonValidations.requiredString("Why Choose Us Title"),
  why_choose_us_title_ar: commonValidations.optionalString("Why Choose Us Title (Arabic)"),
  why_choose_us_description: commonValidations.requiredText("Why Choose Us Description"),
  why_choose_us_description_ar: commonValidations.optionalString("Why Choose Us Description (Arabic)"),

  // Testimonial Section
  testimonial_title: commonValidations.requiredString("Testimonial Title"),
  testimonial_title_ar: commonValidations.optionalString("Testimonial Title (Arabic)"),

  // Client Section
  client_title: commonValidations.requiredString("Client Title"),
  client_title_ar: commonValidations.optionalString("Client Title (Arabic)"),

  // News Section
  news_title: commonValidations.requiredString("News Title"),
  news_title_ar: commonValidations.optionalString("News Title (Arabic)"),
});

export type AboutCmsFormData = z.infer<typeof aboutCmsSchema>;
