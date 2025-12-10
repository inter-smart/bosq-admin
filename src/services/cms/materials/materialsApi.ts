import { apiCall } from '@/utils/apiUtils';

export interface MaterialsCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;

  // BANNER SECTION
  banner_title?: string | null;
  banner_title_ar?: string | null;
  banner_media_desktop_path?: string | null;
  banner_media_mobile_path?: string | null;
  banner_media_alt?: string | null;
  banner_media_alt_ar?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialsCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: MaterialsCms;
}

// Fetch Materials CMS data
export const fetchMaterialsCms = async (): Promise<MaterialsCmsResponse> => {
  return apiCall('/cms/materials/materials-cms');
};

// Update Materials CMS data
export const saveMaterialsCms = async (formData: FormData): Promise<MaterialsCmsResponse> => {
  return apiCall('/cms/materials/materials-cms', {
    method: 'POST',
    data: formData,
  });
};
