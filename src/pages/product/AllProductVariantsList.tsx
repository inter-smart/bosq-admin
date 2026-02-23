import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { MoreHorizontal, Edit, Trash2, Image, XCircle } from "lucide-react";
import { fetchProductVariantList, deleteProductVariant, ProductVariant } from "@/services/product/productVariantApi";
import { fetchProductModelList, ProductModel } from "@/services/product/productModelApi";
import { fetchBaseProductList, BaseProduct } from "@/services/product/baseProductApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AllProductVariantsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);
  const [models, setModels] = useState<ProductModel[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [selectedModelId, setSelectedModelId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const requestIdRef = useRef(0);

  // Load base products
  useEffect(() => {
    loadBaseProducts();
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

  const loadModels = async (productId: number) => {
    try {
      const response = await fetchProductModelList(1, 100, undefined, productId);
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

  // Reset to page 1 when model filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedModelId]);

  useEffect(() => {
    loadVariants();
  }, [currentPage, pageSize, debouncedSearchQuery, selectedProductId, selectedModelId]);

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

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteProductVariant(deleteItemId);
      setVariants((prev) => prev.filter((item) => item.id !== deleteItemId));
      setTotalCount((prev) => prev - 1);
      toast({
        title: "Success",
        description: "Product variant deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product variant",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const { handleIsPrimaryChange } = useCommonTableActions<ProductVariant>({
    modelName: "ProductVariants",
    data: variants,
    setData: setVariants,
  });

  const columns: ColumnDef<ProductVariant>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-sm">{(currentPage - 1) * pageSize + row.index + 1}</div>,
    },
    {
      accessorKey: "productModel.product.title",
      header: "Base Product",
      cell: ({ row }) => <div className="font-medium max-w-[150px] truncate">{row.original.productModel?.product?.title || "N/A"}</div>,
    },
    {
      accessorKey: "productModel.title",
      header: "Model",
      cell: ({ row }) => <div className="font-medium max-w-[150px] truncate">{row.original.productModel?.title || "N/A"}</div>,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <div className="font-mono text-sm max-w-[150px] truncate">{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <div className="font-medium">{row.getValue("price")}</div>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return <Badge variant={stock > 0 ? "default" : "destructive"}>{stock}</Badge>;
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
              <DropdownMenuItem onClick={() => navigate(`/product-variants/${item.product_model_id}/edit/${item.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/product-variant-images/${item.id}`)}>
                <Image className="mr-2 h-4 w-4" />
                Manage Images
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
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">All Product Variants</h1>
            <p className="text-muted-foreground">Manage all variants across all models</p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-56">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
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
                <Select value={selectedModelId} onValueChange={setSelectedModelId} disabled={selectedProductId === "all"}>
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
                <Button variant="ghost" size="icon" onClick={() => setSelectedModelId("all")} title="Clear Model Filter">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <DataTable
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
          searchPlaceholder="Search variants..."
        />
      </div>

      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product variant and remove its data from the servers.
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
    </>
  );
}
