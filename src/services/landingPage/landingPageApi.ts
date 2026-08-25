import { apiCall } from "@/utils/apiUtils";

export interface LandingPage {
  id?: number;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt?: string;
  media_alt_ar?: string;
  button_label?: string;
  button_label_ar?: string;
  link?: string;
  slug?: string;
  form_title?: string;
  form_title_ar?: string;
  form_description?: string;
  form_description_ar?: string;
  form_media_path?: string | null;
  form_media_alt?: string;
  form_media_alt_ar?: string;
  sort_order: number;
  status: boolean;
  show_in_footer: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_title_ar?: string;
  meta_description_ar?: string;
  meta_keywords_ar?: string;
  other_meta?: string;
  other_meta_ar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LandingPageResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: LandingPage[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface LandingPageItemResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: LandingPage;
}

export const fetchLandingPageList = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<LandingPageResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) {
    params.search = search;
  }
  return apiCall("/landing-page", { params });
};

export const fetchLandingPageById = async (id: number): Promise<LandingPageItemResponse> => {
  return apiCall(`/landing-page/${id}`);
};

export const createLandingPage = async (formData: FormData): Promise<LandingPageItemResponse> => {
  return apiCall("/landing-page", {
    method: "POST",
    data: formData,
  });
};

export const updateLandingPage = async (id: number, formData: FormData): Promise<LandingPageItemResponse> => {
  return apiCall(`/landing-page/${id}`, {
    method: "PUT",
    data: formData,
  });
};

export const deleteLandingPage = async (id: number): Promise<void> => {
  return apiCall(`/landing-page/${id}`, {
    method: "DELETE",
  });
};
