import { apiCall } from '@/utils/apiUtils';

export interface ProductEnquiry {
  id: number;
  product_id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  media_path: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    title: string;
  };
}

export interface ProductEnquiriesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProductEnquiry[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ProductEnquiryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProductEnquiry;
}

// Fetch all product enquiries
export const fetchProductEnquiries = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  startDate?: string,
  endDate?: string
): Promise<ProductEnquiriesResponse> => {
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

  return apiCall('/enquiries/product', { params });
};

// Fetch single product enquiry
export const fetchProductEnquiryById = async (id: number): Promise<ProductEnquiryResponse> => {
  return apiCall(`/enquiries/product/${id}`);
};

// Delete product enquiry
export const deleteProductEnquiry = async (id: number): Promise<void> => {
  return apiCall(`/enquiries/product/${id}`, {
    method: 'DELETE',
  });
};
