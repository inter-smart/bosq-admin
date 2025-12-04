import { apiCall } from '@/utils/apiUtils';

export interface FaqCategory {
  // id: number;
  title: string;
  title_ar: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: FaqCategory[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface FaqCategoryItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: FaqCategory;
}

// Fetch all FAQ categories
export const fetchFaqCategoryList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<FaqCategoryResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/faq/faq-category', { params });
};

// Fetch single FAQ category
export const fetchFaqCategoryById = async (id: number): Promise<FaqCategoryItemResponse> => {
  return apiCall(`/cms/faq/faq-category/${id}`);
};

// Create FAQ category
export const createFaqCategory = async (
  payload: FaqCategory
): Promise<FaqCategoryItemResponse> => {
  return apiCall('/cms/faq/faq-category', {
    method: 'POST',
    data: payload,
  });
};

export const updateFaqCategory = async (
  id: number,
  payload: FaqCategory
): Promise<FaqCategoryItemResponse> => {
  return apiCall(`/cms/faq/faq-category/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete FAQ category
export const deleteFaqCategory = async (id: number): Promise<void> => {
  return apiCall(`/cms/faq/faq-category/${id}`, {
    method: 'DELETE',
  });
};
