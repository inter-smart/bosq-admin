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

const metaTagSchema = z.object({
  meta_title: z
    .string()
    .min(1, "Meta title is required")
    .max(60, "Meta title should be under 60 characters"),
  meta_description: z
    .string()
    .min(1, "Meta description is required")
    .max(160, "Meta description should be under 160 characters"),
  meta_keywords: z
    .string()
    .max(255, "Meta keywords should be under 255 characters"),
  other_meta_tags: z.string().optional(),
  canonical_url: z
    .string()
    .url("Please enter a valid URL")
    .or(z.literal(""))
    .optional(),
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
      meta_description: metaTag.meta_description ?? "",
      meta_keywords: metaTag.meta_keywords ?? "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: MetaTagFormData) => {
    try {
      const payload: UpdateMetaTagRequest = {
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
      };

      await updateMetaTag(metaTag.id, payload);

      toast.success("Meta tag updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to update meta tags. Please try again."
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
              <FormTextField
                form={form}
                name="meta_title"
                label="Meta Title"
                placeholder="Enter meta title (50–60 characters)"
              />

              <FormTextareaField
                form={form}
                name="meta_description"
                label="Meta Description"
                placeholder="Enter meta description (150–160 characters)"
                rows={3}
              />

              <FormTextField
                form={form}
                name="meta_keywords"
                label="Meta Keywords"
                placeholder="Comma-separated keywords"
              />

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

