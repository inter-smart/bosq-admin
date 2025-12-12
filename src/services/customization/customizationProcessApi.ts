import { apiCall } from '@/utils/apiUtils';

export interface CustomizationProcess {
  id?: number;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomizationProcessResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: CustomizationProcess[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface CustomizationProcessItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: CustomizationProcess;
}

// Fetch all customization process items
export const fetchCustomizationProcessList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CustomizationProcessResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/customization/customization-process', { params });
};

// Fetch single customization process item
export const fetchCustomizationProcessById = async (id: number): Promise<CustomizationProcessItemResponse> => {
  return apiCall(`/cms/customization/customization-process/${id}`);
};

// Create customization process item
export const createCustomizationProcess = async (payload: CustomizationProcess): Promise<CustomizationProcessItemResponse> => {
  return apiCall('/cms/customization/customization-process', {
    method: 'POST',
    data: payload,
  });
};

// Update customization process item
export const updateCustomizationProcess = async (
  id: number,
  payload: CustomizationProcess
): Promise<CustomizationProcessItemResponse> => {
  return apiCall(`/cms/customization/customization-process/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete customization process item
export const deleteCustomizationProcess = async (id: number): Promise<void> => {
  return apiCall(`/cms/customization/customization-process/${id}`, {
    method: 'DELETE',
  });
};
