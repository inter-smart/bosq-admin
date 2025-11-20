import { apiCall } from '@/utils/apiUtils';

export interface SiteSettings {
  id?: number;
  address: string;
  email: string;
  phone: string;
  logo: string | null;
  logo_alt: string;
  favicon: string | null;
  footer_download_image_one: string | null;
  footer_download_image_one_alt: string;
  footer_download_image_one_link: string;
  footer_download_image_two: string | null;
  footer_download_image_two_alt: string;
  footer_download_image_two_link: string;
  footer_logo: string | null;
  footer_logo_alt: string;
  footer_description: string;
  social_media_title: string;
  subscribe_title: string;
  status?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettingsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: SiteSettings;
}

export interface CreateSiteSettingsData {
  address: string;
  email: string;
  phone: string;
  logo?: File | string;
  logo_alt: string;
  favicon?: File | string;
  footer_download_image_one?: File | string;
  footer_download_image_one_alt: string;
  footer_download_image_one_link: string;
  footer_download_image_two?: File | string;
  footer_download_image_two_alt: string;
  footer_download_image_two_link: string;
  footer_logo?: File | string;
  footer_logo_alt: string;
  footer_description: string;
  social_media_title: string;
  subscribe_title: string;
}

// Fetch Site Settings data
export const fetchSiteSettings = async (): Promise<SiteSettingsResponse> => {
  return apiCall('/site-settings');
};

// Create or Update Site Settings data
export const saveSiteSettings = async (
  formData: FormData
): Promise<SiteSettings> => {
  return apiCall('/site-settings', {
    method: 'POST',
    data: formData,
  });
};