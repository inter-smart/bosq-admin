import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productCategorySchema = z.object({
  name: commonValidations.requiredString("Name"),
  name_ar: commonValidations.requiredString("Name (Arabic)"),
  parent_id: z.number().nullable().optional(),
  media_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProductCategoryFormData = z.infer<typeof productCategorySchema>;
