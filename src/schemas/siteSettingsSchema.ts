import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const headerFooterSchema = z.object({
  // Contact
  address: commonValidations.requiredText("Address"),
  address_ar: commonValidations.requiredText("Address (Arabic)").optional(),


  // Header Logo
  header_logo_media_path: commonValidations.validateFileUpload("Header Logo"),
  header_media_alt: commonValidations.requiredString("Header Logo Alt Text"),
  header_media_alt_ar: commonValidations.requiredString("Header Logo Alt Text (Arabic)").optional(),

  // Footer Logo
  footer_logo_media_path: commonValidations.validateFileUpload("Footer Logo"),
  footer_media_alt: commonValidations.requiredString("Footer Logo Alt Text"),
  footer_media_alt_ar: commonValidations.requiredString("Footer Logo Alt Text (Arabic)").optional(),

  // Sale Enquiry
  sale_enquiry_title: commonValidations.requiredString("Sale Enquiry Title"),
  sale_enquiry_title_ar: commonValidations.requiredString("Sale Enquiry Title (Arabic)").optional(),
  sales_phone_number: commonValidations.validatePhoneNumber("Sales Phone Number"),
  sale_enquiry_email: commonValidations.validateEmail("Sale Enquiry Email"),

  // Support Enquiry
  support_enquiry_title: commonValidations.requiredString("Support Enquiry Title"),
  support_enquiry_title_ar: commonValidations.requiredString("Support Enquiry Title (Arabic)").optional(),
  support_email: commonValidations.validateEmail("Support Email"),

  // Newsletter
  news_letter_title: commonValidations.requiredString("Newsletter Title"),
  news_letter_title_ar: commonValidations.requiredString("Newsletter Title (Arabic)").optional(),
});


export type HeaderFooterFormData = z.infer<typeof headerFooterSchema>;