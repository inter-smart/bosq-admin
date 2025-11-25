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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchHomeCms, saveHomeCms } from "@/services/cms/home/homeCmsApi";
import { commonValidations } from "@/utils/formUtils";
import { homeSchema, HomeCmsFormData } from "@/schemas/homeSchema";


export default function HomeCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [aboutMediaFile, setAboutMediaFile] = useState<File | string | null>(null);
  const [journyMediaFile, setJournyMediaFile] = useState<File | string | null>(null);
  const [calculatorMediaFile, setCalculatorMediaFile] = useState<File | string | null>(null);
  const [customizeMediaFile, setCustomizeMediaFile] = useState<File | string | null>(null);
  const [formMediaFile, setFormMediaFile] = useState<File | string | null>(null);

  const form = useForm<HomeCmsFormData>({
    resolver: zodResolver(homeSchema),
    defaultValues: {
      about_media_path: null,
      about_media_alt: "",
      about_media_alt_ar: "",
      about_title: "",
      about_title_ar: "",
      about_description: "",
      about_description_ar: "",
      featured_title: "",
      featured_title_ar: "",
      journy_title: "",
      journy_title_ar: "",
      journy_description: "",
      journy_description_ar: "",
      journey_media_type: "image",
      journy_media_path: null,
      journy_media_alt: "",
      journy_media_alt_ar: "",
      project_title: "",
      project_title_ar: "",
      calculator_title: "",
      calculator_title_ar: "",
      calculator_description: "",
      calculator_description_ar: "",
      calculator_media_path: null,
      calculator_media_alt: "",
      calculator_media_alt_ar: "",
      customize_title: "",
      customize_title_ar: "",
      customize_description: "",
      customize_description_ar: "",
      customize_media_path: null,
      customize_media_alt: "",
      customize_media_alt_ar: "",
      fits_title: "",
      fits_title_ar: "",
      fits_description: "",
      fits_description_ar: "",
      brands_title: "",
      brands_title_ar: "",
      form_title: "",
      form_title_ar: "",
      form_description: "",
      form_description_ar: "",
      form_media_path: null,
      form_media_alt: "",
      form_media_alt_ar: "",
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
          about_media_alt_ar: data.about_media_alt_ar || "",
          about_title: data.about_title || "",
          about_title_ar: data.about_title_ar || "",
          about_description: data.about_description || "",
          about_description_ar: data.about_description_ar || "",
          featured_title: data.featured_title || "",
          featured_title_ar: data.featured_title_ar || "",
          journy_title: data.journy_title || "",
          journy_title_ar: data.journy_title_ar || "",
          journy_description: data.journy_description || "",
          journy_description_ar: data.journy_description_ar || "",
          journey_media_type: data.journey_media_type || "image",
          journy_media_path: data.journy_media_path || null,
          journy_media_alt: data.journy_media_alt || "",
          journy_media_alt_ar: data.journy_media_alt_ar || "",
          project_title: data.project_title || "",
          project_title_ar: data.project_title_ar || "",
          calculator_title: data.calculator_title || "",
          calculator_title_ar: data.calculator_title_ar || "",
          calculator_description: data.calculator_description || "",
          calculator_description_ar: data.calculator_description_ar || "",
          calculator_media_path: data.calculator_media_path || null,
          calculator_media_alt: data.calculator_media_alt || "",
          calculator_media_alt_ar: data.calculator_media_alt_ar || "",
          customize_title: data.customize_title || "",
          customize_title_ar: data.customize_title_ar || "",
          customize_description: data.customize_description || "",
          customize_description_ar: data.customize_description_ar || "",
          customize_media_path: data.customize_media_path || null,
          customize_media_alt: data.customize_media_alt || "",
          customize_media_alt_ar: data.customize_media_alt_ar || "",
          fits_title: data.fits_title || "",
          fits_title_ar: data.fits_title_ar || "",
          fits_description: data.fits_description || "",
          fits_description_ar: data.fits_description_ar || "",
          brands_title: data.brands_title || "",
          brands_title_ar: data.brands_title_ar || "",
          form_title: data.form_title || "",
          form_title_ar: data.form_title_ar || "",
          form_description: data.form_description || "",
          form_description_ar: data.form_description_ar || "",
          form_media_path: data.form_media_path || null,
          form_media_alt: data.form_media_alt || "",
          form_media_alt_ar: data.form_media_alt_ar || "",
        });

        // Set media file states with full URLs
        if (data.about_media_path) {
          setAboutMediaFile(`${import.meta.env.VITE_IMAGE_URL}/${data.about_media_path}`);
        }
        if (data.journy_media_path) {
          setJournyMediaFile(`${import.meta.env.VITE_IMAGE_URL}/${data.journy_media_path}`);
        }
        if (data.calculator_media_path) {
          setCalculatorMediaFile(`${import.meta.env.VITE_IMAGE_URL}/${data.calculator_media_path}`);
        }
        if (data.customize_media_path) {
          setCustomizeMediaFile(`${import.meta.env.VITE_IMAGE_URL}/${data.customize_media_path}`);
        }
        if (data.form_media_path) {
          setFormMediaFile(`${import.meta.env.VITE_IMAGE_URL}/${data.form_media_path}`);
        }
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: HomeCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // About Section
      if (data.about_title) formData.append("about_title", data.about_title);
      if (data.about_title_ar) formData.append("about_title_ar", data.about_title_ar);
      if (data.about_description) formData.append("about_description", data.about_description);
      if (data.about_description_ar) formData.append("about_description_ar", data.about_description_ar);
      if (data.about_media_alt) formData.append("about_media_alt", data.about_media_alt);
      if (data.about_media_alt_ar) formData.append("about_media_alt_ar", data.about_media_alt_ar);
      if (aboutMediaFile instanceof File) formData.append("about_media_path", aboutMediaFile);

      // Featured Products Section
      if (data.featured_title) formData.append("featured_title", data.featured_title);
      if (data.featured_title_ar) formData.append("featured_title_ar", data.featured_title_ar);

      // Journey Section
      if (data.journy_title) formData.append("journy_title", data.journy_title);
      if (data.journy_title_ar) formData.append("journy_title_ar", data.journy_title_ar);
      if (data.journy_description) formData.append("journy_description", data.journy_description);
      if (data.journy_description_ar) formData.append("journy_description_ar", data.journy_description_ar);
      if (data.journey_media_type) formData.append("journey_media_type", data.journey_media_type);
      if (data.journy_media_alt) formData.append("journy_media_alt", data.journy_media_alt);
      if (data.journy_media_alt_ar) formData.append("journy_media_alt_ar", data.journy_media_alt_ar);
      if (journyMediaFile instanceof File) formData.append("journy_media_path", journyMediaFile);

      // Project Section
      if (data.project_title) formData.append("project_title", data.project_title);
      if (data.project_title_ar) formData.append("project_title_ar", data.project_title_ar);

      // Calculator Section
      if (data.calculator_title) formData.append("calculator_title", data.calculator_title);
      if (data.calculator_title_ar) formData.append("calculator_title_ar", data.calculator_title_ar);
      if (data.calculator_description) formData.append("calculator_description", data.calculator_description);
      if (data.calculator_description_ar) formData.append("calculator_description_ar", data.calculator_description_ar);
      if (data.calculator_media_alt) formData.append("calculator_media_alt", data.calculator_media_alt);
      if (data.calculator_media_alt_ar) formData.append("calculator_media_alt_ar", data.calculator_media_alt_ar);
      if (calculatorMediaFile instanceof File) formData.append("calculator_media_path", calculatorMediaFile);

      // Customize Section
      if (data.customize_title) formData.append("customize_title", data.customize_title);
      if (data.customize_title_ar) formData.append("customize_title_ar", data.customize_title_ar);
      if (data.customize_description) formData.append("customize_description", data.customize_description);
      if (data.customize_description_ar) formData.append("customize_description_ar", data.customize_description_ar);
      if (data.customize_media_alt) formData.append("customize_media_alt", data.customize_media_alt);
      if (data.customize_media_alt_ar) formData.append("customize_media_alt_ar", data.customize_media_alt_ar);
      if (customizeMediaFile instanceof File) formData.append("customize_media_path", customizeMediaFile);

      // Fits Section
      if (data.fits_title) formData.append("fits_title", data.fits_title);
      if (data.fits_title_ar) formData.append("fits_title_ar", data.fits_title_ar);
      if (data.fits_description) formData.append("fits_description", data.fits_description);
      if (data.fits_description_ar) formData.append("fits_description_ar", data.fits_description_ar);

      // Brands Section
      if (data.brands_title) formData.append("brands_title", data.brands_title);
      if (data.brands_title_ar) formData.append("brands_title_ar", data.brands_title_ar);

      // Form Section
      if (data.form_title) formData.append("form_title", data.form_title);
      if (data.form_title_ar) formData.append("form_title_ar", data.form_title_ar);
      if (data.form_description) formData.append("form_description", data.form_description);
      if (data.form_description_ar) formData.append("form_description_ar", data.form_description_ar);
      if (data.form_media_alt) formData.append("form_media_alt", data.form_media_alt);
      if (data.form_media_alt_ar) formData.append("form_media_alt_ar", data.form_media_alt_ar);
      if (formMediaFile instanceof File) formData.append("form_media_path", formMediaFile);

      await saveHomeCms(formData);
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
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية (Arabic)</TabsTrigger>
            </TabsList>

            {/* English Content */}
            <TabsContent value="en" className="space-y-6">
              {/* About Section - EN */}
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
                          <FormLabel>Title</FormLabel>
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter about description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Featured Products Section - EN */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Products Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featured_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter featured title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Journey Section - EN */}
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
                      name="journy_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter journey description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Project Section - EN */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="project_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Calculator Section - EN */}
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
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter calculator title" {...field} />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter calculator description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Customize Section - EN */}
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
                          <FormLabel>Title</FormLabel>
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter customize description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fits Section - EN */}
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
                          <FormLabel>Title</FormLabel>
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter fits description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Brands Section - EN */}
              <Card>
                <CardHeader>
                  <CardTitle>Brands Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="brands_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brands title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Form Section - EN */}
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Arabic Content */}
            <TabsContent value="ar" className="space-y-6">
              {/* About Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم حول (About Section)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="about_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل عنوان القسم" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="about_description_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل وصف القسم" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Featured Products Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم المنتجات المميزة (Featured Products Section)</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featured_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان المنتجات المميزة" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Journey Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم الرحلة (Journey Section)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="journy_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل عنوان الرحلة" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="journy_description_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل وصف الرحلة" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Project Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم المشروع (Project Section)</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="project_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان المشروع" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Calculator Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم الحاسبة (Calculator Section)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="calculator_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل عنوان الحاسبة" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="calculator_description_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل وصف الحاسبة" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Customize Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم التخصيص (Customize Section)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customize_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل عنوان التخصيص" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customize_description_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل وصف التخصيص" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fits Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم المناسب (Fits Section)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fits_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل عنوان المناسب" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fits_description_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل وصف المناسب" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Brands Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم العلامات التجارية (Brands Section)</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="brands_title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل عنوان العلامات التجارية" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Form Section - AR */}
              <Card>
                <CardHeader>
                  <CardTitle>قسم النموذج (Form Section)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="form_title_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>العنوان</FormLabel>
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
                          <FormLabel>الوصف</FormLabel>
                          <FormControl>
                            <Textarea placeholder="أدخل وصف النموذج" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Media Uploads Section - Outside Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Media Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* About Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About Section Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">About Media</label>
                    <FileUpload
                      value={aboutMediaFile}
                      onChange={setAboutMediaFile}
                      accept="image/*"
                      placeholder="Upload about section media"
                      preview={true}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="about_media_alt"
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
                      name="about_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>النص البديل (Alt Text - Arabic)</FormLabel>
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

              {/* Journey Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Journey Section Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div>
                    <label className="text-sm font-medium">
                      Journey {watchJourneyMediaType === "image" ? "Image" : "Video"}
                    </label>
                    <FileUpload
                      value={journyMediaFile}
                      onChange={setJournyMediaFile}
                      accept={watchJourneyMediaType === "image" ? "image/*" : "video/*"}
                      placeholder={`Upload journey ${watchJourneyMediaType}`}
                      preview={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="journy_media_alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Alt Text (English)</FormLabel>
                        <FormControl>
                          <Input placeholder={`Enter ${watchJourneyMediaType} alt text`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="journy_media_alt_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>النص البديل (Alt Text - Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل النص البديل" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Calculator Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Calculator Section Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Calculator Media</label>
                    <FileUpload
                      value={calculatorMediaFile}
                      onChange={setCalculatorMediaFile}
                      accept="image/*"
                      placeholder="Upload calculator media"
                      preview={true}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="calculator_media_alt"
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
                      name="calculator_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>النص البديل (Alt Text - Arabic)</FormLabel>
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

              {/* Customize Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customize Section Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Customize Media</label>
                    <FileUpload
                      value={customizeMediaFile}
                      onChange={setCustomizeMediaFile}
                      accept="image/*"
                      placeholder="Upload customize media"
                      preview={true}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customize_media_alt"
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
                      name="customize_media_alt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>النص البديل (Alt Text - Arabic)</FormLabel>
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

              {/* Form Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Form Section Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Form Media</label>
                    <FileUpload
                      value={formMediaFile}
                      onChange={setFormMediaFile}
                      accept="image/*"
                      placeholder="Upload form media"
                      preview={true}
                    />
                  </div>

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
                          <FormLabel>النص البديل (Alt Text - Arabic)</FormLabel>
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
