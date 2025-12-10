import { apiCall } from '@/utils/apiUtils';

export interface DeliveryMethod {
  id?: number;
  media_path?: string | File | null;
  media_alt: string;
  media_alt_ar: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  sort_order: number;
  status: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryMethodResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: DeliveryMethod[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface DeliveryMethodItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: DeliveryMethod;
}

// Fetch all delivery methods
export const fetchDeliveryMethodList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<DeliveryMethodResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/delivery/delivery-methods', { params });
};

// Fetch single delivery method
export const fetchDeliveryMethodById = async (id: number): Promise<DeliveryMethodItemResponse> => {
  return apiCall(`/cms/delivery/delivery-methods/${id}`);
};

// Create delivery method
export const createDeliveryMethod = async (
  formData: FormData
): Promise<DeliveryMethodItemResponse> => {
  return apiCall('/cms/delivery/delivery-methods', {
    method: 'POST',
    data: formData,
  });
};

// Update delivery method
export const updateDeliveryMethod = async (
  id: number,
  formData: FormData
): Promise<DeliveryMethodItemResponse> => {
  return apiCall(`/cms/delivery/delivery-methods/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete delivery method
export const deleteDeliveryMethod = async (id: number): Promise<void> => {
  return apiCall(`/cms/delivery/delivery-methods/${id}`, {
    method: 'DELETE',
  });
};

// Update delivery method status
export const updateDeliveryMethodStatus = async (
  id: number,
  status: boolean
): Promise<DeliveryMethodItemResponse> => {
  return apiCall(`/cms/delivery/delivery-methods/${id}/status`, {
    method: 'PATCH',
    data: { status },
  });
};

// Update delivery method sort order
export const updateDeliveryMethodSortOrder = async (
  id: number,
  sort_order: number
): Promise<DeliveryMethodItemResponse> => {
  return apiCall(`/cms/delivery/delivery-methods/${id}/sort-order`, {
    method: 'PATCH',
    data: { sort_order },
  });
};
