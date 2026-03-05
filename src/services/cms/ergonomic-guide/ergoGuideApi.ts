import { apiCall } from "@/utils/apiUtils";

export interface ErgonomicGuideCms {
  id?: number;

  // Basic Content
  title?: string | null;
  title_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;

  // Media
  media_desktop_path?: string | null;
  media_mobile_path?: string | null;
  media_desktop_path_ar?: string | null;
  media_mobile_path_ar?: string | null;
  media_alt?: string | null;
  media_alt_ar?: string | null;
  media_type?: string | null;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface ErgonomicGuideCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ErgonomicGuideCms;
}

// Fetch ergonomic guide CMS data
// Note: The endpoint uses "ergnomic" (typo) to match the backend implementation
export const fetchErgonomicGuideCms = async (): Promise<ErgonomicGuideCmsResponse> => {
  return apiCall("/cms/ergnomicguide/ergnomic-guide-cms");
};

// Save ergonomic guide CMS data
// Note: The endpoint uses "ergnomic" (typo) to match the backend implementation
export const saveErgonomicGuideCms = async (
  formData: FormData
): Promise<ErgonomicGuideCmsResponse> => {
  return apiCall("/cms/ergnomicguide/ergnomic-guide-cms", {
    method: "POST",
    data: formData,
  });
};
