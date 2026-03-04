import { apiCall } from '@/utils/apiUtils';

export interface ContactEnquiry {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactEnquiriesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ContactEnquiry[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ContactEnquiryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ContactEnquiry;
}

// Fetch all contact enquiries
export const fetchContactEnquiries = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  startDate?: string,
  endDate?: string
): Promise<ContactEnquiriesResponse> => {
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

  return apiCall('/enquiries/contact', { params });
};

// Fetch single contact enquiry
export const fetchContactEnquiryById = async (id: number): Promise<ContactEnquiryResponse> => {
  return apiCall(`/enquiries/contact/${id}`);
};

// Delete contact enquiry
export const deleteContactEnquiry = async (id: number): Promise<void> => {
  return apiCall(`/enquiries/contact/${id}`, {
    method: 'DELETE',
  });
};
