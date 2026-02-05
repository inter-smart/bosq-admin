import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, X, GripVertical, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadProductVariantImages, fetchProductVariantImages } from "@/services/product/productVariantImagesApi";
import { fetchProductVariantById, ProductVariant } from "@/services/product/productVariantApi";
import { useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  sort_order: number;
  media_type: string;
  status: boolean;
  is_primary: boolean;
  thumbnail?: File | null;
  thumbnailPreview?: string | null;
}

interface SortableImageCardProps {
  image: ImageItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof ImageItem, value: string | number | boolean) => void;
  onSetPrimary: (id: string) => void;
  onThumbnailChange: (id: string, file: File | null) => void;
  hasPrimaryImage: boolean;
}

function SortableImageCard({ image, onRemove, onUpdate, onSetPrimary, onThumbnailChange, hasPrimaryImage }: SortableImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onThumbnailChange(image.id, file);
    }
  };

  const handleRemoveThumbnail = () => {
    onThumbnailChange(image.id, null);
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-4 p-4 border rounded-lg bg-card">
      <div {...attributes} {...listeners} className="cursor-grab mt-2">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        {image.media_type === "image" && (
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border">
            <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {image.media_type === "video" && (
          <>
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border bg-black">
              <video src={image.preview} className="w-full h-full object-cover" controls preload="metadata" playsInline />
            </div>
            {/* Thumbnail section for videos */}
            <div className="w-24">
              <Label className="text-xs text-muted-foreground">Thumbnail</Label>
              {image.thumbnailPreview ? (
                <div className="relative w-24 h-16 mt-1 rounded border overflow-hidden">
                  <img src={image.thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-5 w-5"
                    onClick={handleRemoveThumbnail}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="mt-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                    id={`thumbnail-${image.id}`}
                  />
                  <Label htmlFor={`thumbnail-${image.id}`} className="cursor-pointer">
                    <div className="w-24 h-16 border-2 border-dashed rounded flex items-center justify-center text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                      <Upload className="h-4 w-4" />
                    </div>
                  </Label>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Input type="number" min="0" value={image.sort_order} onChange={(e) => onUpdate(image.id, "sort_order", parseInt(e.target.value) || 0)} />
        </div>

        <div className="space-y-2">
          <Label>Media Type</Label>
          <Select value={image.media_type} onValueChange={(value) => onUpdate(image.id, "media_type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center gap-2 pt-2">
            <Switch checked={image.status} onCheckedChange={(checked) => onUpdate(image.id, "status", checked)} />
            <span className="text-sm text-muted-foreground">{image.status ? "Active" : "Inactive"}</span>
          </div>
        </div>

        {!hasPrimaryImage && (
          <div className="space-y-2">
            <Label>Primary Image</Label>
            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant={image.is_primary ? "default" : "outline"}
                size="sm"
                onClick={() => onSetPrimary(image.id)}
                className={image.is_primary ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              >
                <Star className={`h-4 w-4 mr-1 ${image.is_primary ? "fill-current" : ""}`} />
                {image.is_primary ? "Primary" : "Set Primary"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Button type="button" variant="ghost" size="icon" className="text-destructive mt-2" onClick={() => onRemove(image.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function ProductVariantImagesForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { variantId } = useParams();

  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [existingPrimaryImage, setExistingPrimaryImage] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (variantId) {
      loadVariant(parseInt(variantId));
    }
  }, [variantId]);

  const loadVariant = async (id: number) => {
    try {
      const [variantResponse, imagesResponse] = await Promise.all([
        fetchProductVariantById(id),
        fetchProductVariantImages(id),
      ]);
      setVariant(variantResponse.data);
      const hasPrimary = imagesResponse.data.list.some((img) => img.is_primary);
      setExistingPrimaryImage(hasPrimary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load variant information",
        variant: "destructive",
      });
    }
  };

  const validateImages = useCallback(() => {
    const errors: string[] = [];

    if (images.length === 0) {
      errors.push("Please select at least 1 image to upload.");
    }

    if (images.length > 10) {
      errors.push("You can upload a maximum of 10 images at once.");
    }

    const primaryCount = images.filter((img) => img.is_primary).length;
    if (primaryCount > 1) {
      errors.push("Only one image can be marked as primary.");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [images]);

  useEffect(() => {
    if (images.length > 0) {
      validateImages();
    } else {
      setValidationErrors([]);
    }
  }, [images, validateImages]);

  const getMediaType = (file: File): "image" | "video" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "image"; // fallback
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files);

    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select valid image or video files.",
        variant: "destructive",
      });
      return;
    }

    const totalFiles = images.length + selectedFiles.length;
    if (totalFiles > 10) {
      toast({
        title: "Error",
        description: `You can only upload up to 10 files. You have ${images.length} and are trying to add ${selectedFiles.length}.`,
        variant: "destructive",
      });
      return;
    }

    const newImages: ImageItem[] = selectedFiles.map((file, index) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      sort_order: images.length + index,
      media_type: getMediaType(file), // ✅ auto set
      status: true,
      is_primary: !existingPrimaryImage && images.length === 0 && index === 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      // Revoke thumbnail preview URL if exists
      if (imageToRemove?.thumbnailPreview) {
        URL.revokeObjectURL(imageToRemove.thumbnailPreview);
      }
      const filtered = prev.filter((img) => img.id !== id);
      // Recalculate sort order
      return filtered.map((img, index) => ({ ...img, sort_order: index }));
    });
  };

  const updateImage = (id: string, field: keyof ImageItem, value: string | number | boolean) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, [field]: value } : img)));
  };

  const setPrimaryImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: img.id === id,
      })),
    );
  };

  const handleThumbnailChange = (id: string, file: File | null) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          // Revoke old thumbnail preview URL if exists
          if (img.thumbnailPreview) {
            URL.revokeObjectURL(img.thumbnailPreview);
          }
          return {
            ...img,
            thumbnail: file,
            thumbnailPreview: file ? URL.createObjectURL(file) : null,
          };
        }
        return img;
      }),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update sort_order based on new positions
        return newItems.map((item, index) => ({ ...item, sort_order: index }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!variantId) {
      toast({
        title: "Error",
        description: "Variant ID is required.",
        variant: "destructive",
      });
      return;
    }

    if (!validateImages()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("product_variant_id", variantId);

      images.forEach((image, index) => {
        formData.append("images", image.file);
        formData.append(`sort_order[${index}]`, image.sort_order.toString());
        formData.append(`status[${index}]`, image.status ? "1" : "0");
        formData.append(`media_type[${index}]`, image.media_type);
        formData.append(`is_primary[${index}]`, image.is_primary ? "1" : "0");
        // Include thumbnail if it's a video and has a thumbnail
        if (image.media_type === "video" && image.thumbnail) {
          formData.append(`thumbnail[${index}]`, image.thumbnail);
        }
      });

      await uploadProductVariantImages(formData);

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });

      navigate(`/product-variant-images/${variantId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBackUrl = () => {
    return `/product-variant-images/${variantId}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(getBackUrl())}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Images{variant ? ` for ${variant.sku}` : ""}</h1>
          <p className="text-muted-foreground">Upload images for this product variant (1-10 images)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="border-destructive">
            <CardContent className="pt-4">
              <ul className="list-disc list-inside text-destructive text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Drop Zone */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Drag and drop medias here, or click to select</p>
              <p className="text-sm text-muted-foreground mb-4">Maximum 10 medias</p>
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="secondary" asChild>
                  <span>Select Images</span>
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Image List with Drag & Drop */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Media ({images.length}/10)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
                  {images.map((image) => (
                    <SortableImageCard key={image.id} image={image} onRemove={removeImage} onUpdate={updateImage} onSetPrimary={setPrimaryImage} onThumbnailChange={handleThumbnailChange} hasPrimaryImage={existingPrimaryImage} />
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(getBackUrl())}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || images.length === 0 || images.length > 10 || validationErrors.length > 0}>
            {loading ? "Uploading..." : "Upload Images"}
          </Button>
        </div>
      </form>
    </div>
  );
}
