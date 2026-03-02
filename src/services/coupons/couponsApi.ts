import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface Coupon {
  id?: number;
  code: string;
  title?: string;
  title_ar?: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  min_order_amount: number;
  min_product_amount: number;
  max_discount_amount: number;
  scope_type: "common" | "category" | "product" | "variant" | "model";
  scope_id?: number | null;
  usage_limit_total: number;
  usage_limit_per_user: number;
  start_at: string;
  end_at: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CouponResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: Coupon[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface CouponItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: Coupon;
}

// Extended coupon type with nested relations for edit mode.
// Category is now M2M on variants — each scope type carries the category
// through its variant(s) rather than through a product.category FK.
export interface CouponWithRelations extends Coupon {
  variant?: {
    id: number;
    sku: string;
    // Categories on the variant (M2M) — first one used to pre-populate cascade
    categories: { id: number; name: string; name_ar: string; slug: string; parent_id: number | null }[];
    productModel: {
      id: number;
      title: string;
      product: {
        id: number;
        title: string;
      };
    };
  };
  model?: {
    id: number;
    title: string;
    product: {
      id: number;
      title: string;
    };
    // Variants with categories — first variant's first category pre-populates cascade
    variants?: {
      id: number;
      categories: { id: number; name: string; name_ar: string; slug: string; parent_id: number | null }[];
    }[];
  };
  product?: {
    id: number;
    title: string;
    // Models → variants → categories for cascade pre-population in edit mode
    models?: {
      id: number;
      variants?: {
        id: number;
        categories: { id: number; name: string; name_ar: string; slug: string; parent_id: number | null }[];
      }[];
    }[];
  };
  category?: {
    id: number;
    name: string;
    parent_id: number | null;
    parent?: { id: number; name: string };
  };
}

export interface CouponWithRelationsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: CouponWithRelations;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  children?: ProductCategory[];
}

export interface ProductCategoryResponse {
  success: boolean;
  message: string;
  data: ProductCategory[];
}

export interface Product {
  id: number;
  title: string;
  slug: string;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ProductModel {
  id: number;
  title: string;
  slug: string;
}

export interface ProductModelResponse {
  success: boolean;
  message: string;
  data: ProductModel[];
}

export interface ProductVariant {
  id: number;
  sku: string;
}

export interface ProductVariantResponse {
  success: boolean;
  message: string;
  data: ProductVariant[];
}

/* =======================
   API Calls
======================= */

// Fetch all coupons with pagination
export const fetchCouponList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CouponResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/coupons", { params });
};

// Fetch single coupon by ID
export const fetchCouponById = async (id: number): Promise<CouponWithRelationsResponse> => {
  return apiCall(`/coupons/${id}`);
};

// Create new coupon
export const createCoupon = async (formData: FormData): Promise<CouponItemResponse> => {
  return apiCall("/coupons", {
    method: "POST",
    data: formData,
  });
};

// Update existing coupon
export const updateCoupon = async (id: number, formData: FormData): Promise<CouponItemResponse> => {
  return apiCall(`/coupons/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Fetch categories for scope selection
export const fetchCategoriesForScope = async (): Promise<ProductCategoryResponse> => {
  return apiCall("/coupons/product-category");
};

// Fetch products for scope selection (by category ID) — used for category scope drill-down
export const fetchProductsForScope = async (categoryId: number): Promise<ProductResponse> => {
  return apiCall(`/coupons/product/${categoryId}`);
};

// Fetch ALL active base products (no category filter) — for product/model/variant scope
export const fetchAllProductsForScope = async (): Promise<ProductResponse> => {
  return apiCall("/coupons/products");
};

// Fetch product models for scope selection (by product ID)
export const fetchModelsForScope = async (productId: number): Promise<ProductModelResponse> => {
  return apiCall(`/coupons/product-model/${productId}`);
};

// Fetch categories of variants in a model — for variant scope category step
export const fetchModelCategoriesForScope = async (modelId: number): Promise<ProductCategoryResponse> => {
  return apiCall(`/coupons/model-categories/${modelId}`);
};

// Fetch product variants (by model ID, optionally filtered by category)
export const fetchVariantsForScope = async (modelId: number, categoryId?: number): Promise<ProductVariantResponse> => {
  const params: Record<string, string | number> = {};
  if (categoryId) params.categoryId = categoryId;
  return apiCall(`/coupons/product-variant/${modelId}`, { params });
};
