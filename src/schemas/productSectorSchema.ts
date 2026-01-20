import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const productSectorSchema = z.object({
  name: commonValidations.requiredString("Name"),
  media_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]).optional(),
  code: commonValidations.requiredString("Code"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type ProductSectorFormData = z.infer<typeof productSectorSchema>;
