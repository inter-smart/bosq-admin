import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productCategorySchema = z.object({
  name: commonValidations.requiredString("Name"),
  name_ar: commonValidations.requiredString("Name (Arabic)"),
  description: z.string().nullable().optional(),
  parent_id: z.number().nullable().optional(),
  media_path: commonValidations.validateFileUpload("Image"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProductCategoryFormData = z.infer<typeof productCategorySchema>;
