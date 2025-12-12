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
  fetchLoginRegisterCms,
  saveLoginRegisterCms,
} from "@/services/cms/login-register/loginRegisterCmsApi";
import {
  loginRegisterCmsSchema,
  LoginRegisterCmsFormData,
} from "@/schemas/loginRegisterSchema";

export default function LoginRegisterCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Separate state for each media file
  const [signupMediaFile, setSignupMediaFile] = useState<File | string | null>(
    null
  );
  const [otpMediaFile, setOtpMediaFile] = useState<File | string | null>(null);
  const [yourPasswordMediaFile, setYourPasswordMediaFile] = useState<
    File | string | null
  >(null);
  const [loginMediaFile, setLoginMediaFile] = useState<File | string | null>(
    null
  );
  const [recoverEmailMediaFile, setRecoverEmailMediaFile] = useState<
    File | string | null
  >(null);
  const [recoverPasswordMediaFile, setRecoverPasswordMediaFile] = useState<
    File | string | null
  >(null);
  const [newPasswordMediaFile, setNewPasswordMediaFile] = useState<
    File | string | null
  >(null);

  const form = useForm<LoginRegisterCmsFormData>({
    resolver: zodResolver(loginRegisterCmsSchema),
    defaultValues: {
      signup_title: "",
      signup_title_ar: "",
      signup_subtitle: "",
      signup_subtitle_ar: "",
      signup_media_path: null,
      otp_title: "",
      otp_title_ar: "",
      otp_subtitle: "",
      otp_subtitle_ar: "",
      otp_media_path: null,
      your_password_title: "",
      your_password_title_ar: "",
      your_password_subtitle: "",
      your_password_subtitle_ar: "",
      your_password_media_path: null,
      login_title: "",
      login_title_ar: "",
      login_subtitle: "",
      login_subtitle_ar: "",
      login_media_path: null,
      recover_email_title: "",
      recover_email_title_ar: "",
      recover_email_subtitle: "",
      recover_email_subtitle_ar: "",
      recover_email_media_path: null,
      recover_password_title: "",
      recover_password_title_ar: "",
      recover_password_subtitle: "",
      recover_password_subtitle_ar: "",
      recover_password_media_path: null,
      new_password_title: "",
      new_password_title_ar: "",
      new_password_media_path: null,
    },
  });

  useEffect(() => {
    loadLoginRegisterCmsData();
  }, []);

  const loadLoginRegisterCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchLoginRegisterCms();
      const data = response.data;

      if (data) {
        form.reset({
          signup_title: data.signup_title || "",
          signup_title_ar: data.signup_title_ar || "",
          signup_subtitle: data.signup_subtitle || "",
          signup_subtitle_ar: data.signup_subtitle_ar || "",
          signup_media_path: data.signup_media_path || null,
          otp_title: data.otp_title || "",
          otp_title_ar: data.otp_title_ar || "",
          otp_subtitle: data.otp_subtitle || "",
          otp_subtitle_ar: data.otp_subtitle_ar || "",
          otp_media_path: data.otp_media_path || null,
          your_password_title: data.your_password_title || "",
          your_password_title_ar: data.your_password_title_ar || "",
          your_password_subtitle: data.your_password_subtitle || "",
          your_password_subtitle_ar: data.your_password_subtitle_ar || "",
          your_password_media_path: data.your_password_media_path || null,
          login_title: data.login_title || "",
          login_title_ar: data.login_title_ar || "",
          login_subtitle: data.login_subtitle || "",
          login_subtitle_ar: data.login_subtitle_ar || "",
          login_media_path: data.login_media_path || null,
          recover_email_title: data.recover_email_title || "",
          recover_email_title_ar: data.recover_email_title_ar || "",
          recover_email_subtitle: data.recover_email_subtitle || "",
          recover_email_subtitle_ar: data.recover_email_subtitle_ar || "",
          recover_email_media_path: data.recover_email_media_path || null,
          recover_password_title: data.recover_password_title || "",
          recover_password_title_ar: data.recover_password_title_ar || "",
          recover_password_subtitle: data.recover_password_subtitle || "",
          recover_password_subtitle_ar: data.recover_password_subtitle_ar || "",
          recover_password_media_path: data.recover_password_media_path || null,
          new_password_title: data.new_password_title || "",
          new_password_title_ar: data.new_password_title_ar || "",
          new_password_media_path: data.new_password_media_path || null,
        });

        // Set media file states with full URL
        if (data.signup_media_path) {
          setSignupMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.signup_media_path}`
          );
        }
        if (data.otp_media_path) {
          setOtpMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.otp_media_path}`
          );
        }
        if (data.your_password_media_path) {
          setYourPasswordMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.your_password_media_path}`
          );
        }
        if (data.login_media_path) {
          setLoginMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.login_media_path}`
          );
        }
        if (data.recover_email_media_path) {
          setRecoverEmailMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.recover_email_media_path}`
          );
        }
        if (data.recover_password_media_path) {
          setRecoverPasswordMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.recover_password_media_path}`
          );
        }
        if (data.new_password_media_path) {
          setNewPasswordMediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.new_password_media_path}`
          );
        }
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
      toast({
        title: error.message,
        description: "Failed to load login register data",
        variant: "destructive",
      })
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
      )[0] as keyof LoginRegisterCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: LoginRegisterCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Signup Section
      if (data.signup_title) formData.append("signup_title", data.signup_title);
      if (data.signup_title_ar)
        formData.append("signup_title_ar", data.signup_title_ar);
      if (data.signup_subtitle)
        formData.append("signup_subtitle", data.signup_subtitle);
      if (data.signup_subtitle_ar)
        formData.append("signup_subtitle_ar", data.signup_subtitle_ar);

      // OTP Section
      if (data.otp_title) formData.append("otp_title", data.otp_title);
      if (data.otp_title_ar) formData.append("otp_title_ar", data.otp_title_ar);
      if (data.otp_subtitle) formData.append("otp_subtitle", data.otp_subtitle);
      if (data.otp_subtitle_ar)
        formData.append("otp_subtitle_ar", data.otp_subtitle_ar);

      // Your Password Section
      if (data.your_password_title)
        formData.append("your_password_title", data.your_password_title);
      if (data.your_password_title_ar)
        formData.append("your_password_title_ar", data.your_password_title_ar);
      if (data.your_password_subtitle)
        formData.append("your_password_subtitle", data.your_password_subtitle);
      if (data.your_password_subtitle_ar)
        formData.append(
          "your_password_subtitle_ar",
          data.your_password_subtitle_ar
        );

      // Login Section
      if (data.login_title) formData.append("login_title", data.login_title);
      if (data.login_title_ar)
        formData.append("login_title_ar", data.login_title_ar);
      if (data.login_subtitle)
        formData.append("login_subtitle", data.login_subtitle);
      if (data.login_subtitle_ar)
        formData.append("login_subtitle_ar", data.login_subtitle_ar);

      // Recover Email Section
      if (data.recover_email_title)
        formData.append("recover_email_title", data.recover_email_title);
      if (data.recover_email_title_ar)
        formData.append("recover_email_title_ar", data.recover_email_title_ar);
      if (data.recover_email_subtitle)
        formData.append("recover_email_subtitle", data.recover_email_subtitle);
      if (data.recover_email_subtitle_ar)
        formData.append(
          "recover_email_subtitle_ar",
          data.recover_email_subtitle_ar
        );

      // Recover Password Section
      if (data.recover_password_title)
        formData.append("recover_password_title", data.recover_password_title);
      if (data.recover_password_title_ar)
        formData.append(
          "recover_password_title_ar",
          data.recover_password_title_ar
        );
      if (data.recover_password_subtitle)
        formData.append(
          "recover_password_subtitle",
          data.recover_password_subtitle
        );
      if (data.recover_password_subtitle_ar)
        formData.append(
          "recover_password_subtitle_ar",
          data.recover_password_subtitle_ar
        );

      // New Password Section
      if (data.new_password_title)
        formData.append("new_password_title", data.new_password_title);
      if (data.new_password_title_ar)
        formData.append("new_password_title_ar", data.new_password_title_ar);

      // Add media file uploads (only if they are new File objects)
      if (signupMediaFile instanceof File) {
        formData.append("signup_media_path", signupMediaFile);
      }
      if (otpMediaFile instanceof File) {
        formData.append("otp_media_path", otpMediaFile);
      }
      if (yourPasswordMediaFile instanceof File) {
        formData.append("your_password_media_path", yourPasswordMediaFile);
      }
      if (loginMediaFile instanceof File) {
        formData.append("login_media_path", loginMediaFile);
      }
      if (recoverEmailMediaFile instanceof File) {
        formData.append("recover_email_media_path", recoverEmailMediaFile);
      }
      if (recoverPasswordMediaFile instanceof File) {
        formData.append("recover_password_media_path", recoverPasswordMediaFile);
      }
      if (newPasswordMediaFile instanceof File) {
        formData.append("new_password_media_path", newPasswordMediaFile);
      }

      await saveLoginRegisterCms(formData);
      toast({
        title: "Success",
        description: "Login/Register CMS data saved successfully",
      });

      // Reload data to get updated values
      await loadLoginRegisterCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Login/Register CMS data",
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
          Loading Login/Register CMS data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Login/Register Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Login and Register pages
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Signup Section */}
          <Card>
            <CardHeader>
              <CardTitle>Signup Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
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

                  <FormField
                    control={form.control}
                    name="signup_subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signup Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter signup subtitle"
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
                    name="signup_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signup Title (العنوان)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان التسجيل"
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
                    name="signup_subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signup Subtitle (العنوان الفرعي)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل العنوان الفرعي للتسجيل"
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

              {/* Media Upload */}
              <FormField
                control={form.control}
                name="signup_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signup Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={signupMediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setSignupMediaFile(file);
                        }}
                        recommendedDimensions="1920x1080"
                        accept="image/*"
                        placeholder="Upload signup media"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* OTP Section */}
          <Card>
            <CardHeader>
              <CardTitle>OTP Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="otp_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter OTP title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otp_subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter OTP subtitle"
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
                    name="otp_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP Title (العنوان)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان OTP"
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
                    name="otp_subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP Subtitle (العنوان الفرعي)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل العنوان الفرعي لـ OTP"
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

              {/* Media Upload */}
              <FormField
                control={form.control}
                name="otp_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={otpMediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setOtpMediaFile(file);
                        }}
                        recommendedDimensions="1920x1080"
                        accept="image/*"
                        placeholder="Upload OTP media"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Your Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Password Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="your_password_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Password Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="your_password_subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Password Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your password subtitle"
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
                    name="your_password_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Password Title (العنوان)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان كلمة المرور"
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
                    name="your_password_subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Your Password Subtitle (العنوان الفرعي)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل العنوان الفرعي لكلمة المرور"
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

              {/* Media Upload */}
              <FormField
                control={form.control}
                name="your_password_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Password Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={yourPasswordMediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setYourPasswordMediaFile(file);
                        }}
                        recommendedDimensions="1920x1080"
                        accept="image/*"
                        placeholder="Upload your password media"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Login Section */}
          <Card>
            <CardHeader>
              <CardTitle>Login Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
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

                  <FormField
                    control={form.control}
                    name="login_subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter login subtitle"
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
                    name="login_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Title (العنوان)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان تسجيل الدخول"
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
                    name="login_subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Subtitle (العنوان الفرعي)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل العنوان الفرعي لتسجيل الدخول"
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

              {/* Media Upload */}
              <FormField
                control={form.control}
                name="login_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={loginMediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setLoginMediaFile(file);
                        }}
                        recommendedDimensions="1920x1080"
                        accept="image/*"
                        placeholder="Upload login media"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Recover Email Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recover Email Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recover_email_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recover Email Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter recover email title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recover_email_subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recover Email Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter recover email subtitle"
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
                    name="recover_email_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recover Email Title (العنوان)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان استرداد البريد الإلكتروني"
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
                    name="recover_email_subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Recover Email Subtitle (العنوان الفرعي)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل العنوان الفرعي لاسترداد البريد الإلكتروني"
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

              {/* Media Upload */}
              <FormField
                control={form.control}
                name="recover_email_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recover Email Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={recoverEmailMediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setRecoverEmailMediaFile(file);
                        }}
                        recommendedDimensions="1920x1080"
                        accept="image/*"
                        placeholder="Upload recover email media"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Recover Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recover Password Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recover_password_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recover Password Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter recover password title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recover_password_subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recover Password Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter recover password subtitle"
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
                    name="recover_password_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recover Password Title (العنوان)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان استرداد كلمة المرور"
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
                    name="recover_password_subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Recover Password Subtitle (العنوان الفرعي)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل العنوان الفرعي لاسترداد كلمة المرور"
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

              {/* Media Upload */}
              <FormField
                control={form.control}
                name="recover_password_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recover Password Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={recoverPasswordMediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setRecoverPasswordMediaFile(file);
                        }}
                        recommendedDimensions="1920x1080"
                        accept="image/*"
                        placeholder="Upload recover password media"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* New Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>New Password Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <FormField
                  control={form.control}
                  name="new_password_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new password title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Arabic Fields */}
                <FormField
                  control={form.control}
                  name="new_password_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password Title (العنوان)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان كلمة المرور الجديدة"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Media Upload */}
              <FormField
                control={form.control}
                name="new_password_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={newPasswordMediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setNewPasswordMediaFile(file);
                        }}
                        recommendedDimensions="1920x1080"
                        accept="image/*"
                        placeholder="Upload new password media"
                        preview={true}
                      />
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
