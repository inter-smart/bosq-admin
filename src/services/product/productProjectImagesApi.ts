import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductProjectImage {
  id?: number;
  product_id: number;
  media_path: string;
  media_alt?: string;
  media_alt_ar?: string;
  status: boolean;
  sort_order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductProjectImagesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductProjectImage[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface ProductProjectImageItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductProjectImage;
}

/* =======================
   API Calls
======================= */

// Fetch all project images for a product
export const fetchProductProjectImages = async (
  productId: number,
  page: number = 1,
  limit: number = 50
): Promise<ProductProjectImagesResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    product_id: productId,
  };

  return apiCall("/resources/product-project-image", { params });
};

// Fetch single product project image
export const fetchProductProjectImageById = async (
  id: number
): Promise<ProductProjectImageItemResponse> => {
  return apiCall(`/resources/product-project-image/${id}`);
};

// Create product project image (multipart/form-data)
export const createProductProjectImage = async (
  formData: FormData
): Promise<ProductProjectImageItemResponse> => {
  return apiCall("/resources/product-project-image", {
    method: "POST",
    data: formData,
  });
};

// Update product project image
export const updateProductProjectImage = async (
  id: number,
  data: Partial<ProductProjectImage> | FormData
): Promise<ProductProjectImageItemResponse> => {
  return apiCall(`/resources/product-project-image/${id}`, {
    method: "PUT",
    data,
  });
};

// Delete product project image
export const deleteProductProjectImage = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-project-image/${id}`, {
    method: "DELETE",
  });
};
