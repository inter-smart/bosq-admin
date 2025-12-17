import { apiCall } from '@/utils/apiUtils';

export interface SpecialisedArea {
  // Primary fields
  id?: number;
  project_id: number;

  // Media
  media_path: string | File | null;
  media_alt?: string;
  media_alt_ar?: string;

  // Title (bilingual)
  title: string;
  title_ar: string;

  // Settings
  sort_order?: number;
  status?: boolean;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  // Association data
  projects?: {
    id: number;
    title: string;
    title_ar: string;
  };
}

export interface SpecialisedAreaResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: SpecialisedArea[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      projectId: number | null;
      isSearchApplied: boolean;
      searchTerm: string | null;
    };
  };
}

export interface SpecialisedAreaItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: SpecialisedArea;
}

// Fetch all specialised areas with pagination and search
export const fetchSpecialisedAreasList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  projectId: number | null = null
): Promise<SpecialisedAreaResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    project_id: projectId,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/projects/specialised-areas', { params });
};

// Fetch single specialised area by ID
export const fetchSpecialisedAreaById = async (id: number): Promise<SpecialisedAreaItemResponse> => {
  return apiCall(`/projects/specialised-areas/${id}`);
};

// Create new specialised area with FormData for file upload
export const createSpecialisedArea = async (
  formData: FormData
): Promise<SpecialisedAreaItemResponse> => {
  return apiCall('/projects/specialised-areas', {
    method: 'POST',
    data: formData,
  });
};

// Update existing specialised area
export const updateSpecialisedArea = async (
  id: number,
  formData: FormData
): Promise<SpecialisedAreaItemResponse> => {
  return apiCall(`/projects/specialised-areas/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete specialised area (soft delete)
export const deleteSpecialisedArea = async (id: number): Promise<void> => {
  return apiCall(`/projects/specialised-areas/${id}`, {
    method: 'DELETE',
  });
};
