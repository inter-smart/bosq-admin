import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchAuthCms, saveAuthCms } from "@/services/cms/auth/authCmsApi";
import { RichTextEditor } from "@/components/common/RichTextEditor";

const authCmsSchema = z.object({
  // Login Section
  login_title: z.string().optional(),
  login_title_ar: z.string().optional(),
  login_description_ar: z.string().optional(),
  login_description: z.string().optional(),
  login_media_desktop_path: z.any().optional().nullable(),
  login_media_alt: z.string().optional(),
  login_media_alt_ar: z.string().optional(),

  // Signup Section
  signup_title: z.string().optional(),
  signup_title_ar: z.string().optional(),
  signup_description: z.string().optional(),
  signup_description_ar: z.string().optional(),
  signup_media_desktop_path: z.any().optional().nullable(),
  signup_media_alt: z.string().optional(),
  signup_media_alt_ar: z.string().optional(),
});

type AuthCmsFormData = z.infer<typeof authCmsSchema>;

export default function AuthCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<AuthCmsFormData>({
    resolver: zodResolver(authCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      login_title: "",
      login_title_ar: "",
      login_description: "",
      login_description_ar: "",
      login_media_desktop_path: null,
      login_media_alt: "",
      login_media_alt_ar: "",
      signup_title: "",
      signup_title_ar: "",
      signup_description: "",
      signup_description_ar: "",
      signup_media_desktop_path: null,
      signup_media_alt: "",
      signup_media_alt_ar: "",
    },
  });

  useEffect(() => {
    loadAuthCmsData();
  }, []);

  const loadAuthCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchAuthCms();
      const data = response.data;

      if (data) {
        form.reset({
          login_title: data.login_title || "",
          login_title_ar: data.login_title_ar || "",
          login_description: data.login_description || "",
          login_description_ar: data.login_description_ar || "",
          login_media_desktop_path: data.login_media_desktop_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.login_media_desktop_path}` : null,
          login_media_alt: data.login_media_alt || "",
          login_media_alt_ar: data.login_media_alt_ar || "",
          signup_title: data.signup_title || "",
          signup_title_ar: data.signup_title_ar || "",
          signup_description: data.signup_description || "",
          signup_description_ar: data.signup_description_ar || "",
          signup_media_desktop_path: data.signup_media_desktop_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.signup_media_desktop_path}` : null,
          signup_media_alt: data.signup_media_alt || "",
          signup_media_alt_ar: data.signup_media_alt_ar || "",
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
      const firstErrorField = Object.keys(errors)[0] as keyof AuthCmsFormData;
      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: AuthCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Login section
      if (data.login_title) formData.append("login_title", data.login_title);
      if (data.login_title_ar) formData.append("login_title_ar", data.login_title_ar);
      if (data.login_description) formData.append("login_description", data.login_description);
      if (data.login_description_ar) formData.append("login_description_ar", data.login_description_ar);
      if (data.login_media_alt) formData.append("login_media_alt", data.login_media_alt);
      if (data.login_media_alt_ar) formData.append("login_media_alt_ar", data.login_media_alt_ar);

      // Signup section
      if (data.signup_title) formData.append("signup_title", data.signup_title);
      if (data.signup_title_ar) formData.append("signup_title_ar", data.signup_title_ar);
      if (data.signup_description) formData.append("signup_description", data.signup_description);
      if (data.signup_description_ar) formData.append("signup_description_ar", data.signup_description_ar);
      if (data.signup_media_alt) formData.append("signup_media_alt", data.signup_media_alt);
      if (data.signup_media_alt_ar) formData.append("signup_media_alt_ar", data.signup_media_alt_ar);

      // Add file uploads
      if (data.login_media_desktop_path instanceof File) {
        formData.append("login_media_desktop_path", data.login_media_desktop_path);
      }
      if (data.signup_media_desktop_path instanceof File) {
        formData.append("signup_media_desktop_path", data.signup_media_desktop_path);
      }

      await saveAuthCms(formData);
      toast({
        title: "Success",
        description: "Auth CMS data saved successfully",
      });

      await loadAuthCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Auth CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Auth CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Auth Page CMS</h1>
        <p className="text-muted-foreground">Manage content for the Login and Signup pages</p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Login Section */}
          <Card>
            <CardHeader>
              <CardTitle>Login Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <FormField
                  control={form.control}
                  name="login_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter login title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Arabic Fields */}
                <FormField
                  control={form.control}
                  name="login_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login Title (AR)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل عنوان تسجيل الدخول" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="login_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login Description</FormLabel>
                      <FormControl>
                        <RichTextEditor placeholder="Enter login description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="login_description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login Description (AR)</FormLabel>
                      <FormControl>
                        <RichTextEditor placeholder="أدخل وصف تسجيل الدخول" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="login_media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login Image (Desktop)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          recommendedDimensions="1920px x 1080px"
                          placeholder="Upload login page image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="login_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Image Alt Text (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alt text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="login_media_alt_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Image Alt Text (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل النص البديل" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signup Section */}
          <Card>
            <CardHeader>
              <CardTitle>Signup Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <FormField
                  control={form.control}
                  name="signup_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signup Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter signup title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Arabic Fields */}
                <FormField
                  control={form.control}
                  name="signup_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signup Title (AR)</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل عنوان إنشاء الحساب" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signup_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signup Description</FormLabel>
                      <FormControl>
                        <RichTextEditor placeholder="Enter signup description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signup_description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signup Description (AR)</FormLabel>
                      <FormControl>
                        <RichTextEditor placeholder="أدخل وصف إنشاء الحساب" {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="signup_media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signup Image (Desktop)</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          recommendedDimensions="1920px x 1080px"
                          placeholder="Upload signup page image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="signup_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signup Image Alt Text (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alt text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="signup_media_alt_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signup Image Alt Text (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل النص البديل" {...field} dir="rtl" />
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
