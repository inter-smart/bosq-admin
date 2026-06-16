import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductVariant {
  id?: number;
  product_model_id: number;
  sku: string;
  price: string;
  stock: number;
  product_code: string;
  sort_order: number;
  status: boolean;
  is_primary: boolean;
  title?: string;
  title_ar?: string;
  media_path?: string;
  design_title?: string;
  design_title_ar?: string;
  hover_media_path?: string;
  brochure?: string;
  description?: string;
  description_ar?: string;
  details?: string;
  details_ar?: string;
  details_points?: string;
  details_points_ar?: string;
  additional_details?: string;
  additional_details_ar?: string;
  enhance_title?: string;
  enhance_title_ar?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  category_ids?: number[];
  variant_attributes: {
    attribute_id: number;
    attribute_value_id: number;
    price: string;
  }[];
  categories?: {
    id: number;
    name: string;
    name_ar: string;
    slug: string;
    parent_id?: number | null;
  }[];
  productModel?: {
    id: number;
    title: string;
    product_id: number;
    product?: {
      id: number;
      title: string;
    };
  };
  attributes?: VariantAttribute[];
}

export interface VariantAttribute {
  sku_code: string;
  attribute_id: number;
  attribute_value_id: number;
  price: string;
}

export interface AttributeValue {
  id: number;
  value: string;
  value_ar: string;
  slug: string;
}

export interface AttributeWithValues {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  code: string;
  values: AttributeValue[];
}

export interface AttributesWithValuesResponse {
  success: boolean;
  message: string;
  data: AttributeWithValues[];
}

export interface ProductVariantResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductVariant[];
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

export interface ProductVariantItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductVariant;
}

/* =======================
   API Calls
======================= */

// Fetch all product variants
export const fetchProductVariantList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  productModelId?: number,
  baseProductId?: number,
  categoryId?: number,
): Promise<ProductVariantResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (productModelId) {
    params.product_model_id = productModelId;
  }

  if (baseProductId) {
    params.product_id = baseProductId;
  }

  if (categoryId) {
    params.category_id = categoryId;
  }

  return apiCall("/resources/product-variants", { params });
};

// Fetch single product variant
export const fetchProductVariantById = async (
  id: number,
): Promise<ProductVariantItemResponse> => {
  return apiCall(`/resources/product-variants/${id}`);
};

// Create product variant
export const createProductVariant = async (
  data: Partial<ProductVariant>,
): Promise<ProductVariantItemResponse> => {
  return apiCall("/resources/product-variants", {
    method: "POST",
    data,
  });
};

// Update product variant
export const updateProductVariant = async (
  id: number,
  data: Partial<ProductVariant> | FormData,
): Promise<ProductVariantItemResponse> => {
  return apiCall(`/resources/product-variants/${id}`, {
    method: "PUT",
    data: data as any,
  });
};

// Delete product variant
export const deleteProductVariant = async (
  id: number,
  deleteType: "soft" | "force" = "soft",
): Promise<void> => {
  return apiCall(
    `/resources/product-variants/${id}?delete_type=${deleteType}`,
    {
      method: "DELETE",
    },
  );
};

// Bulk delete product variants
export const bulkDeleteProductVariants = async (
  ids: number[],
  deleteType: "soft" | "force" = "soft",
): Promise<{ success: boolean; message: string }> => {
  return apiCall(`/resources/product-variants/all?delete_type=${deleteType}`, {
    method: "DELETE",
    data: { ids },
  });
};

// Fetch attributes with values
export const fetchAttributesWithValues =
  async (): Promise<AttributesWithValuesResponse> => {
    return apiCall("/common-actions/attributes/with-values");
  };

/* =======================
   Bought Together
======================= */

export interface BoughtTogetherResponse {
  success: boolean;
  message: string;
  data: ProductVariant & { boughtTogetherVariants: ProductVariant[] };
}

export const fetchBoughtTogether = async (
  variantId: number,
): Promise<BoughtTogetherResponse> => {
  return apiCall(`/resources/product-variant-bought-together/${variantId}`);
};

export const syncBoughtTogether = async (
  variantId: number,
  relatedVariantIds: number[],
): Promise<{ success: boolean; message: string }> => {
  return apiCall(
    `/resources/product-variant-bought-together/${variantId}/sync`,
    {
      method: "POST",
      data: { related_variant_ids: relatedVariantIds },
    },
  );
};
