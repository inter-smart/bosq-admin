import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const baseProductSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  base_price: z.string().optional(),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
  media_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  selling_points: z.array(z.number()).min(1, "At least one selling point is required").default([]),
  sectors: z.array(z.number()).min(1, "At least one sector is required").default([]),
});

export type BaseProductFormData = z.infer<typeof baseProductSchema>;
