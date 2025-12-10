import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchMaterialsCms, saveMaterialsCms } from "@/services/cms/materials/materialsApi";
import { materialsCmsSchema, type MaterialsCmsFormData } from "@/schemas/materialsSchema";

export default function MaterialsCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<MaterialsCmsFormData>({
    resolver: zodResolver(materialsCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      title_ar: "",
      banner_title: "",
      banner_title_ar: "",
      banner_media_desktop_path: null,
      banner_media_mobile_path: null,
      banner_media_alt: "",
      banner_media_alt_ar: "",
    },
  });

  useEffect(() => {
    loadMaterialsCmsData();
  }, []);

  const loadMaterialsCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchMaterialsCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          banner_title: data.banner_title || "",
          banner_title_ar: data.banner_title_ar || "",
          banner_media_desktop_path: data.banner_media_desktop_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.banner_media_desktop_path}`
            : null,
          banner_media_mobile_path: data.banner_media_mobile_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.banner_media_mobile_path}`
            : null,
          banner_media_alt: data.banner_media_alt || "",
          banner_media_alt_ar: data.banner_media_alt_ar || "",
        });
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

  // Custom submit handler with validation
  const handleFormSubmit = form.handleSubmit(
    // Success callback
    async (data) => {
      await onSubmit(data);
    },
    // Error callback - runs when validation fails
    (errors) => {
      // Get the first error field and focus it
      const firstErrorField = Object.keys(
        errors
      )[0] as keyof MaterialsCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: MaterialsCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add all text fields (English and Arabic)
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);

      // Banner section
      if (data.banner_title) formData.append("banner_title", data.banner_title);
      if (data.banner_title_ar)
        formData.append("banner_title_ar", data.banner_title_ar);
      if (data.banner_media_alt)
        formData.append("banner_media_alt", data.banner_media_alt);
      if (data.banner_media_alt_ar)
        formData.append("banner_media_alt_ar", data.banner_media_alt_ar);

      // Add banner file uploads
      if (data.banner_media_desktop_path instanceof File) {
        formData.append(
          "banner_media_desktop_path",
          data.banner_media_desktop_path
        );
      }
      if (data.banner_media_mobile_path instanceof File) {
        formData.append(
          "banner_media_mobile_path",
          data.banner_media_mobile_path
        );
      }

      await saveMaterialsCms(formData);
      toast({
        title: "Success",
        description: "Materials CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadMaterialsCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Materials CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Materials CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Material Guide CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Material Guide page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Page Title Section */}
          <Card>
            <CardHeader>
              <CardTitle>Page Title Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter page title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Arabic */}
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (العنوان)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان الصفحة"
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

          {/* Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="banner_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter banner title" {...field} />
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
                    name="banner_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Title (عنوان البانر)</FormLabel>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Uploads Section */}
          <Card>
            <CardHeader>
              <CardTitle>Media Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banner Section Media</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="banner_media_desktop_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image (Desktop)</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*"
                            recommendedDimensions="1920px x 1080px"
                            placeholder="Upload desktop banner image"
                            preview={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="banner_media_mobile_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image (Mobile)</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*"
                            recommendedDimensions="768px x 1024px"
                            placeholder="Upload mobile banner image"
                            preview={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="banner_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Alt Text (English)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter media alt text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="banner_media_alt_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Alt Text (النص البديل)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل النص البديل"
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

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
