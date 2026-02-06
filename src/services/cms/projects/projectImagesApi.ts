import { apiCall } from '@/utils/apiUtils';

export interface ProjectImage {
  id?: number;
  project_id: number;

  media_path: string | File | null;
  media_alt?: string;
  media_alt_ar?: string;

  sort_order?: number;
  status?: boolean;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  projects?: {
    id: number;
    title: string;
    title_ar: string;
  };
}

export interface ProjectImageResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProjectImage[];
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

export interface ProjectImageItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProjectImage;
}

export const fetchProjectImagesList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  projectId: string | null = null
): Promise<ProjectImageResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    project_id: projectId as string,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/projects/project-images', { params });
};

export const fetchProjectImageById = async (id: number): Promise<ProjectImageItemResponse> => {
  return apiCall(`/projects/project-images/${id}`);
};

export const createProjectImage = async (
  formData: FormData
): Promise<ProjectImageItemResponse> => {
  return apiCall('/projects/project-images', {
    method: 'POST',
    data: formData,
  });
};

export const updateProjectImage = async (
  id: number,
  formData: FormData
): Promise<ProjectImageItemResponse> => {
  return apiCall(`/projects/project-images/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

export const deleteProjectImage = async (id: number): Promise<void> => {
  return apiCall(`/projects/project-images/${id}`, {
    method: 'DELETE',
  });
};
