import { apiCall } from '@/utils/apiUtils';

export interface DeliveryTime {
  id?: number;
  icon_media_path?: string | File | null;
  duration: string;
  duration_ar: string;
  title: string;
  title_ar: string;
  sort_order: number;
  status: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryTimeResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: DeliveryTime[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface DeliveryTimeItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: DeliveryTime;
}

// Fetch all delivery times
export const fetchDeliveryTimeList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<DeliveryTimeResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/delivery/delivery-time', { params });
};

// Fetch single delivery time
export const fetchDeliveryTimeById = async (id: number): Promise<DeliveryTimeItemResponse> => {
  return apiCall(`/cms/delivery/delivery-time/${id}`);
};

// Create delivery time
export const createDeliveryTime = async (
  formData: FormData
): Promise<DeliveryTimeItemResponse> => {
  return apiCall('/cms/delivery/delivery-time', {
    method: 'POST',
    data: formData,
  });
};

// Update delivery time
export const updateDeliveryTime = async (
  id: number,
  formData: FormData
): Promise<DeliveryTimeItemResponse> => {
  return apiCall(`/cms/delivery/delivery-time/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete delivery time
export const deleteDeliveryTime = async (id: number): Promise<void> => {
  return apiCall(`/cms/delivery/delivery-time/${id}`, {
    method: 'DELETE',
  });
};

// Update delivery time status
export const updateDeliveryTimeStatus = async (
  id: number,
  status: boolean
): Promise<DeliveryTimeItemResponse> => {
  return apiCall(`/cms/delivery/delivery-time/${id}/status`, {
    method: 'PATCH',
    data: { status },
  });
};

// Update delivery time sort order
export const updateDeliveryTimeSortOrder = async (
  id: number,
  sort_order: number
): Promise<DeliveryTimeItemResponse> => {
  return apiCall(`/cms/delivery/delivery-time/${id}/sort-order`, {
    method: 'PATCH',
    data: { sort_order },
  });
};
