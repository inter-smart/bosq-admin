import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  fetchHomeBannerById,
  createHomeBanner,
  updateHomeBanner,
} from "@/services/cms/home/homeBannerApi";
import { homeBannerSchema, HomeBannerFormData } from "@/schemas/homeSchema";
import { Switch } from "@/components/ui/switch";

export default function HomeBannerSliderForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [imageFile, setImageFile] = useState<File | string | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | string | null>(
    null
  );

  const form = useForm<HomeBannerFormData>({
    resolver: zodResolver(homeBannerSchema),
    shouldFocusError: true, // Enable auto-focus on error
    defaultValues: {
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      media_alt: "",
      media_alt_ar: "",
      button_text: "",
      button_text_ar: "",
      link: "",
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadBannerData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadBannerData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchHomeBannerById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          button_text: data.button_text || "",
          button_text_ar: data.button_text_ar || "",
          link: data.link || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          media_desktop_path: data.media_desktop_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_desktop_path}`
            : null,
          media_mobile_path: data.media_mobile_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_mobile_path}`
            : null,
        });

        if (data.media_desktop_path) {
          setImageFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.media_desktop_path}`
          );
        }
        if (data.media_mobile_path) {
          setMobileImageFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.media_mobile_path}`
          );
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banner data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };



  const onSubmit = async (data: HomeBannerFormData) => {
    try {
      setLoading(true);

      console.log(data);
      const formData = new FormData();

      // English fields
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.button_text) formData.append("button_text", data.button_text);
      if (data.link) formData.append("link", data.link);

      // Arabic fields
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.description_ar)
        formData.append("description_ar", data.description_ar);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);
      if (data.button_text_ar)
        formData.append("button_text_ar", data.button_text_ar);

      formData.append("sort_order", (data.sort_order || 0).toString());
      formData.append("status", (data.status ?? true).toString());

      if (data.media_desktop_path instanceof File) {
        formData.append("media_desktop_path", data.media_desktop_path);
      }
      if (data.media_mobile_path instanceof File) {
        formData.append("media_mobile_path", data.media_mobile_path);
      }

      if (isEditing && id) {
        await updateHomeBanner(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Banner updated successfully",
        });
      } else {
        await createHomeBanner(formData);
        toast({
          title: "Success",
          description: "Banner created successfully",
        });
      }

      navigate("/home-banner-slider");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} banner`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading banner data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/home-banner-slider")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Home Banner
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} home banner slider
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banner Content</CardTitle>
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
                          <Input placeholder="Enter banner title" {...field} />
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
                          <Textarea
                            placeholder="Enter description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="button_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Learn More" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
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
                            placeholder="أدخل عنوان البانر"
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
                          <Textarea
                            placeholder="أدخل الوصف"
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
                    name="button_text_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text  (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: اعرف المزيد"
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
              <CardTitle>Banner Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Image</FormLabel>

                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setImageFile(file);
                          }}
                          recommendedDimensions="1200px × 625px"
                          accept="image/*"
                          preview={true}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media_mobile_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Image</FormLabel>

                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setMobileImageFile(file);
                          }}
                          // size
                          recommendedDimensions="800x600"
                          accept="image/*"
                          preview={true}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter image alt text for accessibility"
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
                      <FormLabel>Alt Text (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل النص البديل للصورة"
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

          <Card>
            <CardHeader>
              <CardTitle>Banner Settings</CardTitle>
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
                          Enable or disable this banner slider
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
              onClick={() => navigate("/home-banner-slider")}
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
