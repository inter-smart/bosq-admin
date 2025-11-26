import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const contactCmsSchema = z.object({
  // Page Title
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.optionalString("Title (Arabic)"),

  // Form Section
  form_title: commonValidations.requiredString("Form Title"),
  form_title_ar: commonValidations.optionalString("Form Title (Arabic)"),
  form_description: commonValidations.requiredText("Form Description"),
  form_description_ar: commonValidations.optionalString("Form Description (Arabic)"),

  // Media Section
  media_path: commonValidations.fileUpload,
  media_alt: commonValidations.optionalString("Media Alt Text"),
  media_alt_ar: commonValidations.optionalString("Media Alt Text (Arabic)"),
  media_title: commonValidations.requiredString("Media Title"),
  media_title_ar: commonValidations.optionalString("Media Title (Arabic)"),
  media_description: commonValidations.requiredText("Media Description"),
  media_description_ar: commonValidations.optionalString("Media Description (Arabic)"),

  // Email Section
  email_title: commonValidations.requiredString("Email Title"),
  email_title_ar: commonValidations.optionalString("Email Title (Arabic)"),
  email: z.string().email("Please enter a valid email address"),

  // Phone Section
  phone_title: commonValidations.requiredString("Phone Title"),
  phone_title_ar: commonValidations.optionalString("Phone Title (Arabic)"),
  phone_number: commonValidations.requiredString("Phone Number"),

  // Address Section
  address_title: commonValidations.requiredString("Address Title"),
  address_title_ar: commonValidations.optionalString("Address Title (Arabic)"),
  address: commonValidations.requiredString("Address"),
  address_ar: commonValidations.optionalString("Address (Arabic)"),

  // Social Media Section
  social_media_title: commonValidations.requiredString("Social Media Title"),
  social_media_title_ar: commonValidations.optionalString("Social Media Title (Arabic)"),

  // Map Integration
  iframe: commonValidations.optionalString("Map Embed Code"),
});


export type ContactCmsFormData = z.infer<typeof contactCmsSchema>;
