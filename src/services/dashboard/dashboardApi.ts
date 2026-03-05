import { apiCall } from "@/utils/apiUtils";

export interface DashboardCounts {
    totalBaseProducts: number;
    totalModels: number;
    totalVariants: number;
    totalProducts?: number; // Keep for backward compatibility if needed, though we should update callers
    totalOrders: number;
    totalUsers: number;
    totalBlogs: number;
    totalNews: number;
    totalProjects: number;
}

export interface DashboardCountsResponse {
    success: boolean;
    message: string;
    timestamp: string;
    statusCode: number;
    data: DashboardCounts;
}

export const fetchDashboardCounts = async (): Promise<DashboardCountsResponse> => {
    return apiCall("/dashboard/counts");
};
