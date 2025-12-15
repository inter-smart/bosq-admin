import { apiCall } from '@/utils/apiUtils';

export interface ReturnPolicyCms {
  id?: number;
  media_path?: string | null;
  media_alt?: string | null;
  media_alt_ar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReturnPolicyCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ReturnPolicyCms;
}

// Fetch Return Policy CMS data
export const fetchReturnPolicyCms = async (): Promise<ReturnPolicyCmsResponse> => {
  return apiCall('/policy/returnpolicy/return-policy-cms');
};

// Update Return Policy CMS data
export const saveReturnPolicyCms = async (data: any): Promise<ReturnPolicyCmsResponse> => {
  return apiCall('/policy/returnpolicy/return-policy-cms', {
    method: 'POST',
    data: data,
  });
};
