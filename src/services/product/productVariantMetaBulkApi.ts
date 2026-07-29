import { getAuthToken } from "@/utils/apiUtils";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/backend`;
const BASE_PATH = `${API_BASE_URL}/products/variant-meta-tags/bulk`;

/* =======================
   Types & Interfaces
======================= */

export interface ValidationError {
  sheet: string;
  row: number;
  field: string;
  message: string;
}

export interface MetaValidationSummary {
  total_rows?: number;
  invalid_rows?: number;
  valid_rows?: number;
}

export interface MetaValidationResult {
  status: "success" | "failed" | "error";
  message?: string;
  token?: string;
  summary?: MetaValidationSummary;
  errors?: ValidationError[];
}

export interface ApproveResult {
  status: string;
  message: string;
  job_id: string;
}

export type JobState = "waiting" | "active" | "completed" | "failed" | "delayed" | "unknown";

export interface MetaJobStatus {
  job_id: string;
  state: JobState;
  progress: number;
  created_at: string;
  result?: {
    created: number;
    updated: number;
    total: number;
  };
  error?: string;
  attempts_made?: number;
}

export interface ExportMetaRow {
  sku: string;
  product_title: string;
  meta_title: string;
  meta_title_ar: string;
  meta_description: string;
  meta_description_ar: string;
  meta_keywords: string;
  meta_keywords_ar: string;
  other_meta: string;
  other_meta_ar: string;
}

export interface ExportMetaDataResult {
  status: "success" | "error";
  data?: {
    rows: ExportMetaRow[];
  };
  message?: string;
}

/* =======================
   API Functions
======================= */

/**
 * Fetches pre-filled meta rows (sku + current meta values, blank if none yet)
 * for the given variant IDs, ready for client-side Excel generation.
 */
export const exportProductVariantMetaBulk = async (variantIds: number[]): Promise<ExportMetaDataResult> => {
  const response = await fetch(`${BASE_PATH}/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ variant_ids: variantIds }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "Export request failed", ...data };
  }

  return data;
};

/**
 * Uploads and validates a product_meta Excel sheet.
 * Does NOT throw on 422 (validation failure) — returns the error payload instead.
 */
export const validateProductVariantMetaBulk = async (file: File): Promise<MetaValidationResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_PATH}/validate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAuthToken()}` },
    body: formData,
  });

  const data = await response.json();

  if (response.status === 422) return data;

  if (!response.ok) {
    throw { message: data.message || "Validation request failed", ...data };
  }

  return data;
};

/**
 * Approves a validated meta upload session and enqueues the background job.
 */
export const approveProductVariantMetaBulk = async (token: string): Promise<ApproveResult> => {
  const response = await fetch(`${BASE_PATH}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "Approval request failed", ...data };
  }

  return data;
};

/**
 * Fetches the current state of a meta upload background job.
 */
export const getProductVariantMetaBulkStatus = async (jobId: string): Promise<MetaJobStatus> => {
  const response = await fetch(`${BASE_PATH}/status/${jobId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "Status request failed", ...data };
  }

  return data;
};
