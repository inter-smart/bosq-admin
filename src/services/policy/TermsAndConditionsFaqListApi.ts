import { apiCall } from '@/utils/apiUtils';

export interface FaqList {
  id: number;
  question: string;
  question_ar: string;
  answer: string;
  answer_ar: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
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

  return apiCall('/cms/termsandconditions/faq', { params });
};

// Fetch single FAQ list item
export const fetchFaqListById = async (id: number): Promise<FaqListItemResponse> => {
  return apiCall(`/cms/termsandconditions/faq/${id}`);
};

// Create FAQ list item
export const createFaqList = async (payload: FaqList): Promise<FaqListItemResponse> => {
  return apiCall('/cms/termsandconditions/faq', {
    method: 'POST',
    data: payload,
  });
};

export const updateFaqList = async (
  id: number,
  payload: FaqList
): Promise<FaqListItemResponse> => {
  return apiCall(`/cms/termsandconditions/faq/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete FAQ list item
export const deleteFaqList = async (id: number): Promise<void> => {
  return apiCall(`/cms/termsandconditions/faq/${id}`, {
    method: 'DELETE',
  });
};
