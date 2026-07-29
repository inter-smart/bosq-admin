import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productVariantMetaSchema = z.object({
  meta_title: commonValidations.optionalString("Meta title"),
  meta_title_ar: commonValidations.optionalString("Meta title (AR)"),
  meta_description: commonValidations.optionalString("Meta description"),
  meta_description_ar: commonValidations.optionalString("Meta description (AR)"),
  meta_keywords: commonValidations.optionalString("Meta keywords"),
  meta_keywords_ar: commonValidations.optionalString("Meta keywords (AR)"),
  other_meta: z.string().max(2000, "Other meta tags must be at most 2000 characters").optional(),
  other_meta_ar: z.string().max(2000, "Other meta tags (AR) must be at most 2000 characters").optional(),
});

export type ProductVariantMetaFormData = z.infer<typeof productVariantMetaSchema>;
