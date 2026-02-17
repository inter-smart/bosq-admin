import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const enquiryDropdownSchema = z.object({
    title: commonValidations.requiredString("Title"),
    title_ar: z.string().optional().nullable(),
    sort_order: commonValidations.sortOrder(),
    status: z.boolean().default(true),
});

export type EnquiryDropdownFormData = z.infer<typeof enquiryDropdownSchema>;
