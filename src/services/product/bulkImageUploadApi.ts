import { getAuthToken } from "@/utils/apiUtils";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/backend`;

/* =======================
   Types & Interfaces
======================= */

export type BulkImageJobState =
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "delayed"
  | "unknown";

export interface BulkImageUploadResult {
  saved_count: number;
  skipped_count: number;
  skipped_files: string[];
}

export interface BulkImageJobStatus {
  job_id: string;
  state: BulkImageJobState;
  /** 0–100 */
  progress: number;
  total_files: number;
  created_at: string;
  result?: BulkImageUploadResult;
  error?: string;
  attempts_made?: number;
}

export interface BulkImageUploadQueued {
  status: string;
  message: string;
  job_id: string;
  total_files: number;
}

/* =======================
   API Functions
======================= */

/**
 * Uploads up to 100 image/video files to the bulk staging endpoint.
 * The server immediately queues a background job and returns a job_id.
 */
export const uploadBulkImages = async (
  files: File[]
): Promise<BulkImageUploadQueued> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-image-upload/upload`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || "Upload request failed", ...data };
  }

  return data;
};

/**
 * Polls the status of a bulk image upload background job.
 */
export const getBulkImageUploadStatus = async (
  jobId: string
): Promise<BulkImageJobStatus> => {
  const response = await fetch(
    `${API_BASE_URL}/resources/product-bulk-image-upload/status/${jobId}`,
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
