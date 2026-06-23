import { apiCall } from '@/utils/apiUtils';

export interface HomeBanner {
  id: number;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  media_desktop_path?: File | null;
  media_mobile_path?: File | null;
  media_desktop_path_ar?: File | null;
  media_mobile_path_ar?: File | null;
  media_alt?: string;
  media_alt_ar?: string;
  button_text?: string;
  button_text_ar?: string;
  link?: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeBannerResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: HomeBanner[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface HomeBannerItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: HomeBanner;
}

// Fetch all home banner items
export const fetchHomeBannerList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<HomeBannerResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }







  return apiCall('/cms/home/home-banner', { params });
};

// Fetch single home banner item
export const fetchHomeBannerById = async (id: number): Promise<HomeBannerItemResponse> => {
  return apiCall(`/cms/home/home-banner/${id}`);
};

// Create home banner item
export const createHomeBanner = async (formData: FormData): Promise<HomeBannerItemResponse> => {
  return apiCall('/cms/home/home-banner', {
    method: 'POST',
    data: formData,
  });
};

// Update home banner item
export const updateHomeBanner = async (
  id: number,
  formData: FormData
): Promise<HomeBannerItemResponse> => {
  return apiCall(`/cms/home/home-banner/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete home banner item
export const deleteHomeBanner = async (id: number): Promise<void> => {
  return apiCall(`/cms/home/home-banner/${id}`, {
    method: 'DELETE',
  });
};