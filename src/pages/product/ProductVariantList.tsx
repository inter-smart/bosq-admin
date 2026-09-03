import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { MoreHorizontal, Edit, Trash2, ArrowLeft, Image, ImagePlus, ChevronUp, ChevronDown, Star } from "lucide-react";
import { fetchProductVariantList, deleteProductVariant, ProductVariant } from "@/services/product/productVariantApi";
import { fetchProductModelById, ProductModel } from "@/services/product/productModelApi";
import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import { updateIsPrimary } from "@/services/commonApi";
import { Input } from "@/components/ui/input";

export default function ProductVariantList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productId } = useParams(); // This is now the model ID
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [model, setModel] = useState<ProductModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Load model info on mount
  useEffect(() => {
    if (productId) {
      loadModel(parseInt(productId));
    }
  }, [productId]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (productId) {
      loadVariants();
    }
  }, [currentPage, pageSize, debouncedSearchQuery, productId]);

  const loadModel = async (id: number) => {
    try {
      const response = await fetchProductModelById(id);
      setModel(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load model information",
        variant: "destructive",
      });
    }
  };

  const loadVariants = async () => {
    if (!productId) return;

    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchProductVariantList(currentPage, pageSize, debouncedSearchQuery, parseInt(productId));

      if (response.success) {
        setVariants(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product variants",
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

  const { editingSortOrder, handleSortOrderChange } = useCommonTableActions<ProductVariant>({
    modelName: "ProductVariants",
    data: variants,
    setData: setVariants,
  });

  // A model always has at most one primary variant — the one shown for it in
  // storefront listings. Setting a new primary always replaces the old one;
  // there's no "unset" (the backend rejects that), matching the pattern in
  // ProductVariantImagesList.tsx.
  const handleSetPrimary = async (variantId: number) => {
    try {
      await updateIsPrimary({ model_name: "ProductVariants", row_id: variantId, is_primary: true });

      setVariants((prev) => prev.map((v) => ({ ...v, is_primary: v.id === variantId })));

      toast({ title: "Success", description: "Primary variant updated" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update primary variant",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<ProductVariant>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-sm">{(currentPage - 1) * pageSize + row.index + 1}</div>,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <div className="font-mono text-sm max-w-[200px] truncate">{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "product_code",
      header: "Product Code",
      cell: ({ row }) => <div className="font-mono text-sm max-w-[200px] truncate">{row.getValue("product_code")}</div>,
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
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;
        return <Badge variant={status ? "default" : "secondary"}>{status ? "Active" : "Inactive"}</Badge>;
      },
    },
    {
      id: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const cats = (row.original.categories ?? []) as { id: number; name: string; parent_id?: number | null }[];
        if (cats.length === 0) return <span className="text-muted-foreground text-sm">—</span>;
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
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                +{overflow}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_primary",
      header: "Primary",
      cell: ({ row }) => {
        const item = row.original;
        const isPrimary = row.getValue("is_primary") as boolean;
        return isPrimary ? (
          <Badge variant="default" className="gap-1">
            <Star className="h-3 w-3 fill-current" />
            Primary
          </Badge>
        ) : (
          <Button variant="outline" size="sm" onClick={() => handleSetPrimary(item.id!)}>
            Set Primary
          </Button>
        );
      },
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
      accessorKey: "createdAt",
      header: "Created At",
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
              <DropdownMenuItem onClick={() => navigate(`/product-variants/${item.product_model_id}/edit/${item.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/product-variant-images/${item.id}`)}>
                <Image className="mr-2 h-4 w-4" />
                Manage Images
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
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(model?.product_id ? `/product-models/${model.product_id}/list` : "/base-products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Product Variants{model ? `: ${model.title}` : ""}</h1>
            <p className="text-muted-foreground">Manage variants for this model</p>
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
          onAdd={() => navigate(`/product-variants/${productId}/create`)}
          addButtonText="Add Variant"
        />
      </div>

      {/* Delete Confirmation Dialog */}
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
