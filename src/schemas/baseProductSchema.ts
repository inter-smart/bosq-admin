import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const baseProductSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  enhance_title: commonValidations.optionalString("Enhance Title"),
  enhance_title_ar: commonValidations.optionalString("Enhance Title (Arabic)"),
  description: commonValidations.requiredString("Description"),
  description_ar: commonValidations.requiredString("Description (Arabic)"),
  details: z.string().optional(),
  details_ar: z.string().optional(),
  details_points: z.string().optional(),
  details_points_ar: z.string().optional(),
  additional_details: z.string().optional(),
  additional_details_ar: z.string().optional(),
  category_id: z.number({ required_error: "Category is required" }).min(1, "Category is required"),
  sub_category_id: z.number().nullable().optional(),
  base_price: z.string().optional(),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
  media_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  selling_points: z.array(z.number()).min(1, "At least one selling point is required").default([]),
  sectors: z.array(z.number()).min(1, "At least one sector is required").default([]),
});

export type BaseProductFormData = z.infer<typeof baseProductSchema>;
