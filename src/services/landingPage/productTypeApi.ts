import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductType {
  id?: number;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  features?: string;
  features_ar?: string;
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt?: string;
  media_alt_ar?: string;
  button?: string;
  button_ar?: string;
  link?: string;
  slug?: string;
  landing_page_id?: number;
  product_variants: number[];
  sort_order: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductTypeResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductType[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ProductTypeItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductType;
}

export interface ProductVariantData {
  id: number;
  sku: string;
  title: string;
}

export interface ProductTypeWithRelations extends ProductType {
  product_variants_data: ProductVariantData[];
}

export interface ProductTypeWithRelationsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductTypeWithRelations;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  children?: ProductCategory[];
}

export interface ProductVariant {
  id: number;
  sku: string;
  title?: string;
}

interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

/* =======================
   API Calls
======================= */

export const fetchProductTypeList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ProductTypeResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) {
    params.search = search;
  }
  return apiCall("/product-type", { params });
};

export const fetchProductTypeById = async (id: number): Promise<ProductTypeWithRelationsResponse> => {
  return apiCall(`/product-type/${id}`);
};

export const createProductType = async (formData: FormData): Promise<ProductTypeItemResponse> => {
  return apiCall("/product-type", {
    method: "POST",
    data: formData,
  });
};

export const updateProductType = async (id: number, formData: FormData): Promise<ProductTypeItemResponse> => {
  return apiCall(`/product-type/${id}`, {
    method: "PUT",
    data: formData,
  });
};

export const deleteProductType = async (id: number): Promise<void> => {
  return apiCall(`/product-type/${id}`, {
    method: "DELETE",
  });
};

// Cascading dropdown APIs
export const fetchCategoriesForProductType = async (): Promise<ListResponse<ProductCategory>> => {
  return apiCall("/product-type/product-category");
};

export const fetchVariantsByCategoryForProductType = async (categoryId: number): Promise<ListResponse<ProductVariant>> => {
  return apiCall(`/product-type/variants-by-category/${categoryId}`);
};
