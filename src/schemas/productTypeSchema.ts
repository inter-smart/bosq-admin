import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productTypeSchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  description: commonValidations.optionalString("Description"),
  features: commonValidations.optionalRichText,
  description_ar: commonValidations.optionalString("Description (Arabic)"),
  features_ar: commonValidations.optionalRichText,
  media_path: commonValidations.validateFileUpload("Image"),
  media_alt: commonValidations.optionalString("Media Alt Text"),
  media_alt_ar: commonValidations.optionalString("Media Alt Text (Arabic)"),
  button: commonValidations.optionalString("Button Text"),
  button_ar: commonValidations.optionalString("Button Text (Arabic)"),
  link: commonValidations.optionalString("Link"),
  slug: z.string().optional().refine(
    (v) => !v || /^[a-z0-9-]+$/.test(v),
    { message: "Slug must be lowercase letters, numbers, and hyphens only" }
  ),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
  product_variants: z.array(z.number()).optional(),
});

export type ProductTypeFormData = z.infer<typeof productTypeSchema>;
