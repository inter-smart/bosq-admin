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
  fetchAttributeValueById,
  createAttributeValue,
  updateAttributeValue,
} from "@/services/product/attributeValuesApi";
import { fetchProductAttributeById, ProductAttribute } from "@/services/product/productAttributesApi";
import {
  attributeValueSchema,
  AttributeValueFormData,
} from "@/schemas/attributeValueSchema";
import { Switch } from "@/components/ui/switch";

export default function AttributeValuesForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { attributeId, id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [attribute, setAttribute] = useState<ProductAttribute | null>(null);

  const form = useForm<AttributeValueFormData>({
    resolver: zodResolver(attributeValueSchema),
    defaultValues: {
      value: "",
      value_ar: "",
      attribute_id: attributeId ? parseInt(attributeId) : 0,
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (attributeId) {
      loadAttribute(parseInt(attributeId));
    }
  }, [attributeId]);

  useEffect(() => {
    if (isEditing && id) {
      loadValueData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadAttribute = async (attrId: number) => {
    try {
      const response = await fetchProductAttributeById(attrId);
      setAttribute(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attribute information",
        variant: "destructive",
      });
    }
  };

  const loadValueData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchAttributeValueById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          value: data.value || "",
          value_ar: data.value_ar || "",
          attribute_id: data.attribute_id,
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          media_path: data.media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_path}`
            : undefined,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attribute value data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: AttributeValueFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("value", data.value);
      formData.append("value_ar", data.value_ar);
      formData.append("attribute_id", data.attribute_id.toString());
      formData.append("sort_order", (data.sort_order || 1).toString());
      formData.append("status", (data.status ?? true).toString());

      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      if (isEditing && id) {
        await updateAttributeValue(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Attribute value updated successfully",
        });
      } else {
        await createAttributeValue(formData);
        toast({
          title: "Success",
          description: "Attribute value created successfully",
        });
      }

      navigate(`/product-attributes/${attributeId}/values`);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} attribute value`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading attribute value data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/product-attributes/${attributeId}/values`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Attribute Value
            {attribute ? ` for "${attribute.name}"` : ""}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} attribute value
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Value Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter value (e.g., White, Red, Large)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value (Arabic)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل القيمة"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media (Optional)</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                        }}
                        accept="image/*"
                        preview={true}
                        recommendedDimensions="200px x 200px"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an optional image for this attribute value (e.g., color swatch)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Value Settings</CardTitle>
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
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
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
                          Enable or disable this attribute value
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
              onClick={() => navigate(`/product-attributes/${attributeId}/values`)}
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
