import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ArrowLeft, Plus, X, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/common/FileUpload";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchProductVariantById,
  createProductVariant,
  updateProductVariant,
  fetchAttributesWithValues,
  AttributeWithValues,
} from "@/services/product/productVariantApi";
import { fetchProductModelById, ProductModel } from "@/services/product/productModelApi";
import { fetchActiveProductCategories, ProductCategory } from "@/services/product/productCategoriesApi";

interface AttributeValueSelection {
  id: string;
  valueId: number | null;
  price: string;
}

interface AttributeSelectionState {
  [attributeId: number]: AttributeValueSelection[];
}

const baseSchema = z.object({
  title: z.string(),
  title_ar: z.string(),
  cover_image: z.union([z.instanceof(File), z.string()]).nullable(),
  hover_image: z.union([z.instanceof(File), z.string()]).nullable(),
  brochure: z.union([z.instanceof(File), z.string()]).nullable(),
  design_title: z.string(),
  design_title_ar: z.string(),
  sku: z.string(),
  product_code: z.string(),
  price: z.string(),
  stock: z.coerce.number(),
  sort_order: z.coerce.number(),
  status: z.boolean(),
  is_featured: z.boolean(),
  description: z.string(),
  description_ar: z.string(),
  details: z.string(),
  details_ar: z.string(),
  details_points: z.string(),
  details_points_ar: z.string(),
  additional_details: z.string(),
  additional_details_ar: z.string(),
  enhance_title: z.string(),
  enhance_title_ar: z.string(),
});

type FormValues = z.infer<typeof baseSchema>;

