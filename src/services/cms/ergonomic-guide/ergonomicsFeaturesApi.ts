import { apiCall } from "@/utils/apiUtils";

/* =======================
   Types & Interfaces
======================= */

export interface ErgonomicsChairFeature {
  id?: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  media_path?: string | File | null;
  media_alt?: string | null;
  media_alt_ar?: string | null;
  sort_order: number;
  status: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ErgonomicsChairFeatureResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ErgonomicsChairFeature[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ErgonomicsChairFeatureItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ErgonomicsChairFeature;
}

/* =======================
   API Calls
======================= */

// Fetch all ergonomics chair features
export const fetchErgonomicsChairFeatureList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ErgonomicsChairFeatureResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall("/cms/ergnomicguide/ergnomic-guide-features", { params });
};

// Fetch single ergonomics chair feature
export const fetchErgonomicsChairFeatureById = async (
  id: number
): Promise<ErgonomicsChairFeatureItemResponse> => {
  return apiCall(`/cms/ergnomicguide/ergnomic-guide-features/${id}`);
};

// Create ergonomics chair feature
export const createErgonomicsChairFeature = async (
  formData: FormData
): Promise<ErgonomicsChairFeatureItemResponse> => {
  return apiCall("/cms/ergnomicguide/ergnomic-guide-features", {
    method: "POST",
    data: formData,
  });
};

// Update ergonomics chair feature
export const updateErgonomicsChairFeature = async (
  id: number,
  formData: FormData
): Promise<ErgonomicsChairFeatureItemResponse> => {
  return apiCall(`/cms/ergnomicguide/ergnomic-guide-features/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Delete ergonomics chair feature
export const deleteErgonomicsChairFeature = async (
  id: number
): Promise<void> => {
  return apiCall(`/cms/ergnomicguide/ergnomic-guide-features/${id}`, {
    method: "DELETE",
  });
};

// Update status
export const updateErgonomicsChairFeatureStatus = async (
  id: number,
  status: boolean
): Promise<ErgonomicsChairFeatureItemResponse> => {
  return apiCall(`/cms/ergnomicguide/ergnomic-guide-features/${id}/status`, {
    method: "PATCH",
    data: { status },
  });
};
