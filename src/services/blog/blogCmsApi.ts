import { apiCall } from '@/utils/apiUtils';

export interface BlogCms {
  id?: number;
  title?: string | null;
  description?: string | null;
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt?: string | null;
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
