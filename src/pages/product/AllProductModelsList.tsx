import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, ListPlus, XCircle, Plus, ChevronDown, ChevronUp, TriangleAlert } from "lucide-react";
import { fetchProductModelList, deleteProductModel, bulkDeleteProductModels, ProductModel } from "@/services/product/productModelApi";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchBaseProductList, BaseProduct } from "@/services/product/baseProductApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AllProductModelsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [models, setModels] = useState<ProductModel[]>([]);
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<number[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteType, setDeleteType] = useState<"soft" | "force">("soft");

  // Filters, search, and pagination live in the URL query string so the view
  // is bookmarkable/shareable and survives navigating away and back.
  const [filters, setFilters] = useQueryStates(
    {
      product: parseAsString.withDefault("all"),
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
    },
    { history: "replace" },
  );
  const { product: selectedProductId, page: currentPage, pageSize } = filters;

  // Local mirror of the search input so typing stays instant; only the
  // settled value (after the debounce below) is written to the URL/fetched.
  const [searchQuery, setSearchQuery] = useState(filters.search);

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

  // Debounce search query into the URL — only the settled value is fetched/shared.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        setFilters({ search: searchQuery, page: 1 });
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    loadModels();
  }, [currentPage, pageSize, filters.search, selectedProductId]);

  const loadModels = async () => {
    try {
      if (filters.search) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchProductModelList(
        currentPage,
        pageSize,
        filters.search,
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

  const handleBulkAction = (action: string, selectedRows: ProductModel[]) => {
    if (action === "delete") {
      setBulkDeleteIds(selectedRows.map((r) => r.id!));
      setShowBulkDeleteDialog(true);
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteProductModels(bulkDeleteIds, deleteType);
      setModels((prev) => prev.filter((m) => !bulkDeleteIds.includes(m.id!)));
      setTotalCount((prev) => prev - bulkDeleteIds.length);
      toast({
        title: "Success",
        description: `${bulkDeleteIds.length} model(s) deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected models",
        variant: "destructive",
      });
    } finally {
      setBulkDeleteIds([]);
      setShowBulkDeleteDialog(false);
      setTableKey((k) => k + 1);
    }
  };

  const handleProductFilterChange = (value: string) => {
    setFilters({ product: value, page: 1 });
  };

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } = useCommonTableActions<ProductModel>({
    modelName: "ProductModels",
    data: models,
    setData: setModels,
  });

  const columns: ColumnDef<ProductModel>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-sm">{(currentPage - 1) * pageSize + row.index + 1}</div>,
    },
    {
      accessorKey: "title",
      header: "Model Title",
      cell: ({ row }) => <div className="font-medium max-w-[200px] truncate">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "product.title",
      header: "Base Product",
      cell: ({ row }) => <div className="font-medium max-w-[200px] truncate">{row.original.product?.title || "N/A"}</div>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => <div className="font-mono text-sm max-w-[150px] truncate">{row.getValue("slug")}</div>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div className="font-mono text-sm max-w-[150px] truncate">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "sort_order",
      header: "Sort Order",
      cell: ({ row }) => {
        const item = row.original;
        const currentVal = editingSortOrder[item.id!] !== undefined ? editingSortOrder[item.id!] : String(row.getValue("sort_order") || 1);
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
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleSortOrderChange(item.id!, String(numVal + 1))}>
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
            <Switch checked={status} onCheckedChange={() => handleStatusChange(item.id!, status)} />
            <Badge variant={status ? "default" : "secondary"}>{status ? "Active" : "Inactive"}</Badge>
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
              <DropdownMenuItem onClick={() => navigate(`/product-models/${item.product_id}/edit/${item.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/product-variants/${item.id}/list`)}>
                <ListPlus className="mr-2 h-4 w-4" />
                Manage Variants
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
            <p className="text-muted-foreground">Manage all models across all products</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-64">
                <Select value={selectedProductId} onValueChange={handleProductFilterChange}>
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
                <Button variant="ghost" size="icon" onClick={() => handleProductFilterChange("all")} title="Clear Filter">
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
          key={tableKey}
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
            onPageChange: (page: number) => setFilters({ page }),
            onPageSizeChange: (size: number) => setFilters({ pageSize: size, page: 1 }),
          }}
          title=""
          searchPlaceholder="Search models..."
          onBulkAction={handleBulkAction}
        />
      </div>

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={(open) => { setShowBulkDeleteDialog(open); if (!open) setDeleteType("soft"); }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <TriangleAlert className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <AlertDialogTitle className="text-base">
                  Delete {bulkDeleteIds.length} model{bulkDeleteIds.length !== 1 ? "s" : ""}?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs mt-0.5">
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              All related product variants will also be permanently deleted.
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Delete Type</Label>
              <RadioGroup
                value={deleteType}
                onValueChange={(value) => setDeleteType(value as "soft" | "force")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="soft" id="bulk-soft" />
                  <Label htmlFor="bulk-soft" className="text-sm cursor-pointer">
                    Move to Trash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="force" id="bulk-force" />
                  <Label htmlFor="bulk-force" className="text-sm cursor-pointer">
                    Delete Permanently
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto rounded-md border divide-y text-sm">
            {models
              .filter((m) => bulkDeleteIds.includes(m.id!))
              .map((m) => (
                <div key={m.id} className="flex items-center justify-between px-3 py-2 hover:bg-muted/50">
                  <span className="font-medium">{m.title}</span>
                  {m.product?.title && (
                    <span className="text-muted-foreground text-xs">{m.product.title}</span>
                  )}
                </div>
              ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete {bulkDeleteIds.length} Model{bulkDeleteIds.length !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
