import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/common/FileUpload";
import {
  fetchProductVariantById,
  createProductVariant,
  updateProductVariant,
  fetchAttributesWithValues,
  AttributeWithValues,
} from "@/services/product/productVariantApi";
import { fetchProductModelById, ProductModel } from "@/services/product/productModelApi";

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
  design_title: z.string(),
  design_title_ar: z.string(),
  sku: z.string(),
  product_code: z.string(),
  price: z.string(),
  stock: z.coerce.number(),
  sort_order: z.coerce.number(),
  status: z.boolean(),
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
      design_title: "",
      design_title_ar: "",
      sku: "",
      product_code: "",
      price: "",
      stock: 0,
      sort_order: 1,
      status: true,
    },
  });

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

      const attributesResponse = await fetchAttributesWithValues();
      if (attributesResponse.success) {
        setAttributes(attributesResponse.data);

        const initialSelections: AttributeSelectionState = {};
        attributesResponse.data.forEach((attr) => {
          initialSelections[attr.id] = [];
        });
        setAttributeSelections(initialSelections);
      }

      if (isEditing && id) {
        const variantResponse = await fetchProductVariantById(parseInt(id));
        const data = variantResponse.data;

        reset({
          title: data.title || "",
          title_ar: data.title_ar || "",
          cover_image: data.media_path || null,
          hover_image: data.hover_media_path || null,
          design_title: data.design_title || "",
          design_title_ar: data.design_title_ar || "",
          sku: data.sku || "",
          product_code: data.product_code || "",
          price: data.price || "",
          stock: data.stock || 0,
          sort_order: data.sort_order || 1,
          status: data.status ?? true,
        });

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

        if (data.cover_image instanceof File) {
          formData.append("media_path", data.cover_image);
        }
        if (data.hover_image instanceof File) {
          formData.append("hover_media_path", data.hover_image);
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
        });
        toast({ title: "Success", description: "Product variant created successfully" });
      }

      navigate(`/product-variants/${productId}/list`);
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
        <Button variant="outline" size="icon" onClick={() => navigate(`/product-variants/${productId}/list`)}>
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
              </div>
            </CardContent>
          </Card>
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

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/product-variants/${productId}/list`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
