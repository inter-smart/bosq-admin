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
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchWhyBosqById,
  createWhyBosq,
  updateWhyBosq,
} from "@/services/cms/about/whyBosqApi";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/common/FileUpload";
import { WhyBosqFormData, whyBosqSchema } from "@/schemas/aboutSchema";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function WhyBosqForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<WhyBosqFormData>({
    resolver: zodResolver(whyBosqSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      title_ar: "",
      subtitle_ar: "",
      description_ar: "",
      media_alt: "",
      media_alt_ar: "",
      icon_media_alt: "",
      icon_media_alt_ar: "",
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadWhyBosqData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadWhyBosqData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchWhyBosqById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          title_ar: data.title_ar || "",
          subtitle_ar: data.subtitle_ar || "",
          description_ar: data.description_ar || "",
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          icon_media_alt: data.icon_media_alt || "",
          icon_media_alt_ar: data.icon_media_alt_ar || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          media_path: data.media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_path}`
            : null,
          icon_media_path: data.icon_media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.icon_media_path}`
            : null,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Why BOSQ data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: WhyBosqFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Add all text fields
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("description", data.description);
      formData.append("title_ar", data.title_ar);
      formData.append("subtitle_ar", data.subtitle_ar);
      formData.append("description_ar", data.description_ar);
      formData.append("media_alt", data.media_alt);
      formData.append("media_alt_ar", data.media_alt_ar);
      formData.append("icon_media_alt", data.icon_media_alt);
      formData.append("icon_media_alt_ar", data.icon_media_alt_ar);
      formData.append("sort_order", (data.sort_order || 1).toString());
      formData.append("status", (data.status ?? true).toString());

      // Only append File instances (new uploads)
      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }
      if (data.icon_media_path instanceof File) {
        formData.append("icon_media_path", data.icon_media_path);
      }

      if (isEditing && id) {
        await updateWhyBosq(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Why BOSQ item updated successfully",
        });
      } else {
        await createWhyBosq(formData);
        toast({
          title: "Success",
          description: "Why BOSQ item created successfully",
        });
      }

      navigate("/why-bosq");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} Why BOSQ item`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Why BOSQ data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/why-bosq")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Why BOSQ Item
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} Why BOSQ item
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Content Information */}
          <Card>
            <CardHeader>
              <CardTitle>Content Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Content */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subtitle" {...field} />
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
                            placeholder="Enter description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Arabic Content */}
                <div className="space-y-4">
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

                  <FormField
                    control={form.control}
                    name="subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل العنوان الفرعي"
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
                            placeholder="أدخل الوصف"
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

          {/* Main Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Main Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                        accept="image/*"
                        preview={true}
                        maxImageSize={2 * 1024 * 1024}
                        recommendedDimensions="1200px x 800px"
                        dimensionNote="Hero image for Why BOSQ section"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Media Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter alt text in English"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Media Alt Text (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل النص البديل بالعربية"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Icon Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Icon Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="icon_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                        accept="image/*"
                        preview={true}
                        maxImageSize={500 * 1024}
                        recommendedDimensions="64px x 64px"
                        dimensionNote="Small icon for feature representation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon_media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Alt Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter icon alt text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon_media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Alt Text (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter icon alt text in Arabic"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
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
                          Enable or disable this Why BOSQ item
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
              onClick={() => navigate("/why-bosq")}
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
