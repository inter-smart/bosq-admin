import { apiCall } from "@/utils/apiUtils";

export interface ProductSector {
  id?: number;
  name: string;
  code: string;
  slug?: string;
  media_path?: string | File | null;
  sort_order?: number;
  status?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSectorsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductSector[];
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

export interface ProductSectorItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductSector;
}

// Fetch all product attributes
export const fetchProductSectorList = async (page: number = 1, limit: number = 10, search?: string): Promise<ProductSectorsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/resources/product-sectors", { params });
};

// Fetch single product attribute
export const fetchProductSectorById = async (id: number): Promise<ProductSectorItemResponse> => {
  return apiCall(`/resources/product-sectors/${id}`);
};

// Create product attribute
export const createProductSector = async (formData: FormData): Promise<ProductSectorItemResponse> => {
  return apiCall("/resources/product-sectors", {
    method: "POST",
    data: formData,
  });
};

// Update product attribute
export const updateProductSector = async (id: number, formData: FormData): Promise<ProductSectorItemResponse> => {
  return apiCall(`/resources/product-sectors/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete product attribute
export const deleteProductSector = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-sectors/${id}`, {
    method: "DELETE",
  });
};
