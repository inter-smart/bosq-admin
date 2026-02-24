import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchSustainabilityCms, saveSustainabilityCms } from "@/services/cms/sustainablility/sustainabilityCmsApi";
import { sustainabilityCmsSchema, type SustainabilityCmsFormData } from "@/schemas/sustainabilitySchema";

export default function SustainabilityCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [prevBannerMediaType, setPrevBannerMediaType] = useState<string | null>(null);

  const form = useForm<SustainabilityCmsFormData>({
    resolver: zodResolver(sustainabilityCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      title_ar: "",
      banner_media_desktop_path: null,
      banner_media_mobile_path: null,
      banner_media_alt: "",
      banner_media_alt_ar: "",
      banner_media_type: null,
      section1_title: "",
      section1_title_ar: "",
      section1_description: "",
      section1_description_ar: "",
      section1_media_path: null,
      section1_media_alt: "",
      section1_media_alt_ar: "",
    },
  });

  const watchBannerMediaType = form.watch("banner_media_type");

  useEffect(() => {
    if (!initialLoading && prevBannerMediaType !== null && prevBannerMediaType !== watchBannerMediaType) {
      form.setValue("banner_media_desktop_path", null);
      form.setValue("banner_media_mobile_path", null);
    }
    if (!initialLoading) {
      setPrevBannerMediaType(watchBannerMediaType);
    }
  }, [watchBannerMediaType, initialLoading, form, prevBannerMediaType]);

  useEffect(() => {
    loadSustainabilityCmsData();
  }, []);

  const loadSustainabilityCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchSustainabilityCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          banner_media_desktop_path: data.banner_media_desktop_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.banner_media_desktop_path}`
            : null,
          banner_media_mobile_path: data.banner_media_mobile_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.banner_media_mobile_path}`
            : null,
          banner_media_alt: data.banner_media_alt || "",
          banner_media_alt_ar: data.banner_media_alt_ar || "",
          banner_media_type: data.banner_media_type || null,
          section1_title: data.section1_title || "",
          section1_title_ar: data.section1_title_ar || "",
          section1_description: data.section1_description || "",
          section1_description_ar: data.section1_description_ar || "",
          section1_media_path: data.section1_media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.section1_media_path}`
            : null,
          section1_media_alt: data.section1_media_alt || "",
          section1_media_alt_ar: data.section1_media_alt_ar || "",
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
      )[0] as keyof SustainabilityCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: SustainabilityCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add all text fields (English and Arabic)
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);

      // Banner section
      if (data.banner_media_alt)
        formData.append("banner_media_alt", data.banner_media_alt);
      if (data.banner_media_alt_ar)
        formData.append("banner_media_alt_ar", data.banner_media_alt_ar);
      if (data.banner_media_type)
        formData.append("banner_media_type", data.banner_media_type);

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

      // Section 1
      if (data.section1_title)
        formData.append("section1_title", data.section1_title);
      if (data.section1_title_ar)
        formData.append("section1_title_ar", data.section1_title_ar);
      if (data.section1_description)
        formData.append("section1_description", data.section1_description);
      if (data.section1_description_ar)
        formData.append("section1_description_ar", data.section1_description_ar);
      if (data.section1_media_alt)
        formData.append("section1_media_alt", data.section1_media_alt);
      if (data.section1_media_alt_ar)
        formData.append("section1_media_alt_ar", data.section1_media_alt_ar);
      // Add section1 file upload
      if (data.section1_media_path instanceof File) {
        formData.append(
          "section1_media_path",
          data.section1_media_path
        );
      }

      await saveSustainabilityCms(formData);
      toast({
        title: "Success",
        description: "Sustainability CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadSustainabilityCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Sustainability CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // if (initialLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-muted-foreground">Loading Sustainability CMS data...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sustainability CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Sustainability page
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
                      <FormLabel>Title (AR)</FormLabel>
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
            <CardContent className="space-y-6">
              {/* Banner Media Type */}
              <FormField
                control={form.control}
                name="banner_media_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Media Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Banner Media Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="banner_media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Media (Desktop)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept={
                            form.watch("banner_media_type") === "video"
                              ? "video/*"
                              : "image/*"
                          }
                          recommendedDimensions="1920px × 730px"
                          placeholder="Upload desktop banner media"
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
                      <FormLabel>Banner Media (Mobile)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept={
                            form.watch("banner_media_type") === "video"
                              ? "video/*"
                              : "image/*"
                          }
                          recommendedDimensions="640px × 1138px"
                          placeholder="Upload mobile banner media"
                          preview={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Banner Alt Text */}
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
                      <FormLabel>Media Alt Text (AR)</FormLabel>
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
            </CardContent>
          </Card>

          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Section 1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section 1 Titles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="section1_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter section title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section1_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان القسم"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 1 Descriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="section1_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter section description"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section1_description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Description (AR)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل وصف القسم"
                          className="min-h-[120px]"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 1 Media Upload */}
              <FormField
                control={form.control}
                name="section1_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        recommendedDimensions="1789px × 798px"
                        placeholder="Upload section media"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section 1 Alt Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="section1_media_alt"
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
                  name="section1_media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text (AR)</FormLabel>
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