import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
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
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/common/FileUpload";
import {
  fetchDeliveryTimeById,
  createDeliveryTime,
  updateDeliveryTime,
} from "@/services/cms/delivery/deliveryTimeApi";
import { Switch } from "@/components/ui/switch";
import {
  DeliveryTimeFormData,
  deliveryTimeSchema,
} from "@/schemas/deliverySchema";

export default function DeliveryTimeForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<DeliveryTimeFormData>({
    resolver: zodResolver(deliveryTimeSchema),
    shouldFocusError: true,
    defaultValues: {
      duration: "",
      duration_ar: "",
      title: "",
      title_ar: "",
      icon_media_path: null,
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadDeliveryTimeData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadDeliveryTimeData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchDeliveryTimeById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          duration: data.duration || "",
          duration_ar: data.duration_ar || "",
          title: data.title || "",
          title_ar: data.title_ar || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          icon_media_path: data.icon_media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.icon_media_path}`
            : null,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load delivery time data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: DeliveryTimeFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Add all text fields
      formData.append("duration", data.duration);
      formData.append("duration_ar", data.duration_ar);
      formData.append("title", data.title);
      formData.append("title_ar", data.title_ar);
      formData.append("sort_order", (data.sort_order || 1).toString());
      formData.append("status", (data.status ?? true).toString());

      // Only append File instances (new uploads)
      if (data.icon_media_path instanceof File) {
        formData.append("icon_media_path", data.icon_media_path);
      }

      if (isEditing && id) {
        await updateDeliveryTime(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Delivery time updated successfully",
        });
      } else {
        await createDeliveryTime(formData);
        toast({
          title: "Success",
          description: "Delivery time created successfully",
        });
      }

      navigate("/delivery-time");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} delivery time`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading delivery time data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/delivery-time")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Delivery Time
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} delivery time
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 2-3 Days"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Arabic Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="duration_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (المدة)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: ٢-٣ أيام"
                            {...field}
                            dir="rtl"
                          />
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
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل العنوان"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Icon Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Icon Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="icon_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Time Icon</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        placeholder="Upload delivery time icon"
                        preview={true}
                        recommendedDimensions="100px x 100px"
                      />
                    </FormControl>
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
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
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
                        <FormDescription>
                          Enable or disable this delivery time
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/delivery-time")}
            >
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
