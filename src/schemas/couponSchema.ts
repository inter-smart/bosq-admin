import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, "Coupon code is required")
    .max(50, "Coupon code must not exceed 50 characters"),

  title: commonValidations.optionalString("Title"),

  title_ar: commonValidations.optionalString("Title (Arabic)"),

  description: commonValidations.optionalString("Description"),

  description_ar: commonValidations.optionalString("Description (Arabic)"),

  media_path: commonValidations.fileUpload,

  discount_type: z.enum(["percentage", "flat"], {
    required_error: "Discount type is required",
  }),

  discount_value: z.coerce
    .number({ required_error: "Discount value is required" })
    .min(0, "Discount value must be 0 or greater"),

  min_order_amount: z.coerce
    .number({ required_error: "Min order amount is required" })
    .min(0, "Min order amount must be 0 or greater"),

  min_product_amount: z.coerce
    .number({ required_error: "Min product amount is required" })
    .min(0, "Min product amount must be 0 or greater"),

  max_discount_amount: z.coerce
    .number({ required_error: "Maximum discount amount is required" })
    .min(0, "Maximum discount amount must be 0 or greater"),

  scope_type: z.enum(["common", "category", "product", "variant", "model"], {
    required_error: "Scope type is required",
  }),

  scope_id: z.coerce.number().nullable().optional(),

  usage_limit_total: z.coerce
    .number({ required_error: "Total usage limit is required" })
    .int()
    .min(1, "Total usage limit must be at least 1"),

  usage_limit_per_user: z.coerce
    .number({ required_error: "Per-user usage limit is required" })
    .int()
    .min(1, "Per-user usage limit must be at least 1"),

  start_at: commonValidations.dateString,

  end_at: commonValidations.dateString,

  status: commonValidations.booleanStatus(),
}).refine(
  (data) => {
    if (data.discount_type === "percentage" && data.discount_value > 100) {
      return false;
    }
    return true;
  },
  {
    message: "Percentage discount cannot exceed 100",
    path: ["discount_value"],
  }
).refine(
  (data) => {
    if (data.usage_limit_per_user > data.usage_limit_total) {
      return false;
    }
    return true;
  },
  {
    message: "Per-user usage limit cannot exceed total usage limit",
    path: ["usage_limit_per_user"],
  }
).refine(
  (data) => {
    if (data.start_at && data.end_at) {
      return new Date(data.end_at) > new Date(data.start_at);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["end_at"],
  }
).refine(
  (data) => {
    // Validate scope_id is required for non-common scope types
    if (data.scope_type !== "common" && !data.scope_id) {
      return false;
    }
    return true;
  },
  {
    message: "Please complete the selection for the chosen scope type",
    path: ["scope_id"],
  }
);

export type CouponFormData = z.infer<typeof couponSchema>;