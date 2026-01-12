import { apiCall } from '@/utils/apiUtils';

export interface News {
  id?: number;
  title: string;
  title_ar?: string;
  slug?: string;
  description: string;
  description_ar?: string;
  name?: string;
  name_ar?: string;
  
  meta_title: string;
  meta_title_ar?: string;
  meta_description: string;
  meta_description_ar?: string;
  meta_keywords: string;
  meta_keywords_ar?: string;
  
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt: string;
  media_alt_ar?: string;
  thumbnail?: string | null;
  thumbnail_alt?: string | null;
  thumbnail_alt_ar?: string | null;
  published_date: string;
  viewCount?: number;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: News[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface NewsItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: News;
}

// Fetch all news items
export const fetchNewsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<NewsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
    params.limit = 100000
  }

  return apiCall('/news/news', { params });
};

// Fetch single news item
export const fetchNewsById = async (id: number): Promise<NewsItemResponse> => {
  return apiCall(`/news/news/${id}`);
};

// Create news item
export const createNews = async (formData: FormData): Promise<NewsItemResponse> => {
  return apiCall('/news/news', {
    method: 'POST',
    data: formData,
  });
};

// Update news item
export const updateNews = async (
  id: number,
  formData: FormData
): Promise<NewsItemResponse> => {
  return apiCall(`/news/news/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete news item
export const deleteNews = async (id: number): Promise<void> => {
  return apiCall(`/news/news/${id}`, {
    method: 'DELETE',
  });
};
