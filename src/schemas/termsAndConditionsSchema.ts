import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const termsAndConditionsCmsSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  faq_title: commonValidations.requiredString("FAQ Title"),
  faq_title_ar: commonValidations.requiredString("FAQ Title (Arabic)"),
});




export const faqListSchema = z.object({
  question: commonValidations.requiredString("Question"),
  question_ar: commonValidations.requiredString("Question (Arabic)"),
  answer: commonValidations.requiredText("Answer"),
  answer_ar: commonValidations.requiredText("Answer (Arabic)"),
  sort_order:commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});


export type FaqListFormData = z.infer<typeof faqListSchema>;
export type TermsAndConditionsCmsFormData = z.infer<typeof termsAndConditionsCmsSchema>;