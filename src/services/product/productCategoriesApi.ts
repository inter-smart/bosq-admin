import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductCategory {
  id?: number;
  parent_id?: number | null;
  name: string;
  name_ar: string;
  slug: string;
  media_path?: string | File | null;
  status: boolean;
  sort_order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentCategories {
  id?: number;
  name: string;
  name_ar: string;
  slug: string;
  media_path?: string | File | null;
}

export interface ProductCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductCategory[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}
export interface ParentCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ParentCategories[];
}

export interface ProductCategoryItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductCategory;
}

/* =======================
   API Calls
======================= */

// Fetch all ergonomics chair features
export const fetchParentCategoryList = async (): Promise<ParentCategoryResponse> => {
  return apiCall("/resources/product-categories/parents", {
    method: "GET",
  });
};

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Fetch all product categories with pagination, search, and category filter.
 * @param {number} [page=1] - Page number for pagination.
 * @param {number} [limit=10] - Limit number of items per page.
 * @returns {Promise<ProductCategoryResponse>} - Promise with response data.
 */
export const fetchProductCategoryList = async (page: number = 1, limit: number = 10, search?: string): Promise<ProductCategoryResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/resources/product-categories", { params });
};

// Fetch single ergonomics chair feature
export const fetchProductCategoryById = async (id: number): Promise<ProductCategoryItemResponse> => {
  return apiCall(`/resources/product-categories/${id}`);
};

// Create ergonomics chair feature
export const createProductCategory = async (formData: FormData): Promise<ProductCategoryItemResponse> => {
  return apiCall("/resources/product-categories", {
    method: "POST",
    data: formData,
  });
};

// Update ergonomics chair feature
export const updateProductCategory = async (id: number, formData: FormData): Promise<ProductCategoryItemResponse> => {
  return apiCall(`/resources/product-categories/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete ergonomics chair feature
export const deleteProductCategory = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-categories/${id}`, {
    method: "DELETE",
  });
};

// Update status
export const updateProductCategoryStatus = async (id: number, status: boolean): Promise<ProductCategoryItemResponse> => {
  return apiCall(`/resources/product-categories/${id}/status`, {
    method: "PATCH",
    data: { status },
  });
};
