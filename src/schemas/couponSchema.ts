import { commonValidations } from "@/utils/formUtils";
import { z } from "zod";

export const couponSchema = z
  .object({
    code: z.string().min(1, "Coupon code is required").max(50, "Coupon code must not exceed 50 characters"),

    title: commonValidations.optionalString("Title"),

    title_ar: commonValidations.optionalString("Title (Arabic)"),

    media_path: commonValidations.fileUpload,

    discount_type: z.enum(["percentage", "flat"], {
      required_error: "Discount type is required",
    }),

    discount_value: z.coerce.number({ required_error: "Discount value is required" }).min(0, "Discount value must be 0 or greater"),

    min_order_amount: z.coerce.number({ required_error: "Min order amount is required" }).min(0, "Min order amount must be 0 or greater"),

    min_product_amount: z.coerce.number({ required_error: "Min product amount is required" }).min(0, "Min product amount must be 0 or greater"),

    max_discount_amount: z.coerce
      .number({ required_error: "Maximum discount amount is required" })
      .min(0, "Maximum discount amount must be 0 or greater"),

    scope_type: z.enum(["common", "category", "product", "variant", "model"], {
      required_error: "Scope type is required",
    }),

    scope_id: z.coerce.number().nullable().optional(),

    usage_limit_total: z.coerce.number({ required_error: "Total usage limit is required" }).int().min(1, "Total usage limit must be at least 1"),

    usage_limit_per_user: z.coerce
      .number({ required_error: "Per-user usage limit is required" })
      .int()
      .min(1, "Per-user usage limit must be at least 1"),

    start_at: commonValidations.dateString,

    end_at: commonValidations.dateString,

    status: commonValidations.booleanStatus(),
  })
  .refine(
    (data) => {
      if (data.discount_type === "percentage" && data.discount_value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100",
      path: ["discount_value"],
    },
  )
  .refine(
    (data) => {
      // For flat discounts: the discount cannot be >= the minimum order amount
      // (only meaningful when min_order_amount is set > 0)
      if (data.discount_type === "flat" && data.min_order_amount > 0 && data.discount_value >= data.min_order_amount) {
        return false;
      }
      return true;
    },
    {
      message: "Discount value must be less than the minimum order amount",
      path: ["discount_value"],
    },
  )
  .refine(
    (data) => {
      if (data.usage_limit_per_user > data.usage_limit_total) {
        return false;
      }
      return true;
    },
    {
      message: "Per-user usage limit cannot exceed total usage limit",
      path: ["usage_limit_per_user"],
    },
  )
  .refine(
    (data) => {
      if (data.start_at && data.end_at) {
        // Allow same day: end-of-day (23:59:59) >= start-of-day (00:00:00)
        return new Date(data.end_at) >= new Date(data.start_at);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_at"],
    },
  )
  .refine(
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
    },
  )
  .refine(
    (data) => {
      // For flat discounts on non-common scope: min_product_amount (when provided > 0)
      // must be strictly greater than the discount value
      if (
        data.discount_type === "flat" &&
        data.scope_type !== "common" &&
        data.min_product_amount > 0 &&
        data.min_product_amount <= data.discount_value
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Minimum product amount must be greater than the discount value for flat discounts",
      path: ["min_product_amount"],
    },
  )
  .refine(
    (data) => {
      // For flat discounts on non-common scope: max_discount_amount must be >= discount value
      if (data.discount_type === "flat" && data.scope_type !== "common" && data.max_discount_amount < data.discount_value) {
        return false;
      }
      return true;
    },
    {
      message: "Maximum discount amount must be at least the discount value for flat discounts",
      path: ["max_discount_amount"],
    },
  );

export type CouponFormData = z.infer<typeof couponSchema>;
