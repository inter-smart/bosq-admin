
import { apiCall } from "@/utils/apiUtils";

export interface ProductAttribute {
  id?: number;
  name: string;
  name_ar: string;
  code: string;
  slug?: string;
  sort_order?: number;
  status?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductAttributeResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductAttribute[];
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

export interface ProductAttributeItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductAttribute;
}

// Fetch all product attributes
export const fetchProductAttributeList = async (page: number = 1, limit: number = 10, search?: string): Promise<ProductAttributeResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/resources/product-attributes", { params });
};

// Fetch single product attribute
export const fetchProductAttributeById = async (id: number): Promise<ProductAttributeItemResponse> => {
  return apiCall(`/resources/product-attributes/${id}`);
};

// Create product attribute
export const createProductAttribute = async (
  payload: Omit<ProductAttribute, "id" | "slug" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ProductAttributeItemResponse> => {
  return apiCall("/resources/product-attributes", {
    method: "POST",
    data: payload,
  });
};

// Update product attribute
export const updateProductAttribute = async (
  id: number,
  payload: Omit<ProductAttribute, "id" | "slug" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ProductAttributeItemResponse> => {
  return apiCall(`/resources/product-attributes/${id}`, {
    method: "PUT",
    data: payload,
  });
};

// Delete product attribute
export const deleteProductAttribute = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-attributes/${id}`, {
    method: "DELETE",
  });
};
