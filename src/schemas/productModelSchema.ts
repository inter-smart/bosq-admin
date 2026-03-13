import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productModelSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  code: z.string().optional(),
  base_price: z.string().min(1, "Base price is required"),
  media_path: commonValidations.validateFileUpload("Image"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProductModelFormData = z.infer<typeof productModelSchema>;
