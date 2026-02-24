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
import { fetchCustomizationCms, saveCustomizationCms } from "@/services/customization/customizationCmsApi";
import { customizationCmsSchema, CustomizationCmsFormData } from "@/schemas/customizationSchema";

export default function CustomizationCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [prevMediaType, setPrevMediaType] = useState<string | null>(null);

  const form = useForm<CustomizationCmsFormData>({
    resolver: zodResolver(customizationCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      title_ar: "",
      banner_title: "",
      banner_title_ar: "",
      banner_description: "",
      banner_description_ar: "",
      banner_media_type: "image",
      banner_media_desktop_path: null,
      banner_media_mobile_path: null,
      banner_media_alt: "",
      banner_media_alt_ar: "",
      process_title: "",
      process_title_ar: "",
      process_description: "",
      process_description_ar: "",
      process_media_path: null,
      process_media_alt: "",
      process_media_alt_ar: "",
      options_title: "",
      options_title_ar: "",
      options_description: "",
      options_description_ar: "",
      form_title: "",
      form_title_ar: "",
      form_description: "",
      form_description_ar: "",
      form_media_path: null,
      form_media_alt: "",
      form_media_alt_ar: "",
    },
  });

  const watchBannerMediaType = form.watch("banner_media_type");


  useEffect(() => {
    if (
      !initialLoading &&
      prevMediaType !== null &&
      prevMediaType !== watchBannerMediaType
    ) {
      form.setValue("banner_media_desktop_path", null);
      form.setValue("banner_media_mobile_path", null);
    }

    // Update prevMediaType after initial loading is complete
    if (!initialLoading) {
      setPrevMediaType(watchBannerMediaType);
    }
  }, [watchBannerMediaType, initialLoading, form, prevMediaType]);




  useEffect(() => {
    loadCustomizationCmsData();
  }, []);

  const loadCustomizationCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchCustomizationCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          banner_title: data.banner_title || "",
          banner_title_ar: data.banner_title_ar || "",
          banner_description: data.banner_description || "",
          banner_description_ar: data.banner_description_ar || "",
          banner_media_type: data.banner_media_type || "image",
          banner_media_desktop_path: data.banner_media_desktop_path || null,
          banner_media_mobile_path: data.banner_media_mobile_path || null,
          banner_media_alt: data.banner_media_alt || "",
          banner_media_alt_ar: data.banner_media_alt_ar || "",
          process_title: data.process_title || "",
          process_title_ar: data.process_title_ar || "",
          process_description: data.process_description || "",
          process_description_ar: data.process_description_ar || "",
          process_media_path: data.process_media_path || null,
          process_media_alt: data.process_media_alt || "",
          process_media_alt_ar: data.process_media_alt_ar || "",
          options_title: data.options_title || "",
          options_title_ar: data.options_title_ar || "",
          options_description: data.options_description || "",
          options_description_ar: data.options_description_ar || "",
          form_title: data.form_title || "",
          form_title_ar: data.form_title_ar || "",
          form_description: data.form_description || "",
          form_description_ar: data.form_description_ar || "",
          form_media_path: data.form_media_path || null,
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

  const handleFormSubmit = form.handleSubmit(
    async (data) => {
      await onSubmit(data);
    },
    (errors) => {
      const firstErrorField = Object.keys(errors)[0] as keyof CustomizationCmsFormData;
      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: CustomizationCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Page Title
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);

      // Banner Section
      if (data.banner_title) formData.append("banner_title", data.banner_title);
      if (data.banner_title_ar) formData.append("banner_title_ar", data.banner_title_ar);
      if (data.banner_description) formData.append("banner_description", data.banner_description);
      if (data.banner_description_ar) formData.append("banner_description_ar", data.banner_description_ar);
      if (data.banner_media_type) formData.append("banner_media_type", data.banner_media_type);
      if (data.banner_media_alt) formData.append("banner_media_alt", data.banner_media_alt);
      if (data.banner_media_alt_ar) formData.append("banner_media_alt_ar", data.banner_media_alt_ar);

      if (data.banner_media_desktop_path instanceof File) {
        formData.append("banner_media_desktop_path", data.banner_media_desktop_path);
      }
      if (data.banner_media_mobile_path instanceof File) {
        formData.append("banner_media_mobile_path", data.banner_media_mobile_path);
      }

      // Process Section
      if (data.process_title) formData.append("process_title", data.process_title);
      if (data.process_title_ar) formData.append("process_title_ar", data.process_title_ar);
      if (data.process_description) formData.append("process_description", data.process_description);
      if (data.process_description_ar) formData.append("process_description_ar", data.process_description_ar);
      if (data.process_media_alt) formData.append("process_media_alt", data.process_media_alt);
      if (data.process_media_alt_ar) formData.append("process_media_alt_ar", data.process_media_alt_ar);

      if (data.process_media_path instanceof File) {
        formData.append("process_media_path", data.process_media_path);
      }

      // Options Section
      if (data.options_title) formData.append("options_title", data.options_title);
      if (data.options_title_ar) formData.append("options_title_ar", data.options_title_ar);
      if (data.options_description) formData.append("options_description", data.options_description);
      if (data.options_description_ar) formData.append("options_description_ar", data.options_description_ar);

      // Form Section
      if (data.form_title) formData.append("form_title", data.form_title);
      if (data.form_title_ar) formData.append("form_title_ar", data.form_title_ar);
      if (data.form_description) formData.append("form_description", data.form_description);
      if (data.form_description_ar) formData.append("form_description_ar", data.form_description_ar);
      if (data.form_media_alt) formData.append("form_media_alt", data.form_media_alt);
      if (data.form_media_alt_ar) formData.append("form_media_alt_ar", data.form_media_alt_ar);

      if (data.form_media_path instanceof File) {
        formData.append("form_media_path", data.form_media_path);
      }

      await saveCustomizationCms(formData);
      toast({
        title: "Success",
        description: "Customization CMS data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Customization CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Customization CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customization Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Customization page
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
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customization title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان التخصيص"
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
                    name="banner_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter banner description"
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
                    name="banner_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف البانر"
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

              {/* Media Type Select */}
              <FormField
                control={form.control}
                name="banner_media_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              {/* Media Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="banner_media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept={watchBannerMediaType === "video" ? "video/*" : "image/*"}
                          placeholder="Upload desktop media"
                          recommendedDimensions="1920px × 730px"
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
                      <FormLabel>Mobile Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept={watchBannerMediaType === "video" ? "video/*" : "image/*"}
                          placeholder="Upload mobile media"
                          recommendedDimensions="640px × 1138px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="banner_media_alt"
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

          {/* Process Section */}
          <Card>
            <CardHeader>
              <CardTitle>Process Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="process_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Process Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter process title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="process_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Process Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter process description"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="process_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Process Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان العملية"
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
                    name="process_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Process Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف العملية"
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

              <FormField
                control={form.control}
                name="process_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Process Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        placeholder="Upload process media"
                        recommendedDimensions="826px × 698px"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="process_media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Process Media Alt Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter media alt text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="process_media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Process Media Alt Text (AR)</FormLabel>
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

          {/* Options Section */}
          <Card>
            <CardHeader>
              <CardTitle>Options Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="options_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter options title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="options_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter options description"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="options_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان الخيارات"
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
                    name="options_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف الخيارات"
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

          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        recommendedDimensions="828px × 500px"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="form_media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Media Alt Text</FormLabel>
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
