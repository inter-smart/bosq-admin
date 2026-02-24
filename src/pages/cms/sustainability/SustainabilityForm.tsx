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
import { FileUpload } from "@/components/common/FileUpload";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchSustainabilityById,
  createSustainability,
  updateSustainability,
} from "@/services/cms/sustainablility/sustainabilityApi";
import { sustainabilityItemSchema, SustainabilityItemFormData } from "@/schemas/sustainabilitySchema";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function SustainabilityForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<SustainabilityItemFormData>({
    resolver: zodResolver(sustainabilityItemSchema),
    defaultValues: {
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      // points: "",
      // points_ar: "",
      img1_path: null,
      img1_alt: "",
      img1_alt_ar: "",
      // img2_path: null,
      // img2_alt: "",
      // img2_alt_ar: "",
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadItemData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadItemData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchSustainabilityById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          // points: data.points || "",
          // points_ar: data.points_ar || "",
          img1_path: data.img1_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.img1_path}` : null,
          img1_alt: data.img1_alt || "",
          img1_alt_ar: data.img1_alt_ar || "",
          // img2_path: data.img2_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.img2_path}` : null,
          // img2_alt: data.img2_alt || "",
          // img2_alt_ar: data.img2_alt_ar || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sustainability item data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: SustainabilityItemFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Text fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      // formData.append("points", data.points);

      // Arabic fields
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.description_ar) formData.append("description_ar", data.description_ar);
      // if (data.points_ar) formData.append("points_ar", data.points_ar);

      // Image 1
      if (data.img1_alt) formData.append("img1_alt", data.img1_alt);
      if (data.img1_alt_ar) formData.append("img1_alt_ar", data.img1_alt_ar);
      if (data.img1_path instanceof File) {
        formData.append("img1_path", data.img1_path);
      }

      // Image 2
      // if (data.img2_alt) formData.append("img2_alt", data.img2_alt);
      // if (data.img2_alt_ar) formData.append("img2_alt_ar", data.img2_alt_ar);
      // if (data.img2_path instanceof File) {
      //   formData.append("img2_path", data.img2_path);
      // }

      // Settings
      formData.append("sort_order", (data.sort_order || 1).toString());
      formData.append("status", (data.status ?? true).toString());

      if (isEditing && id) {
        await updateSustainability(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Sustainability item updated successfully",
        });
      } else {
        await createSustainability(formData);
        toast({
          title: "Success",
          description: "Sustainability item created successfully",
        });
      }

      navigate("/sustainability");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} sustainability item`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading sustainability item data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/sustainability")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Sustainability Item
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} sustainability item
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Arabic Title */}
                <FormField
                  control={form.control}
                  name="title_ar"
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
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          placeholder="Enter description"
                          className="min-h-[120px]"
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
                          placeholder="أدخل الوصف"
                          className="min-h-[120px]"
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

          {/* Points Section - Commented out as not needed */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Key Points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points (HTML List)</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter key points as HTML list"
                        />
                      </FormControl>
                      <FormDescription>
                        Use bullet points or numbered lists
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points (AR - HTML List)</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          dir="rtl"
                          placeholder="أدخل النقاط الرئيسية كقائمة HTML"
                        />
                      </FormControl>
                      <FormDescription>
                        Use bullet points or numbered lists
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card> */}

          {/* Image 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Image 1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="img1_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Image 1 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        preview={true}
                        recommendedDimensions="768px × 439px"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Upload a new image to replace the current one (optional)"
                        : "Upload first image (required)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="img1_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 1 Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter alt text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="img1_alt_ar"
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
            </CardContent>
          </Card>

          {/* Image 2 - Commented out as not needed */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Image 2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="img2_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Image 2 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        preview={true}
                        recommendedDimensions="800px x 600px"
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditing
                        ? "Upload a new image to replace the current one (optional)"
                        : "Upload second image (required)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="img2_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 2 Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter alt text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="img2_alt_ar"
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
            </CardContent>
          </Card> */}

          {/* Settings */}
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
                          Enable or disable this item
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
              onClick={() => navigate("/sustainability")}
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