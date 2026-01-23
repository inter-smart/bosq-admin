import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductModel {
  id?: number;
  product_id: number;
  title: string;
  title_ar: string;
  code: string;
  slug?: string;
  base_price: string;
  media_path?: string | File | null;
  sort_order?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  product?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface ProductModelResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductModel[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
      searchTerm: string | null;
    };
  };
}

export interface ProductModelItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductModel;
}

/* =======================
   API Calls
======================= */

// Fetch all product models
export const fetchProductModelList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  productId?: number,
): Promise<ProductModelResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (productId) {
    params.product_id = productId;
  }

  return apiCall("/resources/product-models", { params });
};

// Fetch single product model
export const fetchProductModelById = async (id: number): Promise<ProductModelItemResponse> => {
  return apiCall(`/resources/product-models/${id}`);
};

// Create product model
export const createProductModel = async (formData: FormData): Promise<ProductModelItemResponse> => {
  return apiCall("/resources/product-models", {
    method: "POST",
    data: formData,
  });
};

// Update product model
export const updateProductModel = async (id: number, formData: FormData): Promise<ProductModelItemResponse> => {
  return apiCall(`/resources/product-models/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete product model
export const deleteProductModel = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-models/${id}`, {
    method: "DELETE",
  });
};
