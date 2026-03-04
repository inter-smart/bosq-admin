import { apiCall } from '@/utils/apiUtils';

export interface ProjectEnquiry {
  id: number;
  project_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: number;
    title: string;
    slug: string;
  };
}

export interface ProjectEnquiriesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: ProjectEnquiry[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface ProjectEnquiryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: ProjectEnquiry;
}

export const fetchProjectEnquiries = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  startDate?: string,
  endDate?: string
): Promise<ProjectEnquiriesResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) {
    params.search = search;
    params.limit = 100000;
  }
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return apiCall('/enquiries/project', { params });
};

export const fetchProjectEnquiryById = async (id: number): Promise<ProjectEnquiryResponse> =>
  apiCall(`/enquiries/project/${id}`);

export const deleteProjectEnquiry = async (id: number): Promise<void> =>
  apiCall(`/enquiries/project/${id}`, { method: 'DELETE' });
