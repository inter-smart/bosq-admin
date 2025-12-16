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
import { fetchPrivacyPolicyCms, savePrivacyPolicyCms } from "@/services/policy/privacyPolicyCmsApi";
import { privacyPolicyCmsSchema, type PrivacyPolicyCmsFormData } from "@/schemas/privacyPolicySchema";
import PrivacyPolicyList from "./PrivacyPolicyList";

export default function PrivacyPolicyCmsForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<PrivacyPolicyCmsFormData>({
    resolver: zodResolver(privacyPolicyCmsSchema),
    shouldFocusError: true,
    defaultValues: {
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
    },
  });

  useEffect(() => {
    loadPrivacyPolicyCmsData();
  }, []);

  const loadPrivacyPolicyCmsData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchPrivacyPolicyCms();
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
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
      )[0] as keyof PrivacyPolicyCmsFormData;

      if (firstErrorField) {
        setTimeout(() => {
          form.setFocus(firstErrorField);
        }, 100);
      }
    }
  );

  const onSubmit = async (data: PrivacyPolicyCmsFormData) => {
    try {
      setLoading(true);

      await savePrivacyPolicyCms(data);
      toast({
        title: "Success",
        description: "Privacy Policy CMS data saved successfully",
      });

      await loadPrivacyPolicyCmsData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Privacy Policy CMS data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading Privacy Policy CMS data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Privacy Policy CMS</h1>
        <p className="text-muted-foreground">
          Manage content for the Privacy Policy page
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Title Section */}
          <Card>
            <CardHeader>
              <CardTitle>Policy CMS Section</CardTitle>
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
                        <Input placeholder="Enter title" {...field} />
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
                          placeholder="أدخل العنوان"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                   {/* English */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Arabic */}
                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (AR)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل الوصف"
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
