import { apiCall } from "@/utils/apiUtils";

/* =======================
   Interfaces
======================= */

export interface SustainabilityItem {
  id?: number;

  title: string;
  title_ar: string;

  description: string;
  description_ar: string;

  // NOTE: backend returns HTML string, not array
  points?: string | null;
  points_ar?: string | null;

  img1_path?: string | File | null;
  img1_alt?: string;
  img1_alt_ar?: string;

  img2_path?: string | File | null;
  img2_alt?: string;
  img2_alt_ar?: string;

  sort_order: number;
  status: boolean;

  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SustainabilityListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: SustainabilityItem[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
      searchTerm?: string | null;
    };
  };
}

export interface SustainabilityItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: SustainabilityItem;
}

/* =======================
   API Calls
======================= */

// Fetch list
export const fetchSustainabilityList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SustainabilityListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/cms/sustainability/sustainability-two-image", { params });
};

// Fetch single item
export const fetchSustainabilityById = async (
  id: number
): Promise<SustainabilityItemResponse> => {
  return apiCall(`/cms/sustainability/sustainability-two-image/${id}`);
};

// Create
export const createSustainability = async (
  formData: FormData
): Promise<SustainabilityItemResponse> => {
  return apiCall("/cms/sustainability/sustainability-two-image", {
    method: "POST",
    data: formData,
  });
};

// Update
export const updateSustainability = async (
  id: number,
  formData: FormData
): Promise<SustainabilityItemResponse> => {
  return apiCall(`/cms/sustainability/sustainability-two-image/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete
export const deleteSustainability = async (id: number): Promise<void> => {
  return apiCall(`/cms/sustainability/sustainability-two-image/${id}`, {
    method: "DELETE",
  });
};
