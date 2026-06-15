import { apiCall } from '@/utils/apiUtils';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/backend`;

export interface LoginCredentials {
  email: string;
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
    throw new Error(errorData.message || 'Invalid email or password');
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
 * Silently refresh the admin session token if the user is active.
 * Updates localStorage with the new token and expiry.
 * Returns true if refresh was successful, false otherwise.
 */
export const refreshSession = async (): Promise<boolean> => {
  try {
    const response = await apiCall('/auth/auth/refresh-token', { method: 'POST' });
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      localStorage.setItem('token_expires_at', response.data.expiresAt);
      return true;
    }
    return false;
  } catch {
    return false;
  }
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

/**
 * Request password reset - sends OTP to email
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/auth/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to send password reset request');
  }

  return data;
};

/**
 * Verify OTP and reset password
 */
export const verifyResetOtp = async (
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/auth/auth/verify-reset-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "OTP verification failed");
  }

  return data;
};


/**
 * Password reset
 */

export const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/auth/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword, confirmPassword }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }

  return data;
};


/**
 * Resend OTP for password reset
 */
export const resendOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/auth/resend-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("error ", data)
    throw new Error(data?.error?.message || 'Failed to resend OTP');
  }

  return data;
};
