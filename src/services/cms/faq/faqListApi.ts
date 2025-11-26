import { apiCall } from '@/utils/apiUtils';

export interface FaqList {
  id: number;
  question: string;
  question_ar: string;
  answer: string;
  answer_ar: string;
  category: number;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
  faq_category?: {
    id: number;
    title: string;
    status: boolean;
  };
}

export interface FaqListResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: FaqList[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface FaqListItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: FaqList;
}

// Fetch all FAQ lists
export const fetchFaqListList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: number
): Promise<FaqListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (category) {
    params.category = category;
  }

  return apiCall('/cms/faq/faq-list', { params });
};

// Fetch single FAQ list item
export const fetchFaqListById = async (id: number): Promise<FaqListItemResponse> => {
  return apiCall(`/cms/faq/faq-list/${id}`);
};

// Create FAQ list item
export const createFaqList = async (payload: FaqList): Promise<FaqListItemResponse> => {
  return apiCall('/cms/faq/faq-list', {
    method: 'POST',
    data: payload,
  });
};

export const updateFaqList = async (
  id: number,
  payload: FaqList
): Promise<FaqListItemResponse> => {
  return apiCall(`/cms/faq/faq-list/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete FAQ list item
export const deleteFaqList = async (id: number): Promise<void> => {
  return apiCall(`/cms/faq/faq-list/${id}`, {
    method: 'DELETE',
  });
};
