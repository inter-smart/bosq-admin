import { apiCall } from '@/utils/apiUtils';

export interface CustomizationOption {
  id?: number;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  media_path?: string | File | null;
  media_alt?: string;
  media_alt_ar?: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomizationOptionsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: CustomizationOption[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface CustomizationOptionItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: CustomizationOption;
}

// Fetch all customization options items
export const fetchCustomizationOptionsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CustomizationOptionsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/customization/customization-options', { params });
};

// Fetch single customization option item
export const fetchCustomizationOptionById = async (id: number): Promise<CustomizationOptionItemResponse> => {
  return apiCall(`/cms/customization/customization-options/${id}`);
};

// Create customization option item
export const createCustomizationOption = async (formData: FormData): Promise<CustomizationOptionItemResponse> => {
  return apiCall('/cms/customization/customization-options', {
    method: 'POST',
    data: formData,
  });
};

// Update customization option item
export const updateCustomizationOption = async (
  id: number,
  formData: FormData
): Promise<CustomizationOptionItemResponse> => {
  return apiCall(`/cms/customization/customization-options/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete customization option item
export const deleteCustomizationOption = async (id: number): Promise<void> => {
  return apiCall(`/cms/customization/customization-options/${id}`, {
    method: 'DELETE',
  });
};
