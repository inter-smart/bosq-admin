import { apiCall } from '@/utils/apiUtils';

export interface FindYourFit {
  id: number;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  media_path?: File | null;
  media_alt?: string;
  media_alt_ar?: string;
  link?: string;
  sort_order?: number;
  status?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FindYourFitResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: FindYourFit[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface FindYourFitItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: FindYourFit;
}

// Fetch all find your fits
export const fetchFindYourFitsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<FindYourFitResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/home/finds-your-fits', { params });
};

// Fetch single find your fit
export const fetchFindYourFitById = async (id: number): Promise<FindYourFitItemResponse> => {
  return apiCall(`/cms/home/finds-your-fits/${id}`);
};

// Create find your fit
export const createFindYourFit = async (formData: FormData): Promise<FindYourFitItemResponse> => {
  return apiCall('/cms/home/finds-your-fits', {
    method: 'POST',
    data: formData,
  });
};

// Update find your fit
export const updateFindYourFit = async (
  id: number,
  formData: FormData
): Promise<FindYourFitItemResponse> => {
  return apiCall(`/cms/home/finds-your-fits/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete find your fit
export const deleteFindYourFit = async (id: number): Promise<void> => {
  return apiCall(`/cms/home/finds-your-fits/${id}`, {
    method: 'DELETE',
  });
};