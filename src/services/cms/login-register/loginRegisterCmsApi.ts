import { apiCall } from "@/utils/apiUtils";

export interface LoginRegisterCms {
  id?: number;

  // Signup Section
  signup_title?: string | null;
  signup_title_ar?: string | null;
  signup_subtitle?: string | null;
  signup_subtitle_ar?: string | null;
  signup_media_path?: string | null;

  // OTP Section
  otp_title?: string | null;
  otp_title_ar?: string | null;
  otp_subtitle?: string | null;
  otp_subtitle_ar?: string | null;
  otp_media_path?: string | null;

  // Your Password Section
  your_password_title?: string | null;
  your_password_title_ar?: string | null;
  your_password_subtitle?: string | null;
  your_password_subtitle_ar?: string | null;
  your_password_media_path?: string | null;

  // Login Section
  login_title?: string | null;
  login_title_ar?: string | null;
  login_subtitle?: string | null;
  login_subtitle_ar?: string | null;
  login_media_path?: string | null;

  // Recover Email Section
  recover_email_title?: string | null;
  recover_email_title_ar?: string | null;
  recover_email_subtitle?: string | null;
  recover_email_subtitle_ar?: string | null;
  recover_email_media_path?: string | null;

  // Recover Password Section
  recover_password_title?: string | null;
  recover_password_title_ar?: string | null;
  recover_password_subtitle?: string | null;
  recover_password_subtitle_ar?: string | null;
  recover_password_media_path?: string | null;

  // New Password Section
  new_password_title?: string | null;
  new_password_title_ar?: string | null;
  new_password_media_path?: string | null;

  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRegisterCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: LoginRegisterCms;
}

// Fetch login-register CMS data
export const fetchLoginRegisterCms =
  async (): Promise<LoginRegisterCmsResponse> => {
    return apiCall("/cms/loginregister/login-register-cms");
  };

// Update login-register CMS data
export const saveLoginRegisterCms = async (
  formData: FormData
): Promise<LoginRegisterCmsResponse> => {
  return apiCall("/cms/loginregister/login-register-cms", {
    method: "POST",
    data: formData,
  });
};
