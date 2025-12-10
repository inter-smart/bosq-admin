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
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchTermsAndConditionsCms, saveTermsAndConditionsCms } from "@/services/policy/termsAndConditionsCmsApi";
import { termsAndConditionsCmsSchema, type TermsAndConditionsCmsFormData } from "@/schemas/termsAndConditionsSchema";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function TermsAndConditionsCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<TermsAndConditionsCmsFormData>({
    resolver: zodResolver(termsAndConditionsCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      faq_title: "",
      faq_title_ar: "",
    },
  });

  useEffect(() => {
    loadTermsAndConditionsCmsData();
  }, []);

  const loadTermsAndConditionsCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchTermsAndConditionsCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          faq_title: data.faq_title || "",
          faq_title_ar: data.faq_title_ar || "",
        });
      }
    } catch (error) {
      console.log("No existing data found, starting with empty form");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFormSubmit = form.handleSubmit(
    async (data) => {
      await onSubmit(data);
    },
    (errors) => {
      const firstErrorField = Object.keys(
        errors
      )[0] as keyof TermsAndConditionsCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: TermsAndConditionsCmsFormData) => {
    try {
      setLoading(true);

      await saveTermsAndConditionsCms(data);
      toast({
        title: "Success",
        description: "Terms and Conditions CMS data saved successfully",
      });

      await loadTermsAndConditionsCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Terms and Conditions CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Terms and Conditions CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Terms & Conditions CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Terms and Conditions page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Title Section */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions CMS Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title - English */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title - Arabic */}
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (العنوان)</FormLabel>
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

                {/* Description - English */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          placeholder="Enter description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description - Arabic */}
                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (الوصف)</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          placeholder="أدخل الوصف"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FAQ Title - English */}
                <FormField
                  control={form.control}
                  name="faq_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FAQ Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter FAQ title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FAQ Title - Arabic */}
                <FormField
                  control={form.control}
                  name="faq_title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FAQ Title (عنوان الأسئلة الشائعة)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان الأسئلة الشائعة"
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
