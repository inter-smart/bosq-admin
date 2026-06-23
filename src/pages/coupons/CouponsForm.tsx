import { useState, useEffect, useRef, useMemo } from "react";
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
import { Save, ArrowLeft, Check, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchCouponById,
  createCoupon,
  updateCoupon,
  fetchCategoriesForScope,
  fetchProductsForScope,
  fetchAllProductsForScope,
  fetchModelsForScope,
  fetchVariantsForScope,
  fetchModelCategoriesForScope,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchableSelectProps {
  options: { id: number; name: string }[];
  value: number | null;
  onValueChange: (value: number | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
      setVisibleCount(10);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.name.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const displayedOptions = useMemo(() => {
    return filteredOptions.slice(0, visibleCount);
  }, [filteredOptions, visibleCount]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
      setVisibleCount((prev) => prev + 10);
    }
  };

  const selectedOption = options.find((o) => o.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedOption ? selectedOption.name : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        style={{ maxHeight: "var(--radix-popover-content-available-height)" }}
      >
        <Command
          shouldFilter={false}
          style={{ maxHeight: "var(--radix-popover-content-available-height)" }}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList
            onScroll={handleScroll}
            style={{ maxHeight: "calc(var(--radix-popover-content-available-height) - 50px)" }}
          >
            {displayedOptions.length === 0 && <CommandEmpty>{emptyText}</CommandEmpty>}
            <CommandGroup>
              {displayedOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    onValueChange(option.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

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
  // For variant scope: category chosen after model (filters which variants to show)
  const [selectedVariantCategoryId, setSelectedVariantCategoryId] = useState<
    number | null
  >(null);
  const [variantCategories, setVariantCategories] = useState<ProductCategory[]>(
    [],
  );

  // Ref to prevent scope reset when loading coupon data
  const isLoadingCouponRef = useRef(false);

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      title: "",
      title_ar: "",
      discount_type: "percentage",
      discount_value: 0,
      min_order_amount: 0,
      min_product_amount: 0,
      max_discount_amount: 0,
      scope_type: "common",
      scope_id: null,
      usage_limit_total: 1,
      usage_limit_per_user: 1,
      start_at: format(new Date(), "yyyy-MM-dd"),
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

  // For product/model/variant scope: pre-load all products when scope type changes
  useEffect(() => {
    if (isLoadingCouponRef.current) return;
    if (
      watchScopeType === "product" ||
      watchScopeType === "model" ||
      watchScopeType === "variant"
    ) {
      loadAllProducts();
    }
  }, [watchScopeType]);

  // Reset scope selections when scope_type changes (but not during initial load)
  useEffect(() => {
    if (isLoadingCouponRef.current) return;
    form.setValue("scope_id", null);
    setSelectedParentCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedProductId(null);
    setSelectedModelId(null);
    setSelectedVariantCategoryId(null);
    setProducts([]);
    setModels([]);
    setVariantCategories([]);
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

  const loadAllProducts = async () => {
    try {
      const response = await fetchAllProductsForScope();
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

  const loadModelCategories = async (modelId: number) => {
    try {
      const response = await fetchModelCategoriesForScope(modelId);
      if (response.success) {
        setVariantCategories(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const loadVariants = async (modelId: number, categoryId?: number) => {
    try {
      const response = await fetchVariantsForScope(modelId, categoryId);
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
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          min_order_amount: data.min_order_amount,
          min_product_amount: data.min_product_amount ?? 0,
          max_discount_amount: data.max_discount_amount,
          scope_type: data.scope_type,
          scope_id: data.scope_id || null,
          usage_limit_total: data.usage_limit_total,
          usage_limit_per_user: data.usage_limit_per_user,
          start_at: data.start_at
            ? data.start_at.slice(0, 10) + "T00:00:00"
            : "",
          end_at: data.end_at ? data.end_at.slice(0, 10) + "T23:59:59" : "",
          status: data.status ?? true,
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

    if (data.scope_type === "category" && data.category) {
      // Category scope: pre-populate parent/subcategory cascade only
      const category = data.category;
      const parentCatId = category.parent_id || category.id;
      const subCatId = category.parent_id ? category.id : null;
      setSelectedParentCategoryId(parentCatId);
      if (subCatId) setSelectedSubCategoryId(subCatId);
      return;
    }

    // Product / Model / Variant scope: load all products, then cascade down
    let productId: number | null = null;
    let modelId: number | null = null;
    let variantCategoryId: number | null = null;

    if (data.scope_type === "variant" && data.variant) {
      productId = data.variant.productModel.product.id;
      modelId = data.variant.productModel.id;
      variantCategoryId = data.variant.categories?.[0]?.id ?? null;
    } else if (data.scope_type === "model" && data.model) {
      productId = data.model.product.id;
      modelId = data.model.id;
    } else if (data.scope_type === "product" && data.product) {
      productId = data.product.id;
    }

    await loadAllProducts();
    if (productId) setSelectedProductId(productId);

    if (
      (data.scope_type === "model" || data.scope_type === "variant") &&
      productId
    ) {
      await loadModels(productId);
      if (modelId) setSelectedModelId(modelId);
    }

    if (data.scope_type === "variant" && modelId) {
      await loadModelCategories(modelId);
      if (variantCategoryId) setSelectedVariantCategoryId(variantCategoryId);
      await loadVariants(modelId, variantCategoryId ?? undefined);
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
        formData.append(
          "max_discount_amount",
          String(data.max_discount_amount),
        );
      } else {
        formData.append("min_product_amount", "0.00");
        formData.append("max_discount_amount", "0.00");
      }
      formData.append("scope_type", data.scope_type);
      formData.append("usage_limit_total", String(data.usage_limit_total));
      formData.append(
        "usage_limit_per_user",
        String(data.usage_limit_per_user),
      );
      formData.append("start_at", data.start_at.slice(0, 10));
      formData.append("end_at", data.end_at.slice(0, 10));
      formData.append("status", data.status.toString());

      if (data.title) formData.append("title", data.title);
      if (data.title_ar) formData.append("title_ar", data.title_ar);

      if (data.scope_id) {
        formData.append("scope_id", data.scope_id.toString());
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
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset numeric fields when discount type changes
                          form.setValue("discount_value", 0);
                          form.setValue("min_product_amount", 0);
                          form.setValue("min_order_amount", 0);
                          form.setValue("max_discount_amount", 0);
                        }}
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
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            let value = parseFloat(e.target.value) || 0;
                            value = Math.max(0, value);
                            if (watchDiscountType === "percentage") {
                              value = Math.min(100, value);
                            }
                            field.onChange(value);
                          }}
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
                        <FormLabel>Minimum Product Amount * </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            value={field.value ?? ""}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const value = Math.max(
                                0,
                                parseFloat(e.target.value) || 0,
                              );
                              field.onChange(value);
                            }}
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
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              parseFloat(e.target.value) || 0,
                            );
                            field.onChange(value);
                          }}
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
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const value = Math.max(
                                0,
                                parseFloat(e.target.value) || 0,
                              );
                              field.onChange(value);
                            }}
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
                        <SelectItem value="product">Base Product</SelectItem>
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

              {/* Cascade UI — layout differs per scope_type */}
              {watchScopeType !== "common" && (
                <div className="space-y-4">
                  {/* CATEGORY scope: Parent Category → Subcategory */}
                  {watchScopeType === "category" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel>Parent Category *</FormLabel>
                        <SearchableSelect
                          options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
                          value={selectedParentCategoryId}
                          onValueChange={(val) => {
                            setSelectedParentCategoryId(val);
                            setSelectedSubCategoryId(null);
                            form.setValue("scope_id", val);
                          }}
                          placeholder="Select parent category"
                          searchPlaceholder="Search parent category..."
                          emptyText="No categories found."
                        />
                        {!selectedParentCategoryId && (
                          <p className="text-sm text-destructive">
                            Parent category is required
                          </p>
                        )}
                      </div>

                      {selectedParentCategoryId && (
                        <div className="space-y-2">
                          <FormLabel>Subcategory (Optional)</FormLabel>
                          <SearchableSelect
                            options={
                              categories
                                .find((c) => c.id === selectedParentCategoryId)
                                ?.children?.map((sub) => ({ id: sub.id, name: sub.name })) || []
                            }
                            value={selectedSubCategoryId}
                            onValueChange={(val) => {
                              setSelectedSubCategoryId(val);
                              form.setValue("scope_id", val);
                            }}
                            placeholder="Select subcategory"
                            searchPlaceholder="Search subcategory..."
                            emptyText="No subcategories found."
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* PRODUCT scope: Base Product (all products) */}
                  {watchScopeType === "product" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="scope_id"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="mb-2">Base Product *</FormLabel>
                            <FormControl>
                              <SearchableSelect
                                options={products.map((prod) => ({ id: prod.id, name: prod.title }))}
                                value={field.value}
                                onValueChange={(val) => {
                                  setSelectedProductId(val);
                                  field.onChange(val);
                                }}
                                placeholder="Select product"
                                searchPlaceholder="Search product..."
                                emptyText="No products found."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* MODEL scope: Base Product → Model */}
                  {watchScopeType === "model" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel>Base Product *</FormLabel>
                        <SearchableSelect
                          options={products.map((prod) => ({ id: prod.id, name: prod.title }))}
                          value={selectedProductId}
                          onValueChange={(val) => {
                            setSelectedProductId(val);
                            setSelectedModelId(null);
                            setModels([]);
                            form.setValue("scope_id", null);
                            if (val) loadModels(val);
                          }}
                          placeholder="Select product"
                          searchPlaceholder="Search product..."
                          emptyText="No products found."
                        />
                        {!selectedProductId && (
                          <p className="text-sm text-destructive">
                            Product is required
                          </p>
                        )}
                      </div>

                      {selectedProductId && (
                        <FormField
                          control={form.control}
                          name="scope_id"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mb-2">Model *</FormLabel>
                              <FormControl>
                                <SearchableSelect
                                  options={models.map((model) => ({ id: model.id, name: model.title }))}
                                  value={field.value}
                                  onValueChange={(val) => {
                                    setSelectedModelId(val);
                                    field.onChange(val);
                                  }}
                                  placeholder="Select model"
                                  searchPlaceholder="Search model..."
                                  emptyText="No models found."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* VARIANT scope: Base Product → Model → Category → Variant */}
                  {watchScopeType === "variant" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 1. Base Product */}
                      <div className="space-y-2">
                        <FormLabel>Base Product *</FormLabel>
                        <SearchableSelect
                          options={products.map((prod) => ({ id: prod.id, name: prod.title }))}
                          value={selectedProductId}
                          onValueChange={(val) => {
                            setSelectedProductId(val);
                            setSelectedModelId(null);
                            setSelectedVariantCategoryId(null);
                            setModels([]);
                            setVariantCategories([]);
                            setVariants([]);
                            form.setValue("scope_id", null);
                            if (val) loadModels(val);
                          }}
                          placeholder="Select product"
                          searchPlaceholder="Search product..."
                          emptyText="No products found."
                        />
                        {!selectedProductId && (
                          <p className="text-sm text-destructive">
                            Product is required
                          </p>
                        )}
                      </div>

                      {/* 2. Model */}
                      {selectedProductId && (
                        <div className="space-y-2">
                          <FormLabel>Model *</FormLabel>
                          <SearchableSelect
                            options={models.map((model) => ({ id: model.id, name: model.title }))}
                            value={selectedModelId}
                            onValueChange={(val) => {
                              setSelectedModelId(val);
                              setSelectedVariantCategoryId(null);
                              setVariantCategories([]);
                              setVariants([]);
                              form.setValue("scope_id", null);
                              if (val) loadModelCategories(val);
                            }}
                            placeholder="Select model"
                            searchPlaceholder="Search model..."
                            emptyText="No models found."
                          />
                          {!selectedModelId && (
                            <p className="text-sm text-destructive">
                              Model is required
                            </p>
                          )}
                        </div>
                      )}

                      {/* 3. Category (of model's variants) */}
                      {selectedModelId && (
                        <div className="space-y-2">
                          <FormLabel>Category *</FormLabel>
                          <SearchableSelect
                            options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
                            value={selectedVariantCategoryId}
                            onValueChange={(val) => {
                              setSelectedVariantCategoryId(val);
                              setVariants([]);
                              form.setValue("scope_id", null);
                              if (val && selectedModelId) loadVariants(selectedModelId, val);
                            }}
                            placeholder="Select category"
                            searchPlaceholder="Search category..."
                            emptyText="No categories found."
                          />
                          {!selectedVariantCategoryId && (
                            <p className="text-sm text-destructive">
                              Category is required
                            </p>
                          )}
                        </div>
                      )}

                      {/* 4. Variant */}
                      {selectedVariantCategoryId && (
                        <FormField
                          control={form.control}
                          name="scope_id"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mb-2">Variant *</FormLabel>
                              <FormControl>
                                <SearchableSelect
                                  options={variants.map((variant) => ({ id: variant.id, name: variant.title }))}
                                  value={field.value}
                                  onValueChange={(val) => {
                                    field.onChange(val);
                                  }}
                                  placeholder="Select variant"
                                  searchPlaceholder="Search variant..."
                                  emptyText="No variants found."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* scope_id validation message */}
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
                          onFocus={(e) => e.target.select()}
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
                          onFocus={(e) => e.target.select()}
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
                              field.value
                                ? new Date(
                                    field.value.length === 10
                                      ? field.value + "T00:00:00"
                                      : field.value,
                                  )
                                : undefined
                            }
                            onSelect={(date) => {
                              if (!date) {
                                field.onChange("");
                                return;
                              }
                              // Use local date to avoid UTC midnight shifting the day
                              field.onChange(
                                format(date, "yyyy-MM-dd") + "T00:00:00",
                              );
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
                              field.value
                                ? new Date(
                                    field.value.length === 10
                                      ? field.value + "T00:00:00"
                                      : field.value,
                                  )
                                : undefined
                            }
                            onSelect={(date) => {
                              if (!date) {
                                field.onChange("");
                                return;
                              }
                              // Use local date + end-of-day time to cover the full chosen day
                              field.onChange(
                                format(date, "yyyy-MM-dd") + "T23:59:59",
                              );
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
