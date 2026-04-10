import { apiCall } from "@/utils/apiUtils";

// ─── Legacy counts (keep for backward compat) ────────────────────────────────
export interface DashboardCounts {
  totalBaseProducts: number;
  totalModels: number;
  totalVariants: number;
  totalProducts?: number;
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

// ─── Filter params ────────────────────────────────────────────────────────────
export interface DashboardFilter {
  year: number;
  month?: number;
}

function buildQuery(filter: DashboardFilter): string {
  const params = new URLSearchParams({ year: String(filter.year) });
  if (filter.month) params.set("month", String(filter.month));
  return `?${params.toString()}`;
}

// ─── Order Stats ──────────────────────────────────────────────────────────────
export interface PeriodOrderBucket {
  label: string;
  orders: number;
  revenue: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  byPeriod: PeriodOrderBucket[];
  byStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
  byPaymentType: Record<string, number>;
}

export const fetchOrderStats = async (filter: DashboardFilter): Promise<OrderStats> => {
  const res = await apiCall(`/dashboard/order-stats${buildQuery(filter)}`);
  return res.data;
};

// ─── Product Stats ────────────────────────────────────────────────────────────
export interface LowStockItem {
  id: number;
  title: string;
  sku: string;
  stock: number;
}

export interface TopSeller {
  id: number;
  title: string;
  sku: string;
  quantity: number;
  revenue: number;
}

export interface ProductStats {
  totalBase: number;
  totalModels: number;
  totalVariants: number;
  activeVariants: number;
  lowStock: LowStockItem[];
  topSellers: TopSeller[];
}

export const fetchProductStats = async (filter?: Partial<DashboardFilter>): Promise<ProductStats> => {
  const params = new URLSearchParams();
  if (filter?.year) params.set("year", String(filter.year));
  if (filter?.month) params.set("month", String(filter.month));
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await apiCall(`/dashboard/product-stats${qs}`);
  return res.data;
};

// ─── Coupon Analytics ─────────────────────────────────────────────────────────
export interface TopCoupon {
  code: string;
  usageCount: number;
  totalDiscount: number;
}

export interface PeriodCouponBucket {
  label: string;
  usages: number;
  discount: number;
}

export interface CouponAnalytics {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUsages: number;
  totalDiscountGiven: number;
  byScope: Record<string, number>;
  topCoupons: TopCoupon[];
  byPeriod: PeriodCouponBucket[];
}

export const fetchCouponAnalytics = async (filter?: Partial<DashboardFilter>): Promise<CouponAnalytics> => {
  const params = new URLSearchParams();
  if (filter?.year) params.set("year", String(filter.year));
  if (filter?.month) params.set("month", String(filter.month));
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await apiCall(`/dashboard/coupon-analytics${qs}`);
  return res.data;
};

// ─── User Stats ───────────────────────────────────────────────────────────────
export interface PeriodUserBucket {
  label: string;
  newUsers: number;
}

export interface TopCustomer {
  id: number;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  newUsersThisPeriod: number;
  byPeriod: PeriodUserBucket[];
  topCustomers: TopCustomer[];
}

export const fetchUserStats = async (filter?: Partial<DashboardFilter>): Promise<UserStats> => {
  const params = new URLSearchParams();
  if (filter?.year) params.set("year", String(filter.year));
  if (filter?.month) params.set("month", String(filter.month));
  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await apiCall(`/dashboard/user-stats${qs}`);
  return res.data;
};
