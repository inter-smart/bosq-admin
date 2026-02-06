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
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/common/FileUpload";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProjectById,
  createProject,
  updateProject,
} from "@/services/cms/projects/projectsApi";
import {
  fetchProjectCategoryList,
  ProjectCategory,
} from "@/services/cms/projects/projectCategoryApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { projectSchema, ProjectFormData } from "@/schemas/projectsSchema";

export default function ProjectsForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // File upload states
  const [thumbnailFile, setThumbnailFile] = useState<File | string | null>(
    null
  );
  const [section1DesktopFile, setSection1DesktopFile] = useState<
    File | string | null
  >(null);
  const [section1MobileFile, setSection1MobileFile] = useState<
    File | string | null
  >(null);
  const [section3MediaFile, setSection3MediaFile] = useState<
    File | string | null
  >(null);

  // Dynamic arrays
  const [tags, setTags] = useState<string[]>([]);
  const [tags_ar, setTagsAr] = useState<string[]>([]);
  const [features, setFeatures] = useState<Record<string, string>>({});
  const [features_ar, setFeaturesAr] = useState<Record<string, string>>({});

  // Input states for adding new items
  const [tagInput, setTagInput] = useState<string>("");
  const [tagArInput, setTagArInput] = useState<string>("");
  const [featureKeyInput, setFeatureKeyInput] = useState<string>("");
  const [featureValueInput, setFeatureValueInput] = useState<string>("");
  const [featureKeyArInput, setFeatureKeyArInput] = useState<string>("");
  const [featureValueArInput, setFeatureValueArInput] = useState<string>("");

  // Categories
  const [categories, setCategories] = useState<ProjectCategory[]>([]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      category_id: null,
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      thumbnail: null,
      section1_desktop_media_path: null,
      section1_mobile_media_path: null,
      section1_media_alt: "",
      section1_media_alt_ar: "",
      section3_title: "",
      section3_title_ar: "",
      section3_description: "",
      section3_description_ar: "",
      section3_media_path: null,
      section3_media_alt: "",
      section3_media_alt_ar: "",
      section4_title: "",
      section4_title_ar: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      meta_title_ar: "",
      meta_description_ar: "",
      meta_keywords_ar: "",
      tags: [],
      tags_ar: [],
      features: {},
      features_ar: {},
      sort_order: 1,
      status: true,
      show_in_home: false,
    },
  });

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadProjectData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadCategories = async () => {
    try {
      const response = await fetchProjectCategoryList(1, 100);
      setCategories(response.data.list);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadProjectData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchProjectById(itemId);
      const data = response.data;

      if (data) {
        // Parse JSONB arrays
        const parsedTags = Array.isArray(data.tags) ? data.tags : [];
        const parsedTagsAr = Array.isArray(data.tags_ar) ? data.tags_ar : [];

        const parseFeatures = (features: any) => {
          if (!Array.isArray(features)) return {};

          return features.reduce<Record<string, string>>((acc, item) => {
            if (item?.label && item?.value) {
              acc[item.label] = item.value;
            }
            return acc;
          }, {});
        };

        const parsedFeatures = parseFeatures(data.features);
        const parsedFeaturesAr = parseFeatures(data.features_ar);
        form.reset({
          category_id: data.category_id || null,
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          thumbnail: data.thumbnail || null,
          section1_desktop_media_path: data.section1_desktop_media_path || null,
          section1_mobile_media_path: data.section1_mobile_media_path || null,
          section1_media_alt: data.section1_media_alt || "",
          section1_media_alt_ar: data.section1_media_alt_ar || "",
          
          section3_title: data.section3_title || "",
          section3_title_ar: data.section3_title_ar || "",
          section3_description: data.section3_description || "",
          section3_description_ar: data.section3_description_ar || "",
          section3_media_path: data.section3_media_path || null,
          section3_media_alt: data.section3_media_alt || "",
          section3_media_alt_ar: data.section3_media_alt_ar || "",
          section4_title: data.section4_title || "",
          section4_title_ar: data.section4_title_ar || "",
          slug: data.slug || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          meta_keywords: data.meta_keywords || "",
          meta_title_ar: data.meta_title_ar || "",
          meta_description_ar: data.meta_description_ar || "",
          meta_keywords_ar: data.meta_keywords_ar || "",
          tags: parsedTags,
          tags_ar: parsedTagsAr,
          features: parsedFeatures,
          features_ar: parsedFeaturesAr,
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          show_in_home: data.show_in_home ?? false,
        });

        // Set dynamic arrays and objects
        setTags(parsedTags.length > 0 ? parsedTags : [""]);
        setTagsAr(parsedTagsAr.length > 0 ? parsedTagsAr : [""]);
        setFeatures(
          Object.keys(parsedFeatures).length > 0 ? parsedFeatures : {}
        );
        setFeaturesAr(
          Object.keys(parsedFeaturesAr).length > 0 ? parsedFeaturesAr : {}
        );

        // Set file states with full URLs
        if (data.thumbnail) {
          setThumbnailFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.thumbnail}`
          );
        }
        if (data.section1_desktop_media_path) {
          setSection1DesktopFile(
            `${import.meta.env.VITE_IMAGE_URL}/${
              data.section1_desktop_media_path
            }`
          );
        }
        if (data.section1_mobile_media_path) {
          setSection1MobileFile(
            `${import.meta.env.VITE_IMAGE_URL}/${
              data.section1_mobile_media_path
            }`
          );
        }
    
        if (data.section3_media_path) {
          setSection3MediaFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.section3_media_path}`
          );
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  // Slugify function
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Watch title to auto-generate slug
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && !isEditing) {
      form.setValue("slug", slugify(watchTitle));
    }
  }, [watchTitle, isEditing]);

  // Helper functions for Tags (EN)
  const addTag = () => {
    const trimmedValue = tagInput.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      const newTags = [...tags, trimmedValue];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Helper functions for Tags (AR)
  const addTagAr = () => {
    const trimmedValue = tagArInput.trim();
    if (trimmedValue && !tags_ar.includes(trimmedValue)) {
      const newTags = [...tags_ar, trimmedValue];
      setTagsAr(newTags);
      form.setValue("tags_ar", newTags);
      setTagArInput("");
    }
  };

  const removeTagAr = (tagToRemove: string) => {
    const newTags = tags_ar.filter((tag) => tag !== tagToRemove);
    setTagsAr(newTags);
    form.setValue("tags_ar", newTags);
  };

  const handleTagArKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTagAr();
    }
  };

  // Helper functions for Features (EN)
  const addFeature = () => {
    const trimmedKey = featureKeyInput.trim();
    const trimmedValue = featureValueInput.trim();

    if (trimmedKey && trimmedValue && !features[trimmedKey]) {
      const newFeatures = { ...features, [trimmedKey]: trimmedValue };
      setFeatures(newFeatures);
      form.setValue("features", newFeatures);
      setFeatureKeyInput("");
      setFeatureValueInput("");
    }
  };

  const removeFeature = (keyToRemove: string) => {
    const { [keyToRemove]: _, ...newFeatures } = features;
    setFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // Helper functions for Features (AR)
  const addFeatureAr = () => {
    const trimmedKey = featureKeyArInput.trim();
    const trimmedValue = featureValueArInput.trim();

    if (trimmedKey && trimmedValue && !features_ar[trimmedKey]) {
      const newFeatures = { ...features_ar, [trimmedKey]: trimmedValue };
      setFeaturesAr(newFeatures);
      form.setValue("features_ar", newFeatures);
      setFeatureKeyArInput("");
      setFeatureValueArInput("");
    }
  };

  const removeFeatureAr = (keyToRemove: string) => {
    const { [keyToRemove]: _, ...newFeatures } = features_ar;
    setFeaturesAr(newFeatures);
    form.setValue("features_ar", newFeatures);
  };

  const handleFeatureArKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeatureAr();
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Basic Information
      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.description) formData.append("description", data.description);
      if (data.description_ar)
        formData.append("description_ar", data.description_ar);
      if (data.category_id)
        formData.append("category_id", data.category_id.toString());
      if (data.slug) formData.append("slug", data.slug);

      // Section 1
      if (data.section1_media_alt)
        formData.append("section1_media_alt", data.section1_media_alt);
      if (data.section1_media_alt_ar)
        formData.append("section1_media_alt_ar", data.section1_media_alt_ar);

     

      // Section 3
      if (data.section3_title)
        formData.append("section3_title", data.section3_title);
      if (data.section3_title_ar)
        formData.append("section3_title_ar", data.section3_title_ar);
      if (data.section3_description)
        formData.append("section3_description", data.section3_description);
      if (data.section3_description_ar)
        formData.append(
          "section3_description_ar",
          data.section3_description_ar
        );
      if (data.section3_media_alt)
        formData.append("section3_media_alt", data.section3_media_alt);
      if (data.section3_media_alt_ar)
        formData.append("section3_media_alt_ar", data.section3_media_alt_ar);

      // Section 4
      if (data.section4_title)
        formData.append("section4_title", data.section4_title);
      if (data.section4_title_ar)
        formData.append("section4_title_ar", data.section4_title_ar);

      // SEO Meta Tags
      if (data.meta_title) formData.append("meta_title", data.meta_title);
      if (data.meta_title_ar)
        formData.append("meta_title_ar", data.meta_title_ar);
      if (data.meta_description)
        formData.append("meta_description", data.meta_description);
      if (data.meta_description_ar)
        formData.append("meta_description_ar", data.meta_description_ar);
      if (data.meta_keywords)
        formData.append("meta_keywords", data.meta_keywords);
      if (data.meta_keywords_ar)
        formData.append("meta_keywords_ar", data.meta_keywords_ar);

      // Settings
      if (data.sort_order !== undefined)
        formData.append("sort_order", data.sort_order.toString());
      formData.append("status", data.status.toString());
      formData.append("show_in_home", data.show_in_home.toString());

      // JSONB Arrays and Objects - stringify and append
      const filteredTags = tags.filter((t) => t.trim() !== "");
      const filteredTagsAr = tags_ar.filter((t) => t.trim() !== "");
      // Filter out empty key-value pairs
      const filteredFeatures = Object.entries(features)
        .filter(([key, value]) => key.trim() !== "" && value.trim() !== "")
        .map(([key, value]) => ({
          label: key,
          value: value,
        }));

      const filteredFeaturesAr = Object.entries(features_ar)
        .filter(([key, value]) => key.trim() !== "" && value.trim() !== "")
        .map(([key, value]) => ({
          label: key,
          value: value,
        }));

      formData.append("tags", JSON.stringify(filteredTags));
      formData.append("tags_ar", JSON.stringify(filteredTagsAr));
      formData.append("features", JSON.stringify(filteredFeatures));
      formData.append("features_ar", JSON.stringify(filteredFeaturesAr));

      // Add file uploads (only if they are new File instances)
      if (thumbnailFile instanceof File) {
        formData.append("thumbnail", thumbnailFile);
      }
      if (section1DesktopFile instanceof File) {
        formData.append("section1_desktop_media_path", section1DesktopFile);
      }
      if (section1MobileFile instanceof File) {
        formData.append("section1_mobile_media_path", section1MobileFile);
      }
      if (section3MediaFile instanceof File) {
        formData.append("section3_media_path", section3MediaFile);
      }

      if (isEditing && id) {
        await updateProject(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await createProject(formData);
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      navigate("/projects");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} project`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading project data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Project
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} project
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                 {/* 0. SEO Meta Tags */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter meta description"
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
                  name="meta_description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description (AR)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل وصف الميتا"
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
                  name="meta_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter meta keywords (comma-separated)"
                          {...field}
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
                          placeholder="أدخل كلمات الميتا (مفصولة بفواصل)"
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

          {/* 1. Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
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

                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (AR)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان المشروع"
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter project description"
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
                    name="description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (AR)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل وصف المشروع"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value ? parseInt(value) : null)
                          }
                          value={field.value?.toString() ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id!.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="project-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          Auto-generated from title, can be edited
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Thumbnail Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={thumbnailFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setThumbnailFile(file);
                        }}
                        accept="image/*"
                        recommendedDimensions="800x600"
                        placeholder="Upload thumbnail image"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 3. Section 1 Hero Media */}
          <Card>
            <CardHeader>
              <CardTitle>Section 1 Hero Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="section1_desktop_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={section1DesktopFile}
                          onChange={(file) => {
                            field.onChange(file);
                            setSection1DesktopFile(file);
                          }}
                          accept="image/*,video/*"
                          recommendedDimensions="1920x1080"
                          placeholder="Upload desktop media"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section1_mobile_media_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Media</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={section1MobileFile}
                          onChange={(file) => {
                            field.onChange(file);
                            setSection1MobileFile(file);
                          }}
                          accept="image/*,video/*"
                          recommendedDimensions="768x1024"
                          placeholder="Upload mobile media"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="section1_media_alt"
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

                <FormField
                  control={form.control}
                  name="section1_media_alt_ar"
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
            </CardContent>
          </Card>

      
          {/* 5. Section 3 Content */}
          <Card>
            <CardHeader>
              <CardTitle>Section 3 Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="section3_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 3 Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter section title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section3_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 3 Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان القسم"
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
                  name="section3_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 3 Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter section description"
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
                  name="section3_description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 3 Description (AR)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل وصف القسم"
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

              <FormField
                control={form.control}
                name="section3_media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section 3 Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={section3MediaFile}
                        onChange={(file) => {
                          field.onChange(file);
                          setSection3MediaFile(file);
                        }}
                        accept="image/*"
                        recommendedDimensions="800x600"
                        placeholder="Upload section media"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="section3_media_alt"
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

                <FormField
                  control={form.control}
                  name="section3_media_alt_ar"
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
            </CardContent>
          </Card>

          {/* 6. Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle>Section 4</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="section4_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 4 Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter section title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section4_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 4 Title (AR)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان القسم"
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

          {/* 7. Tags & Features */}
          <Card>
            <CardHeader>
              <CardTitle>Tags & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tags (EN) */}
                <div>
                  <FormLabel>Tags (EN)</FormLabel>
                  <FormDescription>
                    Press Enter or click Add to add a tag
                  </FormDescription>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Enter tag and press Enter"
                    />
                    <Button type="button" size="sm" onClick={addTag}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="px-3 py-1 border bg-white text-black border-gray-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {form.formState.errors.tags && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.tags.message}
                    </p>
                  )}
                </div>

                {/* Tags (AR) */}
                <div>
                  <FormLabel>Tags (AR)</FormLabel>
                  <FormDescription>
                    Press Enter or click Add to add a tag
                  </FormDescription>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={tagArInput}
                      onChange={(e) => setTagArInput(e.target.value)}
                      onKeyDown={handleTagArKeyDown}
                      placeholder="أدخل الوسم واضغط على Enter"
                      dir="rtl"
                    />
                    <Button type="button" size="sm" onClick={addTagAr}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {tags_ar.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags_ar.map((tag, index) => (
                        <Badge
                          key={index}
                          // variant="secondary"
                          className="px-3 py-1 border bg-white text-black border-gray-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTagAr(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {form.formState.errors.tags_ar && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.tags_ar.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Features (EN) */}
              <div>
                <FormLabel>Features (EN)</FormLabel>
                <FormDescription>
                  Enter key and value, then press Enter or click Add
                </FormDescription>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={featureKeyInput}
                    onChange={(e) => setFeatureKeyInput(e.target.value)}
                    onKeyDown={handleFeatureKeyDown}
                    placeholder="Enter feature key (e.g., Area)"
                    className="flex-1"
                  />
                  <Input
                    value={featureValueInput}
                    onChange={(e) => setFeatureValueInput(e.target.value)}
                    onKeyDown={handleFeatureKeyDown}
                    placeholder="Enter feature value (e.g., 5000 sqm)"
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {Object.keys(features).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(features).map(([key, value]) => (
                      <div
                        key={key}
                        className="group flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 shadow-sm"
                      >
                        <div className="flex flex-col text-sm leading-tight">
                          <span className="text-muted-foreground font-medium">
                            {key}
                          </span>
                          <span className="font-semibold text-foreground">
                            {value}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFeature(key)}
                          className="ml-2 text-muted-foreground hover:text-destructive transition"
                          aria-label="Remove feature"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {form.formState.errors.features && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.features.message}
                  </p>
                )}
              </div>

              {/* Features (AR) */}
              <div>
                <FormLabel>Features (AR)</FormLabel>
                <FormDescription>
                  أدخل المفتاح والقيمة، ثم اضغط على Enter أو انقر فوق إضافة
                </FormDescription>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={featureKeyArInput}
                    onChange={(e) => setFeatureKeyArInput(e.target.value)}
                    onKeyDown={handleFeatureArKeyDown}
                    placeholder="أدخل مفتاح الميزة"
                    className="flex-1"
                    dir="rtl"
                  />
                  <Input
                    value={featureValueArInput}
                    onChange={(e) => setFeatureValueArInput(e.target.value)}
                    onKeyDown={handleFeatureArKeyDown}
                    placeholder="أدخل قيمة الميزة"
                    className="flex-1"
                    dir="rtl"
                  />
                  <Button type="button" size="sm" onClick={addFeatureAr}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {Object.keys(features_ar).length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {Object.entries(features_ar).map(([key, value]) => (
                      <div
                        key={key}
                        className="group flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 shadow-sm"
                      >
                        <div
                          className="flex flex-col text-sm leading-tight"
                          dir="rtl"
                        >
                          <span className="text-muted-foreground font-medium">
                            {key}
                          </span>
                          <span className="font-semibold text-foreground">
                            {value}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFeatureAr(key)}
                          className="ml-2 text-muted-foreground hover:text-destructive transition"
                          aria-label="Remove feature"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {form.formState.errors.features_ar && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.features_ar.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

   
          {/* 9. Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
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
                          Enable or disable this project
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
                  name="show_in_home"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show In Home Page</FormLabel>
                        <FormDescription>
                          Enable or disable this project to show in homepage
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
              onClick={() => navigate("/projects")}
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
