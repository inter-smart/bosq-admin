import { apiCall } from '@/utils/apiUtils';

export interface FaqList {
  id?: number;
  question: string;
  question_ar?: string;
  answer: string;
  answer_ar?: string;
  type: 'general' | 'product';
  faq_category_id?: number;
  product_variant_id?: number;
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
  product_variant?: {
    id: number;
    title: string;
    title_ar: string;
    sku: string;
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

export interface FaqListDropdownResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    categories: { id: number; title: string }[];
    products: { id: number; title: string }[];
  };
}

export interface FaqModelsDropdownResponse {
  success: boolean;
  message: string;
  data: {
    models: { id: number; title: string; title_ar: string; slug: string }[];
  };
}

export interface FaqCategoriesDropdownResponse {
  success: boolean;
  message: string;
  data: {
    categories: { id: number; name: string; name_ar: string; slug: string }[];
  };
}

export interface FaqVariantsDropdownResponse {
  success: boolean;
  message: string;
  data: {
    variants: { id: number; title: string; title_ar: string; sku: string; design_title: string; design_title_ar: string }[];
  };
}

// Fetch all FAQ lists
export const fetchFaqListList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  faq_category?: number,
  type?: 'general' | 'product',
  product_variant?: number,
  base_id?: number,
  model_id?: number
): Promise<FaqListResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;
  if (faq_category) params.faq_category = faq_category;
  if (type) params.type = type;
  if (product_variant) params.product_variant = product_variant;
  if (base_id) params.base_id = base_id;
  if (model_id) params.model_id = model_id;
  return apiCall('/cms/faq/faq-list', { params });
};

// Fetch single FAQ list item
export const fetchFaqListById = async (id: number): Promise<FaqListItemResponse> => {
  return apiCall(`/cms/faq/faq-list/${id}`);
};

// Create FAQ list item
export const createFaqList = async (payload: FaqList): Promise<FaqListItemResponse> => {
  return apiCall('/cms/faq/faq-list', { method: 'POST', data: payload });
};

export const updateFaqList = async (id: number, payload: FaqList): Promise<FaqListItemResponse> => {
  return apiCall(`/cms/faq/faq-list/${id}`, { method: 'PUT', data: payload });
};

// Delete FAQ list item
export const deleteFaqList = async (id: number): Promise<void> => {
  return apiCall(`/cms/faq/faq-list/${id}`, { method: 'DELETE' });
};

export const getDropdown = async (): Promise<FaqListDropdownResponse> => {
  return apiCall('/cms/faq/faq-list/dropdown');
};

export const getFaqModelsDropdown = async (base_id: number): Promise<FaqModelsDropdownResponse> => {
  return apiCall('/cms/faq/faq-list/dropdown/models', { params: { base_id } });
};

export const getFaqCategoriesDropdown = async (model_id: number): Promise<FaqCategoriesDropdownResponse> => {
  return apiCall('/cms/faq/faq-list/dropdown/categories', { params: { model_id } });
};

export const getFaqVariantsDropdown = async (model_id: number, category_id?: number): Promise<FaqVariantsDropdownResponse> => {
  const params: Record<string, number> = { model_id };
  if (category_id) params.category_id = category_id;
  return apiCall('/cms/faq/faq-list/dropdown/variants', { params });
};
