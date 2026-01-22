import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react";
import {
  fetchProductVariantImages,
  deleteProductVariantImage,
  bulkDeleteProductVariantImages,
  updateProductVariantImage,
  ProductVariantImage,
} from "@/services/product/productVariantImagesApi";
import { fetchProductVariantById, ProductVariant } from "@/services/product/productVariantApi";
import { useToast } from "@/hooks/use-toast";

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
        setImages(response.data.list);
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
      await bulkDeleteProductVariantImages(imageIds);
      setImages((prev) => prev.filter((item) => !selectedImages.has(item.id!)));
      setSelectedImages(new Set());
      toast({
        title: "Success",
        description: `${imageIds.length} image(s) deleted successfully`,
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
      // First, unset all other images as primary
      const updatePromises = images
        .filter((img) => img.is_primary && img.id !== imageId)
        .map((img) => updateProductVariantImage(img.id!, { is_primary: false }));

      await Promise.all(updatePromises);

      // Set the selected image as primary
      await updateProductVariantImage(imageId, { is_primary: true });

      // Update local state
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading images...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(getBackUrl())}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Variant Media{variant ? `: ${variant.sku}` : ""}</h1>
              <p className="text-muted-foreground">Manage images for this product variant</p>
            </div>
          </div>
          <div className="flex gap-2">
            {selectedImages.size > 0 && (
              <Button variant="destructive" onClick={() => setShowBulkDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedImages.size})
              </Button>
            )}
            <Button onClick={() => navigate(`/product-variant-images/${variantId}/add`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Images
            </Button>
          </div>
        </div>

        {images.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-muted-foreground text-center">No images found for this variant. Click "Add Images" to upload some.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-2 pb-2">
              <Checkbox id="select-all" checked={selectedImages.size === images.length} onCheckedChange={toggleSelectAll} />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select All ({selectedImages.size}/{images.length})
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((image) => (
                  <Card key={image.id} className="overflow-hidden group relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Checkbox
                        checked={selectedImages.has(image.id!)}
                        onCheckedChange={() => toggleImageSelection(image.id!)}
                        className="bg-white border-2"
                      />
                    </div>
                    <div className="aspect-square relative">
                      {image?.media_type == "video" ? (
                        <video
                          src={`${import.meta.env.VITE_IMAGE_URL}/${image.media_path}`}
                          className="w-full h-full object-cover"
                          controls
                          preload="metadata"
                          playsInline
                        />
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_IMAGE_URL}/${image.media_path}`}
                          alt={`Variant image ${image.id}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {image.is_primary && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Primary
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!image.is_primary && (
                          <Button size="sm" variant="secondary" onClick={() => handleSetPrimary(image.id!)}>
                            <Star className="h-4 w-4 mr-1" />
                            Set Primary
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => setDeleteItemId(image.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Order: {image.sort_order}</span>
                        <Badge variant={image.status ? "default" : "secondary"}>{image.status ? "Active" : "Inactive"}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </>
        )}
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
