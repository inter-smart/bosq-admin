import { apiCall } from '@/utils/apiUtils';

export interface AboutTestimonials {
  id?: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  name: string;
  name_ar: string;
  designation: string;
  designation_ar: string;
  sort_order: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
}

export interface AboutTestimonialsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: AboutTestimonials[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface AboutTestimonialsItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: AboutTestimonials;
}

// Fetch all About Testimonials
export const fetchAboutTestimonialsList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<AboutTestimonialsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  return apiCall('/cms/about/about-testimonials', { params });
};

// Fetch single About Testimonial
export const fetchAboutTestimonialsById = async (id: number): Promise<AboutTestimonialsItemResponse> => {
  return apiCall(`/cms/about/about-testimonials/${id}`);
};

// Create About Testimonial
export const createAboutTestimonials = async (
  payload: AboutTestimonials
): Promise<AboutTestimonialsItemResponse> => {
  return apiCall('/cms/about/about-testimonials', {
    method: 'POST',
    data: payload,
  });
};

export const updateAboutTestimonials = async (
  id: number,
  payload: AboutTestimonials
): Promise<AboutTestimonialsItemResponse> => {
  return apiCall(`/cms/about/about-testimonials/${id}`, {
    method: 'PUT',
    data: payload,
  });
};

// Delete About Testimonial
export const deleteAboutTestimonials = async (id: number): Promise<void> => {
  return apiCall(`/cms/about/about-testimonials/${id}`, {
    method: 'DELETE',
  });
};
