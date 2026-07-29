import { apiCall } from "@/utils/apiUtils";

export interface ProductVariantMeta {
  id: number;
  product_title: string;
  product_slug: string | null;
  meta_title: string | null;
  meta_title_ar: string | null;
  meta_description: string | null;
  meta_description_ar: string | null;
  meta_keywords: string | null;
  meta_keywords_ar: string | null;
  other_meta: string | null;
  other_meta_ar: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductVariantMetaListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductVariantMeta[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ProductVariantMetaItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductVariantMeta;
}

export interface UpdateProductVariantMetaRequest {
  meta_title?: string;
  meta_title_ar?: string;
  meta_description?: string;
  meta_description_ar?: string;
  meta_keywords?: string;
  meta_keywords_ar?: string;
  other_meta?: string;
  other_meta_ar?: string;
}

export const fetchProductVariantMetaList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ProductVariantMetaListResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) { params.search = search; }
  return apiCall("/products/variant-meta-tags", { params });
};

export const fetchProductVariantMetaById = async (
  id: number
): Promise<ProductVariantMetaItemResponse> => {
  return apiCall(`/products/variant-meta-tags/${id}`);
};

export const updateProductVariantMeta = async (
  id: number,
  payload: Partial<UpdateProductVariantMetaRequest>
): Promise<ProductVariantMetaItemResponse> => {
  return apiCall(`/products/variant-meta-tags/${id}`, {
    method: "PUT",
    data: payload,
  });
};
