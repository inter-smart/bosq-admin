import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const metaTagSchema = z.object({
  page: commonValidations.optionalString("Page"),

  meta_title: commonValidations.optionalString("Meta Title"),
  meta_title_ar: commonValidations.optionalString("Meta Title (Arabic)"),

  meta_description: commonValidations.optionalString("Meta Description"),
  meta_description_ar: commonValidations.optionalString("Meta Description (Arabic)"),

  meta_keywords: commonValidations.optionalString("Meta Keywords"),
  meta_keywords_ar: commonValidations.optionalString("Meta Keywords (Arabic)"),

});

export type MetaTagFormData = z.infer<typeof metaTagSchema>;
