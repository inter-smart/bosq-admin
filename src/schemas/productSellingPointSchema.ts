import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const schema = z.object({
  name: commonValidations.requiredString("Name"),
  media_path: commonValidations.validateFileUpload("Icon"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export type FormDataSchema = z.infer<typeof schema>;
