import { apiCall } from '@/utils/apiUtils';

export interface ExtraMaterial {
  id?: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  media_path?: string | File | null;
  media_alt: string;
  media_alt_ar: string;
  icon_path?: string | File | null;
  sort_order: number;
  status: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExtraMaterialsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ExtraMaterial[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ExtraMaterialItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ExtraMaterial;
}

// Fetch all extra materials
export const fetchExtraMaterialsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ExtraMaterialsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/materials/extra-materials', { params });
};

// Fetch single extra material
export const fetchExtraMaterialById = async (id: number): Promise<ExtraMaterialItemResponse> => {
  return apiCall(`/cms/materials/extra-materials/${id}`);
};

// Create extra material
export const createExtraMaterial = async (
  formData: FormData
): Promise<ExtraMaterialItemResponse> => {
  return apiCall('/cms/materials/extra-materials', {
    method: 'POST',
    data: formData,
  });
};

// Update extra material
export const updateExtraMaterial = async (
  id: number,
  formData: FormData
): Promise<ExtraMaterialItemResponse> => {
  return apiCall(`/cms/materials/extra-materials/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete extra material
export const deleteExtraMaterial = async (id: number): Promise<void> => {
  return apiCall(`/cms/materials/extra-materials/${id}`, {
    method: 'DELETE',
  });
};
