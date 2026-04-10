import { useEffect, useState, useCallback } from "react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { RevenueOrderChart } from "@/components/dashboard/RevenueOrderChart";
import { OrderBreakdownCharts } from "@/components/dashboard/OrderBreakdownCharts";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { LowStockTable } from "@/components/dashboard/LowStockTable";
import { CouponStatsSection } from "@/components/dashboard/CouponStatsSection";
import { UserGrowthChart } from "@/components/dashboard/UserGrowthChart";
import {
  fetchOrderStats,
  fetchProductStats,
  fetchCouponAnalytics,
  fetchUserStats,
  OrderStats,
  ProductStats,
  CouponAnalytics,
  UserStats,
} from "@/services/dashboard/dashboardApi";
import {
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  Users,
} from "lucide-react";

function formatCurrency(value: number) {
  return `AED ${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const Index = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | undefined>(undefined);

  // Data states
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [couponAnalytics, setCouponAnalytics] = useState<CouponAnalytics | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Loading states per section
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const loadAll = useCallback(async () => {
    const filter = { year, month };

    setLoadingOrders(true);
    setLoadingProducts(true);
    setLoadingCoupons(true);
    setLoadingUsers(true);

    // Fire all four requests in parallel
    fetchOrderStats(filter)
      .then((d) => setOrderStats(d))
      .catch((e) => console.error("Order stats failed:", e))
      .finally(() => setLoadingOrders(false));

    fetchProductStats(filter)
      .then((d) => setProductStats(d))
      .catch((e) => console.error("Product stats failed:", e))
      .finally(() => setLoadingProducts(false));

    fetchCouponAnalytics(filter)
      .then((d) => setCouponAnalytics(d))
      .catch((e) => console.error("Coupon analytics failed:", e))
      .finally(() => setLoadingCoupons(false));

    fetchUserStats(filter)
      .then((d) => setUserStats(d))
      .catch((e) => console.error("User stats failed:", e))
      .finally(() => setLoadingUsers(false));
  }, [year, month]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleFilterChange = (newYear: number, newMonth?: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="space-y-6">
      {/* Page Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Your BOSQ ecommerce analytics at a glance
          </p>
        </div>
        <DashboardFilters year={year} month={month} onChange={handleFilterChange} />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Revenue"
          value={loadingOrders ? "—" : formatCurrency(orderStats?.totalRevenue ?? 0)}
          icon={DollarSign}
          description={loadingOrders ? "Loading..." : `Avg order: ${formatCurrency(orderStats?.avgOrderValue ?? 0)}`}
        />
        <MetricsCard
          title="Total Orders"
          value={loadingOrders ? "—" : (orderStats?.totalOrders ?? 0)}
          icon={ShoppingCart}
          description="For selected period"
        />
        <MetricsCard
          title="Total Products"
          value={loadingProducts ? "—" : (productStats?.totalVariants ?? 0)}
          icon={ShoppingBag}
          description={loadingProducts ? "Loading..." : `${productStats?.activeVariants ?? 0} active variants`}
        />
        <MetricsCard
          title="Total Users"
          value={loadingUsers ? "—" : (userStats?.totalUsers ?? 0)}
          icon={Users}
          description={loadingUsers ? "Loading..." : `${userStats?.newUsersThisPeriod ?? 0} new this period`}
        />
      </div>

      {/* Revenue & Orders Chart — full width */}
      <RevenueOrderChart
        data={orderStats?.byPeriod ?? []}
        loading={loadingOrders}
      />

      {/* Order Breakdown + Top Products — half/half */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderBreakdownCharts data={orderStats} loading={loadingOrders} />
        <TopProductsChart data={productStats?.topSellers ?? []} loading={loadingProducts} />
      </div>

      {/* Low Stock + Coupon Analytics — half/half */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockTable data={productStats?.lowStock ?? []} loading={loadingProducts} />
        <CouponStatsSection data={couponAnalytics} loading={loadingCoupons} />
      </div>

      {/* User Growth — full width */}
      <UserGrowthChart data={userStats} loading={loadingUsers} />
    </div>
  );
};

export default Index;
