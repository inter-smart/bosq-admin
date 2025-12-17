import { apiCall } from '@/utils/apiUtils';

export interface Project {
  // Primary fields
  id?: number;
  category_id?: number | null;

  // Basic content (bilingual)
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;

  // Thumbnail
  thumbnail: string | File | null;

  // Section 1 - Hero Media (desktop/mobile)
  section1_desktop_media_path: string | File | null;
  section1_mobile_media_path: string | File | null;
  section1_media_alt: string;
  section1_media_alt_ar: string;

  // Section 2 - Dual Images
  section2_first_media_path: string | File | null;
  section2_first_media_alt: string;
  section2_first_media_alt_ar: string;
  section2_second_media_path: string | File | null;
  section2_second_alt: string;
  section2_second_media_alt_ar: string;

  // Section 3 - Content with media
  section3_title: string;
  section3_title_ar: string;
  section3_description: string;
  section3_description_ar: string;
  section3_media_path: string | File | null;
  section3_media_alt: string;
  section3_media_alt_ar: string;

  // Section 4
  section4_title: string;
  section4_title_ar: string;

  // SEO & Meta
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  meta_title_ar: string;
  meta_description_ar: string;
  meta_keywords_ar: string;

  // JSONB Arrays - stored as arrays of strings
  tags: string[];
  tags_ar: string[];
  features: string[];
  features_ar: string[];

  // Settings
  sort_order?: number;
  status?: boolean;
  show_in_home?: boolean;
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: Project[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
      searchTerm: string | null;
    };
  };
}

export interface ProjectItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: Project;
}

// Fetch all projects with pagination, search, and category filter
export const fetchProjectsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category_id?: number
): Promise<ProjectResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (category_id) {
    params.category_id = category_id;
  }

  return apiCall('/projects/projects', { params });
};

// Fetch single project by ID
export const fetchProjectById = async (id: number): Promise<ProjectItemResponse> => {
  return apiCall(`/projects/projects/${id}`);
};

// Create new project with FormData for file uploads
export const createProject = async (
  formData: FormData
): Promise<ProjectItemResponse> => {
  return apiCall('/projects/projects', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Update existing project
export const updateProject = async (
  id: number,
  formData: FormData
): Promise<ProjectItemResponse> => {
  return apiCall(`/projects/projects/${id}`, {
    method: 'PUT',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete project (soft delete)
export const deleteProject = async (id: number): Promise<void> => {
  return apiCall(`/projects/projects/${id}`, {
    method: 'DELETE',
  });
};
