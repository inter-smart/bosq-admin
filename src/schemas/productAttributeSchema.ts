import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productAttributeSchema = z.object({
  name: commonValidations.requiredString("Name"),
  code: commonValidations.requiredString("Code"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProductAttributeFormData = z.infer<typeof productAttributeSchema>;
