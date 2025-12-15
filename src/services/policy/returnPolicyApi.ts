import { apiCall } from '@/utils/apiUtils';

export interface ReturnPolicy {
  id?: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  sort_order: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
}

export interface ReturnPoliciesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ReturnPolicy[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ReturnPolicyItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ReturnPolicy;
}

// Fetch all Return Policies
export const fetchReturnPoliciesList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ReturnPoliciesResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/policy/returnpolicy/return-policies', { params });
};

// Fetch single Return Policy
export const fetchReturnPolicyById = async (id: number): Promise<ReturnPolicyItemResponse> => {
  return apiCall(`/policy/returnpolicy/return-policies/${id}`);
};

// Create Return Policy
export const createReturnPolicy = async (
  payload: ReturnPolicy
): Promise<ReturnPolicyItemResponse> => {
  return apiCall('/policy/returnpolicy/return-policies', {
    method: 'POST',
    data: payload,
  });
};

// Update Return Policy
export const updateReturnPolicy = async (
  id: number,
  payload: ReturnPolicy
): Promise<ReturnPolicyItemResponse> => {
  return apiCall(`/policy/returnpolicy/return-policies/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete Return Policy
export const deleteReturnPolicy = async (id: number): Promise<void> => {
  return apiCall(`/policy/returnpolicy/return-policies/${id}`, {
    method: 'DELETE',
  });
};
