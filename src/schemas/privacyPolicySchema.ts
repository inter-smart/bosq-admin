import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const privacyPolicyCmsSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
});

export type PrivacyPolicyCmsFormData = z.infer<typeof privacyPolicyCmsSchema>;

export const policySchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type PolicyFormData = z.infer<typeof policySchema>;
