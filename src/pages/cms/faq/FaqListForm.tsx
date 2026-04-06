import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchFaqListById,
  createFaqList,
  updateFaqList,
  FaqList,
  getDropdown,
  getFaqModelsDropdown,
  getFaqCategoriesDropdown,
  getFaqVariantsDropdown,
} from "@/services/cms/faq/faqListApi";
import { Switch } from "@/components/ui/switch";
import { FaqListFormData, faqListSchema } from "@/schemas/faqSchema";
import { RichTextEditor } from "@/components/common/RichTextEditor";

export default function FaqListForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // General FAQ category dropdown
  const [categories, setCategories] = useState<Array<{ id: number; title: string }>>([]);

  // Cascade: base products
  const [baseProducts, setBaseProducts] = useState<Array<{ id: number; title: string }>>([]);
  // Cascade: models (loaded when base product selected)
  const [models, setModels] = useState<Array<{ id: number; title: string; title_ar: string; slug: string }>>([]);
  // Cascade: categories for variants of model
  const [variantCategories, setVariantCategories] = useState<Array<{ id: number; name: string; name_ar: string; slug: string }>>([]);
  // Cascade: variants (filtered by model + optional category)
  const [variants, setVariants] = useState<Array<{ id: number; title: string; title_ar: string; sku: string; design_title: string; design_title_ar: string }>>([]);

  // Cascade selection state
  const [selectedBaseId, setSelectedBaseId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Display name for current variant in edit mode
  const [currentVariantTitle, setCurrentVariantTitle] = useState<string>("");

  // Prevents cascade effects from clearing product_variant_id during edit initialization
  const isInitializingRef = useRef(false);

  const form = useForm<FaqListFormData>({
    resolver: zodResolver(faqListSchema),
    defaultValues: {
      question: "",
      question_ar: "",
      answer: "",
      answer_ar: "",
      type: "general",
      faq_category_id: undefined,
      product_variant_id: undefined,
      sort_order: 1,
      status: true,
    },
  });

  const selectedType = form.watch("type");

  useEffect(() => {
    loadDropdownData();
    if (isEditing && id) {
      loadFaqData(parseInt(id));
    }
  }, [id, isEditing]);

  // Load models when base product changes
  useEffect(() => {
    if (selectedBaseId) {
      if (!isInitializingRef.current) {
        setModels([]);
        setVariantCategories([]);
        setVariants([]);
        setSelectedModelId(null);
        setSelectedCategoryId(null);
        form.setValue("product_variant_id", undefined);

        getFaqModelsDropdown(selectedBaseId).then((res) => {
          if (res.success) setModels(res.data.models);
        }).catch(() => {});
      }
    }
  }, [selectedBaseId]);

  // Load variant categories when model changes
  useEffect(() => {
    if (selectedModelId) {
      if (!isInitializingRef.current) {
        setVariantCategories([]);
        setVariants([]);
        setSelectedCategoryId(null);
        form.setValue("product_variant_id", undefined);

        Promise.all([
          getFaqCategoriesDropdown(selectedModelId),
          getFaqVariantsDropdown(selectedModelId),
        ]).then(([catRes, varRes]) => {
          if (catRes.success) setVariantCategories(catRes.data.categories);
          if (varRes.success) setVariants(varRes.data.variants);
        }).catch(() => {});
      }
    }
  }, [selectedModelId]);

  // Reload variants when category filter changes
  useEffect(() => {
    if (selectedModelId && !isInitializingRef.current) {
      setVariants([]);
      form.setValue("product_variant_id", undefined);

      getFaqVariantsDropdown(selectedModelId, selectedCategoryId ?? undefined).then((res) => {
        if (res.success) setVariants(res.data.variants);
      }).catch(() => {});
    }
  }, [selectedCategoryId]);

  // Reset initialization flag after cascade pre-population effects have run
  // Must be placed AFTER the cascade effects so it executes last in the same render cycle
  useEffect(() => {
    if (isInitializingRef.current && selectedBaseId && selectedModelId) {
      isInitializingRef.current = false;
    }
  }, [selectedBaseId, selectedModelId]);

  const loadDropdownData = async () => {
    try {
      const response = await getDropdown();
      setCategories(response.data.categories);
      setBaseProducts(response.data.products);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dropdown data",
        variant: "destructive",
      });
    }
  };

  const loadFaqData = async (itemId: number) => {
    try {
      setInitialLoading(true);
      const response = await fetchFaqListById(itemId);
      const data = response.data;

      if (data) {
        form.reset({
          question: data.question || "",
          question_ar: data.question_ar || "",
          answer: data.answer || "",
          answer_ar: data.answer_ar || "",
          type: data.type || "general",
          faq_category_id: data.faq_category_id || undefined,
          product_variant_id: data.product_variant_id || undefined,
          sort_order: data.sort_order || 0,
          status: data.status ?? true,
        });

        if (data.type === "product" && data.product_variant) {
          setCurrentVariantTitle(data.product_variant.title);

          const modelId = data.product_variant.product_model_id;
          const baseId = data.product_variant.productModel?.product_id;

          if (baseId && modelId) {
            // Set flag BEFORE state updates so cascade effects see it and skip clearing
            isInitializingRef.current = true;

            const [modelsRes, catRes, varRes] = await Promise.all([
              getFaqModelsDropdown(baseId),
              getFaqCategoriesDropdown(modelId),
              getFaqVariantsDropdown(modelId),
            ]);

            if (modelsRes.success) setModels(modelsRes.data.models);
            if (catRes.success) setVariantCategories(catRes.data.categories);
            if (varRes.success) setVariants(varRes.data.variants);

            // Triggers cascade effects (blocked by isInitializingRef)
            setSelectedBaseId(baseId);
            setSelectedModelId(modelId);

            // Re-affirm form value after all state updates
            form.setValue("product_variant_id", data.product_variant_id);
            // isInitializingRef is cleared by the "clear init flag" effect
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load FAQ data",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: FaqListFormData) => {
    try {
      setLoading(true);

      const payload: FaqList = {
        question: data.question,
        question_ar: data.question_ar,
        answer: data.answer.toString(),
        answer_ar: data.answer_ar?.toString(),
        type: data.type,
        faq_category_id: data.type === "general" ? data.faq_category_id : undefined,
        product_variant_id: data.type === "product" ? data.product_variant_id : undefined,
        sort_order: data.sort_order,
        status: data.status,
      };

      if (isEditing && id) {
        await updateFaqList(parseInt(id), payload);
        toast({ title: "Success", description: "FAQ updated successfully" });
      } else {
        await createFaqList(payload);
        toast({ title: "Success", description: "FAQ created successfully" });
      }

      navigate("/faq-list");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} FAQ`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading FAQ data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/faq-list")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit" : "Add"} FAQ</h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} FAQ item</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FAQ Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* English Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter FAQ question" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                          <RichTextEditor placeholder="Enter FAQ answer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Arabic Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="question_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل سؤال الأسئلة الشائعة" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="answer_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer (AR)</FormLabel>
                        <FormControl>
                          <RichTextEditor placeholder="أدخل إجابة الأسئلة الشائعة" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Type and Category/Product Fields */}
              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value === "general") {
                            form.setValue("product_variant_id", undefined);
                            form.clearErrors("product_variant_id");
                            setSelectedBaseId(null);
                            setSelectedModelId(null);
                            setSelectedCategoryId(null);
                          } else {
                            form.setValue("faq_category_id", undefined);
                            form.clearErrors("faq_category_id");
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedType === "general" && (
                  <FormField
                    control={form.control}
                    name="faq_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value ? String(field.value) : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={String(category.id)}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedType === "product" && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground">Select Product Variant</p>

                    {/* Step 1: Base Product */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Base Product</label>
                      <Select
                        onValueChange={(value) => setSelectedBaseId(parseInt(value))}
                        value={selectedBaseId ? String(selectedBaseId) : ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select base product" />
                        </SelectTrigger>
                        <SelectContent>
                          {baseProducts.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Step 2: Model */}
                    {selectedBaseId && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Model</label>
                        <Select
                          onValueChange={(value) => setSelectedModelId(parseInt(value))}
                          value={selectedModelId ? String(selectedModelId) : ""}
                          disabled={models.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={models.length === 0 ? "Loading..." : "Select model"} />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map((m) => (
                              <SelectItem key={m.id} value={String(m.id)}>
                                {m.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Step 3: Category (optional filter) */}
                    {selectedModelId && variantCategories.length > 0 && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Category (Optional)</label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedCategoryId(value === "all" ? null : parseInt(value))
                          }
                          value={selectedCategoryId ? String(selectedCategoryId) : "all"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {variantCategories.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Step 4: Variant */}
                    {selectedModelId && (
                      <FormField
                        control={form.control}
                        name="product_variant_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              value={field.value ? String(field.value) : ""}
                              disabled={variants.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={variants.length === 0 ? "Loading..." : "Select variant"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {variants.map((v) => (
                                  <SelectItem key={v.id} value={String(v.id)}>
                                    {v.title} — {v.sku}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Edit mode: show current variant if cascade not yet used */}
                    {isEditing && currentVariantTitle && !selectedModelId && (
                      <div className="text-sm text-muted-foreground">
                        Current variant: <span className="font-medium text-foreground">{currentVariantTitle}</span>
                        <span className="ml-2">(use cascade above to change)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ Settings</CardTitle>
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
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
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
                        <FormDescription>Enable or disable this FAQ</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/faq-list")}>
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
