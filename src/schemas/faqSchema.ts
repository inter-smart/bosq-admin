import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const faqCmsSchema = z.object({
  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_media_desktop_path: commonValidations.fileUpload.optional(),
  banner_media_mobile_path: commonValidations.fileUpload.optional(),
  banner_media_alt: commonValidations.optionalString("Banner Media Alt Text"),

  // FAQ Section Titles
  general_title: commonValidations.requiredString("General Title"),
  payment_title: commonValidations.requiredString("Payment Title"),
  refund_title: commonValidations.requiredString("Refund Title"),
  product_title: commonValidations.requiredString("Product Title"),
  warrenty_title: commonValidations.requiredString("Warranty Title"),

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
