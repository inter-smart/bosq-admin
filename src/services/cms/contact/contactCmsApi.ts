import { apiCall } from "@/utils/apiUtils";

export interface ContactCms {
  id?: number;

  // ABOUT
  title?: string | null;
  form_title?: string | null;
  form_description?: string | null;
  media_path?: string | null;
  media_alt?: string | null;
  media_title?: string | null;
  media_description?: string | null;

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
