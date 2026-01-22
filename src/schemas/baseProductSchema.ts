import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const baseProductSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.requiredString("Description"),
  description_ar: commonValidations.requiredString("Description (Arabic)"),
  details: z.string().optional(),
  details_ar: z.string().optional(),
  details_points: z.string().optional(),
  details_points_ar: z.string().optional(),
  additional_details: z.string().optional(),
  additional_details_ar: z.string().optional(),
  category_id: z.number().nullable().optional(),
  sub_category_id: z.number().nullable().optional(),
  base_price: z.string().min(1, "Base price is required").regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal (e.g., 99.99)"),
  sort_order: commonValidations.sortOrder(),
  media_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  selling_points: z.array(z.number()).optional(),
  sectors: z.array(z.number()).optional(),
});

export type BaseProductFormData = z.infer<typeof baseProductSchema>;
