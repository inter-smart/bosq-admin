import { apiCall } from '@/utils/apiUtils';

export interface AboutJourneys {
  id?: number;
  title: string;
  title_ar: string;
  sort_order: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
}

export interface AboutJourneysResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: AboutJourneys[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface AboutJourneysItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: AboutJourneys;
}

// Fetch all About Journeys
export const fetchAboutJourneysList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<AboutJourneysResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/about/about-journeys', { params });
};

// Fetch single About Journey
export const fetchAboutJourneysById = async (id: number): Promise<AboutJourneysItemResponse> => {
  return apiCall(`/cms/about/about-journeys/${id}`);
};

// Create About Journey
export const createAboutJourneys = async (
  payload: AboutJourneys
): Promise<AboutJourneysItemResponse> => {
  return apiCall('/cms/about/about-journeys', {
    method: 'POST',
    data: payload,
  });
};

export const updateAboutJourneys = async (
  id: number,
  payload: AboutJourneys
): Promise<AboutJourneysItemResponse> => {
  return apiCall(`/cms/about/about-journeys/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete About Journey
export const deleteAboutJourneys = async (id: number): Promise<void> => {
  return apiCall(`/cms/about/about-journeys/${id}`, {
    method: 'DELETE',
  });
};
