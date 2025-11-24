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
  fetchBlogById,
  createBlog,
  updateBlog,
} from "@/services/blog/blogsApi";
import { blogSchema, BlogFormData } from "@/schemas/blogSchema";
import { Switch } from "@/components/ui/switch";

export default function BlogsForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [thumbnailFile, setThumbnailFile] = useState<File | string | null>(null);
  const [desktopImageFile, setDesktopImageFile] = useState<File | string | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | string | null>(null);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      media_alt: "",
      thumbnail_alt: "",
      published_date: new Date().toISOString().split('T')[0],
      sort_order: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadBlogData(parseInt(id));
    }
  }, [id, isEditing]);

  const loadBlogData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchBlogById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          description: data.description || "",
          media_alt: data.media_alt || "",
          thumbnail_alt: data.thumbnail_alt || "",
          published_date: data.published_date ? new Date(data.published_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
        });

        if (data.thumbnail) {
          setThumbnailFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.thumbnail}`
          );
        }
        if (data.media_desktop_path) {
          setDesktopImageFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.media_desktop_path}`
          );
        }
        if (data.media_mobile_path) {
          setMobileImageFile(
            `${import.meta.env.VITE_IMAGE_URL}/${data.media_mobile_path}`
          );
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message||"Failed to load blog data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("media_alt", data.media_alt);
      if (data.thumbnail_alt) formData.append("thumbnail_alt", data.thumbnail_alt);
      formData.append("published_date", data.published_date);
      formData.append("sort_order", (data.sort_order || 0).toString());
      formData.append("status", (data.status ?? true).toString());

      if (thumbnailFile instanceof File) {
        formData.append("thumbnail", thumbnailFile);
      }
      if (desktopImageFile instanceof File) {
        formData.append("media_desktop_path", desktopImageFile);
      }
      if (mobileImageFile instanceof File) {
        formData.append("media_mobile_path", mobileImageFile);
      }

      if (isEditing && id) {
        await updateBlog(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
      } else {
        await createBlog(formData);
        toast({
          title: "Success",
          description: "Blog created successfully",
        });
      }

      navigate("/blogs");
    } catch (error) {
      toast({
        title: "Error",
        description:error.message || `Failed to ${isEditing ? "update" : "create"} blog`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading blog data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/blogs")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Blog
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} blog post
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
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
                        placeholder="Enter blog description"
                        rows={6}
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
                  name="thumbnail_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter thumbnail alt text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="published_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Published Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blog Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Thumbnail Image</label>
                <FileUpload
                  value={thumbnailFile}
                  onChange={setThumbnailFile}
                  accept="image/*"
                  placeholder="Upload thumbnail image"
                  preview={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Desktop Image</label>
                  <FileUpload
                    value={desktopImageFile}
                    onChange={setDesktopImageFile}
                    accept="image/*"
                    placeholder="Upload desktop blog image"
                    preview={true}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Mobile Image</label>
                  <FileUpload
                    value={mobileImageFile}
                    onChange={setMobileImageFile}
                    accept="image/*"
                    placeholder="Upload mobile blog image"
                    preview={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blog Settings</CardTitle>
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
                          Enable or disable this blog post
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
              onClick={() => navigate("/blogs")}
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
