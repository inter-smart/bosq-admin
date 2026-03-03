import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const attributeValueSchema = z.object({
  value: commonValidations.requiredString("Value"),
  value_ar: commonValidations.requiredString("Value (Arabic)"),
  attribute_id: z.number().min(1, "Attribute ID is required"),
  slug: commonValidations.optionalString("Slug"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
 
});

export type AttributeValueFormData = z.infer<typeof attributeValueSchema>;
