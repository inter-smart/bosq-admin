import { useState, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/common/FileUpload";
import { Save, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProductTypeById,
  createProductType,
  updateProductType,
  fetchCategoriesForProductType,
  fetchVariantsByCategoryForProductType,
  ProductCategory,
  ProductVariant,
  ProductVariantData,
} from "@/services/landingPage/productTypeApi";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import {
  ProductTypeFormData,
  productTypeSchema,
} from "@/schemas/productTypeSchema";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";

export default function ProductTypeForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { landingPageId, id } = useParams();
  const isEditing = Boolean(id);
  const MEDIA_URL = import.meta.env.VITE_IMAGE_URL;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [desktopImageFile, setDesktopImageFile] = useState<
    File | string | null
  >(null);
  const [mobileImageFile, setMobileImageFile] = useState<
    File | string | null
  >(null);

  // Selected variants list
  const [selectedVariants, setSelectedVariants] = useState<
    { id: number; sku: string; title?: string }[]
  >([]);

  // Cascade state
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<
    number | null
  >(null);

  const isLoadingRef = useRef(false);

  const form = useForm<ProductTypeFormData>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      title: "",
      title_ar: "",
      description: "",
      features: "",
      description_ar: "",
      features_ar: "",
      media_alt: "",
      media_alt_ar: "",
      button: "",
      button_ar: "",
      link: "",
      slug: "",
      sort_order: 1,
      status: true,
      product_variants: [],
    },
  });

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadProductTypeData(parseInt(id));
    }
  }, [id, isEditing]);

  // Load variants directly when category changes
  useEffect(() => {
    if (isLoadingRef.current) return;
    if (selectedParentCategoryId) {
      loadVariantsByCategory(selectedParentCategoryId);
    } else {
      setVariants([]);
    }
  }, [selectedParentCategoryId]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategoriesForProductType();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const loadVariantsByCategory = async (categoryId: number) => {
    try {
      const response = await fetchVariantsByCategoryForProductType(categoryId);
      if (response.success) {
        setVariants(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product variants",
        variant: "destructive",
      });
    }
  };

  const loadProductTypeData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      isLoadingRef.current = true;
      const response = await fetchProductTypeById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          features: data.features || "",
          description_ar: data.description_ar || "",
          features_ar: data.features_ar || "",
          media_alt: data.media_alt || "",
          media_alt_ar: data.media_alt_ar || "",
          button: data.button || "",
          button_ar: data.button_ar || "",
          link: data.link || "",
          slug: data.slug || "",
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          product_variants: data.product_variants || [],
        });

        if (data.media_desktop_path) {
          const desktopUrl = `${MEDIA_URL}/${data.media_desktop_path}`;
          setDesktopImageFile(desktopUrl);
          form.setValue("media_desktop_path", desktopUrl);
        }
        if (data.media_mobile_path) {
          const mobileUrl = `${MEDIA_URL}/${data.media_mobile_path}`;
          setMobileImageFile(mobileUrl);
          form.setValue("media_mobile_path", mobileUrl);
        }

        // Populate selected variants from the response
        if (data.product_variants_data && data.product_variants_data.length > 0) {
          setSelectedVariants(
            data.product_variants_data.map((v: ProductVariantData) => ({
              id: v.id,
              sku: v.sku,
              title: v.title,
            }))
          );
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load product type data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
      isLoadingRef.current = false;
    }
  };

  const handleVariantsChange = (selectedIds: (number | string)[]) => {
    const ids = selectedIds as number[];
    const updated = variants
      .filter((v) => ids.includes(v.id))
      .map((v) => ({ id: v.id, sku: v.sku }));
    const outsideModel = selectedVariants.filter(
      (sv) => !variants.some((v) => v.id === sv.id)
    );
    const merged = [...outsideModel, ...updated];
    setSelectedVariants(merged);
    form.setValue(
      "product_variants",
      merged.map((v) => v.id)
    );
  };

  const removeVariant = (variantId: number) => {
    const updated = selectedVariants.filter((v) => v.id !== variantId);
    setSelectedVariants(updated);
    form.setValue(
      "product_variants",
      updated.map((v) => v.id)
    );
  };

  const onSubmit = async (data: ProductTypeFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("title_ar", data.title_ar);
      if (data.description) formData.append("description", data.description);
      if (data.features) formData.append("features", data.features);
      if (data.description_ar)
        formData.append("description_ar", data.description_ar);
      if (data.features_ar) formData.append("features_ar", data.features_ar);
      if (data.media_alt) formData.append("media_alt", data.media_alt);
      if (data.media_alt_ar) formData.append("media_alt_ar", data.media_alt_ar);
      if (data.button) formData.append("button", data.button);
      if (data.button_ar) formData.append("button_ar", data.button_ar);
      if (data.link) formData.append("link", data.link);
      if (data.slug) formData.append("slug", data.slug);
      formData.append("sort_order", (data.sort_order || 0).toString());
      formData.append("status", (data.status ?? true).toString());
      formData.append("landing_page_id", landingPageId || "");
      formData.append(
        "product_variants",
        JSON.stringify(selectedVariants.map((v) => v.id))
      );

      if (desktopImageFile instanceof File) {
        formData.append("media_desktop_path", desktopImageFile);
      }
      if (mobileImageFile instanceof File) {
        formData.append("media_mobile_path", mobileImageFile);
      }

      if (isEditing && id) {
        await updateProductType(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Product type updated successfully",
        });
      } else {
        await createProductType(formData);
        toast({
          title: "Success",
          description: "Product type created successfully",
        });
      }

      navigate(`/product-types/${landingPageId}/list`);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} product type`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          Loading product type data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/product-types/${landingPageId}/list`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Product Type
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} product type
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) =>
            console.log("error", err)
          )}
          className="space-y-6"
        >
          {/* Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Type Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product type title"
                            {...field}
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
                            placeholder="Enter description"
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
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter product type features"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Arabic) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان نوع المنتج"
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
                    name="description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Arabic)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="أدخل الوصف"
                            rows={4}
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
                    name="features_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features (Arabic)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            dir="rtl"
                            placeholder="أدخل مميزات نوع المنتج"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Type Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="media_desktop_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setDesktopImageFile(file);
                          }}
                          accept="image/*"
                          placeholder="Upload desktop image"
                          preview={true}
                          recommendedDimensions="1920px x 1080px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="media_mobile_path"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={(file) => {
                            field.onChange(file);
                            setMobileImageFile(file);
                          }}
                          accept="image/*"
                          placeholder="Upload mobile image"
                          recommendedDimensions="600px x 400px"
                          preview={true}
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
                  name="media_alt_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Alt Text (Arabic)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل النص البديل للوسائط"
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

          {/* Call to Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="button"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter button label" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="button_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Label (Arabic)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل نص الزر"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="enter-slug-here" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique URL identifier (lowercase letters, numbers, and hyphens only)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Variants Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Category */}
                <div className="space-y-2">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const catId = parseInt(value);
                      setSelectedParentCategoryId(catId);
                      setVariants([]);
                    }}
                    value={selectedParentCategoryId?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Variants (directly from category) */}
                {selectedParentCategoryId && (
                  <div className="space-y-2">
                    <FormLabel>Variants</FormLabel>
                    <MultiSelect
                      options={variants.map((v) => ({ id: v.id, name: v.sku }))}
                      selected={selectedVariants
                        .filter((sv) => variants.some((v) => v.id === sv.id))
                        .map((sv) => sv.id)}
                      onChange={handleVariantsChange}
                      placeholder="Select variants..."
                    />
                  </div>
                )}
              </div>

              {/* Selected Variants Display */}
              {selectedVariants.length > 0 && (
                <div className="space-y-2">
                  <FormLabel>Selected Variants</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {selectedVariants.map((variant) => (
                      <Badge
                        key={variant.id}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {variant.sku || variant.title || `Variant #${variant.id}`}
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Card */}
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
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
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
                          Enable or disable this product type
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
              onClick={() => navigate(`/product-types/${landingPageId}/list`)}
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
