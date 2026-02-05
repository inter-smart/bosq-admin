import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, "Coupon code is required")
    .max(50, "Coupon code must not exceed 50 characters"),

  title: z
    .string()
    .max(255, "Title must not exceed 255 characters")
    .optional()
    .or(z.literal("")),

  title_ar: z
    .string()
    .max(255, "Title (Arabic) must not exceed 255 characters")
    .optional()
    .or(z.literal("")),

  description: z.string().optional().or(z.literal("")),

  description_ar: z.string().optional().or(z.literal("")),

  media_path: z
    .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
    .optional(),

  discount_type: z.enum(["percentage", "flat"], {
    required_error: "Discount type is required",
  }),

discount_value: z.coerce
    .number({ required_error: "Discount value is required" })
    .min(0, "Discount value must be 0 or greater"),

  min_order_amount: z.coerce
    .number({ required_error: "Min order amount is required" })
    .min(0, "Min order amount must be 0 or greater"),


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
    .min(1),

  usage_limit_per_user: z.coerce
    .number({ required_error: "Per-user usage limit is required" })
    .int()
    .min(1),
  start_at: z.string().min(1, "Start date is required"),

  end_at: z.string().min(1, "End date is required"),

  status: z.boolean(),
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
);

export type CouponFormData = z.infer<typeof couponSchema>;
