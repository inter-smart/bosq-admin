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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchContactCms,
  saveContactCms,
} from "@/services/contact/contactCmsApi";
import { commonValidations } from "@/utils/formUtils";

const formSchema = z.object({
  title: commonValidations.requiredString("Featured Products Title"),
  form_title: commonValidations.requiredString("Form Title"),
  form_description: commonValidations.requiredString("Form Description"),
  media_path: commonValidations.fileUpload,
  media_alt: commonValidations.optionalString("Form Media Alt Text"),
  media_description: commonValidations.requiredString("Form Media Description"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      form_title: "",
      form_description: "",
      media_path: null,
      media_alt: "",
      media_description: "",
    },
  });

  useEffect(() => {
    loadContactCmsData();
  }, []);

  const loadContactCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchContactCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          form_title: data.form_title || "",
          form_description: data.form_description || "",
          media_path: data.media_path || null,
          media_alt: data.media_alt || "",
          media_description: data.media_description || "",
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
        const formData = new FormData();
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      await saveContactCms(formData);
      toast({
        title: "Success",
        description: "Contact CMS data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Contact CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Contact CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Page CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Contact page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Featured Products Section */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Products Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Products Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter featured products title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

              <FormField
                control={form.control}
                name="media_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter media description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="media_path"
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
                  name="media_alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text (Optional)</FormLabel>
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