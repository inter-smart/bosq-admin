import { apiCall } from "@/utils/apiUtils";

export interface AuthCms {
  id?: number;

  // LOGIN SECTION
  login_title?: string | null;
  login_title_ar?: string | null;
  login_description_ar?: string | null;
  login_description?: string | null;
  login_media_desktop_path?: string | null;
  login_media_alt?: string | null;
  login_media_alt_ar?: string | null;

  // SIGNUP SECTION
  signup_title?: string | null;
  signup_title_ar?: string | null;
  signup_description_ar?: string | null;
  signup_description?: string | null;
  signup_media_desktop_path?: string | null;
  signup_media_alt?: string | null;
  signup_media_alt_ar?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface AuthCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: AuthCms;
}

// Fetch Auth CMS data
export const fetchAuthCms = async (): Promise<AuthCmsResponse> => {
  return apiCall("/cms/auth/auth-cms");
};

// Update Auth CMS data
export const saveAuthCms = async (formData: FormData): Promise<AuthCmsResponse> => {
  return apiCall("/cms/auth/auth-cms", {
    method: "POST",
    data: formData,
  });
};
