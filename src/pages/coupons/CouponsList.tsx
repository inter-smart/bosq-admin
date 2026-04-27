import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, FilterOption } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Ticket, CheckCircle, XCircle } from "lucide-react";
import { fetchCouponList, fetchCouponStats, Coupon, CouponStats } from "@/services/coupons/couponsApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import { MetricsCard } from "@/components/dashboard/MetricsCard";


export default function CouponsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string>("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, startDate, endDate, status]);

  useEffect(() => {
    loadCoupons();
  }, [currentPage, pageSize, debouncedSearchQuery, startDate, endDate, status]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchCouponStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to load coupon stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  const loadCoupons = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchCouponList(
        currentPage,
        pageSize,
        debouncedSearchQuery,
        startDate,
        endDate,
        status === "all" ? "" : status
      );

      if (response.success) {
        setCoupons(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
    useCommonTableActions<Coupon>({
      modelName: "Coupons",
      data: coupons,
      setData: setCoupons,
    });

  const formatDate = (dateString: string) => {
    try {
      // Parse only the date part (YYYY-MM-DD) so the browser's UTC→local
      // conversion doesn't shift the displayed day.
      const datePart = dateString.split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
      return format(new Date(year, month - 1, day), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {(currentPage - 1) * pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-mono font-medium">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate">
          {row.getValue("title") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "discount_type",
      header: "Discount",
      cell: ({ row }) => {
        const type = row.getValue("discount_type") as string;
        const value = row.original.discount_value;
        return (
          <Badge variant={type === "percentage" ? "default" : "secondary"}>
            {type === "percentage" ? `${value}%` : `${value} flat`}
          </Badge>
        );
      },
    },
    {
      accessorKey: "scope_type",
      header: "Scope",
      cell: ({ row }) => {
        const scope = row.getValue("scope_type") as string;
        return (
          <Badge variant="outline" className="capitalize">
            {scope}
          </Badge>
        );
      },
    },
    {
      accessorKey: "usage_limit_total",
      header: "Usage Limit",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.usage_limit_per_user} /{" "}
          {row.getValue("usage_limit_total")}
        </div>
      ),
    },
    {
      accessorKey: "start_at",
      header: "Validity",
      cell: ({ row }) => (
        <div className="text-sm">
          <div>{formatDate(row.original.start_at)}</div>
          <div className="text-muted-foreground">
            to {formatDate(row.original.end_at)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const item = row.original;
        const status = row.getValue("status") as boolean;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={status}
              onCheckedChange={() => handleStatusChange(item.id!, status)}
            />
            <Badge variant={status ? "default" : "secondary"}>
              {status ? "active" : "inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/coupons/edit/${item.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filters: FilterOption[] = [
    {
      id: "dateRange",
      label: "Date Range",
      type: "dateRange",
      startDate: startDate,
      endDate: endDate,
      onStartDateChange: setStartDate,
      onEndDateChange: setEndDate,
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      value: status || "all",
      onChange: setStatus,
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Coupons"
          value={statsLoading ? "—" : (stats?.totalCoupons ?? 0)}
          icon={Ticket}
          description="All coupons created"
        />
        <MetricsCard
          title="Active Coupons"
          value={statsLoading ? "—" : (stats?.activeCoupons ?? 0)}
          icon={CheckCircle}
          description="Currently valid coupons"
        />
        <MetricsCard
          title="Expired Coupons"
          value={statsLoading ? "—" : (stats?.expiredCoupons ?? 0)}
          icon={XCircle}
          description="Past end date"
        />
      </div>

      {/* Coupons Table */}
      <DataTable
        columns={columns}
        data={coupons}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searching={searching}
        filters={filters}
        pagination={{
          currentPage,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
        title="Coupons"
        searchPlaceholder="Search coupons..."
        onAdd={() => navigate("/coupons/create")}
        addButtonText="Add Coupon"
      />
    </div>
  );
}
