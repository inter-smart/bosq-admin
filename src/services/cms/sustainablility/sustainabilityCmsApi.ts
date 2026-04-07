import { apiCall } from '@/utils/apiUtils';

export interface SustainabilityCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;

  // BANNER SECTION
  banner_media_desktop_path?: string | null;
  banner_media_mobile_path?: string | null;
  banner_media_desktop_path_ar?: string | null;
  banner_media_mobile_path_ar?: string | null;
  banner_media_alt?: string | null;
  banner_media_alt_ar?: string | null;
  banner_media_type?: 'image' | 'video' | null;
  banner_media_thumbnail?: string | null;
  banner_media_thumbnail_ar?: string | null;

  // SECTION 1
  section1_title?: string | null;
  section1_title_ar?: string | null;
  section1_description?: string | null;
  section1_description_ar?: string | null;
  section1_media_path?: string | null;
  section1_media_alt?: string | null;
  section1_media_alt_ar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SustainabilityCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: SustainabilityCms;
}

// Fetch Sustainability CMS data
export const fetchSustainabilityCms = async (): Promise<SustainabilityCmsResponse> => {
  return apiCall('/cms/sustainability/sustainability-cms');
};

// Update Sustainability CMS data
export const saveSustainabilityCms = async (formData: FormData): Promise<SustainabilityCmsResponse> => {
  return apiCall('/cms/sustainability/sustainability-cms', {
    method: 'POST',
    data: formData,
  });
};