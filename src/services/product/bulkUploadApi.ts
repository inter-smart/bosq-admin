import { getAuthToken } from "@/utils/apiUtils";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/backend`;

/* =======================
   Types & Interfaces
======================= */

export interface ValidationError {
  sheet: string;
  row: number;
  field: string;
  message: string;
}

export interface ValidationSummary {
  /** Returned on failure */
  total_rows?: number;
  valid_rows?: number;
  invalid_rows?: number;
  /** Returned on success */
  total_bases?: number;
  total_models?: number;
  total_variants?: number;
}

export interface FaqValidationSummary {
  /** Returned on failure */
  total_rows?: number;
  invalid_rows?: number;
  valid_rows?: number;
  /** Returned on success */
  total_faqs?: number;
  total_variants?: number;
}

export interface FaqValidationResult {
  status: "success" | "failed" | "error";
  message?: string;
  token?: string;
  summary?: FaqValidationSummary;
  errors?: ValidationError[];
}

export interface FaqJobStatus {
  job_id: string;
  state: JobState;
  progress: number;
  created_at: string;
  result?: {
    faqs_inserted: number;
    variants_updated: number;
  };
  error?: string;
  attempts_made?: number;
}

export interface ValidationResult {
  status: "success" | "failed" | "error";
  message?: string;
  token?: string;
  summary?: ValidationSummary;
  errors?: ValidationError[];
}

export interface ApproveResult {
  status: string;
  message: string;
  job_id: string;
}

export type JobState = "waiting" | "active" | "completed" | "failed" | "delayed" | "unknown";

export interface UploadJobStatus {
  job_id: string;
  state: JobState;
  progress: number;
  created_at: string;
  result?: {
    bases_created: number;
    bases_updated: number;
    models_created: number;
    models_updated: number;
    variants_created: number;
    variants_updated: number;
    category_links: number;
    attribute_links: number;
    images_inserted: number;
  };
  error?: string;
  attempts_made?: number;
}

/* =======================
   API Functions
======================= */

/**
 * Uploads and validates an Excel file.
 * Does NOT throw on 422 (validation failure) — returns the error payload instead.
 */
export const validateBulkUpload = async (file: File): Promise<ValidationResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-upload/validate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    }
  );

  const data = await response.json();

  // 422 = validation failed — return the payload (not an exception)
  if (response.status === 422) return data;

  if (!response.ok) {
    throw { message: data.message || "Validation request failed", ...data };
  }

  return data;
};

/**
 * Approves a validated upload session and enqueues the background job.
 */
export const approveBulkUpload = async (token: string): Promise<ApproveResult> => {
  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-upload/approve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ token }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "Approval request failed", ...data };
  }

  return data;
};

/**
 * Fetches the current state of a bulk upload background job.
 */
export const getBulkUploadStatus = async (jobId: string): Promise<UploadJobStatus> => {
  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-upload/status/${jobId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "Status request failed", ...data };
  }

  return data;
};

/**
 * Uploads and validates a FAQ Excel file (product_faqs sheet only).
 * Does NOT throw on 422 — returns the error payload instead.
 */
export const validateFaqUpload = async (file: File): Promise<FaqValidationResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-upload/faqs/validate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    }
  );

  const data = await response.json();

  if (response.status === 422) return data;

  if (!response.ok) {
    throw { message: data.message || "FAQ validation request failed", ...data };
  }

  return data;
};

/**
 * Approves a validated FAQ upload session and enqueues the background job.
 */
export const approveFaqUpload = async (token: string): Promise<ApproveResult> => {
  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-upload/faqs/approve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ token }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "FAQ approval request failed", ...data };
  }

  return data;
};

/**
 * Fetches the current state of a FAQ upload background job.
 */
export const getFaqUploadStatus = async (jobId: string): Promise<FaqJobStatus> => {
  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-upload/faqs/status/${jobId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "FAQ status request failed", ...data };
  }

  return data;
};
