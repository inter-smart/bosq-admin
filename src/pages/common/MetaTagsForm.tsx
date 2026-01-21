import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormTextareaField,
} from "@/components/forms/FormFieldComponents";
import {
  updateMetaTag,
  MetaTag,
  UpdateMetaTagRequest,
} from "@/services/common/metaTagsApi";
import { toast } from "sonner";
import { commonValidations } from "@/utils/formUtils";

const metaTagSchema = z.object({
  meta_title: commonValidations.requiredString("Meta title"),
  meta_title_ar: commonValidations.requiredString("Meta title (AR)"),
  meta_description: commonValidations.requiredString("Meta description"),
  meta_description_ar: commonValidations.requiredString(
    "Meta description (AR)",
  ),
  meta_keywords: commonValidations.requiredString("Meta keywords"),
  meta_keywords_ar: commonValidations.requiredString(
    "Meta keywords (AR)",
  ),
  other_meta: commonValidations.requiredString("Other meta tags"),

  other_meta_ar: commonValidations.requiredString(
    "Other meta tags (AR)",
  ),
});

type MetaTagFormData = z.infer<typeof metaTagSchema>;

interface MetaTagsFormProps {
  metaTag: MetaTag;
  onClose: () => void;
  onSuccess: () => void;
}

export const MetaTagsForm: React.FC<MetaTagsFormProps> = ({
  metaTag,
  onClose,
  onSuccess,
}) => {
  const form = useForm<MetaTagFormData>({
    resolver: zodResolver(metaTagSchema),
    defaultValues: {
      meta_title: metaTag.meta_title ?? "",
      meta_title_ar: metaTag.meta_title_ar ?? "",
      meta_description: metaTag.meta_description ?? "",
      meta_description_ar: metaTag.meta_description_ar ?? "",
      meta_keywords: metaTag.meta_keywords ?? "",
      meta_keywords_ar: metaTag.meta_keywords_ar ?? "",
      other_meta: metaTag.other_meta ?? "",
      other_meta_ar: metaTag.other_meta_ar ?? "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: MetaTagFormData) => {
    try {
      const payload: UpdateMetaTagRequest = {
        meta_title: data.meta_title,
        meta_title_ar: data.meta_title_ar,
        meta_description: data.meta_description,
        meta_description_ar: data.meta_description_ar,
        meta_keywords: data.meta_keywords,
        meta_keywords_ar: data.meta_keywords_ar,
        other_meta: data.other_meta,
        other_meta_ar: data.other_meta_ar,
      };

      await updateMetaTag(metaTag.id, payload);

      toast.success("Meta tag updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to update meta tags. Please try again.",
      );
    }
  };

  return (
    <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <h2 className="text-lg font-semibold">Edit Meta Tags</h2>
            <p className="text-sm text-muted-foreground">
              Page: <span className="font-medium">{metaTag.page}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Meta Title Section */}
              <div className="grid grid-cols-2 gap-4">
                <FormTextField
                  form={form}
                  name="meta_title"
                  label="Meta Title"
                  placeholder="Enter meta title (50–60 characters)"
                />
                <FormTextField
                  form={form}
                  name="meta_title_ar"
                  label="Meta Title (Arabic)"
                  placeholder="أدخل عنوان الميتا (50-60 حرف)"
                  dir="rtl"
                />
              </div>

              {/* Meta Description Section */}
              <div className="grid grid-cols-2 gap-4">
                <FormTextareaField
                  form={form}
                  name="meta_description"
                  label="Meta Description"
                  placeholder="Enter meta description (150–160 characters)"
                  rows={3}
                />
                <FormTextareaField
                  form={form}
                  name="meta_description_ar"
                  label="Meta Description (Arabic)"
                  placeholder="أدخل وصف الميتا (150-160 حرف)"
                  rows={3}
                  dir="rtl"
                />
              </div>

              {/* Meta Keywords Section */}
              <div className="grid grid-cols-2 gap-4">
                <FormTextField
                  form={form}
                  name="meta_keywords"
                  label="Meta Keywords"
                  placeholder="Comma-separated keywords"
                />
                <FormTextField
                  form={form}
                  name="meta_keywords_ar"
                  label="Meta Keywords (Arabic)"
                  placeholder="كلمات مفتاحية مفصولة بفواصل"
                  dir="rtl"
                />
              </div>

              {/* Other Meta Section */}
              <div className="grid grid-cols-2 gap-4">
                <FormTextareaField
                  form={form}
                  name="other_meta"
                  label="Other Meta Tags"
                  placeholder="Enter other meta tags"
                  rows={3}
                />
                <FormTextareaField
                  form={form}
                  name="other_meta_ar"
                  label="Other Meta Tags (Arabic)"
                  placeholder="أدخل علامات ميتا أخرى"
                  rows={3}
                  dir="rtl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="mr-1 h-4 w-4" />
                      Update Meta Tags
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
};
