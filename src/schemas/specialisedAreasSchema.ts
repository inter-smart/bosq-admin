import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const specialisedAreasSchema = z.object({
  project_id: z.number({
    required_error: "Project is required",
    invalid_type_error: "Project must be selected",
  }).min(1, "Project is required"),

  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  media_path: commonValidations.validateFileUpload("Image"),
  media_alt: commonValidations.optionalString("Media Alt Text"),
  media_alt_ar: commonValidations.optionalString("Media Alt Text (Arabic)"),

  sort_order: commonValidations.sortOrder(),
  status: z.boolean().default(true),
});

export type SpecialisedAreasFormData = z.infer<typeof specialisedAreasSchema>;
