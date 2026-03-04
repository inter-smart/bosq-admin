import { apiCall } from '@/utils/apiUtils';

export interface Blog {
  id?: number;
  title: string;
  title_ar?: string;
  slug?: string;
  description: string;
  description_ar?: string;

  meta_title: string;
  meta_title_ar?: string;
  meta_description: string;
  meta_description_ar?: string;
  meta_keywords: string;
  meta_keywords_ar?: string;
  other_meta?: string;
  other_meta_ar?: string;

  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt: string;
  media_alt_ar?: string;
  thumbnail?: string | null;
  thumbnail_alt?: string | null;
  thumbnail_alt_ar?: string | null;
  published_date: string;
  viewCount?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: Blog[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface BlogItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: Blog;
}

// Fetch all blog items
export const fetchBlogList = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<BlogResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
    params.limit = 100000;
  }

  if (status !== undefined && status !== "") {
    params.status = status;
  }

  if (startDate) {
    params.startDate = startDate;
  }

  if (endDate) {
    params.endDate = endDate;
  }

  return apiCall("/blog/blogs", { params });
};

// Fetch single blog item
export const fetchBlogById = async (id: number): Promise<BlogItemResponse> => {
  return apiCall(`/blog/blogs/${id}`);
};

// Create blog item
export const createBlog = async (formData: FormData): Promise<BlogItemResponse> => {
  return apiCall('/blog/blogs', {
    method: 'POST',
    data: formData,
  });
};

// Update blog item
export const updateBlog = async (
  id: number,
  formData: FormData
): Promise<BlogItemResponse> => {
  return apiCall(`/blog/blogs/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete blog item
export const deleteBlog = async (id: number): Promise<void> => {
  return apiCall(`/blog/blogs/${id}`, {
    method: 'DELETE',
  });
};
