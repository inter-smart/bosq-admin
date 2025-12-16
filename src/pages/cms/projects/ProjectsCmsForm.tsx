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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProjectsCms,
  saveProjectsCms,
} from "@/services/cms/projects/projectsCmsApi";
import {
  projectsCmsSchema,
  ProjectsCmsFormData,
} from "@/schemas/projectsSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ProjectsCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mediaDesktopFile, setMediaDesktopFile] = useState<
    File | string | null
  >(null);
  const [mediaMobileFile, setMediaMobileFile] = useState<File | string | null>(
    null
  );
  const [formMediaFile, setFormMediaFile] = useState<File | string | null>(
    null
  );

  const [prevMediaType, setPrevMediaType] = useState<string | null>(null);



  const form = useForm<ProjectsCmsFormData>({
    resolver: zodResolver(projectsCmsSchema),
    defaultValues: {
      title: "",
      title_ar: "",
      banner_title: "",
      banner_title_ar: "",
      description: "",
      description_ar: "",
      media_desktop_path: null,
      media_mobile_path: null,
      media_alt: "",
      media_alt_ar: "",
      media_type: "image",
      form_title: "",
      form_title_ar: "",
      form_description: "",
      form_description_ar: "",
      form_media_path: null,
      form_media_alt: "",
      form_media_alt_ar: "",
    },
  });

  
  const watchBannerMediaType = form.watch("media_type");


    // Effect to reset media fields when media type changes
  useEffect(() => {
    if (
      !initialLoading &&
      prevMediaType !== null &&
      prevMediaType !== watchBannerMediaType
    ) {
      form.setValue("media_desktop_path", null);
      form.setValue("media_mobile_path", null);
    }

    // Update prevMediaType after initial loading is complete
    if (!initialLoading) {
      setPrevMediaType(watchBannerMediaType);
    }
  }, [watchBannerMediaType, initialLoading, form, prevMediaType]);



  useEffect(() => {
    loadProjectsCmsData();
  }, []);

  const loadProjectsCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchProjectsCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          banner_title: data.banner_title || "",
          banner_title_ar: data.banner_title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          media_desktop_path: data.media_desktop_path || null,
          media_mobile_path: data.media_mobile_path || null,
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          media_type: (data.media_type as "image" | "video") || "image",
          form_title: data.form_title || "",
          form_title_ar: data.form_title_ar || "",
          form_description: data.form_description || "",
          form_description_ar: data.form_description_ar || "",
          form_media_path: data.form_media_path || null,
          form_media_alt: data.form_media_alt || "",
          form_media_alt_ar: data.form_media_alt_ar || "",
        });

        // Set media file states with full URL
        if (data.media_desktop_path) {
          setMediaDesktopFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.media_desktop_path}`
          );
        }
        if (data.media_mobile_path) {
          setMediaMobileFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.media_mobile_path}`
          );
        }
        if (data.form_media_path) {
          setFormMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.form_media_path}`
          );
        }
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
      )[0] as keyof ProjectsCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );


  const onSubmit = async (data: ProjectsCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Page Title Section
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);

      // Banner Section
      if (data.banner_title) formData.append("banner_title", data.banner_title);
      if (data.banner_title_ar)
        formData.append("banner_title_ar", data.banner_title_ar);
      if (data.description) formData.append("description", data.description);
      if (data.description_ar)
        formData.append("description_ar", data.description_ar);

      // Banner Media Section
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);
      if (data.media_type) formData.append("media_type", data.media_type);

      // Form Section
      if (data.form_title) formData.append("form_title", data.form_title);
      if (data.form_title_ar)
        formData.append("form_title_ar", data.form_title_ar);
      if (data.form_description)
        formData.append("form_description", data.form_description);
      if (data.form_description_ar)
        formData.append("form_description_ar", data.form_description_ar);

      // Form Media Section
      if (data.form_media_alt)
        formData.append("form_media_alt", data.form_media_alt);
      if (data.form_media_alt_ar)
        formData.append("form_media_alt_ar", data.form_media_alt_ar);

      // Add file uploads (only if they are new File instances)
      if (mediaDesktopFile instanceof File) {
        formData.append("media_desktop_path", mediaDesktopFile);
      }
      if (mediaMobileFile instanceof File) {
        formData.append("media_mobile_path", mediaMobileFile);
      }
      if (formMediaFile instanceof File) {
        formData.append("form_media_path", formMediaFile);
      }

      await saveProjectsCms(formData);
      toast({
        title: "Success",
        description: "Projects CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadProjectsCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Projects CMS data",
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
          Loading Projects CMS data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Projects Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Projects page
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

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description"
                            rows={4}
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
                    name="banner_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Title (AR)</FormLabel>
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
                            rows={4}
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

          {/* Banner Media Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Media Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Desktop Banner */}

              <FormField
                control={form.control}
                name="media_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {watchBannerMediaType === "image" ? "Image" : "Video"}{" "}
                        (Desktop)
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setMediaDesktopFile(file);
                          }}
                          accept={
                            watchBannerMediaType === "image"
                              ? "image/*"
                              : "video/*"
                          }
                          recommendedDimensions="1920px x 1080px"
                          placeholder={`Upload desktop banner ${watchBannerMediaType}`}
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
                      <FormLabel>
                        {watchBannerMediaType === "image" ? "Image" : "Video"}{" "}
                        (Mobile)
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setMediaMobileFile(file);
                          }}
                          accept={
                            watchBannerMediaType === "image"
                              ? "image/*"
                              : "video/*"
                          }
                          recommendedDimensions="1920px x 1080px"
                          placeholder={`Upload mobile banner ${watchBannerMediaType}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Alt Text Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter media alt text" {...field} />
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
                        <FormLabel>Form Title</FormLabel>
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
                        <FormLabel>Form Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter form description"
                            rows={4}
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
                    name="form_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان النموذج"
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
                    name="form_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف النموذج"
                            rows={4}
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

          {/* Form Media Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Media Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="form_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={formMediaFile}
                          onChange={(file) => {
                            field.onChange(file);
                            setFormMediaFile(file);
                          }}
                          recommendedDimensions="800x600"
                          accept="image/*"
                          placeholder="Upload form image"
                          preview={true}
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
                        <FormLabel>Form Media Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter form media alt text"
                            {...field}
                          />
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
                        <FormLabel>Form Media Alt Text (AR)</FormLabel>
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
