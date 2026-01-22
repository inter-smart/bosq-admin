import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productModelSchema = z.object({
  name: commonValidations.requiredString("Name"),
  name_ar: commonValidations.requiredString("Name (Arabic)"),
  code: commonValidations.requiredString("Code"),
  description: z.string().optional(),
  description_ar: z.string().optional(),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProductModelFormData = z.infer<typeof productModelSchema>;
