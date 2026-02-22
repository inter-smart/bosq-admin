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
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchCouponById,
  createCoupon,
  updateCoupon,
  fetchCategoriesForScope,
  fetchProductsForScope,
  fetchModelsForScope,
  fetchVariantsForScope,
  ProductCategory,
  Product,
  ProductModel,
  ProductVariant,
  CouponWithRelations,
} from "@/services/coupons/couponsApi";
import { Switch } from "@/components/ui/switch";
import { CouponFormData, couponSchema } from "@/schemas/couponSchema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CouponsForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // Scope selection state
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [models, setModels] = useState<ProductModel[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Selected IDs for cascade
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<
    number | null
  >(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // Ref to prevent scope reset when loading coupon data
  const isLoadingCouponRef = useRef(false);

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      media_path: null,
      discount_type: "percentage",
      discount_value: 0,
      min_order_amount: 0,
      min_product_amount: 0,
      max_discount_amount: 0,
      scope_type: "common",
      scope_id: null,
      usage_limit_total: 1,
      usage_limit_per_user: 1,
      start_at: "",
      end_at: "",
      status: true,
    },
  });

  const watchScopeType = form.watch("scope_type");
  const watchDiscountType = form.watch("discount_type");

  useEffect(() => {
    loadCategories();
    if (isEditing && id) {
      loadCouponData(parseInt(id));
    }
  }, [id, isEditing]);

  // Load products when category/subcategory is selected
  useEffect(() => {
    const categoryId = selectedSubCategoryId || selectedParentCategoryId;
    if (
      categoryId &&
      (watchScopeType === "product" ||
        watchScopeType === "model" ||
        watchScopeType === "variant")
    ) {
      loadProducts(categoryId);
    }
  }, [selectedSubCategoryId, selectedParentCategoryId, watchScopeType]);

  // Load models when product is selected
  useEffect(() => {
    if (
      selectedProductId &&
      (watchScopeType === "model" || watchScopeType === "variant")
    ) {
      loadModels(selectedProductId);
    }
  }, [selectedProductId, watchScopeType]);

  // Load variants when model is selected
  useEffect(() => {
    if (selectedModelId && watchScopeType === "variant") {
      loadVariants(selectedModelId);
    }
  }, [selectedModelId, watchScopeType]);

  // Reset scope selections when scope_type changes (but not during initial load)
  useEffect(() => {
    if (isLoadingCouponRef.current) return;
    form.setValue("scope_id", null);
    setSelectedParentCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedProductId(null);
    setSelectedModelId(null);
    setProducts([]);
    setModels([]);
    setVariants([]);
  }, [watchScopeType]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategoriesForScope();
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

  const loadProducts = async (categoryId: number) => {
    try {
      const response = await fetchProductsForScope(categoryId);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const loadModels = async (productId: number) => {
    try {
      const response = await fetchModelsForScope(productId);
      if (response.success) {
        setModels(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product models",
        variant: "destructive",
      });
    }
  };

  const loadVariants = async (modelId: number) => {
    try {
      const response = await fetchVariantsForScope(modelId);
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

  const loadCouponData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      isLoadingCouponRef.current = true;
      const response = await fetchCouponById(itemId);
      const data = response.data as CouponWithRelations;

      if (data) {
        // Reset form first to trigger scope_type change while loading ref is true
        form.reset({
          code: data.code || "",
          title: data.title || "",
          title_ar: data.title_ar || "",
          description: data.description || "",
          description_ar: data.description_ar || "",
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          min_order_amount: data.min_order_amount,
          min_product_amount: data.min_product_amount ?? 0,
          max_discount_amount: data.max_discount_amount,
          scope_type: data.scope_type,
          scope_id: data.scope_id || null,
          usage_limit_total: data.usage_limit_total,
          usage_limit_per_user: data.usage_limit_per_user,
          start_at: data.start_at ? data.start_at.split("T")[0] + "T00:00:00" : "",
          end_at: data.end_at ? data.end_at.split("T")[0] + "T23:59:59" : "",
          status: data.status ?? true,
          media_path: data.media_path
            ? `${import.meta.env.VITE_IMAGE_URL}/${data.media_path}`
            : null,
        });

        // Then populate cascading dropdowns based on scope_type
        await populateCascadeSelections(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load coupon data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
      // Defer clearing the loading ref until after the next browser paint so
      // that any React effects triggered by form.reset() (e.g. watchScopeType)
      // run while the ref is still true, preventing them from wiping the scope
      // selections that populateCascadeSelections just populated.
      requestAnimationFrame(() => {
        isLoadingCouponRef.current = false;
      });
    }
  };

  const populateCascadeSelections = async (data: CouponWithRelations) => {
    if (data.scope_type === "common") return;

    let category: { id: number; parent_id: number | null } | null = null;
    let productId: number | null = null;
    let modelId: number | null = null;

    // Extract category and IDs based on scope_type
    if (data.scope_type === "variant" && data.variant) {
      category = data.variant.productModel.product.category;
      productId = data.variant.productModel.product.id;
      modelId = data.variant.productModel.id;
    } else if (data.scope_type === "model" && data.model) {
      category = data.model.product.category;
      productId = data.model.product.id;
      modelId = data.model.id;
    } else if (data.scope_type === "product" && data.product) {
      category = data.product.category;
    } else if (data.scope_type === "category" && data.category) {
      category = data.category;
    }

    if (!category) return;

    // Determine parent and subcategory
    const parentCatId = category.parent_id || category.id;
    const subCatId = category.parent_id ? category.id : null;

    setSelectedParentCategoryId(parentCatId);
    if (subCatId) setSelectedSubCategoryId(subCatId);

    // Load products if needed (for product/model/variant scope)
    if (
      (data.scope_type === "product" ||
        data.scope_type === "model" ||
        data.scope_type === "variant") &&
      (subCatId || parentCatId)
    ) {
      await loadProducts(subCatId || parentCatId);
      if (productId) setSelectedProductId(productId);
    }

    // Load models if needed (for model/variant scope)
    if (
      (data.scope_type === "model" || data.scope_type === "variant") &&
      productId
    ) {
      await loadModels(productId);
      if (modelId) setSelectedModelId(modelId);
    }

    // Load variants if needed (for variant scope)
    if (data.scope_type === "variant" && modelId) {
      await loadVariants(modelId);
    }
  };

  const onSubmit = async (data: CouponFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("code", data.code);
      formData.append("discount_type", data.discount_type);
      formData.append("discount_value", String(data.discount_value));
      formData.append("min_order_amount", String(data.min_order_amount));
      if (data.scope_type !== "common") {
        formData.append("min_product_amount", String(data.min_product_amount));
        formData.append("max_discount_amount", String(data.max_discount_amount));
      } else {
        // min_product_amount is not applicable for common scope — omit it entirely
        // so the backend optional() check skips it (sending "0" is truthy and
        // would fail the flat-discount cross-check on the server).
        // max_discount_amount is auto-derived from discount_value so the backend
        // flat-check (max >= discount) always passes.
        formData.append("max_discount_amount", String(data.discount_value));
      }
      formData.append("scope_type", data.scope_type);
      formData.append("usage_limit_total", String(data.usage_limit_total));
      formData.append(
        "usage_limit_per_user",
        String(data.usage_limit_per_user),
      );
      formData.append("start_at", data.start_at);
      formData.append("end_at", data.end_at);
      formData.append("status", data.status.toString());

      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);
      if (data.description) formData.append("description", data.description);
      if (data.description_ar)
        formData.append("description_ar", data.description_ar);

      if (data.scope_id) {
        formData.append("scope_id", data.scope_id.toString());
      }

      if (data.media_path instanceof File) {
        formData.append("media_path", data.media_path);
      }

      if (isEditing && id) {
        await updateCoupon(parseInt(id), formData);
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        });
      } else {
        await createCoupon(formData);
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
      }

      navigate("/coupons");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} coupon`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading coupon data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/coupons")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit" : "Add"} Coupon
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update" : "Create a new"} coupon
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) =>
            console.log("error", err),
          )}
          className="space-y-6"
        >
          {/* Coupon Information */}
          <Card>
            <CardHeader>
              <CardTitle>Coupon Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter coupon code (e.g., SAVE20)"
                        {...field}
                        className="uppercase"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Arabic title"
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          rows={3}
                          {...field}
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
                          placeholder="Enter Arabic description"
                          rows={3}
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="media_path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Image (Optional)</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={(file) => field.onChange(file)}
                        accept="image/*"
                        preview={true}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a coupon banner or image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Discount Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="flat">Flat Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Discount Value *{" "}
                        {watchDiscountType === "percentage" && "(max 100)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchScopeType !== "common" && (
                  <FormField
                    control={form.control}
                    name="min_product_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Minimum Product Amount *{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="min_order_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Order Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchScopeType !== "common" && (
                  <FormField
                    control={form.control}
                    name="max_discount_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Max Discount Amount *{" "}
                          {watchDiscountType === "flat" && "(≥ discount value)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scope Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Scope Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="scope_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="common">
                          Common (All Products)
                        </SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="model">Product Model</SelectItem>
                        <SelectItem value="variant">Product Variant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose where this coupon can be applied
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unified Cascade: Parent Category → Subcategory → Product → Model → Variant */}
              {watchScopeType !== "common" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* 1. Parent Category - always shown for non-common scope */}
                    <div className="space-y-2">
                      <FormLabel>Parent Category *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const catId = parseInt(value);
                          setSelectedParentCategoryId(catId);
                          setSelectedSubCategoryId(null);
                          setSelectedProductId(null);
                          setSelectedModelId(null);
                          setProducts([]);
                          setModels([]);
                          setVariants([]);
                          if (watchScopeType === "category") {
                            form.setValue("scope_id", catId);
                          } else {
                            form.setValue("scope_id", null);
                          }
                        }}
                        value={selectedParentCategoryId?.toString() || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!selectedParentCategoryId && (
                        <p className="text-sm text-destructive">
                          Parent category is required
                        </p>
                      )}
                    </div>

                    {/* 2. Subcategory - shown after parent category is selected */}
                    {selectedParentCategoryId && (
                      <div className="space-y-2">
                        <FormLabel>
                          Subcategory{" "}
                          {watchScopeType === "category" ? "(Optional)" : "*"}
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const subCatId = parseInt(value);
                            setSelectedSubCategoryId(subCatId);
                            setSelectedProductId(null);
                            setSelectedModelId(null);
                            setProducts([]);
                            setModels([]);
                            setVariants([]);
                            if (watchScopeType === "category") {
                              form.setValue("scope_id", subCatId);
                            } else {
                              form.setValue("scope_id", null);
                            }
                          }}
                          value={selectedSubCategoryId?.toString() || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find((c) => c.id === selectedParentCategoryId)
                              ?.children?.map((sub) => (
                                <SelectItem
                                  key={sub.id}
                                  value={sub.id.toString()}
                                >
                                  {sub.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* 3. Product - shown for product/model/variant scope after category is selected */}
                    {(watchScopeType === "product" ||
                      watchScopeType === "model" ||
                      watchScopeType === "variant") &&
                      (selectedSubCategoryId || selectedParentCategoryId) && (
                        <div className="space-y-2">
                          <FormLabel>Product *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const prodId = parseInt(value);
                              setSelectedProductId(prodId);
                              setSelectedModelId(null);
                              setModels([]);
                              setVariants([]);
                              if (watchScopeType === "product") {
                                form.setValue("scope_id", prodId);
                              } else {
                                form.setValue("scope_id", null);
                              }
                            }}
                            value={selectedProductId?.toString() || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((prod) => (
                                <SelectItem
                                  key={prod.id}
                                  value={prod.id.toString()}
                                >
                                  {prod.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!selectedProductId &&
                            (watchScopeType === "product" ||
                              watchScopeType === "model" ||
                              watchScopeType === "variant") && (
                              <p className="text-sm text-destructive">
                                Product is required
                              </p>
                            )}
                        </div>
                      )}

                    {/* 4. Model - shown for model/variant scope after product is selected */}
                    {(watchScopeType === "model" ||
                      watchScopeType === "variant") &&
                      selectedProductId && (
                        <div className="space-y-2">
                          <FormLabel>Model *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const modelId = parseInt(value);
                              setSelectedModelId(modelId);
                              setVariants([]);
                              if (watchScopeType === "model") {
                                form.setValue("scope_id", modelId);
                              } else {
                                form.setValue("scope_id", null);
                              }
                            }}
                            value={selectedModelId?.toString() || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              {models.map((model) => (
                                <SelectItem
                                  key={model.id}
                                  value={model.id.toString()}
                                >
                                  {model.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!selectedModelId &&
                            (watchScopeType === "model" ||
                              watchScopeType === "variant") && (
                              <p className="text-sm text-destructive">
                                Model is required
                              </p>
                            )}
                        </div>
                      )}

                    {/* 5. Variant - shown for variant scope after model is selected */}
                    {watchScopeType === "variant" && selectedModelId && (
                      <FormField
                        control={form.control}
                        name="scope_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant *</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={field.value?.toString() || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select variant" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {variants.map((variant) => (
                                  <SelectItem
                                    key={variant.id}
                                    value={variant.id.toString()}
                                  >
                                    {variant.sku}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Overall scope validation message */}
                  <FormField
                    control={form.control}
                    name="scope_id"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="usage_limit_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Usage Limit *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of times this coupon can be used
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usage_limit_per_user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per User Limit *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum times a single user can use this coupon
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Validity Period */}
          <Card>
            <CardHeader>
              <CardTitle>Validity Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_at"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (!date) {
                                field.onChange("");
                                return;
                              }
                              // Use local date to avoid UTC midnight shifting the day
                              field.onChange(format(date, "yyyy-MM-dd") + "T00:00:00");
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_at"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              if (!date) {
                                field.onChange("");
                                return;
                              }
                              // Use local date + end-of-day time to cover the full chosen day
                              field.onChange(format(date, "yyyy-MM-dd") + "T23:59:59");
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this coupon
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/coupons")}
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
