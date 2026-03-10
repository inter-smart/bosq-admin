import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProductProjectImageById,
  createProductProjectImage,
  updateProductProjectImage,
} from "@/services/product/productProjectImagesApi";
import { fetchProductVariantById } from "@/services/product/productVariantApi";
import { Switch } from "@/components/ui/switch";

const projectImageSchema = z.object({
  media_alt: z.string().optional(),
  media_alt_ar: z.string().optional(),
  sort_order: z.number().min(0).default(1),
  status: z.boolean().default(true),
  media_path: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]),
});

type ProjectImageFormData = z.infer<typeof projectImageSchema>;

export default function ProductProjectImagesForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productId, id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [product, setProduct] = useState<{ title: string } | null>(null);

  const form = useForm<ProjectImageFormData>({
    resolver: zodResolver(projectImageSchema),
    defaultValues: {
      media_alt: "",
      media_alt_ar: "",
      sort_order: 1,
      status: true,
      media_path: null,
    },
  });

  useEffect(() => {
    if (productId) {
      loadProduct(parseInt(productId));
    }
    if (isEditing && id) {
      loadImageData(parseInt(id));
    }
  }, [productId, id, isEditing]);

  const loadProduct = async (itemId: number) => {
    try {
      const response = await fetchProductVariantById(itemId);
      setProduct(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive",
      });
    }
  };

  const loadImageData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchProductProjectImageById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          media_path: data.media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_path}` : null,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project image data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ProjectImageFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("product_variant_id", productId!);
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);
      formData.append("sort_order", (data.sort_order || 1).toString());
      formData.append("status", (data.status ?? true).toString());

      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      if (isEditing && id) {
        await updateProductProjectImage(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Project image updated successfully",
        });
      } else {
        if (!(data.media_path instanceof File)) {
          toast({
            title: "Error",
            description: "Please select an image to upload",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        await createProductProjectImage(formData);
        toast({
          title: "Success",
          description: "Project image created successfully",
        });
      }

      navigate(`/product-project-images/${productId}/list`);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} project image`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading project image data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(`/product-project-images/${productId}/list`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Project Image{product ? `: ${product.title}` : ""}
          </h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} project image for this product</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Project Image {!isEditing && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                        }}
                        accept="image/*"
                        preview={true}
                        recommendedDimensions="800px x 600px"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Upload a new image to replace the current one (optional)"
                        : "Upload a project image (required)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alt Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image description for accessibility" {...field} />
                      </FormControl>
                      <FormDescription>Description of the image for screen readers</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text (Arabic)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل وصف الصورة" {...field} dir="rtl" />
                      </FormControl>
                      <FormDescription>وصف الصورة لقارئات الشاشة</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Status</FormLabel>
                        <FormDescription>Enable or disable this project image</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(`/product-project-images/${productId}/list`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
