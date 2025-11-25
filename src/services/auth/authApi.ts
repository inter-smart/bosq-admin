import { apiCall } from '@/utils/apiUtils';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/backend`;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
      role: string;
      status: boolean;
    };
    tokenType: string;
    expiresIn: string;
    expiresAt: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: boolean;
}

/**
 * Login user and store authentication token
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(errorData.message || 'Invalid username or password');
  }

  const data: LoginResponse = await response.json();

  // Store authentication data
  if (data.success && data.data.token) {
    localStorage.setItem('auth_token', data.data.token);
    localStorage.setItem('user_data', JSON.stringify(data.data.user));
    localStorage.setItem('token_expires_at', data.data.expiresAt);
  }

  return data;
};

/**
 * Logout user and clear authentication data
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('token_expires_at');
  localStorage.removeItem('bosq_auth'); // Remove old mock auth
  localStorage.removeItem('bosq_remember');
};

/**
 * Get currently logged in user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;

  // Check if token is expired
  const expiresAt = localStorage.getItem('token_expires_at');
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    if (expiryDate <= new Date()) {
      logout(); // Clear expired token
      return false;
    }
  }

  return true;
};

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};
