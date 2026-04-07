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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [journeyOneMediaFile, setJourneyOneMediaFile] = useState<
    File | string | null
  >(null);
  const [journeyTwoMediaFile, setJourneyTwoMediaFile] = useState<
    File | string | null
  >(null);
  const [journeyThreeMediaFile, setJourneyThreeMediaFile] = useState<
    File | string | null
  >(null);

  const [prevMediaType, setPrevMediaType] = useState<string | null>(null);

  const form = useForm<AboutCmsFormData>({
    resolver: zodResolver(aboutCmsSchema),
    shouldFocusError: true, // Enable auto-focus on error
    defaultValues: {
      title: "",
      title_ar: "",
      banner_media_type: "image",
      banner_title: "",
      banner_title_ar: "",
      banner_description: "",
      banner_description_ar: "",
      banner_media_desktop_path: null,
      banner_media_mobile_path: null,
      banner_media_desktop_path_ar: null,
      banner_media_mobile_path_ar: null,
      banner_video_thumbnail_path: null,
      banner_media_alt: "",
      banner_media_alt_ar: "",
      banner_button_text: "",
      banner_button_text_ar: "",
      banner_button_link: "",
      journey_title: "",
      journey_title_ar: "",
      journey_description: "",
      journey_description_ar: "",
      journey_one_media_path: null,
      journey_two_media_path: null,
      journey_three_media_path: null,
      journey_one_media_alt: "",
      journey_one_media_alt_ar: "",
      journey_two_media_alt: "",
      journey_two_media_alt_ar: "",
      journey_three_media_alt: "",
      journey_three_media_alt_ar: "",
      why_choose_us_title: "",
      why_choose_us_title_ar: "",
      why_choose_us_description: "",
      why_choose_us_description_ar: "",
      testimonial_title: "",
      testimonial_title_ar: "",
      client_title: "",
      client_title_ar: "",
      news_title: "",
      news_title_ar: "",
    },
  });

  const watchBannerMediaType = form.watch("banner_media_type");

  useEffect(() => {
    if (
      !initialLoading &&
      prevMediaType !== null &&
      prevMediaType !== watchBannerMediaType
    ) {
      form.setValue("banner_media_desktop_path", null);
      form.setValue("banner_media_mobile_path", null);
      form.setValue("banner_media_desktop_path_ar", null);
      form.setValue("banner_media_mobile_path_ar", null);
      form.setValue("banner_video_thumbnail_path", null);
    }

    // Update prevMediaType after initial loading is complete
    if (!initialLoading) {
      setPrevMediaType(watchBannerMediaType);
    }
  }, [watchBannerMediaType, initialLoading, form, prevMediaType]);

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
          title_ar: data.title_ar || "",
          banner_media_type: data.banner_media_type,
          banner_title: data.banner_title || "",
          banner_title_ar: data.banner_title_ar || "",
          banner_description: data.banner_description || "",
          banner_description_ar: data.banner_description_ar || "",
          banner_media_desktop_path: data.banner_media_desktop_path || null,
          banner_media_mobile_path: data.banner_media_mobile_path || null,
          banner_media_desktop_path_ar: data.banner_media_desktop_path_ar || null,
          banner_media_mobile_path_ar: data.banner_media_mobile_path_ar || null,
          banner_video_thumbnail_path: data.banner_video_thumbnail_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.banner_video_thumbnail_path}`
            : null,
          banner_media_alt: data.banner_media_alt || "",
          banner_media_alt_ar: data.banner_media_alt_ar || "",
          banner_button_text: data.banner_button_text || "",
          banner_button_text_ar: data.banner_button_text_ar || "",
          banner_button_link: data.banner_button_link || "",
          journey_title: data.journey_title || "",
          journey_title_ar: data.journey_title_ar || "",
          journey_description: data.journey_description || "",
          journey_description_ar: data.journey_description_ar || "",
          journey_one_media_path: data.journey_one_media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.journey_one_media_path}`
            : null,
          journey_two_media_path: data.journey_two_media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.journey_two_media_path}`
            : null,
          journey_three_media_path: data.journey_three_media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.journey_three_media_path
            }`
            : null,
          journey_one_media_alt: data.journey_one_media_alt || "",
          journey_one_media_alt_ar: data.journey_one_media_alt_ar || "",
          journey_two_media_alt: data.journey_two_media_alt || "",
          journey_two_media_alt_ar: data.journey_two_media_alt_ar || "",
          journey_three_media_alt: data.journey_three_media_alt || "",
          journey_three_media_alt_ar: data.journey_three_media_alt_ar || "",
          why_choose_us_title: data.why_choose_us_title || "",
          why_choose_us_title_ar: data.why_choose_us_title_ar || "",
          why_choose_us_description: data.why_choose_us_description || "",
          why_choose_us_description_ar: data.why_choose_us_description_ar || "",
          testimonial_title: data.testimonial_title || "",
          testimonial_title_ar: data.testimonial_title_ar || "",
          client_title: data.client_title || "",
          client_title_ar: data.client_title_ar || "",
          news_title: data.news_title || "",
          news_title_ar: data.news_title_ar || "",
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
      console.log(errors)
      const firstErrorField = Object.keys(errors)[0] as keyof AboutCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: AboutCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Add all text fields (English and Arabic)
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);

      // Banner section
      if (data.banner_media_type)
        formData.append("banner_media_type", data.banner_media_type);
      if (data.banner_title) formData.append("banner_title", data.banner_title);
      if (data.banner_title_ar)
        formData.append("banner_title_ar", data.banner_title_ar);
      if (data.banner_description)
        formData.append("banner_description", data.banner_description);
      if (data.banner_description_ar)
        formData.append("banner_description_ar", data.banner_description_ar);
      if (data.banner_media_alt)
        formData.append("banner_media_alt", data.banner_media_alt);
      if (data.banner_media_alt_ar)
        formData.append("banner_media_alt_ar", data.banner_media_alt_ar);
      if (data.banner_button_text)
        formData.append("banner_button_text", data.banner_button_text);
      if (data.banner_button_text_ar)
        formData.append("banner_button_text_ar", data.banner_button_text_ar);
      if (data.banner_button_link)
        formData.append("banner_button_link", data.banner_button_link);

      // Journey section
      if (data.journey_title)
        formData.append("journey_title", data.journey_title);
      if (data.journey_title_ar)
        formData.append("journey_title_ar", data.journey_title_ar);
      if (data.journey_description)
        formData.append("journey_description", data.journey_description);
      if (data.journey_description_ar)
        formData.append("journey_description_ar", data.journey_description_ar);
      if (data.journey_one_media_alt)
        formData.append("journey_one_media_alt", data.journey_one_media_alt);
      if (data.journey_one_media_alt_ar)
        formData.append(
          "journey_one_media_alt_ar",
          data.journey_one_media_alt_ar
        );
      if (data.journey_two_media_alt)
        formData.append("journey_two_media_alt", data.journey_two_media_alt);
      if (data.journey_two_media_alt_ar)
        formData.append(
          "journey_two_media_alt_ar",
          data.journey_two_media_alt_ar
        );
      if (data.journey_three_media_alt)
        formData.append(
          "journey_three_media_alt",
          data.journey_three_media_alt
        );
      if (data.journey_three_media_alt_ar)
        formData.append(
          "journey_three_media_alt_ar",
          data.journey_three_media_alt_ar
        );

      // Why Choose Us section
      if (data.why_choose_us_title)
        formData.append("why_choose_us_title", data.why_choose_us_title);
      if (data.why_choose_us_title_ar)
        formData.append("why_choose_us_title_ar", data.why_choose_us_title_ar);
      if (data.why_choose_us_description)
        formData.append(
          "why_choose_us_description",
          data.why_choose_us_description
        );
      if (data.why_choose_us_description_ar)
        formData.append(
          "why_choose_us_description_ar",
          data.why_choose_us_description_ar
        );

      // Section titles
      if (data.testimonial_title)
        formData.append("testimonial_title", data.testimonial_title);
      if (data.testimonial_title_ar)
        formData.append("testimonial_title_ar", data.testimonial_title_ar);
      if (data.client_title) formData.append("client_title", data.client_title);
      if (data.client_title_ar)
        formData.append("client_title_ar", data.client_title_ar);
      if (data.news_title) formData.append("news_title", data.news_title);
      if (data.news_title_ar)
        formData.append("news_title_ar", data.news_title_ar);

      // Add banner file uploads
      if (data.banner_media_desktop_path instanceof File) {
        formData.append(
          "banner_media_desktop_path",
          data.banner_media_desktop_path
        );
      }
      if (data.banner_media_mobile_path instanceof File) {
        formData.append(
          "banner_media_mobile_path",
          data.banner_media_mobile_path
        );
      }
      if (data.banner_media_desktop_path_ar instanceof File) {
        formData.append(
          "banner_media_desktop_path_ar",
          data.banner_media_desktop_path_ar
        );
      }
      if (data.banner_media_mobile_path_ar instanceof File) {
        formData.append(
          "banner_media_mobile_path_ar",
          data.banner_media_mobile_path_ar
        );
      }
      if (data.banner_video_thumbnail_path instanceof File) {
        formData.append(
          "banner_video_thumbnail_path",
          data.banner_video_thumbnail_path
        );
      }

      // Add journey image uploads
      if (data.journey_one_media_path instanceof File) {
        formData.append("journey_one_media_path", data.journey_one_media_path);
      }
      if (data.journey_two_media_path instanceof File) {
        formData.append("journey_two_media_path", data.journey_two_media_path);
      }
      if (data.journey_three_media_path instanceof File) {
        formData.append(
          "journey_three_media_path",
          data.journey_three_media_path
        );
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



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">About Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the About page
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

                  <FormField
                    control={form.control}
                    name="banner_button_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter button text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="banner_button_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter button link" {...field} />
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
                        <FormLabel>Title (AR)</FormLabel>
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
                        <FormLabel>Description (AR)</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="banner_button_text_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل نص الزر"
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

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="banner_media_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <FormLabel>
                          {watchBannerMediaType === "image" ? "Image" : "Video"}{" "}
                          (Desktop)
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                            accept={
                              watchBannerMediaType === "image"
                                ? "image/*"
                                : "video/*"
                            }
                            recommendedDimensions="1920px x 732px"
                            placeholder={`Upload desktop banner ${watchBannerMediaType}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchBannerMediaType === "image" && (
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
                              recommendedDimensions="640px × 1138px"
                              placeholder="Upload mobile banner image"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {watchBannerMediaType !== "video" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="banner_media_desktop_path_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image (Desktop - AR)</FormLabel>
                          <FormControl>
                            <FileUpload
                              value={field.value}
                              onChange={field.onChange}
                              accept="image/*"
                              recommendedDimensions="1920px x 732px"
                              placeholder="Upload desktop banner image (AR)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="banner_media_mobile_path_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image (Mobile - AR)</FormLabel>
                          <FormControl>
                            <FileUpload
                              value={field.value}
                              onChange={field.onChange}
                              accept="image/*"
                              recommendedDimensions="640px × 1138px"
                              placeholder="Upload mobile banner image (AR)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {watchBannerMediaType === "video" && (
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="banner_video_thumbnail_path"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video Thumbnail</FormLabel>
                          <FormControl>
                            <FileUpload
                              value={field.value}
                              onChange={field.onChange}
                              accept="image/*"
                              recommendedDimensions="1920px x 732px"
                              placeholder="Upload video thumbnail image"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="banner_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Alt Text (English)</FormLabel>
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
                    name="banner_media_alt_ar"
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

          {/* Journey Section */}
          <Card>
            <CardHeader>
              <CardTitle>Journey Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
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
                </div>

                {/* Arabic Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="journey_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان الرحلة"
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
                    name="journey_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف الرحلة"
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


              {/* Journey Media */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Journey Section Media</h3>

                {/* Image 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="journey_one_media_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journey Image 1</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={(file) => {
                              field.onChange(file);
                              setJourneyOneMediaFile(file);
                            }}
                            recommendedDimensions="415px × 270px"
                            accept="image/*"
                            placeholder="Upload journey image 1"
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
                      name="journey_one_media_alt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image 1 Alt Text (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter alt text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="journey_one_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image 1 Alt Text (AR)</FormLabel>
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

                {/* Image 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="journey_two_media_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journey Image 2</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={(file) => {
                              field.onChange(file);
                              setJourneyTwoMediaFile(file);
                            }}
                            accept="image/*"
                            placeholder="Upload journey image 2"
                            recommendedDimensions="415px × 270px"
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
                      name="journey_two_media_alt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image 2 Alt Text (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter alt text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="journey_two_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image 2 Alt Text (AR)</FormLabel>
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

                {/* Image 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="journey_three_media_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journey Image 3</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={(file) => {
                              field.onChange(file);
                              setJourneyThreeMediaFile(file);
                            }}
                            accept="image/*"
                            placeholder="Upload journey image 3"
                            recommendedDimensions="435px × 585px"
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
                      name="journey_three_media_alt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image 3 Alt Text (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter alt text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="journey_three_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image 3 Alt Text (AR)</FormLabel>
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
              </div>

            </CardContent>
          </Card>

          {/* Why Choose Us Section */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="why_choose_us_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter why choose us title"
                            {...field}
                          />
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
                </div>

                {/* Arabic Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="why_choose_us_title_ar"
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
                    name="why_choose_us_description_ar"
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
            </CardContent>
          </Card>

          {/* Testimonial Section */}
          <Card>
            <CardHeader>
              <CardTitle>Testimonial Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="testimonial_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter testimonial title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testimonial_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان الشهادات"
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

          {/* Client Section */}
          <Card>
            <CardHeader>
              <CardTitle>Client Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="client_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان العملاء"
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

          {/* News Section */}
          <Card>
            <CardHeader>
              <CardTitle>News Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="news_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان الأخبار"
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
