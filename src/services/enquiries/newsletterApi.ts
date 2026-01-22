import { apiCall } from '@/utils/apiUtils';

export interface NewsletterSubscription {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriptionsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: NewsletterSubscription[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface NewsletterSubscriptionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: NewsletterSubscription;
}

// Fetch all newsletter subscriptions
export const fetchNewsletterSubscriptions = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<NewsletterSubscriptionsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
    params.limit = 100000;
  }

  return apiCall('/enquiries/newsletter', { params });
};

// Fetch single newsletter subscription
export const fetchNewsletterSubscriptionById = async (id: number): Promise<NewsletterSubscriptionResponse> => {
  return apiCall(`/enquiries/newsletter/${id}`);
};

// Delete newsletter subscription
export const deleteNewsletterSubscription = async (id: number): Promise<void> => {
  return apiCall(`/enquiries/newsletter/${id}`, {
    method: 'DELETE',
  });
};
