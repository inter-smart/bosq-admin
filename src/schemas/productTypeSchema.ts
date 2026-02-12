import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productTypeSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.optionalString("Description"),
  description_ar: commonValidations.optionalString("Description (Arabic)"),
  media_desktop_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  media_mobile_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  media_alt: commonValidations.optionalString("Media Alt Text"),
  media_alt_ar: commonValidations.optionalString("Media Alt Text (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
  product_variants: z.array(z.number()).optional(),
});

export type ProductTypeFormData = z.infer<typeof productTypeSchema>;
