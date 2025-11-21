import { apiCall } from '@/utils/apiUtils';

export interface AboutCms {
  id?: number;
  title?: string | null;

  // BANNER SECTION
  banner_title?: string | null;
  banner_description?: string | null;
  banner_media_desktop_path?: string | null;
  banner_media_mobile_path?: string | null;
  banner_media_alt?: string | null;

  // JOURNEY SECTION
  journey_title?: string | null;
  journey_description?: string | null;

  // WHY CHOOSE US SECTION
  why_choose_us_title?: string | null;
  why_choose_us_description?: string | null;

  // TESTIMONIAL SECTION
  testimonial_title?: string | null;

  // CLIENT SECTION
  client_title?: string | null;

  // NEWS SECTION
  news_title?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface AboutCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: AboutCms;
}

// Fetch About CMS data
export const fetchAboutCms = async (): Promise<AboutCmsResponse> => {
  return apiCall('/cms/about/about-cms');
};

// Update About CMS data
export const saveAboutCms = async (formData: FormData): Promise<AboutCmsResponse> => {
  return apiCall('/cms/about/about-cms', {
    method: 'POST',
    data: formData,
  });
};
