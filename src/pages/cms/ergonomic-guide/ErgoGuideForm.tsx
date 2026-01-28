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
  fetchErgonomicGuideCms,
  saveErgonomicGuideCms,
} from "@/services/cms/ergonomic-guide/ergoGuideApi";
import {
  ergonomicGuideSchema,
  ErgonomicGuideFormData,
} from "@/schemas/ergonomicGuideSchema";

export default function ErgoGuideForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mediaDesktopFile, setMediaDesktopFile] = useState<
    File | string | null
  >(null);
  const [mediaMobileFile, setMediaMobileFile] = useState<File | string | null>(
    null,
  );

  const form = useForm<ErgonomicGuideFormData>({
    resolver: zodResolver(ergonomicGuideSchema),
    defaultValues: {
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      media_desktop_path: null,
      media_mobile_path: null,
      media_alt: "",
      media_alt_ar: "",
    },
  });

  // Effect to reset media fields when media type changes
  useEffect(() => {
    if (initialLoading) {
      form.setValue("media_desktop_path", null);
      form.setValue("media_mobile_path", null);
      setMediaDesktopFile(null);
      setMediaMobileFile(null);
    }
  }, [initialLoading, form]);

  useEffect(() => {
    loadErgonomicGuideData();
  }, []);


  

  const loadErgonomicGuideData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchErgonomicGuideCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          media_desktop_path: data.media_desktop_path || null,
          media_mobile_path: data.media_mobile_path || null,
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
        });

        if (data?.media_desktop_path) {
          const desktopUrl = `${import.meta.env.VITE_IMAGE_URL}/${data?.media_desktop_path}`;

          form.setValue("media_desktop_path", desktopUrl);
          setMediaDesktopFile(desktopUrl);
        }

        if (data.media_mobile_path) {
          const mobileUrl = `${import.meta.env.VITE_IMAGE_URL}/${data.media_mobile_path}`;

          form.setValue("media_mobile_path", mobileUrl);
          setMediaMobileFile(mobileUrl);
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
        errors,
      )[0] as keyof ErgonomicGuideFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    },
  );

  const onSubmit = async (data: ErgonomicGuideFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add text fields
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.description) formData.append("description", data.description);
      if (data.description_ar)
        formData.append("description_ar", data.description_ar);
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);

      // Add file uploads (only if they are new File instances)
      if (mediaDesktopFile instanceof File) {
        formData.append("media_desktop_path", mediaDesktopFile);
      }
      if (mediaMobileFile instanceof File) {
        formData.append("media_mobile_path", mediaMobileFile);
      }

      await saveErgonomicGuideCms(formData);
      toast({
        title: "Success",
        description: "Ergonomic Guide CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadErgonomicGuideData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Ergonomic Guide CMS data",
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
          Loading Ergonomic Guide CMS data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ergonomic Guide CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Ergonomic Guide section
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Content Section */}

          {/* Media Upload Section */}
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
              {/* Desktop & Mobile Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Desktop</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setMediaDesktopFile(file);
                          }}
                          accept={"image"}
                          recommendedDimensions="1920px x 1080px"
                          placeholder={`Upload desktop
                            image
                          `}
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
                        {"image"}
                        (Mobile)
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setMediaMobileFile(file);
                          }}
                          accept={"image"}
                          recommendedDimensions="768px x 1024px"
                          placeholder={`Upload mobile media`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Alt Text (Bilingual) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter alt text" {...field} />
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

          {/* Submit Button */}
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
