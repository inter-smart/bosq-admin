import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  fetchHeaderFooterSettings,
  saveHeaderFooterSettings,
} from "@/services/common/siteSettingsApi";
import {
  headerFooterSchema,
  HeaderFooterFormData,
} from "@/schemas/siteSettingsSchema";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function HeaderFooterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [headerLogo, setHeaderLogo] = useState<File | string | null>(null);
  const [footerLogo, setFooterLogo] = useState<File | string | null>(null);

  const form = useForm<HeaderFooterFormData>({
    resolver: zodResolver(headerFooterSchema),
    defaultValues: {
      address: "",
      address_ar: "",
      phone_number: "",
      email: "",
      header_media_alt: "",
      header_media_alt_ar: "",
      footer_media_alt: "",
      footer_media_alt_ar: "",
      sale_enquiry_title: "",
      sale_enquiry_title_ar: "",
      sale_enquiry_email: "",
      sales_phone_number: "",
      support_enquiry_title: "",
      support_enquiry_title_ar: "",
      support_email: "",
      news_letter_main_title: "",
      news_letter_main_title_ar: "",
      news_letter_title: "",
      news_letter_title_ar: "",
      po_box_number: null,
    },
  });

  useEffect(() => {
    loadHeaderFooterData();
  }, []);

  const loadHeaderFooterData = async () => {
    try {
      setInitialLoading(true);
      const res = await fetchHeaderFooterSettings();
      const data = res.data;

      if (data) {
        form.reset({
          header_logo_media_path: data.header_logo_media_path || null,
          footer_logo_media_path: data.footer_logo_media_path || null,
          header_media_alt: data.header_media_alt || "",
          header_media_alt_ar: data.header_media_alt_ar || "",
          footer_media_alt: data.footer_media_alt || "",
          footer_media_alt_ar: data.footer_media_alt_ar || "",
          address: data.address || "",
          address_ar: data.address_ar || "",
          sale_enquiry_title: data.sale_enquiry_title || "",
          sale_enquiry_title_ar: data.sale_enquiry_title_ar || "",
          sale_enquiry_email: data.sale_enquiry_email || "",
          sales_phone_number: data.sales_phone_number || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          support_enquiry_title: data.support_enquiry_title || "",
          support_enquiry_title_ar: data.support_enquiry_title_ar || "",
          support_email: data.support_email || "",
          news_letter_main_title: data.news_letter_main_title || "",
          news_letter_main_title_ar: data.news_letter_main_title_ar || "",
          news_letter_title: data.news_letter_title || "",
          news_letter_title_ar: data.news_letter_title_ar || "",
          po_box_number: data.po_box_number || null,
        });

        // Set header/footer logo URLs
        if (data.header_logo_media_path) {
          setHeaderLogo(
            `${import.meta.env.VITE_URL}/${data.header_logo_media_path}`
          );
        }
        if (data.footer_logo_media_path) {
          setFooterLogo(
            `${import.meta.env.VITE_URL}/${data.footer_logo_media_path}`
          );
        }
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFormSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      if (headerLogo instanceof File)
        formData.append("header_logo_media_path", headerLogo);
      if (footerLogo instanceof File)
        formData.append("footer_logo_media_path", footerLogo);

      await saveHeaderFooterSettings(formData);

      toast({
        title: "Success",
        description: "Header & Footer settings updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  });

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading site settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Header & Footer Settings</h1>
        <p className="text-muted-foreground">
          Manage global header/footer logos, contact info, and newsletter
          settings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Contact Info */}
          <Card>
  <CardHeader>
    <CardTitle>Contact Information</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <RichTextEditor placeholder="Enter address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address_ar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address (AR)</FormLabel>
            <FormControl>
              <RichTextEditor
                placeholder="أدخل العنوان"
                {...field}
                dir="rtl"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone Number */}
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sales Phone Number */}
      <FormField
        control={form.control}
        name="sales_phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sales Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter sales phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* PO Box Number */}
      <FormField
        control={form.control}
        name="po_box_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PO Box Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter PO box number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* General Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sale Enquiry Email */}
      <FormField
        control={form.control}
        name="sale_enquiry_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sale Enquiry Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Support Email */}
      <FormField
        control={form.control}
        name="support_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Support Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </CardContent>
</Card>


          {/* Header & Footer Logos */}
          <Card>
            <CardHeader>
              <CardTitle>Header & Footer Logos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="header_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Logo Alt Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alt text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="header_logo_media_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Logo</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={(file) => {
                              field.onChange(file);
                              setHeaderLogo(file);
                            }}
                            recommendedDimensions="1920px x 1080px"
                            accept="image/*"
                            placeholder="Upload journey image 1"
                            preview={true}
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
                    name="footer_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Logo Alt Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alt text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="footer_logo_media_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Logo</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={(file) => {
                              field.onChange(file);
                              setFooterLogo(file);
                            }}
                            recommendedDimensions="1920px x 1080px"
                            accept="image/*"
                            placeholder="Upload journey image 1"
                            preview={true}
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

          {/* Enquiry & Newsletter */}
          <Card>
            <CardHeader>
              <CardTitle>Enquiry & Newsletter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sale Enquiry */}
                <FormField
                  control={form.control}
                  name="sale_enquiry_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Enquiry Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sale_enquiry_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Enquiry Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل العنوان"
                          {...field}
                          dir="rtl"
                          className="text-right"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Support Enquiry */}
                <FormField
                  control={form.control}
                  name="support_enquiry_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Enquiry Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="support_enquiry_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Enquiry Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل العنوان"
                          {...field}
                          dir="rtl"
                          className="text-right"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Newsletter Main Title */}
                <FormField
                  control={form.control}
                  name="news_letter_main_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Newsletter Main Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter main title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="news_letter_main_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Newsletter Main Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل العنوان الرئيسي"
                          {...field}
                          dir="rtl"
                          className="text-right"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Newsletter Title */}
                <FormField
                  control={form.control}
                  name="news_letter_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Newsletter Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter newsletter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="news_letter_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Newsletter Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان النشرة"
                          {...field}
                          dir="rtl"
                          className="text-right"
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
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
