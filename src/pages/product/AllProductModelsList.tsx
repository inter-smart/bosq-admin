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
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ListPlus,
  XCircle,
  Plus, ChevronDown, ChevronUp} from "lucide-react";
import {
  fetchProductModelList,
  deleteProductModel,
  ProductModel,
} from "@/services/product/productModelApi";
import {
  fetchBaseProductList,
  BaseProduct,
} from "@/services/product/baseProductApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllProductModelsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [models, setModels] = useState<ProductModel[]>([]);
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Load base products for filtering
  useEffect(() => {
    loadBaseProducts();
  }, []);

  const loadBaseProducts = async () => {
    try {
      const response = await fetchBaseProductList(1, 100);
      if (response.success) {
        setBaseProducts(response.data.list);
      }
    } catch (error) {
      console.error("Failed to load base products", error);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadModels();
  }, [currentPage, pageSize, debouncedSearchQuery, selectedProductId]);

  const loadModels = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchProductModelList(
        currentPage,
        pageSize,
        debouncedSearchQuery,
        selectedProductId === "all" ? undefined : parseInt(selectedProductId),
      );

      if (response.success) {
        setModels(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product models",
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
      await deleteProductModel(deleteItemId);
      setModels((prev) => prev.filter((item) => item.id !== deleteItemId));
      setTotalCount((prev) => prev - 1);
      toast({
        title: "Success",
        description: "Product model deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product model",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
    useCommonTableActions<ProductModel>({
      modelName: "ProductModels",
      data: models,
      setData: setModels,
    });

  const columns: ColumnDef<ProductModel>[] = [
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
      accessorKey: "product.title",
      header: "Base Product",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.original.product?.title || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Model Title",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-mono text-sm max-w-[150px] truncate">
          {row.getValue("code")}
        </div>
      ),
    },
    {
      accessorKey: "sort_order",
      header: "Sort Order",
      cell: ({ row }) => {
        const item = row.original;
        const currentVal =
          editingSortOrder[item.id!] !== undefined
            ? editingSortOrder[item.id!]
            : String(row.getValue("sort_order") || 1);
        const numVal = Math.max(1, parseInt(currentVal, 10) || 1);
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleSortOrderChange(item.id!, String(Math.max(1, numVal - 1)))}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min={1}
              value={currentVal}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                if (!isNaN(num) && num >= 1) {
                  handleSortOrderChange(item.id!, String(num));
                }
              }}
              className="w-14 h-7 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleSortOrderChange(item.id!, String(numVal + 1))}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          </div>
        );
      },
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
              {status ? "Active" : "Inactive"}
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
                onClick={() =>
                  navigate(`/product-models/${item.product_id}/edit/${item.id}`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/product-variants/${item.id}/list`)}
              >
                <ListPlus className="mr-2 h-4 w-4" />
                Manage Variants
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteItemId(item.id!)}
              >
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
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">All Product Models</h1>
            <p className="text-muted-foreground">
              Manage all models across all products
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-64">
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {baseProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id?.toString() || ""}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedProductId !== "all" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProductId("all")}
                  title="Clear Filter"
                >
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => navigate(`/product-models/${selectedProductId}/create`)}
              disabled={selectedProductId === "all"}
              title={selectedProductId === "all" ? "Select a product to add a model" : "Add Model"}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Model
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={models}
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
          title=""
          searchPlaceholder="Search models..."
        />
      </div>

      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={() => setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product model and remove its data from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
