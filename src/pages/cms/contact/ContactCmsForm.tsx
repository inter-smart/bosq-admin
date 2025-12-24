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
  fetchContactCms,
  saveContactCms,
} from "@/services/cms/contact/contactCmsApi";
import { contactCmsSchema, ContactCmsFormData } from "@/schemas/contactSchema";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function ContactCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mediaFile, setMediaFile] = useState<File | string | null>(null);
  const [urls, setUrls] = useState<string>("");
  const form = useForm<ContactCmsFormData>({
    resolver: zodResolver(contactCmsSchema),
    defaultValues: {
      title: "",
      title_ar: "",
      form_title: "",
      form_title_ar: "",
      form_description: "",
      form_description_ar: "",
      media_path: null,
      media_alt: "",
      media_alt_ar: "",
      media_title: "",
      media_title_ar: "",
      media_description: "",
      media_description_ar: "",
      email_title: "",
      email_title_ar: "",
      email: "",
      phone_title: "",
      phone_title_ar: "",
      phone_number: "",
      address_title: "",
      address_title_ar: "",
      address: "",
      address_ar: "",
      social_media_title: "",
      social_media_title_ar: "",
      url: "",
    },
  });

  useEffect(() => {
    loadContactCmsData();
  }, []);

  const loadContactCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchContactCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          form_title: data.form_title || "",
          form_title_ar: data.form_title_ar || "",
          form_description: data.form_description || "",
          form_description_ar: data.form_description_ar || "",
          media_path: data.media_path || null,
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          media_title: data.media_title || "",
          media_title_ar: data.media_title_ar || "",
          media_description: data.media_description || "",
          media_description_ar: data.media_description_ar || "",
          email_title: data.email_title || "",
          email_title_ar: data.email_title_ar || "",
          email: data.email || "",
          phone_title: data.phone_title || "",
          phone_title_ar: data.phone_title_ar || "",
          phone_number: data.phone_number || "",
          address_title: data.address_title || "",
          address_title_ar: data.address_title_ar || "",
          address: data.address || "",
          address_ar: data.address_ar || "",
          social_media_title: data.social_media_title || "",
          social_media_title_ar: data.social_media_title_ar || "",
          url: data.url || "",
        });

        // Set media file state with full URL
        if (data.media_path) {
          setMediaFile(`${import.meta.env.VITE_IMAGE_URL}/${data.media_path}`);
        }

        setUrls(data.url || "");
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
      )[0] as keyof ContactCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: ContactCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add all text fields (English and Arabic)
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);

      // Form section
      if (data.form_title) formData.append("form_title", data.form_title);
      if (data.form_title_ar)
        formData.append("form_title_ar", data.form_title_ar);
      if (data.form_description)
        formData.append("form_description", data.form_description);
      if (data.form_description_ar)
        formData.append("form_description_ar", data.form_description_ar);

      // Media section
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);
      if (data.media_title) formData.append("media_title", data.media_title);
      if (data.media_title_ar)
        formData.append("media_title_ar", data.media_title_ar);
      if (data.media_description)
        formData.append("media_description", data.media_description);
      if (data.media_description_ar)
        formData.append("media_description_ar", data.media_description_ar);

      // Email section
      if (data.email_title) formData.append("email_title", data.email_title);
      if (data.email_title_ar)
        formData.append("email_title_ar", data.email_title_ar);
      if (data.email) formData.append("email", data.email);

      // Phone section
      if (data.phone_title) formData.append("phone_title", data.phone_title);
      if (data.phone_title_ar)
        formData.append("phone_title_ar", data.phone_title_ar);
      if (data.phone_number) formData.append("phone_number", data.phone_number);

      // Address section
      if (data.address_title)
        formData.append("address_title", data.address_title);
      if (data.address_title_ar)
        formData.append("address_title_ar", data.address_title_ar);
      if (data.address) formData.append("address", data.address);
      if (data.address_ar) formData.append("address_ar", data.address_ar);

      // Social media section
      if (data.social_media_title)
        formData.append("social_media_title", data.social_media_title);
      if (data.social_media_title_ar)
        formData.append("social_media_title_ar", data.social_media_title_ar);

      // Map integration
      if (data.url) formData.append("url", data.url);

      // Add media file upload
      if (mediaFile instanceof File) {
        formData.append("media_path", mediaFile);
      }

      await saveContactCms(formData);
      toast({
        title: "Success",
        description: "Contact CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadContactCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Contact CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Contact CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Contact page
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

          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Media Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="media_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Title</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter media title"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="media_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter media description"
                            rows={3}
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
                    name="media_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Title (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل عنوان الوسائط"
                            rows={3}
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
                    name="media_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف الوسائط"
                            rows={3}
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
                  name="media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Media</FormLabel>

                      <FormControl>
                        <FileUpload
                          value={mediaFile}
                          onChange={(file) => {
                            field.onChange(file);
                            setMediaFile(file);
                          }}
                          recommendedDimensions="1920x1080"
                          accept="image/*"
                          placeholder="Upload contact media"
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
                    name="media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter media alt text"
                            {...field}
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
              </div>
            </CardContent>
          </Card>

          {/* Email Section */}
          <Card>
            <CardHeader>
              <CardTitle>Email Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان البريد الإلكتروني"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Phone Section */}
          <Card>
            <CardHeader>
              <CardTitle>Phone Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان الهاتف"
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
            </CardContent>
          </Card>

          {/* Address Section */}
          <Card>
            <CardHeader>
              <CardTitle>Address Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter address title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter address"
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
                    name="address_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان العنوان"
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="social_media_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter social media title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_media_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان وسائل التواصل الاجتماعي"
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

          {/* Map Section */}
          <Card>
            <CardHeader>
              <CardTitle>Map Section</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map URL</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter map URL"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {urls && (
                <div className="mt-4">
                  <iframe
                    src={urls}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
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
