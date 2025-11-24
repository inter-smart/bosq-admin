import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const faqCmsSchema = z.object({
  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_media_desktop_path: commonValidations.fileUpload,
  banner_media_mobile_path: commonValidations.fileUpload,
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),

  // Question Section
  question_title: commonValidations.requiredString("Question Title"),
  question_description: commonValidations.requiredText("Question Description"),
});

export const faqCategorySchema = z.object({
  title: commonValidations.requiredString("Title"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export const faqListSchema = z.object({
  question: commonValidations.requiredString("Question"),
  answer: commonValidations.requiredText("Answer"),
  category: commonValidations.requiredNumber("Category"),
  sort_order:commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type FaqListFormData = z.infer<typeof faqListSchema>;
export type FaqCategoryFormData = z.infer<typeof faqCategorySchema>;
export type FaqCmsFormData = z.infer<typeof faqCmsSchema>;
