import { apiCall } from "@/utils/apiUtils";

export interface ProjectsCms {
  id?: number;

  // Page Title
  title?: string | null;
  title_ar?: string | null;

  // Banner Section
  banner_title?: string | null;
  banner_title_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;

  // Banner Media
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_alt?: string | null;
  media_alt_ar?: string | null;
  media_type?: string | null;

  // Form Section
  form_title?: string | null;
  form_title_ar?: string | null;
  form_description?: string | null;
  form_description_ar?: string | null;

  // Form Media
  form_media_path?: string | null;
  form_media_alt?: string | null;
  form_media_alt_ar?: string | null;

  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProjectsCms;
}

// Fetch projects CMS data
export const fetchProjectsCms = async (): Promise<ProjectsCmsResponse> => {
  return apiCall("/projects/projects-cms");
};

// Update projects CMS data
export const saveProjectsCms = async (
  formData: FormData
): Promise<ProjectsCmsResponse> => {
  return apiCall("/projects/projects-cms", {
    method: "POST",
    data: formData,
  });
};
