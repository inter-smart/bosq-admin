import { apiCall } from '@/utils/apiUtils';

export interface SocialMedia {
  id?: number;
  name: string;
  icon: string | null;
  icon_alt: string;
  link: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialMediaResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    data: SocialMedia[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface SocialMediaItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: SocialMedia;
}

export interface CreateSocialMediaData {
  name: string;
  icon?: File | string;
  icon_alt: string;
  link: string;
  sort_order?: number;
  status?: boolean;
}

// Fetch all social media items
export const fetchSocialMediaList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SocialMediaResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/social-media', { params });
};

// Fetch single social media item
export const fetchSocialMediaById = async (id: number): Promise<SocialMediaItemResponse> => {
  return apiCall(`/social-media/${id}`);
};

// Create social media item
export const createSocialMedia = async (formData: FormData): Promise<SocialMediaItemResponse> => {
  return apiCall('/social-media', {
    method: 'POST',
    data: formData,
  });
};

// Update social media item
export const updateSocialMedia = async (
  id: number,
  formData: FormData
): Promise<SocialMediaItemResponse> => {
  return apiCall(`/social-media/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete social media item
export const deleteSocialMedia = async (id: number): Promise<void> => {
  return apiCall(`/social-media/${id}`, {
    method: 'DELETE',
  });
};

// Toggle status
export const toggleSocialMediaStatus = async (id: number): Promise<SocialMediaItemResponse> => {
  return apiCall(`/social-media/${id}/toggle-status`, {
    method: 'PATCH',
  });
};