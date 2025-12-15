import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const returnPolicyCmsSchema = z.object({
  media_alt: commonValidations.requiredString("Media Alt Text"),
  media_alt_ar: commonValidations.requiredString("Media Alt Text (Arabic)"),
  media_path: commonValidations.validateImageUpload("Media image"),
});


export const returnPolicySchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredText("Description"),
  description_ar: commonValidations.requiredText("Description (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ReturnPolicyCmsFormData = z.infer<typeof returnPolicyCmsSchema>;
export type ReturnPolicyFormData = z.infer<typeof returnPolicySchema>;
