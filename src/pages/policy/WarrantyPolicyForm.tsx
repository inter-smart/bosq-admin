import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  fetchWarrantyPolicyById,
  createWarrantyPolicy,
  updateWarrantyPolicy,
} from "@/services/policy/warrantyPolicyApi";
import { warrantyPolicySchema, WarrantyPolicyFormData } from "@/schemas/warrantyPolicySchema";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function WarrantyPolicyForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<WarrantyPolicyFormData>({
    resolver: zodResolver(warrantyPolicySchema),
    defaultValues: {
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      media_alt: "",
      media_alt_ar: "",
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadPolicyData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadPolicyData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchWarrantyPolicyById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
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
        description: "Failed to load warranty policy data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: WarrantyPolicyFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // English fields
      formData.append("title", data.title);
      formData.append("description", data.description);

      // Arabic fields
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.description_ar) formData.append("description_ar", data.description_ar);

      // Media alt texts
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);

      formData.append("sort_order", (data.sort_order || 0).toString());
      formData.append("status", (data.status ?? true).toString());

      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      if (isEditing && id) {
        await updateWarrantyPolicy(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Warranty policy updated successfully",
        });
      } else {
        await createWarrantyPolicy(formData);
        toast({
          title: "Success",
          description: "Warranty policy created successfully",
        });
      }

      navigate("/warranty-policy");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} warranty policy`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading warranty policy data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/warranty-policy")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Warranty Policy
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} warranty policy
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter warranty policy title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter warranty policy description"
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
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان سياسة الضمان"
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
                    name="description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="أدخل وصف سياسة الضمان"
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

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Policy Image <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                        }}
                        accept="image/*"
                        preview={true}
                        recommendedDimensions="1200px x 600px"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Upload a new image to replace the current one (optional)"
                        : "Upload a warranty policy banner image (required)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <FormField
                  control={form.control}
                  name="media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter image alt text"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Alt text for accessibility and SEO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل النص البديل للصورة"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormDescription>
                        Alt text for accessibility and SEO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Settings</CardTitle>
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
                          Enable or disable this warranty policy
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
              onClick={() => navigate("/warranty-policy")}
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
