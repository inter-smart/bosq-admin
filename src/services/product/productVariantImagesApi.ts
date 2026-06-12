import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductVariantImage {
  id?: number;
  variant_id: number;
  media_path: string;
  media_type: string;
  sort_order: number;
  status: boolean;
  is_primary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariantImagesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductVariantImage[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface ProductVariantImageItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductVariantImage;
}

export interface ProductVariantImageDeleteResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data?: {
    deleted_ids: number[];
  };
}

export interface ProductVariantImagesUploadResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductVariantImage[];
}

/* =======================
   API Calls
======================= */

// Fetch all images for a product variant
export const fetchProductVariantImages = async (variantId: number, page: number = 1, limit: number = 50): Promise<ProductVariantImagesResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    variant_id: variantId,
  };

  return apiCall("/resources/product-variant-images", { params });
};

// Fetch single product variant image
export const fetchProductVariantImageById = async (id: number): Promise<ProductVariantImageItemResponse> => {
  return apiCall(`/resources/product-variant-images/${id}`);
};

// Upload product variant images (multipart/form-data)
export const uploadProductVariantImages = async (formData: FormData): Promise<ProductVariantImagesUploadResponse> => {
  return apiCall("/resources/product-variant-images", {
    method: "POST",
    data: formData,
  });
};

// Update product variant image
export const updateProductVariantImage = async (id: number, data: Partial<ProductVariantImage> | FormData): Promise<ProductVariantImageItemResponse> => {
  return apiCall(`/resources/product-variant-images/${id}`, {
    method: "PUT",
    data,
  });
};

// Delete product variant image
export const deleteProductVariantImage = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-variant-images/${id}`, {
    method: "DELETE",
  });
};

// Delete product variant image bulk
export const bulkDeleteProductVariantImages = async (ids: number[]): Promise<ProductVariantImageDeleteResponse> => {
  return apiCall(`/resources/product-variant-images/all`, {
    method: "DELETE",
    data: { ids },
  });
};
