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
  fetchSocialMediaById,
  createSocialMedia,
  updateSocialMedia,
} from "@/services/common/socialMediaApi";
import { socialMediaSchema, SocialMediaFormData } from "@/schemas/socialMediaSchema";
import { Switch } from "@/components/ui/switch";

export default function SocialMediaForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      icon_alt: "",
      icon_alt_ar: "",
      link: "",
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadSocialMediaData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadSocialMediaData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchSocialMediaById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          link: data.link || "",
          icon_alt: data.icon_alt || "",
          icon_alt_ar: data.icon_alt_ar || "",
          sort_order: data.sort_order || 0,
          status: data.status ?? true,
          icon_media_path: data.icon_media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.icon_media_path}` : null,
          footer_icon_media_path: data.footer_icon_media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.footer_icon_media_path}` : null,

        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load social media data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: SocialMediaFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("link", data.link);
      formData.append("icon_alt", data.icon_alt);
      formData.append("icon_alt_ar", data.icon_alt_ar);
      formData.append("sort_order", (data.sort_order || 0).toString());
      formData.append("status", (data.status ?? true).toString());

      if (data.icon_media_path instanceof File) {
        formData.append("icon_media_path", data.icon_media_path);
      }

      if (data.footer_icon_media_path instanceof File) {
        formData.append("footer_icon_media_path", data.footer_icon_media_path);
      }

      if (isEditing && id) {
        await updateSocialMedia(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Social media item updated successfully",
        });
      } else {
        await createSocialMedia(formData);
        toast({
          title: "Success",
          description: "Social media item created successfully",
        });
      }

      navigate("/social-media");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"
          } social media item`,
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
          Loading social media data...
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
          onClick={() => navigate("/social-media")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Social Media
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} social media item
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Icon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="icon_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Icon (For Contact Page) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                        accept="image/*"
                        preview={true}
                        recommendedDimensions="13px x 13px"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Upload a new icon to replace the current one (optional)"
                        : "Upload a social media icon (required)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="footer_icon_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Footer Icon <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                        accept="image/*"
                        preview={true}
                        recommendedDimensions="13px x 13px"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Upload a new icon to replace the current one (optional)"
                        : "Upload a social media icon (required)"}
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
              <CardTitle>Social Media Settings</CardTitle>
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
                          Enable or disable this social media item
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
              onClick={() => navigate("/social-media")}
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
