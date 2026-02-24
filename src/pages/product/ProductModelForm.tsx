import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/common/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productModelSchema, ProductModelFormData } from "@/schemas/productModelSchema";
import { fetchProductModelById, createProductModel, updateProductModel } from "@/services/product/productModelApi";
import { fetchBaseProductById, BaseProduct } from "@/services/product/baseProductApi";

export default function ProductModelForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productId, id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [product, setProduct] = useState<BaseProduct | null>(null);
  const [initialBasePrice, setInitialBasePrice] = useState<string | null>(null);

  const form = useForm<ProductModelFormData>({
    resolver: zodResolver(productModelSchema),
    defaultValues: {
      title: "",
      title_ar: "",
      base_price: "",
      media_path: null,
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    loadInitialData();
  }, [productId, id]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);

      // Load product info
      if (productId) {
        const productResponse = await fetchBaseProductById(parseInt(productId));
        setProduct(productResponse.data);
      }

      // Load model data if editing
      if (isEditing && id) {
        const modelResponse = await fetchProductModelById(parseInt(id));
        const data = modelResponse.data;

        // Store the initial base price for change detection
        setInitialBasePrice(data.base_price || "");

        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          base_price: data.base_price || "",
          media_path: data.media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_path}` : null,
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ProductModelFormData) => {
    if (!productId) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("product_id", productId);
      formData.append("title", data.title);
      formData.append("title_ar", data.title_ar);
      formData.append("base_price", data.base_price);
      formData.append("sort_order", (data.sort_order || 1).toString());
      formData.append("status", (data.status ?? true).toString());

      // Send flag indicating if base_price has changed (only for updates)
      if (isEditing && initialBasePrice !== null) {
        const basePriceChanged = data.base_price !== initialBasePrice;
        formData.append("base_price_changed", basePriceChanged ? "1" : "0");
      }

      // Only append media_path if it's a new file
      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      if (isEditing && id) {
        await updateProductModel(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Product model updated successfully",
        });
      } else {
        await createProductModel(formData);
        toast({
          title: "Success",
          description: "Product model created successfully",
        });
      }

      navigate(`/product-models/all`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} product model`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Product Model
            {product ? ` for "${product.title}"` : ""}
          </h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} product model</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model name in Arabic" dir="rtl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="Enter base price (e.g., 99.99)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                          }}
                          accept="image/*"
                          preview={true}
                          recommendedDimensions="16px x 16px"
                        />
                      </FormControl>
                      <FormDescription>Upload a icon</FormDescription>
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
                        <Input type="number" placeholder="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
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
                        <FormDescription>Enable or disable this data</FormDescription>
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
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
