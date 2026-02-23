import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productSectorSchema = z.object({
  name: commonValidations.requiredString("Name"),
  name_ar: commonValidations.requiredString("Name (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProductSectorFormData = z.infer<typeof productSectorSchema>;
