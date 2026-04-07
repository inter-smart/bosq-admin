import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchHomeCms, saveHomeCms } from "@/services/cms/home/homeCmsApi";
import { homeSchema, HomeCmsFormData } from "@/schemas/homeSchema";

export default function HomeCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [prevMediaType, setPrevMediaType] = useState<string | null>(null);

  const form = useForm<HomeCmsFormData>({
    resolver: zodResolver(homeSchema),
    shouldFocusError: true,
    defaultValues: {
      about_media_path: null,
      about_media_alt: "",
      about_media_alt_ar: "",
      about_title: "",
      about_title_ar: "",
      about_description: "",
      about_description_ar: "",
      featured_title: "",
      featured_title_ar: "",
      journey_title: "",
      journey_title_ar: "",
      journey_description: "",
      journey_description_ar: "",
      journey_media_type: "image",
      journey_media_desktop_path: null,
      journey_media_mobile_path: null,
      journey_media_alt: "",
      journey_media_alt_ar: "",
      journey_link: "",
      journey_thumbnail_path: null,
      project_title: "",
      project_title_ar: "",
      fits_title: "",
      fits_title_ar: "",
      fits_description: "",
      fits_description_ar: "",
      brands_title: "",
      brands_title_ar: "",
      form_title: "",
      form_title_ar: "",
      form_description: "",
      form_description_ar: "",
      form_media_path: null,
      form_media_alt: "",
      form_media_alt_ar: "",
    },
  });

  const watchJourneyMediaType = form.watch("journey_media_type");

  useEffect(() => {
    if (!initialLoading && prevMediaType !== null && prevMediaType !== watchJourneyMediaType) {
      form.setValue("journey_media_desktop_path", null);
      form.setValue("journey_media_mobile_path", null);
    }

    // Update prevMediaType after initial loading is complete
    if (!initialLoading) {
      setPrevMediaType(watchJourneyMediaType);
    }
  }, [watchJourneyMediaType, initialLoading, form, prevMediaType]);

  useEffect(() => {
    loadHomeCmsData();
  }, []);

  const loadHomeCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchHomeCms();
      const data = response.data;

      if (data) {
        form.reset({
          about_media_path: data.about_media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.about_media_path}` : null,
          about_media_alt: data.about_media_alt || "",
          about_media_alt_ar: data.about_media_alt_ar || "",
          about_title: data.about_title || "",
          about_title_ar: data.about_title_ar || "",
          about_description: data.about_description || "",
          about_description_ar: data.about_description_ar || "",
          featured_title: data.featured_title || "",
          featured_title_ar: data.featured_title_ar || "",
          journey_title: data.journey_title || "",
          journey_title_ar: data.journey_title_ar || "",
          journey_description: data.journey_description || "",
          journey_description_ar: data.journey_description_ar || "",
          journey_media_type: data.journey_media_type || "image",
          journey_media_desktop_path: data.journey_media_desktop_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.journey_media_desktop_path}` : null,
          journey_media_mobile_path: data.journey_media_mobile_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.journey_media_mobile_path}` : null,
          journey_media_alt: data.journey_media_alt || "",
          journey_media_alt_ar: data.journey_media_alt_ar || "",
          journey_link: data.journey_link || "",
          journey_thumbnail_path: data.journey_thumbnail_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.journey_thumbnail_path}` : null,
          project_title: data.project_title || "",
          project_title_ar: data.project_title_ar || "",
          fits_title: data.fits_title || "",
          fits_title_ar: data.fits_title_ar || "",
          fits_description: data.fits_description || "",
          fits_description_ar: data.fits_description_ar || "",
          brands_title: data.brands_title || "",
          brands_title_ar: data.brands_title_ar || "",
          form_title: data.form_title || "",
          form_title_ar: data.form_title_ar || "",
          form_description: data.form_description || "",
          form_description_ar: data.form_description_ar || "",
          form_media_path: data.form_media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.form_media_path}` : null,
          form_media_alt: data.form_media_alt || "",
          form_media_alt_ar: data.form_media_alt_ar || "",
        });
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: HomeCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // About Section
      if (data.about_title) formData.append("about_title", data.about_title);
      if (data.about_title_ar) formData.append("about_title_ar", data.about_title_ar);
      if (data.about_description) formData.append("about_description", data.about_description);
      if (data.about_description_ar) formData.append("about_description_ar", data.about_description_ar);
      if (data.about_media_alt) formData.append("about_media_alt", data.about_media_alt);
      if (data.about_media_alt_ar) formData.append("about_media_alt_ar", data.about_media_alt_ar);
      if (data.about_media_path instanceof File) formData.append("about_media_path", data.about_media_path);

      // Featured Products Section
      if (data.featured_title) formData.append("featured_title", data.featured_title);
      if (data.featured_title_ar) formData.append("featured_title_ar", data.featured_title_ar);

      // Journey Section
      if (data.journey_title) formData.append("journey_title", data.journey_title);
      if (data.journey_title_ar) formData.append("journey_title_ar", data.journey_title_ar);
      if (data.journey_description) formData.append("journey_description", data.journey_description);
      if (data.journey_description_ar) formData.append("journey_description_ar", data.journey_description_ar);
      if (data.journey_media_type) formData.append("journey_media_type", data.journey_media_type);
      if (data.journey_media_alt) formData.append("journey_media_alt", data.journey_media_alt);
      if (data.journey_media_alt_ar) formData.append("journey_media_alt_ar", data.journey_media_alt_ar);
      if (data.journey_media_desktop_path instanceof File) formData.append("journey_media_desktop_path", data.journey_media_desktop_path);

      if (data.journey_media_mobile_path instanceof File) formData.append("journey_media_mobile_path", data.journey_media_mobile_path);
      if (data.journey_thumbnail_path instanceof File) formData.append("journey_thumbnail_path", data.journey_thumbnail_path);
      formData.append("journey_link", data.journey_link ?? "");

      // Project Section
      if (data.project_title) formData.append("project_title", data.project_title);
      if (data.project_title_ar) formData.append("project_title_ar", data.project_title_ar);

      // Fits Section
      if (data.fits_title) formData.append("fits_title", data.fits_title);
      if (data.fits_title_ar) formData.append("fits_title_ar", data.fits_title_ar);
      if (data.fits_description) formData.append("fits_description", data.fits_description);
      if (data.fits_description_ar) formData.append("fits_description_ar", data.fits_description_ar);

      // Brands Section
      if (data.brands_title) formData.append("brands_title", data.brands_title);
      if (data.brands_title_ar) formData.append("brands_title_ar", data.brands_title_ar);

      // Form Section
      if (data.form_title) formData.append("form_title", data.form_title);
      if (data.form_title_ar) formData.append("form_title_ar", data.form_title_ar);
      if (data.form_description) formData.append("form_description", data.form_description);
      if (data.form_description_ar) formData.append("form_description_ar", data.form_description_ar);
      if (data.form_media_alt) formData.append("form_media_alt", data.form_media_alt);
      if (data.form_media_alt_ar) formData.append("form_media_alt_ar", data.form_media_alt_ar);
      if (data.form_media_path instanceof File) formData.append("form_media_path", data.form_media_path);

      await saveHomeCms(formData);
      toast({
        title: "Success",
        description: "Home CMS data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Home CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Home CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Home Page CMS</h1>
        <p className="text-muted-foreground">Manage content for the Home page</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="about_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter about title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="about_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter about description" {...field} />
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
                    name="about_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان القسم" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="about_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصف القسم" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Media */}
                <FormField
                  control={form.control}
                  name="about_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload about section media"
                          recommendedDimensions="308px × 517px"
                          preview
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Alt Texts */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="about_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Alt Text (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter media alt text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="about_media_alt_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل النص البديل" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Products Section */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Products Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter featured title" {...field} />
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
                    name="featured_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان المنتجات المميزة" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journey Section */}
          <Card>
            <CardHeader>
              <CardTitle>Journey Section</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Title & Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="journey_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter journey title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="journey_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter journey description" {...field} />
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
                    name="journey_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان الرحلة" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="journey_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصف الرحلة" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Media Type */}
              <FormField
                control={form.control}
                name="journey_media_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              {/* Media + Alt Texts */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="journey_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Media */}
                <FormField
                  control={form.control}
                  name="journey_media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Journey{" "}
                        {watchJourneyMediaType === "image" ? "Image" : "Video"}
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept={
                            watchJourneyMediaType === "image"
                              ? "image/*"
                              : "video/*"
                          }
                          placeholder={`Upload journey ${watchJourneyMediaType}`}
                          preview
                          recommendedDimensions="1080px × 563px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchJourneyMediaType !== "video" ? (
                  <FormField
                    control={form.control}
                    name="journey_media_mobile_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journey Image (Mobile)</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*"
                            placeholder="Upload journey image (mobile)"
                            preview
                            recommendedDimensions="800px × 600px"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="journey_thumbnail_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journey Thumbnail</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*"
                            placeholder="Upload journey thumbnail"
                            preview
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Alt Texts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="journey_media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text (English)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter ${watchJourneyMediaType} alt text`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="journey_media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text (AR)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل النص البديل" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="project_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project title" {...field} />
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
                    name="project_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان المشروع" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fits Section */}
          <Card>
            <CardHeader>
              <CardTitle>Fits Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fits_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter fits title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fits_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter fits description" {...field} />
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
                    name="fits_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان المناسب" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fits_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصف المناسب" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brands Section */}
          <Card>
            <CardHeader>
              <CardTitle>Brands Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="brands_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brands title" {...field} />
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
                    name="brands_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان العلامات التجارية" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="form_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter form title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="form_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter form description" {...field} />
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
                    name="form_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان النموذج" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="form_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصف النموذج" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="form_media_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Media</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*"
                            placeholder="Upload form media"
                            preview={true}
                            recommendedDimensions="541px × 348px"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="form_media_alt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media Alt Text (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter media alt text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="form_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alt Text (AR)</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل النص البديل" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
    </div >
  );
}
