import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const metaTagSchema = z.object({
  page: commonValidations.requiredString("Page"),

  meta_title: commonValidations.requiredString("Meta Title"),
  meta_title_ar: commonValidations.requiredString("Meta Title (Arabic)"),

  meta_description: commonValidations.requiredString("Meta Description"),
  meta_description_ar: commonValidations.requiredString("Meta Description (Arabic)"),

  meta_keywords: commonValidations.requiredString("Meta Keywords"),
  meta_keywords_ar: commonValidations.requiredString("Meta Keywords (Arabic)"),

});

export type MetaTagFormData = z.infer<typeof metaTagSchema>;
