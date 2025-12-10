import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const warrantyPolicySchema = z.object({
  // English fields (required)
  title: commonValidations.requiredString("Title"),
  description: commonValidations.requiredText("Description"),

  // Arabic fields (required)
  title_ar: commonValidations.requiredString("Arabic Title"),
  description_ar: commonValidations.requiredText("Arabic Description"),

  // Media fields
  media_path: commonValidations.validateFileUpload("Warranty Policy Image"),
  media_alt: commonValidations.requiredString("Media Alt Text"),
  media_alt_ar: commonValidations.requiredString("Arabic Media Alt Text"),

  // Sort order + status
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type WarrantyPolicyFormData = z.infer<typeof warrantyPolicySchema>;
