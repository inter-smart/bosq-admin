import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ProductSellingPoint {
  id?: number;
  name: string;
  slug: string;
  media_path?: string | File | null;
  status: boolean;
  sort_order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSellingPointResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductSellingPoint[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ProductSellingPointItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductSellingPoint;
}

/* =======================
   API Calls
======================= */

export const fetchDataList = async (page: number = 1, limit: number = 10, search?: string): Promise<ProductSellingPointResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/resources/product-selling-points", { params });
};

// Fetch single ergonomics chair feature
export const fetchDataById = async (id: number): Promise<ProductSellingPointItemResponse> => {
  return apiCall(`/resources/product-selling-points/${id}`);
};

// Create ergonomics chair feature
export const createData = async (formData: FormData): Promise<ProductSellingPointItemResponse> => {
  return apiCall("/resources/product-selling-points", {
    method: "POST",
    data: formData,
  });
};

// Update ergonomics chair feature
export const updateData = async (id: number, formData: FormData): Promise<ProductSellingPointItemResponse> => {
  return apiCall(`/resources/product-selling-points/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete ergonomics chair feature
export const deleteData = async (id: number): Promise<void> => {
  return apiCall(`/resources/product-selling-points/${id}`, {
    method: "DELETE",
  });
};

// Update status
export const updateStatus = async (id: number, status: boolean): Promise<ProductSellingPointItemResponse> => {
  return apiCall(`/resources/product-selling-points/${id}/status`, {
    method: "PATCH",
    data: { status },
  });
};
