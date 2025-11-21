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
import { fetchFaqCms, saveFaqCms } from "@/services/faq/faqCmsApi";
import { faqCmsSchema, type FaqCmsFormData } from "@/schemas/faqCmsSchema";

export default function FaqCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<FaqCmsFormData>({
    resolver: zodResolver(faqCmsSchema),
    defaultValues: {
      banner_title: "",
      banner_media_desktop_path: null,
      banner_media_mobile_path: null,
      banner_media_alt: "",
      general_title: "",
      payment_title: "",
      refund_title: "",
      product_title: "",
      warrenty_title: "",
      question_title: "",
      question_description: "",
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
          banner_media_desktop_path: data.banner_media_desktop_path || null,
          banner_media_mobile_path: data.banner_media_mobile_path || null,
          banner_media_alt: data.banner_media_alt || "",
          general_title: data.general_title || "",
          payment_title: data.payment_title || "",
          refund_title: data.refund_title || "",
          product_title: data.product_title || "",
          warrenty_title: data.warrenty_title || "",
          question_title: data.question_title || "",
          question_description: data.question_description || "",
        });
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

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

          {/* FAQ Section Titles */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ Section Titles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="general_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>General Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter general title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter payment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refund_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter refund title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warrenty_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter warranty title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <Textarea
                        placeholder="Enter question description"
                        rows={4}
                        {...field}
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
