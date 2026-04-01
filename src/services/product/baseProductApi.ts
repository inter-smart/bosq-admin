import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
}

export interface ChildCategory {
  id: number;
  name: string;
  parent_id: number;
}

export interface ChildCategoryResponse {
  success: boolean;
  message: string;
  data: ChildCategory[];
}

export interface RelationItem {
  id: number;
  name: string;
  slug: string;
}

export interface BaseProduct {
  id?: number;
  title: string;
  title_ar: string;
  base_price: string;
  brochure?: string;
  slug?: string;
  description?: string;
  description_ar?: string;
  details?: string;
  details_ar?: string;
  details_points?: string;
  details_points_ar?: string;
  additional_details?: string;
  additional_details_ar?: string;
  sub_category_id?: number | null;
  sub_category?: Category | null;
  category_id?: number | null;
  category?: Category | null;
  sort_order?: number;
  status?: boolean;
  media_path?: string | File | null;
  sellingPoints?: RelationItem[];
  sectors?: RelationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseProductResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: BaseProduct[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface BaseProductItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: BaseProduct;
}

/* =======================
   API Calls
======================= */

// Fetch all base products
export const fetchBaseProductList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<BaseProductResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) params.search = search;
  if (status && status !== "all") params.status = status;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiCall("/resources/product-base", { params });
};

// Export base products to Excel
export const exportBaseProductList = async (search?: string, status?: string, startDate?: string, endDate?: string): Promise<void> => {
  const params: Record<string, string> = {};

  if (search) params.search = search;
  if (status && status !== "all") params.status = status;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const queryString = new URLSearchParams(params).toString();
  const url = `${import.meta.env.VITE_API_BASE_URL}/admin/resources/product-base/export${queryString ? `?${queryString}` : ""}`;

  // Use window.location.href or a link element to trigger the download,
  // ensuring the auth token is managed (usually via a cookie or by the server).
  // If the API requires a header, we'd need a different approach (blob).
  // Given previous implementations, we'll try the blob approach for better token handling.

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored here
      },
    });

    if (!response.ok) throw new Error("Export failed");

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `base-products-${new Date().toISOString().split("T")[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};

// Fetch single base product
export const fetchBaseProductById = async (id: number): Promise<BaseProductItemResponse> => {
  return apiCall(`/resources/product-base/${id}`);
};

// Create base product
export const createBaseProduct = async (formData: FormData): Promise<BaseProductItemResponse> => {
  return apiCall("/resources/product-base", {
    method: "POST",
    data: formData,
  });
};

// Update base product
export const updateBaseProduct = async (id: number, formData: FormData): Promise<BaseProductItemResponse> => {
  return apiCall(`/resources/product-base/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete base product
export const deleteBaseProduct = async (id: number, deleteType: "soft" | "force" = "soft"): Promise<void> => {
  return apiCall(`/resources/product-base/${id}?delete_type=${deleteType}`, {
    method: "DELETE",
  });
};

// Bulk delete base products
export const bulkDeleteBaseProducts = async (ids: number[], deleteType: "soft" | "force" = "soft"): Promise<{ success: boolean; message: string }> => {
  return apiCall(`/resources/product-base/all?delete_type=${deleteType}`, {
    method: "DELETE",
    data: { ids },
  });
};

// Fetch child categories by parent id
export const fetchChildCategories = async (parentId: number): Promise<ChildCategoryResponse> => {
  return apiCall("/common-actions/categories/child-categories", {
    params: { parent_id: parentId },
  });
};
