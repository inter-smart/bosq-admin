import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const homeBannerSchema = z.object({
  // Required string fields
  title: commonValidations.requiredString("Title"),

  // Optional string fields (backend allows empty strings)
  description: commonValidations.requiredString("Description"),

  link: commonValidations.requiredString("Link"),

  button_text: commonValidations.requiredString("Button Text"),

  media_alt:commonValidations.optionalString("Media Alt Text"),

  // File uploads
  media_desktop_path: commonValidations.fileUpload.optional(),
  media_mobile_path: commonValidations.fileUpload.optional(),

  // Sort order + status
  sort_order: commonValidations.sortOrder,
  status: commonValidations.booleanStatus,
});

export type HomeBannerFormData = z.infer<typeof homeBannerSchema>;
