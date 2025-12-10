import { apiCall } from '@/utils/apiUtils';

export interface Policy {
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

export interface PoliciesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: Policy[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface PolicyItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: Policy;
}

// Fetch all Policies
export const fetchPoliciesList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PoliciesResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/policy/privacypolicy/policies', { params });
};

// Fetch single Policy
export const fetchPolicyById = async (id: number): Promise<PolicyItemResponse> => {
  return apiCall(`/policy/privacypolicy/policies/${id}`);
};

// Create Policy
export const createPolicy = async (
  payload: Policy
): Promise<PolicyItemResponse> => {
  return apiCall('/policy/privacypolicy/policies', {
    method: 'POST',
    data: payload,
  });
};

// Update Policy
export const updatePolicy = async (
  id: number,
  payload: Policy
): Promise<PolicyItemResponse> => {
  return apiCall(`/policy/privacypolicy/policies/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete Policy
export const deletePolicy = async (id: number): Promise<void> => {
  return apiCall(`/policy/privacypolicy/policies/${id}`, {
    method: 'DELETE',
  });
};
