import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { fetchHomeCms, saveHomeCms } from "@/services/home/homeCmsApi";
import { commonValidations } from "@/utils/formUtils";

const formSchema = z.object({
  // About Section
  about_media_path: commonValidations.fileUpload,
  about_media_alt: commonValidations.optionalString("About Media Alt Text"),
  about_title: commonValidations.requiredString("About Title"),
  about_description: commonValidations.requiredString("About Description"),

  // FEATURED PRODUCTS
  featured_title: commonValidations.requiredString("Featured Title"),

  // JOURNEY SECTION
  journy_title: commonValidations.requiredString("Journey Title"),
  journy_description: commonValidations.requiredString("Journey Description"),
  journey_media_type: commonValidations.requiredString("Media Type"),
  journy_media_path: commonValidations.fileUpload,
  journy_media_alt: commonValidations.optionalString(
    "Journey Media Alt Text"
  ),

  // PROJECT SECTION
  project_title: commonValidations.requiredString("Project Title"),

  // CALCULATOR SECTION
  calculator_title: commonValidations.requiredString("Calculator Title"),
  calculator_description: commonValidations.requiredString(
    "Calculator Description"
  ),
  calculator_media_path: commonValidations.fileUpload,
  calculator_media_alt: commonValidations.optionalString(
    "Calculator Media Alt Text"
  ),

  // CUSTOMIZE SECTION
  customize_title: commonValidations.requiredString("Customize Title"),
  customize_description: commonValidations.requiredString(
    "Customize Description"
  ),
  customize_media_path: commonValidations.fileUpload,
  customize_media_alt: commonValidations.optionalString(
    "Customize Media Alt Text"
  ),

  // FITS SECTION
  fits_title: commonValidations.requiredString("Fits Title"),
  fits_description: commonValidations.requiredString("Fits Description"),

  // BRANDS SECTION
  brands_title: commonValidations.requiredString("Brands Title"),

  // FORM SECTION
  form_title: commonValidations.requiredString("Form Title"),
  form_description: commonValidations.requiredString("Form Description"),
  form_media_path: commonValidations.fileUpload,
  form_media_alt: commonValidations.requiredString("Form Media Alt Text"),
});

type FormData = z.infer<typeof formSchema>;

export default function HomeCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about_media_path: null,
      about_media_alt: "",
      about_title: "",
      about_description: "",
      featured_title: "",
      journy_title: "",
      journy_description: "",
      journey_media_type: "image",
      journy_media_path: null,
      journy_media_alt: "",
      project_title: "",
      calculator_title: "",
      calculator_description: "",
      calculator_media_path: null,
      calculator_media_alt: "",
      customize_title: "",
      customize_description: "",
      customize_media_path: null,
      customize_media_alt: "",
      fits_title: "",
      fits_description: "",
      brands_title: "",
      form_title: "",
      form_description: "",
      form_media_path: null,
      form_media_alt: "",
    },
  });

  const watchJourneyMediaType = form.watch("journey_media_type");

  useEffect(() => {
    loadHomeCmsData();
  }, []);

  const loadHomeCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchHomeCms();
      const data = response.data;

      if (data) {
        form.reset({
          about_media_path: data.about_media_path || null,
          about_media_alt: data.about_media_alt || "",
          about_title: data.about_title || "",
          about_description: data.about_description || "",
          featured_title: data.featured_title || "",
          journy_title: data.journy_title || "",
          journy_description: data.journy_description || "",
          journey_media_type: data.journey_media_type || "image",
          journy_media_path: data.journy_media_path || null,
          journy_media_alt: data.journy_media_alt || "",
          project_title: data.project_title || "",
          calculator_title: data.calculator_title || "",
          calculator_description: data.calculator_description || "",
          calculator_media_path: data.calculator_media_path || null,
          calculator_media_alt: data.calculator_media_alt || "",
          customize_title: data.customize_title || "",
          customize_description: data.customize_description || "",
          customize_media_path: data.customize_media_path || null,
          customize_media_alt: data.customize_media_alt || "",
          fits_title: data.fits_title || "",
          fits_description: data.fits_description || "",
          brands_title: data.brands_title || "",
          form_title: data.form_title || "",
          form_description: data.form_description || "",
          form_media_path: data.form_media_path || null,
          form_media_alt: data.form_media_alt || "",
        });
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await saveHomeCms(data);
      toast({
        title: "Success",
        description: "Home CMS data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Home CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Home CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Home Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Home page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="about_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter about title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter about description"
                          {...field}
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
                  name="about_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload about section media"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about_media_alt"
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
              </div>
            </CardContent>
          </Card>

          {/* Featured Products Section */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Products Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="featured_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter featured title" {...field} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="journy_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Journey Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter journey title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="journey_media_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
              </div>

              <FormField
                control={form.control}
                name="journy_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journey Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter journey description"
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
                  name="journy_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Journey{" "}
                        {watchJourneyMediaType === "image" ? "Image" : "Video"}
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept={
                            watchJourneyMediaType === "image"
                              ? "image/*"
                              : "video/*"
                          }
                          placeholder={`Upload journey ${watchJourneyMediaType}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="journy_media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter ${watchJourneyMediaType} alt text`}
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

          {/* Project Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="project_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Calculator Section */}
          <Card>
            <CardHeader>
              <CardTitle>Calculator Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="calculator_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calculator Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter calculator title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calculator_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calculator Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter calculator description"
                          {...field}
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
                  name="calculator_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calculator Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload calculator media"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calculator_media_alt"
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
              </div>
            </CardContent>
          </Card>

          {/* Customize Section */}
          <Card>
            <CardHeader>
              <CardTitle>Customize Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customize_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customize Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customize title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customize_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customize Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter customize description"
                          {...field}
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
                  name="customize_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customize Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload customize media"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customize_media_alt"
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
              </div>
            </CardContent>
          </Card>

          {/* Fits Section */}
          <Card>
            <CardHeader>
              <CardTitle>Fits Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fits_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fits Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter fits title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fits_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fits Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter fits description"
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

          {/* Brands Section */}
          <Card>
            <CardHeader>
              <CardTitle>Brands Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="brands_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brands Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brands title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          {...field}
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
                  name="form_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          placeholder="Upload form media"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="form_media_alt"
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
