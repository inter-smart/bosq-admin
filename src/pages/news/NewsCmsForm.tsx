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
import { fetchNewsCms, saveNewsCms } from "@/services/news/newsCmsApi";
import { newsCmsSchema, NewsCmsFormData } from "@/schemas/newsSchema";

export default function NewsCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<NewsCmsFormData>({
    resolver: zodResolver(newsCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      title_ar: "",
      banner_title: "",
      banner_title_ar: "",
      banner_description: "",
      banner_description_ar: "",
      media_desktop_path: null,
      media_mobile_path: null,
      media_desktop_path_ar: null,
      media_mobile_path_ar: null,
      media_alt: "",
      media_alt_ar: "",
      popular_news_title: "",
      popular_news_title_ar: "",
      related_news_title: "",
      related_news_title_ar: "",
    },
  });

  useEffect(() => {
    loadNewsCmsData();
  }, []);

  const loadNewsCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchNewsCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          banner_title: data.banner_title || "",
          banner_title_ar: data.banner_title_ar || "",
          banner_description: data.banner_description || "",
          banner_description_ar: data.banner_description_ar || "",
          media_desktop_path: data.media_desktop_path || null,
          media_mobile_path: data.media_mobile_path || null,
          media_desktop_path_ar: data.media_desktop_path_ar || null,
          media_mobile_path_ar: data.media_mobile_path_ar || null,
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          popular_news_title: data.popular_news_title || "",
          popular_news_title_ar: data.popular_news_title_ar || "",
          related_news_title: data.related_news_title || "",
          related_news_title_ar: data.related_news_title_ar || "",
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
      const firstErrorField = Object.keys(errors)[0] as keyof NewsCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: NewsCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // English fields
      formData.append("title", data.title);
      if (data.banner_title) formData.append("banner_title", data.banner_title);
      if (data.banner_description) formData.append("banner_description", data.banner_description);
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.popular_news_title) formData.append("popular_news_title", data.popular_news_title);
      if (data.related_news_title) formData.append("related_news_title", data.related_news_title);

      // Arabic fields
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.banner_title_ar) formData.append("banner_title_ar", data.banner_title_ar);
      if (data.banner_description_ar) formData.append("banner_description_ar", data.banner_description_ar);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);
      if (data.popular_news_title_ar) formData.append("popular_news_title_ar", data.popular_news_title_ar);
      if (data.related_news_title_ar) formData.append("related_news_title_ar", data.related_news_title_ar);

      if (data.media_desktop_path instanceof File) {
        formData.append("media_desktop_path", data.media_desktop_path);
      }
      if (data.media_mobile_path instanceof File) {
        formData.append("media_mobile_path", data.media_mobile_path);
      }
      if (data.media_desktop_path_ar instanceof File) {
        formData.append("media_desktop_path_ar", data.media_desktop_path_ar);
      }
      if (data.media_mobile_path_ar instanceof File) {
        formData.append("media_mobile_path_ar", data.media_mobile_path_ar);
      }

      await saveNewsCms(formData);
      toast({
        title: "Success",
        description: "News CMS data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save News CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading News CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">News Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the News page
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
                        <Input placeholder="Enter news title" {...field} />
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
                          placeholder="أدخل عنوان المدونة"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload desktop media"
                          recommendedDimensions="1920px x 1080px"
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
                      <FormLabel>Mobile Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload mobile media"
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
                  name="media_desktop_path_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Media (AR)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload desktop media (Arabic)"
                          recommendedDimensions="1920px x 1080px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media_mobile_path_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Media (AR)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload mobile media (Arabic)"
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


          {/* Section Titles */}
          <Card>
            <CardHeader>
              <CardTitle>Section Titles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="popular_news_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Popular News Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter popular news title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="related_news_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related News Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter related news title" {...field} />
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
                    name="popular_news_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Popular News Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان المدونات الشائعة"
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
                    name="related_news_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related News Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان المدونات ذات الصلة"
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
