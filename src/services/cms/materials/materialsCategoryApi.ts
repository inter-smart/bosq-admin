import { apiCall } from '@/utils/apiUtils';

export interface MaterialCategory {
  id?: number;
  title: string;
  title_ar: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: MaterialCategory[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface MaterialCategoryItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: MaterialCategory;
}

// Fetch all material categories
export const fetchMaterialCategoryList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<MaterialCategoryResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/materials/materials-category', { params });
};

// Fetch single material category
export const fetchMaterialCategoryById = async (id: number): Promise<MaterialCategoryItemResponse> => {
  return apiCall(`/cms/materials/materials-category/${id}`);
};

// Create material category
export const createMaterialCategory = async (
  payload: MaterialCategory
): Promise<MaterialCategoryItemResponse> => {
  return apiCall('/cms/materials/materials-category', {
    method: 'POST',
    data: payload,
  });
};

// Update material category
export const updateMaterialCategory = async (
  id: number,
  payload: MaterialCategory
): Promise<MaterialCategoryItemResponse> => {
  return apiCall(`/cms/materials/materials-category/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete material category
export const deleteMaterialCategory = async (id: number): Promise<void> => {
  return apiCall(`/cms/materials/materials-category/${id}`, {
    method: 'DELETE',
  });
};
