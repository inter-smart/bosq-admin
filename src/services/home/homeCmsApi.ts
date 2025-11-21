import { apiCall } from '@/utils/apiUtils';

export interface HomeCms {
  id?: number;

  // ABOUT
  about_media_path?: string | null;
  about_media_alt?: string | null;
  about_title?: string | null;
  about_description?: string | null;

  // FEATURED PRODUCTS
  featured_title?: string | null;

  // JOURNY
  journy_title?: string | null;
  journy_description?: string | null;
  journey_media_type?: "image" | "video" | null;
  journy_media_path?: string | null;
  journy_media_alt?: string | null;

  // PROJECT
  project_title?: string | null;

  // CALCULATOR
  calculator_title?: string | null;
  calculator_description?: string | null;
  calculator_media_path?: string | null;
  calculator_media_alt?: string | null;

  // CUSTOMIZE
  customize_title?: string | null;
  customize_description?: string | null;
  customize_media_path?: string | null;
  customize_media_alt?: string | null;

  // FITS
  fits_title?: string | null;
  fits_description?: string | null;

  // BRANDS
  brands_title?: string | null;

  // FORM
  form_title?: string | null;
  form_description?: string | null;
  form_media_path?: string | null;
  form_media_alt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface HomeCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: HomeCms;
}

// Fetch home CMS data
export const fetchHomeCms = async (): Promise<HomeCmsResponse> => {
  return apiCall('/home/home-cms');
};

// Update home CMS data
export const saveHomeCms = async (formData: FormData): Promise<HomeCmsResponse> => {
  return apiCall('/home/home-cms', {
    method: 'POST',
    data: formData,
  });
};
