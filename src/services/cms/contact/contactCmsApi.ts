import { apiCall } from "@/utils/apiUtils";

export interface ContactCms {
  id?: number;

  // Page Title
  title?: string | null;
  title_ar?: string | null;

  // Form Section
  form_title?: string | null;
  form_title_ar?: string | null;
  form_description?: string | null;
  form_description_ar?: string | null;

  // Media Section
  media_path?: string | null;
  media_alt?: string | null;
  media_alt_ar?: string | null;
  media_title?: string | null;
  media_title_ar?: string | null;
  media_description?: string | null;
  media_description_ar?: string | null;

  // Email Section
  email_title?: string | null;
  email_title_ar?: string | null;
  email?: string | null;

  // Phone Section
  phone_title?: string | null;
  phone_title_ar?: string | null;
  phone_number?: string | null;

  // Address Section
  address_title?: string | null;
  address_title_ar?: string | null;
  address?: string | null;
  address_ar?: string | null;

  // Social Media Section
  social_media_title?: string | null;
  social_media_title_ar?: string | null;

  // Map Integration
  url?: string | null;

  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ContactCms;
}

// Fetch contact CMS data
export const fetchContactCms = async (): Promise<ContactCmsResponse> => {
  return apiCall("/cms/contact/contact-cms");
};

// Update contact CMS data
export const saveContactCms = async (
  formData: FormData
): Promise<ContactCmsResponse> => {
  return apiCall("/cms/contact/contact-cms", {
    method: "POST",
    data: formData,
  });
};
