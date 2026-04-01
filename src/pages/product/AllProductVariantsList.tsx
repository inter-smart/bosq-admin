import { useState, useEffect, useRef } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Image,
  XCircle,
  Plus,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  ImagePlus,
  TriangleAlert,
} from "lucide-react";
import {
  fetchProductVariantList,
  deleteProductVariant,
  bulkDeleteProductVariants,
  ProductVariant,
} from "@/services/product/productVariantApi";
import {
  fetchProductModelList,
  ProductModel,
} from "@/services/product/productModelApi";
import {
  fetchBaseProductList,
  BaseProduct,
} from "@/services/product/baseProductApi";
import {
  fetchProductCategoryList,
  ProductCategory,
} from "@/services/product/productCategoriesApi";
import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function AllProductVariantsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);
  const [models, setModels] = useState<ProductModel[]>([]);
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [selectedModelId, setSelectedModelId] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<number[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [deleteType, setDeleteType] = useState<"soft" | "force">("soft");
  const requestIdRef = useRef(0);

  // Load base products and categories on mount
  useEffect(() => {
    loadBaseProducts();
    loadCategories();
  }, []);

  // Load models when base product changes
  useEffect(() => {
    setSelectedModelId("all");
    setCurrentPage(1);
    if (selectedProductId !== "all") {
      loadModels(parseInt(selectedProductId));
    } else {
      setModels([]);
    }
  }, [selectedProductId]);

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

  const loadCategories = async () => {
    try {
      const response = await fetchProductCategoryList(1, 200);
      if (response.success) {
        setAllCategories(response.data.list);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const loadModels = async (productId: number) => {
    try {
      const response = await fetchProductModelList(
        1,
        100,
        undefined,
        productId,
      );
      if (response.success) {
        setModels(response.data.list);
      }
    } catch (error) {
      console.error("Failed to load models", error);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when model or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedModelId, selectedCategoryId]);

  useEffect(() => {
    loadVariants();
  }, [
    currentPage,
    pageSize,
    debouncedSearchQuery,
    selectedProductId,
    selectedModelId,
    selectedCategoryId,
  ]);

  const loadVariants = async () => {
    const requestId = ++requestIdRef.current;

    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchProductVariantList(
        currentPage,
        pageSize,
        debouncedSearchQuery,
        selectedModelId === "all" ? undefined : parseInt(selectedModelId),
        selectedProductId === "all" ? undefined : parseInt(selectedProductId),
        selectedCategoryId === "all" ? undefined : parseInt(selectedCategoryId),
      );

      if (requestId !== requestIdRef.current) return;

      if (response.success) {
        setVariants(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      toast({
        title: "Error",
        description: "Failed to load product variants",
        variant: "destructive",
      });
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setSearching(false);
      }
    }
  };

  const handleBulkAction = (action: string, selectedRows: ProductVariant[]) => {
    if (action === "delete") {
      setBulkDeleteIds(selectedRows.map((r) => r.id!));
      setShowBulkDeleteDialog(true);
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteProductVariants(bulkDeleteIds, deleteType);
      setVariants((prev) => prev.filter((v) => !bulkDeleteIds.includes(v.id!)));
      setTotalCount((prev) => prev - bulkDeleteIds.length);
      toast({
        title: "Success",
        description: `${bulkDeleteIds.length} variant(s) deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected variants",
        variant: "destructive",
      });
    } finally {
      setBulkDeleteIds([]);
      setShowBulkDeleteDialog(false);
      setTableKey((k) => k + 1);
    }
  };

  const { editingSortOrder, handleSortOrderChange } =
    useCommonTableActions<ProductVariant>({
      modelName: "ProductVariants",
      data: variants,
      setData: setVariants,
    });

  const columns: ColumnDef<ProductVariant>[] = [
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
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {(currentPage - 1) * pageSize + row.index + 1}
        </div>
      ),
    },
     {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium max-w-[150px] truncate">
          {row.getValue("title") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <div className="font-mono text-sm max-w-[150px] truncate">
          {row.getValue("sku")}
        </div>
      ),
    },
    {
      accessorKey: "productModel.product.title",
      header: "Base Product",
      cell: ({ row }) => (
        <div className="font-medium max-w-[150px] truncate">
          {row.original.productModel?.product?.title || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "productModel.title",
      header: "Model",
      cell: ({ row }) => (
        <div className="font-medium max-w-[150px] truncate">
          {row.original.productModel?.title || "N/A"}
        </div>
      ),
    },
   
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("price")}</div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return (
          <Badge variant={stock > 0 ? "default" : "destructive"}>{stock}</Badge>
        );
      },
    },
    {
      id: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const cats = (row.original.categories ?? []) as {
          id: number;
          name: string;
          parent_id?: number | null;
        }[];
        if (cats.length === 0)
          return <span className="text-muted-foreground text-sm">—</span>;
        const visible = cats.slice(0, 2);
        const overflow = cats.length - visible.length;
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((cat) => (
              <Badge
                key={cat.id}
                variant={cat.parent_id ? "outline" : "secondary"}
                className="text-xs font-normal"
              >
                {cat.name}
              </Badge>
            ))}
            {overflow > 0 && (
              <Badge
                variant="outline"
                className="text-xs font-normal text-muted-foreground"
              >
                +{overflow}
              </Badge>
            )}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "is_primary",
    //   header: "Primary",
    //   cell: ({ row }) => {
    //     const item = row.original;
    //     const isPrimary = row.getValue("is_primary") as boolean;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Switch
    //           checked={isPrimary}
    //           onCheckedChange={() => handleIsPrimaryChange(item.id!, isPrimary)}
    //         />
    //       </div>
    //     );
    //   },
    // },
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
              onClick={() =>
                handleSortOrderChange(item.id!, String(Math.max(1, numVal - 1)))
              }
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
              onClick={() =>
                handleSortOrderChange(item.id!, String(numVal + 1))
              }
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
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
                  navigate(
                    `/product-variants/${item.product_model_id}/edit/${item.id}`,
                  )
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/product-variant-images/${item.id}`)}
              >
                <Image className="mr-2 h-4 w-4" />
                Manage Images
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/product-project-images/${item.id}/list`)
                }
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Manage Project Images
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/product-variants/${item.id}/bought-together`)
                }
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Manage Bought Together
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
            <h1 className="text-2xl font-bold">All Product Variants</h1>
            <p className="text-muted-foreground">
              Manage all variants across all models
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-56">
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Base Product" />
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
                  onClick={() => {
                    setSelectedProductId("all");
                    setSelectedModelId("all");
                  }}
                  title="Clear Product Filter"
                >
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-56">
                <Select
                  value={selectedModelId}
                  onValueChange={setSelectedModelId}
                  disabled={selectedProductId === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {models.map((m) => (
                      <SelectItem key={m.id} value={m.id?.toString() || ""}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedModelId !== "all" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedModelId("all")}
                  title="Clear Model Filter"
                >
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-48">
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories
                      .filter((c) => !c.parent_id)
                      .map((parent) => {
                        const children = allCategories.filter(
                          (c) => c.parent_id === parent.id,
                        );
                        return [
                          <SelectItem
                            key={parent.id}
                            value={parent.id!.toString()}
                          >
                            {parent.name}
                          </SelectItem>,
                          ...children.map((child) => (
                            <SelectItem
                              key={child.id}
                              value={child.id!.toString()}
                            >
                              &nbsp;&nbsp;↳ {child.name}
                            </SelectItem>
                          )),
                        ];
                      })}
                  </SelectContent>
                </Select>
              </div>
              {selectedCategoryId !== "all" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedCategoryId("all")}
                  title="Clear Category Filter"
                >
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>

            <Button
              onClick={() =>
                navigate(`/product-variants/${selectedModelId}/create`)
              }
              disabled={selectedModelId === "all"}
              title={
                selectedModelId === "all"
                  ? "Select a model to add a variant"
                  : "Add Variant"
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Variant
            </Button>
          </div>
        </div>

        <DataTable
          key={tableKey}
          columns={columns}
          data={variants}
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
          searchPlaceholder="Search variants by title or SKU"
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
                  Delete {bulkDeleteIds.length} variant{bulkDeleteIds.length !== 1 ? "s" : ""}?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs mt-0.5">
                  This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              The selected product variants will be permanently deleted from the system.
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
            {variants
              .filter((v) => bulkDeleteIds.includes(v.id!))
              .map((v) => (
                <div key={v.id} className="flex items-center justify-between px-3 py-2 hover:bg-muted/50">
                  <span className="font-medium">{v.title || v.sku}</span>
                  {v.title && (
                    <span className="text-muted-foreground font-mono text-xs">{v.sku}</span>
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
              Delete {bulkDeleteIds.length} Variant{bulkDeleteIds.length !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
