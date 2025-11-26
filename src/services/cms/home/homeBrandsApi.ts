import { apiCall } from '@/utils/apiUtils';

export interface HomeBrand {
  id: number;
  title: string;
  title_ar?: string;
  media_path?: File | null;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeBrandResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: HomeBrand[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface HomeBrandItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: HomeBrand;
}

// Fetch all home brands
export const fetchHomeBrandsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<HomeBrandResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/home/home-brands', { params });
};

// Fetch single home brand
export const fetchHomeBrandById = async (id: number): Promise<HomeBrandItemResponse> => {
  return apiCall(`/cms/home/home-brands/${id}`);
};

// Create home brand
export const createHomeBrand = async (formData: FormData): Promise<HomeBrandItemResponse> => {
  return apiCall('/cms/home/home-brands', {
    method: 'POST',
    data: formData,
  });
};

// Update home brand
export const updateHomeBrand = async (
  id: number,
  formData: FormData
): Promise<HomeBrandItemResponse> => {
  return apiCall(`/cms/home/home-brands/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete home brand
export const deleteHomeBrand = async (id: number): Promise<void> => {
  return apiCall(`/cms/home/home-brands/${id}`, {
    method: 'DELETE',
  });
};
