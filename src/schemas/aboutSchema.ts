import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const aboutCmsSchema = z.object({
  // Optional title field
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  // Banner Section
  banner_media_type: commonValidations.requiredString("Banner Media Type"),
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredString("Banner Title (Arabic)"),
  banner_description: commonValidations.requiredText("Banner Description"),
  banner_description_ar: commonValidations.requiredString("Banner Description (Arabic)"),
  banner_media_desktop_path: commonValidations.validateFileUpload("Banner Desktop Media"),
  banner_media_mobile_path: commonValidations.validateFileUpload("Banner Mobile Media"),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString("Banner Media Alt Text (Arabic)"),
  banner_button_text: commonValidations.requiredString("Banner Button Text"),
  banner_button_text_ar: commonValidations.requiredString("Banner Button Text (Arabic)"),
  banner_button_link: commonValidations.externalUrl("Banner Button Link"),

  // Journey Section
  journey_title: commonValidations.requiredString("Journey Title"),
  journey_title_ar: commonValidations.requiredString("Journey Title (Arabic)"),
  journey_description: commonValidations.requiredText("Journey Description"),
  journey_description_ar: commonValidations.requiredString("Journey Description (Arabic)"),
  journey_one_media_path: commonValidations.validateFileUpload("Journey Image 1"),
  journey_two_media_path: commonValidations.validateFileUpload("Journey Image 2"),
  journey_three_media_path: commonValidations.validateFileUpload("Journey Image 3"),
  journey_one_media_alt: commonValidations.requiredString("Journey Image 1 Alt Text"),
  journey_one_media_alt_ar: commonValidations.requiredString("Journey Image 1 Alt Text (Arabic)"),
  journey_two_media_alt: commonValidations.requiredString("Journey Image 2 Alt Text"),
  journey_two_media_alt_ar: commonValidations.requiredString("Journey Image 2 Alt Text (Arabic)"),
  journey_three_media_alt: commonValidations.requiredString("Journey Image 3 Alt Text"),
  journey_three_media_alt_ar: commonValidations.requiredString("Journey Image 3 Alt Text (Arabic)"),

  // Why Choose Us Section
  why_choose_us_title: commonValidations.requiredString("Why Choose Us Title"),
  why_choose_us_title_ar: commonValidations.requiredString("Why Choose Us Title (Arabic)"),
  why_choose_us_description: commonValidations.requiredText("Why Choose Us Description"),
  why_choose_us_description_ar: commonValidations.requiredString("Why Choose Us Description (Arabic)"),

  // Testimonial Section
  testimonial_title: commonValidations.requiredString("Testimonial Title"),
  testimonial_title_ar: commonValidations.requiredString("Testimonial Title (Arabic)"),

  // Client Section
  client_title: commonValidations.requiredString("Client Title"),
  client_title_ar: commonValidations.requiredString("Client Title (Arabic)"),

  // News Section
  news_title: commonValidations.requiredString("News Title"),
  news_title_ar: commonValidations.requiredString("News Title (Arabic)"),
});

export type AboutCmsFormData = z.infer<typeof aboutCmsSchema>;
