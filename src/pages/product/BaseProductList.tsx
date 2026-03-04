import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, ListPlus, ImagePlus } from "lucide-react";
import { fetchBaseProductList, deleteBaseProduct, BaseProduct } from "@/services/product/baseProductApi";
import { useToast } from "@/hooks/use-toast";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { fetchDashboardCounts, DashboardCounts } from "@/services/dashboard/dashboardApi";
import { ShoppingBag, Layers, Box, Loader2 } from "lucide-react";

export default function BaseProductList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
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
    loadBaseProducts();
  }, [currentPage, pageSize, debouncedSearchQuery]);

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
        setStatsLoading(false);
      }
    };

    loadCounts();
  }, []);

  const loadBaseProducts = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchBaseProductList(currentPage, pageSize, debouncedSearchQuery);

      if (response.success) {
        setBaseProducts(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load base products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteBaseProduct(deleteItemId);
      setBaseProducts((prev) => prev.filter((item) => item.id !== deleteItemId));
      setTotalCount((prev) => prev - 1);
      toast({
        title: "Success",
        description: "Base product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete base product",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const columns: ColumnDef<BaseProduct>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-sm">{(currentPage - 1) * pageSize + row.index + 1}</div>,
    },
    {
      accessorKey: "media_path",
      header: "Image",
      cell: ({ row }) => {
        const mediaPath = row.getValue("media_path") as string | null;
        return mediaPath ? (
          <img src={`${import.meta.env.VITE_IMAGE_URL}/${mediaPath}`} alt={row.getValue("title")} className="h-10 w-10 object-cover rounded" />
        ) : (
          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">N/A</div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium max-w-[200px] truncate">{row.getValue("title")}</div>,
    },

    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => <div className="font-mono text-sm text-muted-foreground max-w-[200px] truncate">{row.getValue("slug")}</div>,
    },
    {
      accessorKey: "sort_order",
      header: "Sort Order",
      cell: ({ row }) => <div className="text-sm">{row.getValue("sort_order") || 0}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return createdAt ? (
          <div className="text-sm text-muted-foreground">{new Date(createdAt).toLocaleDateString()}</div>
        ) : (
          <div className="text-sm text-muted-foreground">N/A</div>
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
              <DropdownMenuItem onClick={() => navigate(`/base-products/edit/${item.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/product-models/${item.id}/list`)}>
                <ListPlus className="mr-2 h-4 w-4" />
                Manage Models
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/product-project-images/${item.id}/list`)}>
                <ImagePlus className="mr-2 h-4 w-4" />
                Manage Project Images
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteItemId(item.id!)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      {statsLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsCard
            title="Total Base Product"
            value={counts?.totalBaseProducts ?? 0}
            icon={ShoppingBag}
            description="Total base products"
          />
          <MetricsCard
            title="Total Model"
            value={counts?.totalModels ?? 0}
            icon={Layers}
            description="Total product models"
          />
          <MetricsCard
            title="Total Varient"
            value={counts?.totalVariants ?? 0}
            icon={Box}
            description="Total product variants"
          />
        </div>
      )}

      <DataTable
        columns={columns}
        data={baseProducts}
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
        title="Base Products"
        searchPlaceholder="Search base products..."
        onAdd={() => navigate("/base-products/create")}
        addButtonText="Add Base Product"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the base product and remove its data from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
