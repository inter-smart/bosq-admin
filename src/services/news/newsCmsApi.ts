import { apiCall } from '@/utils/apiUtils';

export interface NewsCms {
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
  popular_news_title?: string | null;
  popular_news_title_ar?: string | null;
  related_news_title?: string | null;
  related_news_title_ar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: NewsCms;
}

// Fetch news CMS data
export const fetchNewsCms = async (): Promise<NewsCmsResponse> => {
  return apiCall('/news/news-cms');
};

// Update news CMS data
export const saveNewsCms = async (formData: FormData): Promise<NewsCmsResponse> => {
  return apiCall('/news/news-cms', {
    method: 'POST',
    data: formData,
  });
};
