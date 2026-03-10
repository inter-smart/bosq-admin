import { z } from "zod";
import { commonValidations } from "@/utils/formUtils";

export const faqCmsSchema = z.object({
  // Banner Section
  banner_title: commonValidations.requiredString("Banner Title"),
  banner_title_ar: commonValidations.requiredString("Banner Title (Arabic)"),
  banner_media_desktop_path: commonValidations.validateFileUpload(
    "Banner Image (Desktop)",
  ),
  banner_media_mobile_path: commonValidations.validateFileUpload(
    "Banner Image (Mobile)",
  ),
  banner_media_desktop_path_ar: commonValidations.validateFileUpload(
    "Banner Image (Desktop) (Arabic)",
  ),
  banner_media_mobile_path_ar: commonValidations.validateFileUpload(
    "Banner Image (Mobile) (Arabic)",
  ),
  banner_media_alt: commonValidations.requiredString("Banner Media Alt Text"),
  banner_media_alt_ar: commonValidations.requiredString(
    "Banner Media Alt Text (Arabic)",
  ),

  // Page Title
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),

  // Question Section
  question_title: commonValidations.requiredString("Question Title"),
  question_title_ar: commonValidations.requiredString(
    "Question Title (Arabic)",
  ),
  question_description: commonValidations.requiredText("Question Description"),
  question_description_ar: commonValidations.requiredText(
    "Question Description (Arabic)",
  ),
});

export const faqCategorySchema = z.object({
  title: commonValidations.requiredString("Title"),
  title_ar: commonValidations.requiredString("Title (Arabic)"),
  sort_order: commonValidations.sortOrder(),
  status: z.boolean(),
});

export const faqListSchema = z
  .object({
    question: commonValidations.requiredString("Question"),
    question_ar: z.string().optional(),
    answer: commonValidations.requiredText("Answer"),
    answer_ar: z.string().optional(),
    type: z.enum(["general", "product"], {
      required_error: "Type is required",
    }),
    faq_category_id: z.number().optional(),
    product_variant_id: z.number().optional(),
    sort_order: commonValidations.sortOrder(),
    status: commonValidations.booleanStatus(),
  })
  .superRefine((data, ctx) => {
    // Product variant is required only when type === 'product'
    if (data.type === "product" && !data.product_variant_id) {
      ctx.addIssue({
        path: ["product_variant_id"],
        message: "Product variant is required for product FAQs",
        code: z.ZodIssueCode.custom,
      });
    }

    // FAQ category is required only when type === 'general'
    if (data.type === "general" && !data.faq_category_id) {
      ctx.addIssue({
        path: ["faq_category_id"],
        message: "General category is required for general FAQs",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type FaqListFormData = z.infer<typeof faqListSchema>;
export type FaqCategoryFormData = z.infer<typeof faqCategorySchema>;
export type FaqCmsFormData = z.infer<typeof faqCmsSchema>;
