import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface Coupon {
  id?: number;
  code: string;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  media_path?: string | File | null;
  discount_type: "percentage" | "flat";
  discount_value: number;
  min_order_amount: number;
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

// Extended coupon type with nested relations for edit mode
export interface CouponWithRelations extends Coupon {
  variant?: {
    id: number;
    sku: string;
    productModel: {
      id: number;
      title: string;
      product: {
        id: number;
        title: string;
        category: {
          id: number;
          name: string;
          parent_id: number | null;
          parent?: { id: number; name: string };
        };
      };
    };
  };
  model?: {
    id: number;
    title: string;
    product: {
      id: number;
      title: string;
      category: {
        id: number;
        name: string;
        parent_id: number | null;
        parent?: { id: number; name: string };
      };
    };
  };
  product?: {
    id: number;
    title: string;
    category: {
      id: number;
      name: string;
      parent_id: number | null;
      parent?: { id: number; name: string };
    };
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

// Fetch products for scope selection (by category ID)
export const fetchProductsForScope = async (categoryId: number): Promise<ProductResponse> => {
  return apiCall(`/coupons/product/${categoryId}`);
};

// Fetch product models for scope selection (by product ID)
export const fetchModelsForScope = async (productId: number): Promise<ProductModelResponse> => {
  return apiCall(`/coupons/product-model/${productId}`);
};

// Fetch product variants for scope selection (by model ID)
export const fetchVariantsForScope = async (modelId: number): Promise<ProductVariantResponse> => {
  return apiCall(`/coupons/product-variant/${modelId}`);
};
