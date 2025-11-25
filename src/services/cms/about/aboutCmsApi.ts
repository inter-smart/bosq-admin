import { apiCall } from '@/utils/apiUtils';

export interface AboutCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;

  // BANNER SECTION
  banner_media_type?: string | null;
  banner_title?: string | null;
  banner_title_ar?: string | null;
  banner_description?: string | null;
  banner_description_ar?: string | null;
  banner_media_desktop_path?: string | null;
  banner_media_mobile_path?: string | null;
  banner_media_alt?: string | null;
  banner_media_alt_ar?: string | null;
  banner_button_text?: string | null;
  banner_button_text_ar?: string | null;
  banner_button_link?: string | null;

  // JOURNEY SECTION
  journey_title?: string | null;
  journey_title_ar?: string | null;
  journey_description?: string | null;
  journey_description_ar?: string | null;
  journey_one_media_path?: string | null;
  journey_two_media_path?: string | null;
  journey_three_media_path?: string | null;
  journey_one_media_alt?: string | null;
  journey_one_media_alt_ar?: string | null;
  journey_two_media_alt?: string | null;
  journey_two_media_alt_ar?: string | null;
  journey_three_media_alt?: string | null;
  journey_three_media_alt_ar?: string | null;

  // WHY CHOOSE US SECTION
  why_choose_us_title?: string | null;
  why_choose_us_title_ar?: string | null;
  why_choose_us_description?: string | null;
  why_choose_us_description_ar?: string | null;

  // TESTIMONIAL SECTION
  testimonial_title?: string | null;
  testimonial_title_ar?: string | null;

  // CLIENT SECTION
  client_title?: string | null;
  client_title_ar?: string | null;

  // NEWS SECTION
  news_title?: string | null;
  news_title_ar?: string | null;

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
