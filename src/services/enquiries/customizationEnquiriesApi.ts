import { apiCall } from '@/utils/apiUtils';

export interface CustomizationEnquiry {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string | null;
  options_id: number;
  message: string;
  state:{
    id: number;
    name: string
  }
  createdAt: string;
  updatedAt: string;
  options: {
    id: number;
    title: string;
  };
}

export interface CustomizationEnquiriesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: CustomizationEnquiry[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface CustomizationEnquiryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: CustomizationEnquiry;
}

// Fetch all customization enquiries
export const fetchCustomizationEnquiries = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CustomizationEnquiriesResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
    params.limit = 100000;
  }

  return apiCall('/enquiries/customization', { params });
};

// Fetch single customization enquiry
export const fetchCustomizationEnquiryById = async (id: number): Promise<CustomizationEnquiryResponse> => {
  return apiCall(`/enquiries/customization/${id}`);
};

// Delete customization enquiry
export const deleteCustomizationEnquiry = async (id: number): Promise<void> => {
  return apiCall(`/enquiries/customization/${id}`, {
    method: 'DELETE',
  });
};
