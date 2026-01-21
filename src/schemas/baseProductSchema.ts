import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const baseProductSchema = z.object({
  title: commonValidations.requiredString("Title"),
  description: z.string().optional(),
  category_id: z.number().nullable().optional(),
  sub_category_id: z.number().nullable().optional(),
  sort_order: commonValidations.sortOrder(),
  media_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  selling_points: z.array(z.number()).optional(),
  sectors: z.array(z.number()).optional(),
});

export type BaseProductFormData = z.infer<typeof baseProductSchema>;
