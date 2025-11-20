import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const homeBannerSchema = z.object({
  // Required string fields
  title: commonValidations.requiredString("Title"),

  // Optional string fields (backend allows empty strings)
  description: z.string().optional().or(z.literal("")),

  link: z.string().optional().or(z.literal("")),

  button_text: z.string().optional().or(z.literal("")),

  media_alt: z.string().optional().or(z.literal("")),

  // File uploads
  media_desktop_path: commonValidations.fileUpload.optional(),
  media_mobile_path: commonValidations.fileUpload.optional(),

  // Sort order + status
  sort_order: commonValidations.sortOrder,
  status: commonValidations.booleanStatus,
});

export type HomeBannerFormData = z.infer<typeof homeBannerSchema>;
