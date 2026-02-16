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
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt?: string;
  media_alt_ar?: string;
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
  model?: {
    id: number;
    title: string;
    product?: {
      id: number;
      slug: string;
      title: string;
      category?: {
        id: number;
        slug: string;
        name: string;
        name_ar: string;
        parent_id: number | null;
        parent?: { id: number; slug: string; name: string; name_ar: string; parent_id: number | null };
        children?: { id: number; slug: string; name: string; name_ar: string; parent_id: number | null }[];
      };
    };
  };
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

export interface Product {
  id: number;
  title: string;
  slug: string;
}

export interface ProductModel {
  id: number;
  title: string;
  slug: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
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

export const fetchProductsForProductType = async (categoryId: number): Promise<ListResponse<Product>> => {
  return apiCall(`/product-type/product/${categoryId}`);
};

export const fetchModelsForProductType = async (productId: number): Promise<ListResponse<ProductModel>> => {
  return apiCall(`/product-type/product-model/${productId}`);
};

export const fetchVariantsForProductType = async (modelId: number): Promise<ListResponse<ProductVariant>> => {
  return apiCall(`/product-type/product-variant/${modelId}`);
};
