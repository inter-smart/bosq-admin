import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchBaseProductById, createBaseProduct, updateBaseProduct } from "@/services/product/baseProductApi";
import { fetchProductSectorList, ProductSector } from "@/services/product/productSectorsApi";
import { fetchDataList as fetchSellingPointsList, ProductSellingPoint } from "@/services/product/productSellingPointsApi";
import { BaseProductFormData, baseProductSchema } from "@/schemas/baseProductSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export default function BaseProductForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [sectors, setSectors] = useState<ProductSector[]>([]);
  const [sellingPoints, setSellingPoints] = useState<ProductSellingPoint[]>([]);
  const [initialBasePrice, setInitialBasePrice] = useState<string | null>(null);

  const form = useForm<BaseProductFormData>({
    resolver: zodResolver(baseProductSchema),
    defaultValues: {
      title: "",
      title_ar: "",
      enhance_title: "",
      enhance_title_ar: "",
      base_price: "",
      media_path: null,
      sort_order: 1,
      status: true,
      selling_points: [],
      sectors: [],
    },
  });

  useEffect(() => {
    loadDropdownData();
    if (isEditing && id) {
      loadBaseProductData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadDropdownData = async () => {
    try {
      const [sectorsRes, sellingPointsRes] = await Promise.all([
        fetchProductSectorList(1, 100),
        fetchSellingPointsList(1, 100),
      ]);

      if (sectorsRes.success) {
        setSectors(sectorsRes.data.list);
      }
      if (sellingPointsRes.success) {
        setSellingPoints(sellingPointsRes.data.list);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dropdown data",
        variant: "destructive",
      });
    }
  };

  const loadBaseProductData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchBaseProductById(itemId);
      const data = response.data;

      if (data) {
        // Store the initial base price for change detection
        setInitialBasePrice(data.base_price || "");

        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          enhance_title: data.enhance_title || "",
          enhance_title_ar: data.enhance_title_ar || "",
          base_price: data.base_price || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          media_path: data.media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_path}` : null,
          selling_points: data.sellingPoints?.map((sp) => sp.id) || [],
          sectors: data.sectors?.map((s) => s.id) || [],
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load base product data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: BaseProductFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Required fields
      formData.append("title", data.title);
      formData.append("title_ar", data.title_ar);
      formData.append("enhance_title", data.enhance_title);
      formData.append("enhance_title_ar", data.enhance_title_ar);
      formData.append("sort_order", (data.sort_order || 1).toString());
      formData.append("status", data.status ? "1" : "0");

      // Base price (required, DECIMAL(10,2) format)
      formData.append("base_price", data.base_price);

      // Send flag indicating if base_price has changed (only for updates)
      if (isEditing && initialBasePrice !== null) {
        const basePriceChanged = data.base_price !== initialBasePrice;
        formData.append("base_price_changed", basePriceChanged ? "1" : "0");
      }

      // Only append media_path if it's a new file
      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      // Append selling_points as JSON string array
      if (data.selling_points && data.selling_points.length > 0) {
        formData.append("selling_points", JSON.stringify(data.selling_points));
      }

      // Append sectors as JSON string array
      if (data.sectors && data.sectors.length > 0) {
        formData.append("sectors", JSON.stringify(data.sectors));
      }

      if (isEditing && id) {
        await updateBaseProduct(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Base product updated successfully",
        });
      } else {
        await createBaseProduct(formData);
        toast({
          title: "Success",
          description: "Base product created successfully",
        });
      }

      navigate("/base-products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} base product`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading base product data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/base-products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit" : "Add"} Base Product</h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} base product</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product title (e.g., Ergonomic Chair)" {...field} />
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
                        <Input placeholder="أدخل عنوان المنتج" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <FormField
                  control={form.control}
                  name="enhance_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enhance Title (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter enhance title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enhance_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enhance Title (Arabic)  (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل العنوان المحسّن" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
              </div> */}

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image (Optional)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                          }}
                          accept="image/*"
                          preview={true}
                          recommendedDimensions="400px x 400px"
                        />
                      </FormControl>
                      <FormDescription>Upload a product image (optional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </CardContent>
          </Card>

          {/* Selling Points Card */}
          <Card>
            <CardHeader>
              <CardTitle>Selling Points</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="selling_points"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {sellingPoints.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="selling_points"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id!)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">{item.name}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Sectors Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="sectors"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {sectors.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="sectors"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id!)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">{item.name}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings Card */}
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
                        <FormDescription>Enable or disable this attribute</FormDescription>
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
            <Button type="button" variant="outline" onClick={() => navigate("/base-products")}>
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
