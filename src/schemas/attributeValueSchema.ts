import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const attributeValueSchema = z.object({
  value: commonValidations.requiredString("Value"),
  value_ar: commonValidations.requiredString("Value (Arabic)"),
  attribute_id: z.number().min(1, "Attribute ID is required"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
  media_path: z
    .union([
      z.instanceof(File).refine((f) => f.size <= 5 * 1024 * 1024, {
        message: "Max 5MB allowed",
      }),
      z.string().min(1),
      z.null(),
      z.undefined(),
    ])
    .optional(),
});

export type AttributeValueFormData = z.infer<typeof attributeValueSchema>;
