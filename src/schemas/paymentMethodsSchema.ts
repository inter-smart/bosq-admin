import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const paymentMethodsSchema = z.object({
  icon_media_path: commonValidations.validateFileUpload("Icon"),
  icon_alt: commonValidations.requiredString("Icon Alt Text"),
  icon_alt_ar: commonValidations.requiredString("Icon Alt Arabic Text"),
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type PaymentMethodsFormData = z.infer<typeof paymentMethodsSchema>;