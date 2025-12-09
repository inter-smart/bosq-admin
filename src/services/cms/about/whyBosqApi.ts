import { apiCall } from '@/utils/apiUtils';

export interface WhyBosq {
  id: number;

  // Main Media fields
  media_path?: string | File | null;
  media_alt?: string;
  media_alt_ar?: string;

  // Icon Media fields
  icon_media_path?: string | File | null;
  icon_media_alt?: string;

  // Content fields (English)
  title: string;
  subtitle: string;
  description: string;

  // Content fields (Arabic)
  title_ar: string;
  subtitle_ar: string;
  description_ar: string;

  // Settings
  sort_order: number;
  status: boolean;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
}

export interface WhyBosqResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: WhyBosq[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface WhyBosqItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: WhyBosq;
}

// Fetch all Why BOSQ items
export const fetchWhyBosqList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<WhyBosqResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/about/why-bosq', { params });
};

// Fetch single Why BOSQ item
export const fetchWhyBosqById = async (id: number): Promise<WhyBosqItemResponse> => {
  return apiCall(`/cms/about/why-bosq/${id}`);
};

// Create Why BOSQ item
export const createWhyBosq = async (
  formData: FormData
): Promise<WhyBosqItemResponse> => {
  return apiCall('/cms/about/why-bosq', {
    method: 'POST',
    data: formData,
  });
};

// Update Why BOSQ item
export const updateWhyBosq = async (
  id: number,
  formData: FormData
): Promise<WhyBosqItemResponse> => {
  return apiCall(`/cms/about/why-bosq/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete Why BOSQ item
export const deleteWhyBosq = async (id: number): Promise<void> => {
  return apiCall(`/cms/about/why-bosq/${id}`, {
    method: 'DELETE',
  });
};
