import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Trash2, Star, MoreHorizontal } from "lucide-react";
import {
  fetchProductVariantImages,
  deleteProductVariantImage,
  bulkDeleteProductVariantImages,
  updateProductVariantImage,
  ProductVariantImage,
} from "@/services/product/productVariantImagesApi";
import { fetchProductVariantById, ProductVariant } from "@/services/product/productVariantApi";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function ProductVariantImagesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { variantId } = useParams();
  const [images, setImages] = useState<ProductVariantImage[]>([]);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  useEffect(() => {
    if (variantId) {
      loadVariant(parseInt(variantId));
      loadImages();
    }
  }, [variantId]);

  const loadVariant = async (id: number) => {
    try {
      const response = await fetchProductVariantById(id);
      setVariant(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load variant information",
        variant: "destructive",
      });
    }
  };

  const loadImages = async () => {
    if (!variantId) return;

    try {
      setLoading(true);
      const response = await fetchProductVariantImages(parseInt(variantId));

      if (response.success) {
        // Sort images by sort_order
        const sortedImages = response.data.list.sort((a, b) => a.sort_order - b.sort_order);
        setImages(sortedImages);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load variant media",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteProductVariantImage(deleteItemId);
      setImages((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const imageIds = Array.from(selectedImages);
      const response = await bulkDeleteProductVariantImages(imageIds);

      setImages((prev) => prev.filter((img) => !selectedImages.has(img.id!)));
      setSelectedImages(new Set());

      toast({
        title: "Success",
        description: response.message || `${imageIds.length} image(s) deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected images",
        variant: "destructive",
      });
    } finally {
      setShowBulkDeleteDialog(false);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      const updatePromises = images
        .filter((img) => img.is_primary && img.id !== imageId)
        .map((img) => updateProductVariantImage(img.id!, { is_primary: false }));

      await Promise.all(updatePromises);
      await updateProductVariantImage(imageId, { is_primary: true });

      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        })),
      );

      toast({
        title: "Success",
        description: "Primary image updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update primary image",
        variant: "destructive",
      });
    }
  };

  const toggleImageSelection = (imageId: number) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.id!)));
    }
  };

  const getBackUrl = () => {
    if (variant?.product_id) {
      return `/product-variants/${variant.product_id}/list`;
    }
    return "/base-products";
  };



    const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
      useCommonTableActions<ProductVariantImage>({
        modelName: "ProductVariantImages",
        data: images,
        setData: setImages,
      });
  
  const columns: ColumnDef<ProductVariantImage>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={selectedImages.size === images.length && images.length > 0}
          onCheckedChange={toggleSelectAll}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedImages.has(row.original.id!)}
          onCheckedChange={() => toggleImageSelection(row.original.id!)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => <div className="w-12 text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "media_path",
      header: "Preview",
      cell: ({ row }) => {
        const image = row.original;
        return (
          <div className="min-w-[100px]">
            {image.media_type === "video" ? (
              <video
                src={`${import.meta.env.VITE_IMAGE_URL}/${image.media_path}`}
                className="w-10 h-10 object-cover rounded border"
                preload="metadata"
                playsInline
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${image.media_path}`}
                alt={`Image ${image.id}`}
                className="w-10 h-10 object-cover rounded border"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "media_type",
      header: "Media Type",
      cell: ({ row }) => {
        const mediaType = row.getValue("media_type") as string;
        return (
          <div className="min-w-[100px]">
            <Badge variant="outline">{mediaType === "video" ? "Video" : "Image"}</Badge>
          </div>
        );
      },
    },
     {
      accessorKey: "sort_order",
      header: "Sort Order",
      enableSorting: true,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Input
            type="number"
            value={
              editingSortOrder[item.id!] !== undefined
                ? editingSortOrder[item.id!]
                : row.getValue("sort_order") || 0
            }
            onChange={(e) => handleSortOrderChange(item.id!, e.target.value)}
            className="w-20"
          />
        );
      },
    },
    {
      accessorKey: "is_primary",
      header: "Primary",
      cell: ({ row }) => {
        const isPrimary = row.getValue("is_primary") as boolean;
        return (
          <div className="min-w-[100px]">
            {isPrimary ? (
              <Badge className="bg-yellow-500">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Primary
              </Badge>
            ) : (
              <Button size="sm" variant="outline" onClick={() => handleSetPrimary(row.original.id!)}>
                <Star className="h-3 w-3 mr-1" />
                Set Primary
              </Button>
            )}
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
              {status ? "active" : "inactive"}
            </Badge>
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
          <div className="text-sm text-muted-foreground min-w-[120px]">{new Date(createdAt).toLocaleDateString()}</div>
        ) : (
          <div className="text-sm text-muted-foreground min-w-[120px]">N/A</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="min-w-[80px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!item.is_primary && (
                  <DropdownMenuItem onClick={() => handleSetPrimary(item.id!)}>
                    <Star className="mr-2 h-4 w-4" />
                    Set as Primary
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteItemId(item.id!)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(getBackUrl())}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Variant Media{variant ? `: ${variant.sku}` : ""}</h1>
            <p className="text-muted-foreground">Manage images for this product variant</p>
          </div>
        </div>

        {selectedImages.size > 0 && (
          <div className="flex justify-end">
            <Button variant="destructive" onClick={() => setShowBulkDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedImages.size})
            </Button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={images}
          loading={loading}
          searchQuery=""
          onSearchChange={() => {}}
          searching={false}
          pagination={{
            currentPage: 1,
            pageSize: images.length,
            totalCount: images.length,
            totalPages: 1,
            onPageChange: () => {},
            onPageSizeChange: () => {},
          }}
          title=""
          searchPlaceholder="Search images..."
          onAdd={() => navigate(`/product-variant-images/${variantId}/add`)}
          addButtonText="Add Images"
        />
      </div>

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete this image.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedImages.size} image(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected {selectedImages.size} image(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}