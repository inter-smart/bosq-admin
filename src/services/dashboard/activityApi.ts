import { apiCall, getAuthToken } from "@/utils/apiUtils";

export interface Activity {
  id: string;
  type: "blog" | "job" | "user" | "system";
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status?: "published" | "draft" | "pending" | "active";
}

export interface ActivityFeedResponse {
  success: boolean;
  message: string;
  data: Activity[];
}

export const fetchActivityFeed = (): Promise<ActivityFeedResponse> =>
  apiCall("/dashboard/activity");

export const getSSEUrl = (): string => {
  const base = `${import.meta.env.VITE_API_BASE_URL}/backend`;
  const token = getAuthToken();
  return `${base}/dashboard/activity/stream?token=${encodeURIComponent(token)}`;
};
