import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  fetchProductVariantMetaById,
  updateProductVariantMeta,
  UpdateProductVariantMetaRequest,
} from "@/services/product/productVariantMetaApi";
import { toast } from "sonner";
import { FormTextareaField } from "@/components/forms/FormFieldComponents";
import {
  productVariantMetaSchema,
  ProductVariantMetaFormData,
} from "@/schemas/productVariantMetaSchema";

export default function ProductVariantMetaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [productTitle, setProductTitle] = useState("");

  const form = useForm<ProductVariantMetaFormData>({
    resolver: zodResolver(productVariantMetaSchema),
    defaultValues: {
      meta_title: "", meta_title_ar: "",
      meta_description: "", meta_description_ar: "",
      meta_keywords: "", meta_keywords_ar: "",
      other_meta: "", other_meta_ar: "",
    },
  });

  useEffect(() => {
    if (id) { loadData(parseInt(id)); }
  }, [id]);

  const loadData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchProductVariantMetaById(itemId);
      const data = response.data;
      if (data) {
        setProductTitle(data.product_title);
        form.reset({
          meta_title: data.meta_title ?? "",
          meta_title_ar: data.meta_title_ar ?? "",
          meta_description: data.meta_description ?? "",
          meta_description_ar: data.meta_description_ar ?? "",
          meta_keywords: data.meta_keywords ?? "",
          meta_keywords_ar: data.meta_keywords_ar ?? "",
          other_meta: data.other_meta ?? "",
          other_meta_ar: data.other_meta_ar ?? "",
        });
      }
    } catch (error) {
      toast.error("Failed to load variant meta tag data");
      navigate("/product-variant-meta-tags");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ProductVariantMetaFormData) => {
    if (!id) return;
    try {
      setLoading(true);
      const payload: UpdateProductVariantMetaRequest = {
        meta_title: data.meta_title,
        meta_title_ar: data.meta_title_ar,
        meta_description: data.meta_description,
        meta_description_ar: data.meta_description_ar,
        meta_keywords: data.meta_keywords,
        meta_keywords_ar: data.meta_keywords_ar,
        other_meta: data.other_meta,
        other_meta_ar: data.other_meta_ar,
      };
      await updateProductVariantMeta(parseInt(id), payload);
      toast.success("Variant meta tag updated successfully");
      navigate("/product-variant-meta-tags");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update variant meta tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading variant meta tag data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/product-variant-meta-tags")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Variant Meta Tags</h1>
          <p className="text-muted-foreground">
            Product: <span className="font-medium">{productTitle}</span>
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Meta Title */}
          <Card>
            <CardHeader><CardTitle>Meta Title</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormTextareaField form={form} name="meta_title" label="Meta Title"
                  placeholder="Enter meta title (50–60 characters)" />
                <FormTextareaField form={form} name="meta_title_ar" label="Meta Title (Arabic)"
                  placeholder="أدخل عنوان الميتا (50-60 حرف)" dir="rtl" />
              </div>
            </CardContent>
          </Card>

          {/* Meta Description */}
          <Card>
            <CardHeader><CardTitle>Meta Description</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormTextareaField form={form} name="meta_description" label="Meta Description"
                  placeholder="Enter meta description (150–160 characters)" rows={3} />
                <FormTextareaField form={form} name="meta_description_ar" label="Meta Description (Arabic)"
                  placeholder="أدخل وصف الميتا (150-160 حرف)" rows={3} dir="rtl" />
              </div>
            </CardContent>
          </Card>

          {/* Meta Keywords */}
          <Card>
            <CardHeader><CardTitle>Meta Keywords</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormTextareaField form={form} name="meta_keywords" label="Meta Keywords"
                  placeholder="Comma-separated keywords" />
                <FormTextareaField form={form} name="meta_keywords_ar" label="Meta Keywords (Arabic)"
                  placeholder="كلمات مفتاحية مفصولة بفواصل" dir="rtl" />
              </div>
            </CardContent>
          </Card>

          {/* Other Meta Tags */}
          <Card>
            <CardHeader><CardTitle>Other Meta Tags</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormTextareaField form={form} name="other_meta" label="Other Meta Tags"
                    placeholder="Enter other meta tags" rows={3} />
                  <p className="text-sm text-muted-foreground mt-1">
                    {`eg: <meta name="description" content="John Doe"/>`}
                  </p>
                </div>
                <div>
                  <FormTextareaField form={form} name="other_meta_ar" label="Other Meta Tags (Arabic)"
                    placeholder="أدخل علامات ميتا أخرى" rows={3} dir="rtl" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {`eg: <meta name="description" content="John Doe"/>`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/product-variant-meta-tags")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Updating..." : "Update Meta Tags"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
