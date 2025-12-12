import { apiCall } from '@/utils/apiUtils';

export interface CustomizationFeature {
  id: number;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  media_path?: File | null;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomizationFeatureResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: CustomizationFeature[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface CustomizationFeatureItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: CustomizationFeature;
}

// Fetch all customization features
export const fetchCustomizationFeaturesList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CustomizationFeatureResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/customization/customization-features', { params });
};

// Fetch single customization feature
export const fetchCustomizationFeatureById = async (id: number): Promise<CustomizationFeatureItemResponse> => {
  return apiCall(`/cms/customization/customization-features/${id}`);
};

// Create customization feature
export const createCustomizationFeature = async (formData: FormData): Promise<CustomizationFeatureItemResponse> => {
  return apiCall('/cms/customization/customization-features', {
    method: 'POST',
    data: formData,
  });
};

// Update customization feature
export const updateCustomizationFeature = async (
  id: number,
  formData: FormData
): Promise<CustomizationFeatureItemResponse> => {
  return apiCall(`/cms/customization/customization-features/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete customization feature
export const deleteCustomizationFeature = async (id: number): Promise<void> => {
  return apiCall(`/cms/customization/customization-features/${id}`, {
    method: 'DELETE',
  });
};
