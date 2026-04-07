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
import { FileUpload } from "@/components/common/FileUpload";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
} from "@/services/common/paymentMethods";
import { paymentMethodsSchema, PaymentMethodsFormData } from "@/schemas/paymentMethodsSchema";
import { Switch } from "@/components/ui/switch";

export default function PaymentMethodsForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<PaymentMethodsFormData>({
    resolver: zodResolver(paymentMethodsSchema),
    defaultValues: {
      icon_alt: "",
      icon_alt_ar: "",
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadPaymentData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadPaymentData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchPaymentMethodById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          icon_alt: data.icon_alt || "",
          icon_alt_ar: data.icon_alt_ar || "",
          sort_order: data.sort_order || 0,
          status: data.status ?? true,
             icon_media_path: data.icon_media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.icon_media_path}` : null,
     
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: PaymentMethodsFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("icon_alt", data.icon_alt);
      formData.append("icon_alt_ar", data.icon_alt_ar);
      formData.append("sort_order", (data.sort_order || 0).toString());
      formData.append("status", (data.status ?? true).toString());

      if (data.icon_media_path instanceof File) {
        formData.append("icon_media_path", data.icon_media_path);
      }

      if (isEditing && id) {
        await updatePaymentMethod(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Payment item updated successfully",
        });
      } else {
        await createPaymentMethod(formData);
        toast({
          title: "Success",
          description: "Payment item created successfully",
        });
      }

      navigate("/payment-methods");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          isEditing ? "update" : "create"
        } payment methods`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          Loading payment data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/payment-methods")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Payment
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} payment methods
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Icon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="icon_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Icon <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                        accept=".png, .jpg, .jpeg"
                        preview={true}
                        recommendedDimensions="300px x 300px"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Upload a new icon to replace the current one (optional)"
                        : "Upload a payment icon (required)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Alt Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Alt text for the icon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Alt Text (AR)</FormLabel>
                      <FormControl>
                        <Input placeholder="Alt text for the icon in Arabic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
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
                          Enable or disable this payment item
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
              onClick={() => navigate("/payment-methods")}
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
