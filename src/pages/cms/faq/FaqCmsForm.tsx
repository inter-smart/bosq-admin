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
import { fetchFaqCms, saveFaqCms } from "@/services/cms/faq/faqCmsApi";
import { faqCmsSchema, type FaqCmsFormData } from "@/schemas/faqSchema";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function FaqCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<FaqCmsFormData>({
    resolver: zodResolver(faqCmsSchema),
    defaultValues: {
      banner_title: "",
      banner_title_ar: "",
      banner_media_desktop_path: null,
      banner_media_mobile_path: null,
      banner_media_alt: "",
      banner_media_alt_ar: "",
      title: "",
      title_ar: "",
      question_title: "",
      question_title_ar: "",
      question_description: "",
      question_description_ar: "",
    },
  });

  useEffect(() => {
    loadFaqCmsData();
  }, []);

  const loadFaqCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchFaqCms();
      const data = response.data;

      if (data) {
        form.reset({
          banner_title: data.banner_title || "",
          banner_title_ar: data.banner_title_ar || "",
          banner_media_desktop_path: data.banner_media_desktop_path || null,
          banner_media_mobile_path: data.banner_media_mobile_path || null,
          banner_media_alt: data.banner_media_alt || "",
          banner_media_alt_ar: data.banner_media_alt_ar || "",
          title: data.title || "",
          title_ar: data.title_ar || "",
          question_title: data.question_title || "",
          question_title_ar: data.question_title_ar || "",
          question_description: data.question_description || "",
          question_description_ar: data.question_description_ar || "",
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
      const firstErrorField = Object.keys(errors)[0] as keyof FaqCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: FaqCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && !(value instanceof File)) {
          formData.append(key, value.toString());
        }
      });

      // Add file uploads
      if (data.banner_media_desktop_path instanceof File) {
        formData.append("banner_media_desktop_path", data.banner_media_desktop_path);
      }
      if (data.banner_media_mobile_path instanceof File) {
        formData.append("banner_media_mobile_path", data.banner_media_mobile_path);
      }

      await saveFaqCms(formData);
      toast({
        title: "Success",
        description: "FAQ CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadFaqCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save FAQ CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading FAQ CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">FAQ Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the FAQ page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English */}
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

                {/* Arabic */}
                <FormField
                  control={form.control}
                  name="banner_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Title (عنوان البانر)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل عنوان البانر" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Page Title */}
          <Card>
            <CardHeader>
              <CardTitle>Page Title</CardTitle>
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
                        <Input placeholder="أدخل عنوان الصفحة" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section Titles */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ Section Titles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="question_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter question title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="question_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter question description"
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
                    name="question_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Title (عنوان الأسئلة)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان الأسئلة" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="question_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Description (وصف الأسئلة)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="أدخل وصف الأسئلة"
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
            <CardContent className="space-y-4">
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
                          recommendedDimensions="1200px x 600px"
                          placeholder="Upload desktop banner image"
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
                          placeholder="Upload mobile banner image"
                          recommendedDimensions="600px x 600px"
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
                        <Input placeholder="Enter banner media alt text" {...field} />
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
                      <FormLabel>النص البديل (Alt Text - Arabic)</FormLabel>
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
