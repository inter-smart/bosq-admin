import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const aboutCmsSchema = z.object({
  // Optional title field
  title: commonValidations.optionalString("Title"),

  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_description: commonValidations.requiredText("Banner Description"),
  banner_media_desktop_path: commonValidations.fileUpload.optional(),
  banner_media_mobile_path: commonValidations.fileUpload.optional(),
  banner_media_alt: commonValidations.optionalString("Banner Media Alt Text"),

  // Journey Section
  journey_title: commonValidations.requiredString("Journey Title"),
  journey_description: commonValidations.requiredText("Journey Description"),

  // Why Choose Us Section
  why_choose_us_title: commonValidations.requiredString("Why Choose Us Title"),
  why_choose_us_description: commonValidations.requiredText("Why Choose Us Description"),

  // Testimonial Section
  testimonial_title: commonValidations.requiredString("Testimonial Title"),

  // Client Section
  client_title: commonValidations.requiredString("Client Title"),

  // News Section
  news_title: commonValidations.requiredString("News Title"),
});

export type AboutCmsFormData = z.infer<typeof aboutCmsSchema>;
