import { apiCall } from '@/utils/apiUtils';

export interface UserAddress {
  id: string;
  user_id: string;
  address_type: string;
  name: string;
  company_name: string;
  email: string;
  country_code: string;
  phone: string;
  country: string;
  street_address: string;
  apartment: string;
  state: string;
  order_notes: string;
  is_default: boolean;
  parent_address_id: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  slug: string;
  email: string;
  country_code: string;
  mobile: string;
  profile_image: string | null;
  email_verified: boolean;
  mobile_verified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  addresses?: UserAddress[];
}

export interface UsersResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: {
    list: User[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      isSearchApplied: boolean;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  timestamp: string;
  statusCode: number;
  data: User;
}

// Fetch all users
export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<UsersResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
    params.limit = 100000;
  }

  return apiCall('/users/users', { params });
};

// Fetch single user by ID
export const fetchUserById = async (id: string): Promise<UserResponse> => {
  return apiCall(`/users/users/${id}`);
};
