import { apiCall } from '@/utils/apiUtils';

export interface AboutOurClients {
  id: number;
  media_path?: string | null;
  title: string;
  title_ar: string;
  sort_order: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
}

export interface AboutOurClientsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: AboutOurClients[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface AboutOurClientsItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: AboutOurClients;
}

// Fetch all About OurClientss
export const fetchAboutOurClientsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<AboutOurClientsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/about/about-our-clients', { params });
};

// Fetch single About OurClients
export const fetchAboutOurClientsById = async (id: number): Promise<AboutOurClientsItemResponse> => {
  return apiCall(`/cms/about/about-our-clients/${id}`);
};

// Create About OurClients
export const createAboutOurClients = async (
  formData: FormData
): Promise<AboutOurClientsItemResponse> => {
  return apiCall('/cms/about/about-our-clients', {
    method: 'POST',
    data: formData,
  });
};

export const updateAboutOurClients = async (
  id: number,
   formData: FormData
): Promise<AboutOurClientsItemResponse> => {
  return apiCall(`/cms/about/about-our-clients/${id}`, {
    method: 'PUT',
    data: formData,
  });
};

// Delete About OurClients
export const deleteAboutOurClients = async (id: number): Promise<void> => {
  return apiCall(`/cms/about/about-our-clients/${id}`, {
    method: 'DELETE',
  });
};
