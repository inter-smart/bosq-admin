import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useEffect, useState } from "react";
import { fetchDashboardCounts, DashboardCounts } from "@/services/dashboard/dashboardApi";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  FileText,
  Newspaper,
  Briefcase,
  Loader2,
} from "lucide-react";

const Index = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const response = await fetchDashboardCounts();
        if (response.success) {
          setCounts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your BOSQ content.
        </p>
      </div>

      {/* Metrics Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricsCard
            title="Total Products"
            value={counts?.totalProducts ?? 0}
            icon={ShoppingBag}
            description="Products in the catalog"
          />
          <MetricsCard
            title="Total Orders"
            value={counts?.totalOrders ?? 0}
            icon={ShoppingCart}
            description="All time orders"
          />
          <MetricsCard
            title="Total Users"
            value={counts?.totalUsers ?? 0}
            icon={Users}
            description="Registered users"
          />
          <MetricsCard
            title="Total Blog Posts"
            value={counts?.totalBlogs ?? 0}
            icon={FileText}
            description="Published articles"
          />
          <MetricsCard
            title="Total News"
            value={counts?.totalNews ?? 0}
            icon={Newspaper}
            description="Published news items"
          />
          <MetricsCard
            title="Total Projects"
            value={counts?.totalProjects ?? 0}
            icon={Briefcase}
            description="Active projects"
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <QuickActions />
      </div>
    </div>
  );
};

export default Index;
