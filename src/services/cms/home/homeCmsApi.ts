import { apiCall } from '@/utils/apiUtils';

export interface HomeCms {
  id?: number;

  // ABOUT
  about_media_path?: File | null;
  about_media_alt?: string | null;
  about_media_alt_ar?: string | null;
  about_title?: string | null;
  about_title_ar?: string | null;
  about_description?: string | null;
  about_description_ar?: string | null;

  // FEATURED PRODUCTS
  featured_title?: string | null;
  featured_title_ar?: string | null;

  // journey
  journey_title?: string | null;
  journey_title_ar?: string | null;
  journey_description?: string | null;
  journey_description_ar?: string | null;
  journey_media_type?: "image" | "video" | null;
  journey_media_path?: File | null;
  journey_media_alt?: string | null;
  journey_media_alt_ar?: string | null;

  // PROJECT
  project_title?: string | null;
  project_title_ar?: string | null;

  // FITS
  fits_title?: string | null;
  fits_title_ar?: string | null;
  fits_description?: string | null;
  fits_description_ar?: string | null;

  // BRANDS
  brands_title?: string | null;
  brands_title_ar?: string | null;

  // FORM
  form_title?: string | null;
  form_title_ar?: string | null;
  form_description?: string | null;
  form_description_ar?: string | null;
  form_media_path?: File | null;
  form_media_alt?: string | null;
  form_media_alt_ar?: string | null;

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
  return apiCall('/cms/home/home-cms');
};

// Update home CMS data
export const saveHomeCms = async (formData: FormData): Promise<HomeCmsResponse> => {
  return apiCall('/cms/home/home-cms', {
    method: 'POST',
    data: formData,
  });
};
