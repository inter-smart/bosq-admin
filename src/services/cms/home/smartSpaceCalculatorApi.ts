import { apiCall } from '@/utils/apiUtils';

export interface SmartSpaceCalculator {
  id: number;
  media_path?: File | null;
  media_alt?: string;
  media_alt_ar?: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  link?: string;
  button_text?: string;
  button_text_ar?: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SmartSpaceCalculatorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: SmartSpaceCalculator[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface SmartSpaceCalculatorItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: SmartSpaceCalculator;
}

// Fetch all smart space calculator items
export const fetchSmartSpaceCalculatorList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SmartSpaceCalculatorResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/home/smart-space-calculator', { params });
};

// Fetch single smart space calculator item
export const fetchSmartSpaceCalculatorById = async (id: number): Promise<SmartSpaceCalculatorItemResponse> => {
  return apiCall(`/cms/home/smart-space-calculator/${id}`);
};

// Create smart space calculator item
export const createSmartSpaceCalculator = async (formData: FormData): Promise<SmartSpaceCalculatorItemResponse> => {
  return apiCall('/cms/home/smart-space-calculator', {
    method: 'POST',
    data: formData,
  });
};

// Update smart space calculator item
export const updateSmartSpaceCalculator = async (
  id: number,
  formData: FormData
): Promise<SmartSpaceCalculatorItemResponse> => {
  return apiCall(`/cms/home/smart-space-calculator/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete smart space calculator item
export const deleteSmartSpaceCalculator = async (id: number): Promise<void> => {
  return apiCall(`/cms/home/smart-space-calculator/${id}`, {
    method: 'DELETE',
  });
};
