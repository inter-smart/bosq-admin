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

export type TermsAndConditionsCmsFormData = z.infer<typeof termsAndConditionsCmsSchema>;
