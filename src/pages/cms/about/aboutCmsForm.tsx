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
import { fetchAboutCms, saveAboutCms } from "@/services/cms/about/aboutCmsApi";
import { aboutCmsSchema, type AboutCmsFormData } from "@/schemas/aboutSchema";

export default function AboutCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<AboutCmsFormData>({
    resolver: zodResolver(aboutCmsSchema),
    defaultValues: {
      title: "",
      banner_title: "",
      banner_description: "",
      banner_media_desktop_path: null,
      banner_media_mobile_path: null,
      banner_media_alt: "",
      journey_title: "",
      journey_description: "",
      why_choose_us_title: "",
      why_choose_us_description: "",
      testimonial_title: "",
      client_title: "",
      news_title: "",
    },
  });

  useEffect(() => {
    loadAboutCmsData();
  }, []);

  const loadAboutCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchAboutCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          banner_title: data.banner_title || "",
          banner_description: data.banner_description || "",
          banner_media_desktop_path: data.banner_media_desktop_path || null,
          banner_media_mobile_path: data.banner_media_mobile_path || null,
          banner_media_alt: data.banner_media_alt || "",
          journey_title: data.journey_title || "",
          journey_description: data.journey_description || "",
          why_choose_us_title: data.why_choose_us_title || "",
          why_choose_us_description: data.why_choose_us_description || "",
          testimonial_title: data.testimonial_title || "",
          client_title: data.client_title || "",
          news_title: data.news_title || "",
        });
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: AboutCmsFormData) => {
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

      await saveAboutCms(formData);
      toast({
        title: "Success",
        description: "About CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadAboutCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save About CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading About CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">About Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the About page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="banner_title"
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
                name="banner_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="banner_media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image (Desktop)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
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
                      <FormLabel>Image (Mobile)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload mobile banner image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="banner_media_alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner media alt text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Journey Section */}
          <Card>
            <CardHeader>
              <CardTitle>Journey Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <Textarea
                        placeholder="Enter journey description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Why Choose Us Section */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="why_choose_us_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter why choose us title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="why_choose_us_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter why choose us description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Testimonial Section */}
          <Card>
            <CardHeader>
              <CardTitle>Testimonial Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="testimonial_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter testimonial title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Client Section */}
          <Card>
            <CardHeader>
              <CardTitle>Client Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="client_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* News Section */}
          <Card>
            <CardHeader>
              <CardTitle>News Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="news_title"
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
