import { apiCall } from '@/utils/apiUtils';

export interface CustomizationCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;
  banner_media_desktop_path?: string | null;
  banner_media_mobile_path?: string | null;
  banner_media_desktop_path_ar?: string | null;
  banner_media_mobile_path_ar?: string | null;
  banner_media_thumbnail?: string | null;
  banner_media_thumbnail_ar?: string | null;
  banner_media_alt?: string | null;
  banner_media_alt_ar?: string | null;
  banner_title?: string | null;
  banner_media_type?: "image" | "video" | null;
  banner_title_ar?: string | null;
  banner_description?: string | null;
  banner_description_ar?: string | null;
  process_title?: string | null;
  process_title_ar?: string | null;
  process_description?: string | null;
  process_description_ar?: string | null;
  process_media_path?: string | null;
  process_media_alt?: string | null;
  process_media_alt_ar?: string | null;
  options_title?: string | null;
  options_title_ar?: string | null;
  options_description?: string | null;
  options_description_ar?: string | null;
  form_title?: string | null;
  form_title_ar?: string | null;
  form_description?: string | null;
  form_description_ar?: string | null;
  form_media_path?: string | null;
  form_media_alt?: string | null;
  form_media_alt_ar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomizationCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: CustomizationCms;
}

// Fetch customization CMS data
export const fetchCustomizationCms = async (): Promise<CustomizationCmsResponse> => {
  return apiCall('/cms/customization/customization-cms');
};

// Update customization CMS data
export const saveCustomizationCms = async (formData: FormData): Promise<CustomizationCmsResponse> => {
  return apiCall('/cms/customization/customization-cms', {
    method: 'POST',
    data: formData,
  });
};
