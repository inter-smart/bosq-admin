import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit } from "lucide-react";
import { fetchCouponList, Coupon } from "@/services/coupons/couponsApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

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

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadCoupons();
  }, [currentPage, pageSize, debouncedSearchQuery]);

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
      return format(new Date(dateString), "MMM dd, yyyy");
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

  return (
    <DataTable
      columns={columns}
      data={coupons}
      loading={loading}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searching={searching}
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
  );
}
