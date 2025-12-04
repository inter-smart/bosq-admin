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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchBlogCms, saveBlogCms } from "@/services/blog/blogCmsApi";
import { blogCmsSchema, BlogCmsFormData } from "@/schemas/blogSchema";

export default function BlogCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("en");

  const form = useForm<BlogCmsFormData>({
    resolver: zodResolver(blogCmsSchema),
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
      media_alt: "",
      media_alt_ar: "",
      popular_blogs_title: "",
      popular_blogs_title_ar: "",
      related_blogs_title: "",
      related_blogs_title_ar: "",
    },
  });

  useEffect(() => {
    loadBlogCmsData();
  }, []);

  const loadBlogCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchBlogCms();
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
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          popular_blogs_title: data.popular_blogs_title || "",
          popular_blogs_title_ar: data.popular_blogs_title_ar || "",
          related_blogs_title: data.related_blogs_title || "",
          related_blogs_title_ar: data.related_blogs_title_ar || "",
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
      // Define Arabic fields
      const arabicFields: (keyof BlogCmsFormData)[] = [
        "title_ar",
        "banner_title_ar",
        "banner_description_ar",
        "media_alt_ar",
        "popular_blogs_title_ar",
        "related_blogs_title_ar",
      ];

      // Get the first error field
      const firstErrorField = Object.keys(errors)[0] as keyof BlogCmsFormData;

      if (firstErrorField) {
        // Check if the error is in an Arabic field
        if (arabicFields.includes(firstErrorField)) {
          setActiveTab("ar");
        } else {
          setActiveTab("en");
        }

        // Focus the field after tab switch
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: BlogCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // English fields
      formData.append("title", data.title);
      if (data.banner_title) formData.append("banner_title", data.banner_title);
      if (data.banner_description) formData.append("banner_description", data.banner_description);
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.popular_blogs_title) formData.append("popular_blogs_title", data.popular_blogs_title);
      if (data.related_blogs_title) formData.append("related_blogs_title", data.related_blogs_title);

      // Arabic fields
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.banner_title_ar) formData.append("banner_title_ar", data.banner_title_ar);
      if (data.banner_description_ar) formData.append("banner_description_ar", data.banner_description_ar);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);
      if (data.popular_blogs_title_ar) formData.append("popular_blogs_title_ar", data.popular_blogs_title_ar);
      if (data.related_blogs_title_ar) formData.append("related_blogs_title_ar", data.related_blogs_title_ar);

      if (data.media_desktop_path instanceof File) {
        formData.append("media_desktop_path", data.media_desktop_path);
      }
      if (data.media_mobile_path instanceof File) {
        formData.append("media_mobile_path", data.media_mobile_path);
      }

      await saveBlogCms(formData);
      toast({
        title: "Success",
        description: "Blog CMS data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Blog CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Blog CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blog Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Blog page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">العربية (Arabic)</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter blog title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                  <FormField
                    control={form.control}
                    name="banner_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter banner description"
                            {...field}
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
                        <FormLabel>Media Alt Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter media alt text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="popular_blogs_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Popular Blogs Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter popular blogs title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="related_blogs_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Blogs Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter related blogs title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان (Title)</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="banner_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عنوان البانر (Banner Title)</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="banner_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف البانر (Banner Description)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف البانر"
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
                    name="media_alt_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>النص البديل (Media Alt Text)</FormLabel>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="popular_blogs_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عنوان المدونات الشائعة (Popular Blogs Title)</FormLabel>
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
                      name="related_blogs_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عنوان المدونات ذات الصلة (Related Blogs Title)</FormLabel>
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Blog Header Images */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Header Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
