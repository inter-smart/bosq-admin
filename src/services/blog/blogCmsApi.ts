import { apiCall } from '@/utils/apiUtils';

export interface BlogCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;
  banner_title?: string | null;
  banner_title_ar?: string | null;
  banner_description?: string | null;
  banner_description_ar?: string | null;
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt?: string | null;
  media_alt_ar?: string | null;
  popular_blogs_title?: string | null;
  popular_blogs_title_ar?: string | null;
  related_blogs_title?: string | null;
  related_blogs_title_ar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: BlogCms;
}

// Fetch blog CMS data
export const fetchBlogCms = async (): Promise<BlogCmsResponse> => {
  return apiCall('/blog/blog-cms');
};

// Update blog CMS data
export const saveBlogCms = async (formData: FormData): Promise<BlogCmsResponse> => {
  return apiCall('/blog/blog-cms', {
    method: 'POST',
    data: formData,
  });
};
