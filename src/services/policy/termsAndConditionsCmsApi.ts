import { apiCall } from '@/utils/apiUtils';

export interface TermsAndConditionsCms {
  id?: number;
  title?: string | null;
  title_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;
  faq_title?: string | null;
  faq_title_ar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TermsAndConditionsCmsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: TermsAndConditionsCms;
}

// Fetch Terms and Conditions CMS data
export const fetchTermsAndConditionsCms = async (): Promise<TermsAndConditionsCmsResponse> => {
  return apiCall('/cms/termsandconditions/cms');
};

// Update Terms and Conditions CMS data
export const saveTermsAndConditionsCms = async (data: any): Promise<TermsAndConditionsCmsResponse> => {
  return apiCall('/cms/termsandconditions/cms', {
    method: 'POST',
    data: data,
  });
};