export default function ProductVariantForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productId, id } = useParams();
  const isEditing = Boolean(id);

  const [initialLoading, setInitialLoading] = useState(true);
  const [model, setModel] = useState<ProductModel | null>(null);
  const [attributes, setAttributes] = useState<AttributeWithValues[]>([]);
  const [attributeSelections, setAttributeSelections] = useState<AttributeSelectionState>({});
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const schema = useMemo(
    () =>
      baseSchema.superRefine((data, ctx) => {
        if (!isEditing) return;
        if (!data.title.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Title is required", path: ["title"] });
        if (!data.title_ar.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Title (Arabic) is required", path: ["title_ar"] });
        if (!data.cover_image) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cover image is required", path: ["cover_image"] });
        if (!data.design_title.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Design title is required", path: ["design_title"] });
        if (!data.design_title_ar.trim())
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Design title (Arabic) is required", path: ["design_title_ar"] });
      }),
    [isEditing],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      title_ar: "",
      cover_image: null,
      hover_image: null,
      brochure: null,
      design_title: "",
      design_title_ar: "",
      sku: "",
      product_code: "",
      price: "",
      stock: 0,
      sort_order: 1,
      status: true,
      is_featured: false,
      description: "",
      description_ar: "",
      details: "",
      details_ar: "",
      details_points: "",
      details_points_ar: "",
      additional_details: "",
      additional_details_ar: "",
      enhance_title: "",
      enhance_title_ar: "",
    },
  });

  const hasValidAttributeSelections = useMemo(() => {
    const allSelections = Object.values(attributeSelections).flat();
    if (allSelections.length === 0) return false;
    return allSelections.every((s) => s.valueId !== null);
  }, [attributeSelections]);

  const attributeValidationMessage = useMemo(() => {
    if (isEditing) return null;
    const allSelections = Object.values(attributeSelections).flat();
    if (allSelections.length === 0) return "Add at least one attribute value to create the variant.";
    const missingValues = allSelections.filter((s) => s.valueId === null);
    if (missingValues.length > 0)
      return `Select a value for ${missingValues.length} attribute row(s) before saving.`;
    return null;
  }, [attributeSelections, isEditing]);

  useEffect(() => {
    loadInitialData();
  }, [productId, id]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);

      if (productId) {
        const modelResponse = await fetchProductModelById(parseInt(productId));
        setModel(modelResponse.data);
      }

      const [attributesResponse, categoriesResponse] = await Promise.all([fetchAttributesWithValues(), fetchActiveProductCategories()]);

      if (attributesResponse.success) {
        setAttributes(attributesResponse.data);

        const initialSelections: AttributeSelectionState = {};
        attributesResponse.data.forEach((attr) => {
          initialSelections[attr.id] = [];
        });
        setAttributeSelections(initialSelections);
      }

      if (categoriesResponse.success) {
        setAllCategories(categoriesResponse.data);
      }

      if (isEditing && id) {
        const variantResponse = await fetchProductVariantById(parseInt(id));
        const data = variantResponse.data;

        reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          cover_image: data.media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_path}` : null,
          hover_image: data.hover_media_path ? `${import.meta.env.VITE_IMAGE_URL}/${data.hover_media_path}` : null,
          brochure: data.brochure ? `${import.meta.env.VITE_IMAGE_URL}/${data.brochure}` : null,
          design_title: data.design_title || "",
          design_title_ar: data.design_title_ar || "",
          sku: data.sku || "",
          product_code: data.product_code || "",
          price: data.price || "",
          stock: data.stock || 0,
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
          is_featured: (data as any).is_featured ?? false,
          description: data.description || "",
          description_ar: data.description_ar || "",
          details: data.details || "",
          details_ar: data.details_ar || "",
          details_points: data.details_points || "",
          details_points_ar: data.details_points_ar || "",
          additional_details: data.additional_details || "",
          additional_details_ar: data.additional_details_ar || "",
          enhance_title: data.enhance_title || "",
          enhance_title_ar: data.enhance_title_ar || "",
        });

        // Pre-select existing categories
        if ((data as any).categories && Array.isArray((data as any).categories)) {
          setSelectedCategoryIds((data as any).categories.map((c: any) => c.id));
        }

        if (data.variant_attributes && data.variant_attributes.length > 0) {
          const loadedSelections: AttributeSelectionState = {};

          attributesResponse.data.forEach((attr) => {
            loadedSelections[attr.id] = [];
          });

          data.variant_attributes.forEach((attr) => {
            if (!loadedSelections[attr.attribute_id]) {
              loadedSelections[attr.attribute_id] = [];
            }
            loadedSelections[attr.attribute_id].push({
              id: crypto.randomUUID(),
              valueId: attr.attribute_value_id,
              price: attr.price || "",
            });
          });

          setAttributeSelections(loadedSelections);
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setInitialLoading(false);
    }
  };

  const addValueSelection = (attributeId: number) => {
    setAttributeSelections((prev) => ({
      ...prev,
      [attributeId]: [...(prev[attributeId] || []), { id: crypto.randomUUID(), valueId: null, price: "" }],
    }));
  };

  const removeValueSelection = (attributeId: number, selectionId: string) => {
    setAttributeSelections((prev) => ({
      ...prev,
      [attributeId]: prev[attributeId].filter((s) => s.id !== selectionId),
    }));
  };

  const updateValueSelection = (attributeId: number, selectionId: string, field: "valueId" | "price", value: number | string | null) => {
    setAttributeSelections((prev) => ({
      ...prev,
      [attributeId]: prev[attributeId].map((s) => (s.id === selectionId ? { ...s, [field]: value } : s)),
    }));
  };

  const getValueSlug = (attributeId: number, valueId: number): string => {
    const attribute = attributes.find((a) => a.id === attributeId);
    if (!attribute) return "";
    const value = attribute.values.find((v) => v.id === valueId);
    return value?.slug || "";
  };

  const getSelectedValueIds = (attributeId: number, currentSelectionId: string): number[] => {
    const selections = attributeSelections[attributeId] || [];
    return selections.filter((s) => s.id !== currentSelectionId && s.valueId !== null).map((s) => s.valueId as number);
  };

  const getAvailableValues = (attributeId: number, currentSelectionId: string) => {
    const attribute = attributes.find((a) => a.id === attributeId);
    if (!attribute) return [];
    const selectedValueIds = getSelectedValueIds(attributeId, currentSelectionId);
    return attribute.values.filter((v) => !selectedValueIds.includes(v.id));
  };

  const onSubmit = async (data: FormValues) => {
    if (!productId) return;

    // Validate attribute selections (managed outside RHF)
    for (const selections of Object.values(attributeSelections)) {
      for (const selection of selections) {
        if (!selection.valueId) {
          toast({
            title: "Validation Error",
            description: "Please select a value for all added attributes.",
            variant: "destructive",
          });
          return;
        }
      }
    }

    const allSelections: { attribute_id: number; attribute_value_id: number; price: string; sku_code: string }[] = [];

    Object.entries(attributeSelections).forEach(([attrId, selections]) => {
      selections.forEach((s) => {
        if (s.valueId !== null) {
          allSelections.push({
            attribute_id: parseInt(attrId),
            attribute_value_id: s.valueId,
            price: s.price || "0",
            sku_code: getValueSlug(parseInt(attrId), s.valueId),
          });
        }
      });
    });

    try {
      if (isEditing && id) {
        const formData = new FormData();
        formData.append("product_model_id", productId);
        formData.append("sku", data.sku);
        formData.append("product_code", data.product_code);
        formData.append("price", data.price);
        formData.append("stock", data.stock.toString());
        formData.append("sort_order", data.sort_order.toString());
        formData.append("status", data.status.toString());
        formData.append("title", data.title);
        formData.append("title_ar", data.title_ar);
        formData.append("design_title", data.design_title);
        formData.append("design_title_ar", data.design_title_ar);
        formData.append("attributes", JSON.stringify(allSelections));
        formData.append("category_ids", JSON.stringify(selectedCategoryIds));
        formData.append("is_featured", data.is_featured.toString());
        if (data.description) formData.append("description", data.description);
        if (data.description_ar) formData.append("description_ar", data.description_ar);
        if (data.details) formData.append("details", data.details);
        if (data.details_ar) formData.append("details_ar", data.details_ar);
        if (data.details_points) formData.append("details_points", data.details_points);
        if (data.details_points_ar) formData.append("details_points_ar", data.details_points_ar);
        if (data.additional_details) formData.append("additional_details", data.additional_details);
        if (data.additional_details_ar) formData.append("additional_details_ar", data.additional_details_ar);
        if (data.enhance_title) formData.append("enhance_title", data.enhance_title);
        if (data.enhance_title_ar) formData.append("enhance_title_ar", data.enhance_title_ar);

        if (data.cover_image instanceof File) {
          formData.append("media_path", data.cover_image);
        }
        if (data.hover_image instanceof File) {
          formData.append("hover_media_path", data.hover_image);
        }
        if (data.brochure instanceof File) {
          formData.append("brochure", data.brochure);
        } else if (typeof data.brochure === "string") {
          formData.append("brochure", data.brochure);
        }

        await updateProductVariant(parseInt(id), formData);
        toast({ title: "Success", description: "Product variant updated successfully" });
      } else {
        await createProductVariant({
          product_model_id: parseInt(productId),
          sku: data.sku,
          product_code: data.product_code,
          price: data.price,
          stock: data.stock,
          sort_order: data.sort_order,
          status: data.status,
          variant_attributes: allSelections,
          category_ids: selectedCategoryIds,
        } as any);
        toast({ title: "Success", description: "Product variant created successfully" });
      }

      navigate(`/product-variants/all`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} product variant`,
        variant: "destructive",
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Product Variant
            {model ? ` for "${model.title}"` : ""}
          </h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} product variant</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information - only show when editing */}
        {isEditing && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Variant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter variant title" {...register("title")} />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title_ar">Title (Arabic)</Label>
                    <Input id="title_ar" placeholder="أدخل عنوان المنتج" dir="rtl" {...register("title_ar")} />
                    {errors.title_ar && <p className="text-sm text-destructive">{errors.title_ar.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <Controller
                      name="cover_image"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          recommendedDimensions="430px × 412px"
                          placeholder="Drop cover image here or click to browse"
                        />
                      )}
                    />
                    {errors.cover_image && <p className="text-sm text-destructive">{errors.cover_image.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Hover Image</Label>
                    <Controller
                      name="hover_image"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          recommendedDimensions="430px × 412px"
                          placeholder="Drop hover image here or click to browse"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="design_title">Design Title</Label>
                    <Input id="design_title" placeholder="Enter design title" {...register("design_title")} />
                    {errors.design_title && <p className="text-sm text-destructive">{errors.design_title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="design_title_ar">Design Title (Arabic)</Label>
                    <Input id="design_title_ar" placeholder="أدخل عنوان التصميم" dir="rtl" {...register("design_title_ar")} />
                    {errors.design_title_ar && <p className="text-sm text-destructive">{errors.design_title_ar.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="Enter SKU" disabled {...register("sku")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product_code">Product Code</Label>
                    <Input id="product_code" placeholder="Enter product code" disabled {...register("product_code")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" step="0.01" placeholder="Enter price" disabled {...register("price")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" placeholder="Enter stock quantity" {...register("stock")} />
                    {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input id="sort_order" type="number" placeholder="1" {...register("sort_order")} />
                    {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order.message}</p>}
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Status</Label>
                      <p className="text-sm text-muted-foreground">Enable or disable this variant</p>
                    </div>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Featured</Label>
                      <p className="text-sm text-muted-foreground">Mark this variant as featured</p>
                    </div>
                    <Controller
                      name="is_featured"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Product Brochure (Optional)</Label>
                    <Controller
                      name="brochure"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="application/pdf"
                          preview={false}
                          maxSize={10 * 1024 * 1024}
                        />
                      )}
                    />
                    <p className="text-sm text-muted-foreground">Upload a product brochure (PDF only, max 10MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter product description" className="min-h-[100px]" {...register("description")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_ar">Description (Arabic)</Label>
                    <Textarea id="description_ar" placeholder="أدخل وصف المنتج" className="min-h-[100px]" dir="rtl" {...register("description_ar")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enhance_title">Enhance Title</Label>
                    <Input id="enhance_title" placeholder="Enter enhance title" {...register("enhance_title")} />
                    {errors.enhance_title && <p className="text-sm text-destructive">{errors.enhance_title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enhance_title_ar">Enhance Title (Arabic)</Label>
                    <Input id="enhance_title_ar" placeholder="أدخل عنوان التحسين" dir="rtl" {...register("enhance_title_ar")} />
                    {errors.enhance_title_ar && <p className="text-sm text-destructive">{errors.enhance_title_ar.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Details (Optional)</Label>
                  <Controller
                    name="details"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter detailed product information..." />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details (Arabic) (Optional)</Label>
                  <Controller
                    name="details_ar"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="أدخل تفاصيل المنتج..." dir="rtl" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details Points (Optional)</Label>
                  <Controller
                    name="details_points"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter product detail points..." />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Details Points (Arabic) (Optional)</Label>
                  <Controller
                    name="details_points_ar"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="أدخل نقاط تفاصيل المنتج..." dir="rtl" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Additional Details (Optional)</Label>
                  <Controller
                    name="additional_details"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter any additional product details..." />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Additional Details (Arabic) (Optional)</Label>
                  <Controller
                    name="additional_details_ar"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} placeholder="أدخل تفاصيل إإضافية للمنتج..." dir="rtl" />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Attribute Cards */}
        {attributes.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">No attributes available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {(isEditing ? attributes.filter((attr) => (attributeSelections[attr.id] || []).length > 0) : attributes).map((attribute) => {
              const selections = attributeSelections[attribute.id] || [];

              return (
                <Card key={attribute.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{attribute.name}</CardTitle>
                    {!isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addValueSelection(attribute.id)}
                        disabled={selections.length >= attribute.values.length}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selections.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Click + to add {attribute.name.toLowerCase()} values</p>
                    ) : (
                      selections.map((selection) => (
                        <div key={selection.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                          <div className="flex-1 space-y-2">
                            <Select
                              value={selection.valueId?.toString() || ""}
                              onValueChange={(value) => updateValueSelection(attribute.id, selection.id, "valueId", parseInt(value))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`Select ${attribute.name.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableValues(attribute.id, selection.id).map((val) => (
                                  <SelectItem key={val.id} value={val.id.toString()}>
                                    {val.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Price adjustment"
                              value={selection.price}
                              onChange={(e) => updateValueSelection(attribute.id, selection.id, "price", e.target.value)}
                              className="w-full"
                            />
                          </div>
                          {!isEditing && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive shrink-0"
                              onClick={() => removeValueSelection(attribute.id, selection.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Category Selection */}
        {isEditing &&
          allCategories.length > 0 &&
          (() => {
            const parentCategories = allCategories.filter((c) => !c.parent_id);
            const childrenOf = (parentId: number) => allCategories.filter((c) => c.parent_id === parentId);

            const toggleParent = (parentId: number, checked: boolean) => {
              setSelectedCategoryIds((prev) =>
                checked ? [...prev, parentId] : prev.filter((id) => id !== parentId),
              );
            };

            const toggleChild = (childId: number, checked: boolean) => {
              setSelectedCategoryIds((prev) =>
                checked ? [...prev, childId] : prev.filter((id) => id !== childId),
              );
            };

            const selectedCats = selectedCategoryIds.map((id) => allCategories.find((c) => c.id === id)).filter(Boolean) as typeof allCategories;

            return (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Categories</CardTitle>
                    </div>
                    {selectedCategoryIds.length > 0 && (
                      <Badge variant="secondary" className="text-xs font-medium">
                        {selectedCategoryIds.length} selected
                      </Badge>
                    )}
                  </div>

                  {/* Selected chips */}
                  {selectedCats.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {selectedCats.map((cat) => (
                        <Badge key={cat.id} variant="outline" className="gap-1 pr-1 text-xs font-normal h-6">
                          {cat.name}
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryIds((prev) => prev.filter((i) => i !== cat.id))}
                            className="ml-0.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {parentCategories.map((parent) => {
                      const children = childrenOf(parent.id!);
                      const childIds = children.map((c) => c.id!);
                      const selectedChildren = childIds.filter((id) => selectedCategoryIds.includes(id));
                      const someChildSelected = selectedChildren.length > 0 && selectedChildren.length < childIds.length;
                      const parentChecked = selectedCategoryIds.includes(parent.id!);
                      const isGroupActive = parentChecked || selectedChildren.length > 0;

                      return (
                        <div
                          key={parent.id}
                          className={`rounded-lg border p-3 space-y-2.5 transition-colors ${
                            isGroupActive ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/40"
                          }`}
                        >
                          {/* Parent row */}
                          <div className={`flex items-center gap-2 ${children.length > 0 ? "pb-2 border-b border-border/60" : ""}`}>
                            <Checkbox
                              id={`category-${parent.id}`}
                              checked={someChildSelected && !parentChecked ? "indeterminate" : parentChecked}
                              onCheckedChange={(checked) => toggleParent(parent.id!, !!checked)}
                            />
                            <label htmlFor={`category-${parent.id}`} className="text-sm font-semibold leading-none cursor-pointer flex-1">
                              {parent.name}
                            </label>
                            {selectedChildren.length > 0 && (
                              <span className="text-xs text-muted-foreground tabular-nums">
                                {selectedChildren.length}/{childIds.length}
                              </span>
                            )}
                          </div>

                          {/* Children rows */}
                          {children.length > 0 && (
                            <div className="space-y-2">
                              {children.map((child) => (
                                <div key={child.id} className="flex items-center gap-2 group">
                                  <Checkbox
                                    id={`category-${child.id}`}
                                    checked={selectedCategoryIds.includes(child.id!)}
                                    onCheckedChange={(checked) => toggleChild(child.id!, !!checked)}
                                  />
                                  <label
                                    htmlFor={`category-${child.id}`}
                                    className="text-xs leading-none cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors"
                                  >
                                    {child.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

        {/* Submit Buttons */}
        <div className="flex justify-end items-center gap-4">
          {attributeValidationMessage && (
            <p className="text-sm text-destructive flex-1">{attributeValidationMessage}</p>
          )}
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || (!isEditing && !hasValidAttributeSelections)}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
