import { apiCall } from '@/utils/apiUtils';

export interface PrivacyPolicyCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrivacyPolicyCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: PrivacyPolicyCms;
}

// Fetch Privacy Policy CMS data
export const fetchPrivacyPolicyCms = async (): Promise<PrivacyPolicyCmsResponse> => {
  return apiCall('/policy/privacypolicy/policy-cms');
};

// Update Privacy Policy CMS data
export const savePrivacyPolicyCms = async (data: any): Promise<PrivacyPolicyCmsResponse> => {
  return apiCall('/policy/privacypolicy/policy-cms', {
    method: 'POST',
    data: data,
  });
};
