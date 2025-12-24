import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const contactCmsSchema = z.object({
  // Page Title
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredText("Title (Arabic)"),

  // Form Section
  form_title: commonValidations.requiredString("Form Title"),
  form_title_ar: commonValidations.requiredText("Form Title (Arabic)"),
  form_description: commonValidations.requiredText("Form Description"),
  form_description_ar: commonValidations.requiredText("Form Description (Arabic)"),

  // Media Section
  media_path: commonValidations.validateFileUpload("Contact Media"),
  media_alt: commonValidations.requiredText("Media Alt Text"),
  media_alt_ar: commonValidations.requiredText("Media Alt Text (Arabic)"),
  media_title: commonValidations.requiredString("Media Title"),
  media_title_ar: commonValidations.requiredText("Media Title (Arabic)"),
  media_description: commonValidations.requiredText("Media Description"),
  media_description_ar: commonValidations.requiredText("Media Description (Arabic)"),

  // Email Section
  email_title: commonValidations.requiredString("Email Title"),
  email_title_ar: commonValidations.requiredText("Email Title (Arabic)"),
  email: commonValidations.requiredString("Email"),

  // Phone Section
  phone_title: commonValidations.requiredString("Phone Title"),
  phone_title_ar: commonValidations.requiredText("Phone Title (Arabic)"),
  phone_number: commonValidations.requiredString("Phone Number"),

  // Address Section
  address_title: commonValidations.requiredString("Address Title"),
  address_title_ar: commonValidations.requiredText("Address Title (Arabic)"),
  address: commonValidations.requiredString("Address"),
  address_ar: commonValidations.requiredText("Address (Arabic)"),

  // Social Media Section
  social_media_title: commonValidations.requiredString("Social Media Title"),
  social_media_title_ar: commonValidations.requiredText("Social Media Title (Arabic)"),

  // Map Integration
  url: commonValidations.requiredText("Map Embed Code"),
});


export type ContactCmsFormData = z.infer<typeof contactCmsSchema>;
