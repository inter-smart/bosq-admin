import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const projectImagesSchema = z.object({
  project_id: z.number({
    required_error: "Product Variant is required",
    invalid_type_error: "Product Variant must be selected",
  }).min(1, "Product Variant is required"),
  media_path: commonValidations.validateFileUpload("Image"),
  media_alt: commonValidations.optionalString("Media Alt Text"),
  media_alt_ar: commonValidations.optionalString("Media Alt Text (Arabic)"),

  sort_order: commonValidations.sortOrder(),
  status: z.boolean().default(true),
});

export type ProjectImagesFormData = z.infer<typeof projectImagesSchema>;
