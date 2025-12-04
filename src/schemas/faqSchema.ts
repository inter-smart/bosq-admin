import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const faqCmsSchema = z.object({
  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredString("Banner Title (Arabic)"),
  banner_media_desktop_path: commonValidations.validateFileUpload("Banner Image (Desktop)"),
  banner_media_mobile_path: commonValidations.validateFileUpload("Banner Image (Mobile)"),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString("Banner Media Alt Text (Arabic)"),

  // Page Title
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  // Question Section
  question_title: commonValidations.requiredString("Question Title"),
  question_title_ar: commonValidations.requiredString("Question Title (Arabic)"),
  question_description: commonValidations.requiredText("Question Description"),
  question_description_ar: commonValidations.requiredText("Question Description (Arabic)"),
});

export const faqCategorySchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export const faqListSchema = z.object({
  question: commonValidations.requiredString("Question"),
  question_ar: commonValidations.requiredString("Question (Arabic)"),
  answer: commonValidations.requiredText("Answer"),
  answer_ar: commonValidations.requiredText("Answer (Arabic)"),
  category: commonValidations.requiredNumber("Category"),
  sort_order:commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type FaqListFormData = z.infer<typeof faqListSchema>;
export type FaqCategoryFormData = z.infer<typeof faqCategorySchema>;
export type FaqCmsFormData = z.infer<typeof faqCmsSchema>;
