import { apiCall } from '@/utils/apiUtils';

export interface CustomizationEnquiry {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string | null;
  dropdown_id: number;
  message: string;
  state: {
    id: number;
    name: string
  }
  createdAt: string;
  updatedAt: string;
  dropdown: {
    id: number;
    title: string;
    title_ar?: string;
    sort_order?: number;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
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

// Fetch all General Enquiries
export const fetchCustomizationEnquiries = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  startDate?: string,
  endDate?: string
): Promise<CustomizationEnquiriesResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
    params.limit = 100000;
  }

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiCall('/enquiries/customization', { params });
};

// Fetch single General Enquiry
export const fetchCustomizationEnquiryById = async (id: number): Promise<CustomizationEnquiryResponse> => {
  return apiCall(`/enquiries/customization/${id}`);
};

// Delete General Enquiry
export const deleteCustomizationEnquiry = async (id: number): Promise<void> => {
  return apiCall(`/enquiries/customization/${id}`, {
    method: 'DELETE',
  });
};
