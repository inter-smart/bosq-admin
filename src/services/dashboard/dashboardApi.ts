import { apiCall } from "@/utils/apiUtils";

export interface DashboardCounts {
    totalProducts: number;
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
