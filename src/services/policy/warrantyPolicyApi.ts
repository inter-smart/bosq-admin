import { apiCall } from '@/utils/apiUtils';

export interface WarrantyPolicy {
  id?: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  media_path?: string | File | null;
  media_alt?: string;
  media_alt_ar?: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WarrantyPolicyResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: WarrantyPolicy[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface WarrantyPolicyItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: WarrantyPolicy;
}

// Fetch all warranty policies
export const fetchWarrantyPoliciesList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<WarrantyPolicyResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/policy/warranty-policy', { params });
};

// Fetch single warranty policy
export const fetchWarrantyPolicyById = async (id: number): Promise<WarrantyPolicyItemResponse> => {
  return apiCall(`/policy/warranty-policy/${id}`);
};

// Create warranty policy
export const createWarrantyPolicy = async (formData: FormData): Promise<WarrantyPolicyItemResponse> => {
  return apiCall('/policy/warranty-policy', {
    method: 'POST',
    data: formData,
  });
};

// Update warranty policy
export const updateWarrantyPolicy = async (
  id: number,
  formData: FormData
): Promise<WarrantyPolicyItemResponse> => {
  return apiCall(`/policy/warranty-policy/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete warranty policy
export const deleteWarrantyPolicy = async (id: number): Promise<void> => {
  return apiCall(`/policy/warranty-policy/${id}`, {
    method: 'DELETE',
  });
};
