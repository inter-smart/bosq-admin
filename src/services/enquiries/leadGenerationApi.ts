import { apiCall } from '@/utils/apiUtils';

export interface LeadGeneration {
  id: number;
  type: string;
  name: string;
  phone: string | null;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadGenerationListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: LeadGeneration[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface LeadGenerationResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: LeadGeneration;
}

// Fetch all lead generation entries
export const fetchLeadGenerations = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  startDate?: string,
  endDate?: string
): Promise<LeadGenerationListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
    params.limit = 100000;
  }

  if (startDate) {
    params.startDate = startDate;
  }

  if (endDate) {
    params.endDate = endDate;
  }

  return apiCall('/enquiries/lead-generation', { params });
};

// Fetch single lead generation entry
export const fetchLeadGenerationById = async (id: number): Promise<LeadGenerationResponse> => {
  return apiCall(`/enquiries/lead-generation/${id}`);
};

// Create lead generation entry
export const createLeadGeneration = async (data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<LeadGenerationResponse> => {
  return apiCall('/enquiries/lead-generation', {
    method: 'POST',
    data,
  });
};

// Update lead generation entry
export const updateLeadGeneration = async (
  id: number,
  data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }
): Promise<LeadGenerationResponse> => {
  return apiCall(`/enquiries/lead-generation/${id}`, {
    method: 'PUT',
    data,
  });
};

// Delete lead generation entry
export const deleteLeadGeneration = async (id: number): Promise<void> => {
  return apiCall(`/enquiries/lead-generation/${id}`, {
    method: 'DELETE',
  });
};

// Bulk delete lead generation entries
export const bulkDeleteLeadGenerations = async (ids: number[]): Promise<void> => {
  return apiCall('/enquiries/lead-generation/bulk-delete', {
    method: 'POST',
    data: { ids },
  });
};
