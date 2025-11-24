import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const contactCmsSchema = z.object({
  title: commonValidations.requiredString("Featured Products Title"),
  form_title: commonValidations.requiredString("Form Title"),
  form_description: commonValidations.requiredText("Form Description"),
  media_path: commonValidations.fileUpload,
  media_alt: commonValidations.optionalString("Form Media Alt Text"),
  media_title: commonValidations.requiredString("Form Media Title"),
  media_description: commonValidations.requiredText("Form Media Description"),
});


export type ContactCmsFormData = z.infer<typeof contactCmsSchema>;
