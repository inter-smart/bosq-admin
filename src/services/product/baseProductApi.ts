import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface ChildCategory {
  id: number;
  name: string;
  parent_id: number;
}

export interface ChildCategoryResponse {
  success: boolean;
  message: string;
  data: ChildCategory[];
}

export interface RelationItem {
  id: number;
  name: string;
  slug: string;
}

export interface BaseProduct {
  id?: number;
  title: string;
  title_ar: string;
  slug?: string;
  description?: string;
  description_ar?: string;
  details?: string;
  details_ar?: string;
  details_points?: string;
  details_points_ar?: string;
  additional_details?: string;
  additional_details_ar?: string;
  sub_category_id?: number | null;
  sub_category?: Category | null;
  category_id?: number | null;
  category?: Category | null;
  sort_order?: number;
  media_path?: string | File | null;
  sellingPoints?: RelationItem[];
  sectors?: RelationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseProductResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: BaseProduct[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface BaseProductItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: BaseProduct;
}

/* =======================
   API Calls
======================= */

// Fetch all base products
export const fetchBaseProductList = async (page: number = 1, limit: number = 10, search?: string): Promise<BaseProductResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/resources/product-base", { params });
};

// Fetch single base product
export const fetchBaseProductById = async (id: number): Promise<BaseProductItemResponse> => {
  return apiCall(`/resources/product-base/${id}`);
};

// Create base product
export const createBaseProduct = async (formData: FormData): Promise<BaseProductItemResponse> => {
  return apiCall("/resources/product-base", {
    method: "POST",
    data: formData,
  });
};

// Update base product
export const updateBaseProduct = async (id: number, formData: FormData): Promise<BaseProductItemResponse> => {
  return apiCall(`/resources/product-base/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete base product
export const deleteBaseProduct = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-base/${id}`, {
    method: "DELETE",
  });
};

// Fetch child categories by parent id
export const fetchChildCategories = async (parentId: number): Promise<ChildCategoryResponse> => {
  return apiCall("/common-actions/categories/child-categories", {
    params: { parent_id: parentId },
  });
};
