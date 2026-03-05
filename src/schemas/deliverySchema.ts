import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const deliveryCmsSchema = z.object({
  // Page Title Section
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredString("Banner Title (Arabic)"),
  banner_media_desktop_path: commonValidations.validateFileUpload("Banner Desktop Media"),
  banner_media_desktop_path_ar: commonValidations.validateFileUpload("Banner Desktop Media (Arabic)"),
  banner_media_mobile_path: commonValidations.validateFileUpload("Banner Mobile Media"),
  banner_media_mobile_path_ar: commonValidations.validateFileUpload("Banner Mobile Media (Arabic)"),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString("Banner Media Alt Text (Arabic)"),

  // Delivery Time Section
  delivery_time_title: commonValidations.requiredString("Delivery Time Title"),
  delivery_time_title_ar: commonValidations.requiredString("Delivery Time Title (Arabic)"),
  delivery_time_subtitle: commonValidations.requiredString("Delivery Time Subtitle"),
  delivery_time_subtitle_ar: commonValidations.requiredString("Delivery Time Subtitle (Arabic)"),

  // Delivery Media Section
  delivery_media_path: commonValidations.validateFileUpload("Delivery Media"),
  delivery_media_alt: commonValidations.requiredString("Delivery Media Alt Text"),
  delivery_media_alt_ar: commonValidations.requiredString("Delivery Media Alt Text (Arabic)"),
});

export type DeliveryCmsFormData = z.infer<typeof deliveryCmsSchema>;

// Delivery Time Schema
export const deliveryTimeSchema = z.object({
  duration: commonValidations.requiredString("Duration"),
  duration_ar: commonValidations.requiredString("Duration (Arabic)"),
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  icon_media_path: commonValidations.validateFileUpload("Icon"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type DeliveryTimeFormData = z.infer<typeof deliveryTimeSchema>;

// Delivery Method Schema
export const deliveryMethodSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  media_path: commonValidations.validateFileUpload("Image"),
  media_alt: commonValidations.requiredString("Media Alt Text"),
  media_alt_ar: commonValidations.requiredString("Media Alt Text (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type DeliveryMethodFormData = z.infer<typeof deliveryMethodSchema>;
