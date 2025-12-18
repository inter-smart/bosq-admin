import { apiCall } from '@/utils/apiUtils';

export interface PaymentMethod {
  id?: number;
  icon_media_path: string | null;
  icon_alt: string;
  icon_alt_ar: string;
  link: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethodResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: PaymentMethod[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface PaymentMethodItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: PaymentMethod;
}

export interface CreatePaymentMethodData {
  name: string;
  icon?: File | string;
  icon_alt: string;
  link: string;
  sort_order?: number;
  status?: boolean;
}

// Fetch all social media items
export const fetchPaymentMethodList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaymentMethodResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/sitesettings/payment-methods', { params });
};

// Fetch single social media item
export const fetchPaymentMethodById = async (id: number): Promise<PaymentMethodItemResponse> => {
  return apiCall(`/sitesettings/payment-methods/${id}`);
};

// Create social media item
export const createPaymentMethod = async (formData: FormData): Promise<PaymentMethodItemResponse> => {
  return apiCall('/sitesettings/payment-methods', {
    method: 'POST',
    data: formData,
  });
};

// Update social media item
export const updatePaymentMethod = async (
  id: number,
  formData: FormData
): Promise<PaymentMethodItemResponse> => {
  return apiCall(`/sitesettings/payment-methods/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete social media item
export const deletePaymentMethod = async (id: number): Promise<void> => {
  return apiCall(`/sitesettings/payment-methods/${id}`, {
    method: 'DELETE',
  });
};