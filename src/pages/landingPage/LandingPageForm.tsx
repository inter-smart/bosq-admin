import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FileUpload } from "@/components/common/FileUpload";
import { Save, ArrowLeft, TriangleAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchLandingPageById,
  createLandingPage,
  updateLandingPage,
} from "@/services/landingPage/landingPageApi";
import {
  landingPageSchema,
  LandingPageFormData,
} from "@/schemas/landingPageSchema";
import { RESERVED_SLUGS } from "@/constants/reservedSlugs";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function LandingPageForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const MEDIA_URL = import.meta.env.VITE_IMAGE_URL;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [desktopImageFile, setDesktopImageFile] = useState<
    File | string | null
  >(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | string | null>(
    null,
  );
  const [formImageFile, setFormImageFile] = useState<File | string | null>(
    null,
  );

  const form = useForm<LandingPageFormData>({
    resolver: zodResolver(landingPageSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      title_ar: "",
      meta_title: "",
      meta_title_ar: "",
      meta_description: "",
      meta_description_ar: "",
      meta_keywords: "",
      meta_keywords_ar: "",
      other_meta: "",
      other_meta_ar: "",
      slug: "",
      description: "",
      description_ar: "",
      media_alt: "",
      media_alt_ar: "",
      button_label: "",
      button_label_ar: "",
      link: "",
      form_title: "",
      form_title_ar: "",
      form_description: "",
      form_description_ar: "",
      form_media_alt: "",
      form_media_alt_ar: "",
      sort_order: 1,
      status: true,
      show_in_footer: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadLandingPageData(parseInt(id));
    }
  }, [id, isEditing]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // spaces to hyphen
      .replace(/--+/g, "-"); // remove double hyphens

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title") {
        form.setValue("slug", slugify(value.title || ""), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isEditing]);

  const loadLandingPageData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchLandingPageById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          meta_title: data.meta_title || "",
          meta_title_ar: data.meta_title_ar || "",
          meta_description: data.meta_description || "",
          meta_description_ar: data.meta_description_ar || "",
          meta_keywords: data.meta_keywords || "",
          meta_keywords_ar: data.meta_keywords_ar || "",
          other_meta: data.other_meta || "",
          other_meta_ar: data.other_meta_ar || "",
          slug: data.slug || "",
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          button_label: data.button_label || "",
          button_label_ar: data.button_label_ar || "",
          link: data.link || "",
          form_title: data.form_title || "",
          form_title_ar: data.form_title_ar || "",
          form_description: data.form_description || "",
          form_description_ar: data.form_description_ar || "",
          form_media_alt: data.form_media_alt || "",
          form_media_alt_ar: data.form_media_alt_ar || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          show_in_footer: data.show_in_footer ?? true,
        });

        if (data.media_desktop_path) {
          const desktopUrl = `${MEDIA_URL}/${data.media_desktop_path}`;
          setDesktopImageFile(desktopUrl);
          form.setValue("media_desktop_path", desktopUrl);
        }
        if (data.media_mobile_path) {
          const mobileUrl = `${MEDIA_URL}/${data.media_mobile_path}`;
          setMobileImageFile(mobileUrl);
          form.setValue("media_mobile_path", mobileUrl);
        }
        if (data.form_media_path) {
          const formMediaUrl = `${MEDIA_URL}/${data.form_media_path}`;
          setFormImageFile(formMediaUrl);
          form.setValue("form_media_path", formMediaUrl);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load landing page data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: LandingPageFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // English fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("meta_title", data.meta_title);
      formData.append("meta_description", data.meta_description);
      formData.append("slug", data.slug);
      formData.append("meta_keywords", data.meta_keywords);
      formData.append("other_meta", data.other_meta || "");
      formData.append("media_alt", data.media_alt);
      formData.append("button_label", data.button_label);
      formData.append("link", data.link);
      formData.append("form_title", data.form_title || "");
      formData.append("form_description", data.form_description || "");
      formData.append("form_media_alt", data.form_media_alt || "");

      // Arabic fields
      formData.append("title_ar", data.title_ar);
      formData.append("description_ar", data.description_ar);
      formData.append("meta_title_ar", data.meta_title_ar);
      formData.append("meta_description_ar", data.meta_description_ar);
      formData.append("meta_keywords_ar", data.meta_keywords_ar);
      formData.append("other_meta_ar", data.other_meta_ar || "");
      formData.append("media_alt_ar", data.media_alt_ar);
      formData.append("button_label_ar", data.button_label_ar);
      formData.append("form_title_ar", data.form_title_ar || "");
      formData.append("form_description_ar", data.form_description_ar || "");
      formData.append("form_media_alt_ar", data.form_media_alt_ar || "");

      // Other fields
      formData.append("sort_order", (data.sort_order || 0).toString());
      formData.append("status", (data.status ?? true).toString());
      formData.append("show_in_footer", (data.show_in_footer ?? true).toString());

      if (desktopImageFile instanceof File) {
        formData.append("media_desktop_path", desktopImageFile);
      }
      if (mobileImageFile instanceof File) {
        formData.append("media_mobile_path", mobileImageFile);
      }
      if (formImageFile instanceof File) {
        formData.append("form_media_path", formImageFile);
      }

      if (isEditing && id) {
        await updateLandingPage(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Landing page updated successfully",
        });
      } else {
        await createLandingPage(formData);
        toast({
          title: "Success",
          description: "Landing page created successfully",
        });
      }

      navigate("/landing-page");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} landing page`,
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
          Loading landing page data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/landing-page")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Landing Page
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} landing page
          </p>
        </div>
      </div>

      <Alert>
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Slug becomes this page's live URL</AlertTitle>
        <AlertDescription>
          The slug is published as <code>bosq.ae/&lt;slug&gt;</code>. It must not match a name
          already used by another page on the site, or this landing page will never be reachable.
          Reserved names: {RESERVED_SLUGS.join(", ")}.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Landing Page Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Title row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter landing page title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان الصفحة المقصودة"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Slug row — English only */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="auto-generated-slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div />
                </div>

                {/* Description row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter landing page description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            dir="rtl"
                            placeholder="أدخل وصف الصفحة المقصودة"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Button Label row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="button_label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Shop Now" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="button_label_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Label (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="تسوق الآن" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Button Link — English only */}
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/products/summer-collection"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The URL where the button will navigate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Landing Page Images Card */}
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setDesktopImageFile(file);
                          }}
                          accept="image/*"
                          placeholder="Upload desktop image"
                          preview={true}
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
                      <FormLabel>Mobile Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setMobileImageFile(file);
                          }}
                          accept="image/*"
                          placeholder="Upload mobile image"
                          recommendedDimensions="600px x 400px"
                          preview={true}
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
                        <Input
                          placeholder="Enter media alt text for accessibility"
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
                          placeholder="أدخل النص البديل للوسائط"
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

          {/* Form Section Card */}
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
                        <FormLabel>Title</FormLabel>
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter form description" {...field} />
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
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان النموذج" {...field} dir="rtl" />
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
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصف النموذج" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="form_media_path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Media</FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={(file) => {
                              field.onChange(file);
                              setFormImageFile(file);
                            }}
                            accept="image/*"
                            placeholder="Upload form media"
                            preview={true}
                            recommendedDimensions="541px × 348px"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="form_media_alt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media Alt Text (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter media alt text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="form_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alt Text (AR)</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل النص البديل" {...field} dir="rtl" />
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

          {/* SEO Meta Card */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ================= ENGLISH META ================= */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter meta title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter meta description"
                            {...field}
                            rows={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="keyword1, keyword2, keyword3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="other_meta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Meta Tags</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`<meta name="analytics-id" content="UA-XXXXX-X"/>`}
                            {...field}
                            rows={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ================= ARABIC META ================= */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان الميتا"
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
                    name="meta_description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف الميتا"
                            {...field}
                            rows={6}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_keywords_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="كلمة1، كلمة2، كلمة3"
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
                    name="other_meta_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Meta Tags (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`<meta name="analytics-id" content="UA-XXXXX-X"/>`}
                            {...field}
                            rows={6}
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

          {/* Landing Page Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Status</FormLabel>
                        <FormDescription>
                          Enable or disable this landing page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="show_in_footer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show in Footer</FormLabel>
                        <FormDescription>
                          Display this landing page link in the site footer
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/landing-page")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
