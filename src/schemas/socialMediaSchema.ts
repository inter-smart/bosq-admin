import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const socialMediaSchema = z.object({
  link: commonValidations.externalUrl("Link"),
  icon_media_path: commonValidations.validateFileUpload("Icon"),
  footer_icon_media_path: commonValidations.validateFileUpload("Footer Icon"),
  icon_alt: commonValidations.requiredString("Icon Alt Text"),
  icon_alt_ar: commonValidations.requiredString("Icon Alt Arabic Text"),
  sort_order: commonValidations.sortOrder(),
  status: commonValidations.booleanStatus(),
});

export type SocialMediaFormData = z.infer<typeof socialMediaSchema>;
