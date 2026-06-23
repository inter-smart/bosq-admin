import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { fetchReturnPolicyCms, saveReturnPolicyCms } from "@/services/policy/returnPolicyCmsApi";
import { returnPolicyCmsSchema, ReturnPolicyCmsFormData } from "@/schemas/returnPolicySchema";

export default function ReturnPolicyCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<ReturnPolicyCmsFormData>({
    resolver: zodResolver(returnPolicyCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      media_path: null,
      media_alt: "",
      media_alt_ar: "",
    },
  });

  useEffect(() => {
    loadReturnPolicyCmsData();
  }, []);

  const loadReturnPolicyCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchReturnPolicyCms();
      const data = response.data;

      if (data) {
        form.reset({
          media_path: data.media_path || null,
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
        });
      }
    } catch (error) {

    } finally {
      setInitialLoading(false);
    }
  };

  const handleFormSubmit = form.handleSubmit(
    async (data) => {
      await onSubmit(data);
    },
    (errors) => {
      const firstErrorField = Object.keys(errors)[0] as keyof ReturnPolicyCmsFormData;
      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: ReturnPolicyCmsFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);

      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      await saveReturnPolicyCms(formData);
      toast({
        title: "Success",
        description: "Return Policy CMS data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Return Policy CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Return Policy CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Return Policy Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Return Policy page header
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>Return Policy Header Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Media</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        placeholder="Upload header media"
                        recommendedDimensions="828px × 592px"
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
                        <Input placeholder="Enter media alt text" {...field} />
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
                          placeholder="أدخل النص البديل للصورة"
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
