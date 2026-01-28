import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductVariant {
  id?: number;
  product_id: number;
  sku: string;
  price: string;
  stock: number;
  product_code: string;
  sort_order: number;
  status: boolean;
  is_primary: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  product?: {
    id: number;
    title: string;
    title_ar: string;
    slug: string;
  };
  variant_attributes?: VariantAttribute[];
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
  productId?: number,
): Promise<ProductVariantResponse> => {
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

  return apiCall("/resources/product-variants", { params });
};

// Fetch single product variant
export const fetchProductVariantById = async (id: number): Promise<ProductVariantItemResponse> => {
  return apiCall(`/resources/product-variants/${id}`);
};

// Create product variant
export const createProductVariant = async (data: Partial<ProductVariant>): Promise<ProductVariantItemResponse> => {
  return apiCall("/resources/product-variants", {
    method: "POST",
    data,
  });
};

// Update product variant
export const updateProductVariant = async (id: number, data: Partial<ProductVariant>): Promise<ProductVariantItemResponse> => {
  return apiCall(`/resources/product-variants/${id}`, {
    method: "PUT",
    data,
  });
};

// Delete product variant
export const deleteProductVariant = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-variants/${id}`, {
    method: "DELETE",
  });
};

// Fetch attributes with values
export const fetchAttributesWithValues = async (): Promise<AttributesWithValuesResponse> => {
  return apiCall("/common-actions/attributes/with-values");
};
