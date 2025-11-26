import { apiCall } from '@/utils/apiUtils';

export interface FaqCms {
  id?: number;

  // BANNER SECTION
  banner_title?: string | null;
  banner_title_ar?: string | null;
  banner_media_desktop_path?: string | null;
  banner_media_mobile_path?: string | null;
  banner_media_alt?: string | null;
  banner_media_alt_ar?: string | null;

  // PAGE TITLE
  title?: string | null;
  title_ar?: string | null;

  // QUESTION SECTION
  question_title?: string | null;
  question_title_ar?: string | null;
  question_description?: string | null;
  question_description_ar?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface FaqCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: FaqCms;
}

// Fetch FAQ CMS data
export const fetchFaqCms = async (): Promise<FaqCmsResponse> => {
  return apiCall('/cms/faq/faq-cms');
};

// Update FAQ CMS data
export const saveFaqCms = async (formData: FormData): Promise<FaqCmsResponse> => {
  return apiCall('/cms/faq/faq-cms', {
    method: 'POST',
    data: formData,
  });
};
