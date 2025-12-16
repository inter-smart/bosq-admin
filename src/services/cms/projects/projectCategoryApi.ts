import { apiCall } from '@/utils/apiUtils';

export interface ProjectCategory {
  id?: number;
  name: string;
  name_ar: string;
  sort_order?: number;
  status?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProjectCategory[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ProjectCategoryItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProjectCategory;
}

// Fetch all project categories
export const fetchProjectCategoryList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ProjectCategoryResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/projects/project-categories', { params });
};

// Fetch single project category
export const fetchProjectCategoryById = async (id: number): Promise<ProjectCategoryItemResponse> => {
  return apiCall(`/projects/project-categories/${id}`);
};

// Create project category
export const createProjectCategory = async (
  payload: ProjectCategory
): Promise<ProjectCategoryItemResponse> => {
  return apiCall('/projects/project-categories', {
    method: 'POST',
    data: payload,
  });
};

export const updateProjectCategory = async (
  id: number,
  payload: ProjectCategory
): Promise<ProjectCategoryItemResponse> => {
  return apiCall(`/projects/project-categories/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete project category
export const deleteProjectCategory = async (id: number): Promise<void> => {
  return apiCall(`/projects/project-categories/${id}`, {
    method: 'DELETE',
  });
};
