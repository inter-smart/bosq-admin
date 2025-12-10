import { apiCall } from '@/utils/apiUtils';

export interface Material {
  id?: number;
  category: number;
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
  material_categories?: {
    id: number;
    title: string;
    status: boolean;
  };
}

export interface MaterialsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: Material[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface MaterialItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: Material;
}

// Fetch all materials
export const fetchMaterialsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: number
): Promise<MaterialsResponse> => {
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

  return apiCall('/cms/materials/materials', { params });
};

// Fetch single material
export const fetchMaterialById = async (id: number): Promise<MaterialItemResponse> => {
  return apiCall(`/cms/materials/materials/${id}`);
};

// Create material
export const createMaterial = async (
  formData: FormData
): Promise<MaterialItemResponse> => {
  return apiCall('/cms/materials/materials', {
    method: 'POST',
    data: formData,
  });
};

// Update material
export const updateMaterial = async (
  id: number,
  formData: FormData
): Promise<MaterialItemResponse> => {
  return apiCall(`/cms/materials/materials/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete material
export const deleteMaterial = async (id: number): Promise<void> => {
  return apiCall(`/cms/materials/materials/${id}`, {
    method: 'DELETE',
  });
};
