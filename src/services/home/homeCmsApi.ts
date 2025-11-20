import { apiCall } from '@/utils/apiUtils';

export interface HomeCms {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  content?: string;
  featured_image?: string | null;
  status?: boolean;
  deleted_at?: string | null;
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
export const updateHomeCms = async (formData: FormData): Promise<HomeCmsResponse> => {
  return apiCall('/home/home-cms', {
    method: 'PUT',
    data: formData,
  });
};
