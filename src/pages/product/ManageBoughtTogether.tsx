import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, XCircle, ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  fetchBoughtTogether,
  syncBoughtTogether,
  fetchProductVariantList,
  ProductVariant,
} from "@/services/product/productVariantApi";
import { fetchBaseProductList, BaseProduct } from "@/services/product/baseProductApi";
import { fetchProductModelList, ProductModel } from "@/services/product/productModelApi";
import { fetchProductCategoryList, ProductCategory } from "@/services/product/productCategoriesApi";

export default function ManageBoughtTogether() {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Current variant info
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);
  const [loadingCurrent, setLoadingCurrent] = useState(true);

  // Selected related variant IDs
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  // Filter state
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);
  const [models, setModels] = useState<ProductModel[]>([]);
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [selectedModelId, setSelectedModelId] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Variant list state
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loadingList, setLoadingList] = useState(false);
  const requestIdRef = useRef(0);

  // Load filter options on mount
  useEffect(() => {
    fetchBaseProductList(1, 100).then((r) => r.success && setBaseProducts(r.data.list));
    fetchProductCategoryList(1, 200).then((r) => r.success && setAllCategories(r.data.list));
  }, []);

  // Load models when base product changes
  useEffect(() => {
    setSelectedModelId("all");
    setCurrentPage(1);
    if (selectedProductId !== "all") {
      fetchProductModelList(1, 100, undefined, parseInt(selectedProductId)).then(
        (r) => r.success && setModels(r.data.list),
      );
    } else {
      setModels([]);
    }
  }, [selectedProductId]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedModelId, selectedCategoryId]);

  // Load current variant + its existing bought-together selections
  useEffect(() => {
    if (!variantId) return;
    setLoadingCurrent(true);
    fetchBoughtTogether(parseInt(variantId))
      .then((r) => {
        if (r.success) {
          setCurrentVariant(r.data);
          const ids = new Set<number>(
            (r.data.boughtTogetherVariants ?? []).map((v: ProductVariant) => v.id as number),
          );
          setSelectedIds(ids);
        }
      })
      .finally(() => setLoadingCurrent(false));
  }, [variantId]);

  // Load filtered variant list (excluding self)
  useEffect(() => {
    if (!variantId) return;
    const requestId = ++requestIdRef.current;
    setLoadingList(true);

    fetchProductVariantList(
      currentPage,
      pageSize,
      debouncedSearch,
      selectedModelId === "all" ? undefined : parseInt(selectedModelId),
      selectedProductId === "all" ? undefined : parseInt(selectedProductId),
      selectedCategoryId === "all" ? undefined : parseInt(selectedCategoryId),
    )
      .then((r) => {
        if (requestId !== requestIdRef.current) return;
        if (r.success) {
          // Exclude self from list
          const filtered = r.data.list.filter((v) => v.id !== parseInt(variantId));
          setVariants(filtered);
          setTotalCount(r.data.pagination.totalCount);
        }
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        toast({ title: "Error", description: "Failed to load variants", variant: "destructive" });
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoadingList(false);
      });
  }, [currentPage, debouncedSearch, selectedProductId, selectedModelId, selectedCategoryId, variantId]);

  const toggleVariant = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!variantId) return;
    setSaving(true);
    try {
      await syncBoughtTogether(parseInt(variantId), Array.from(selectedIds));
      toast({ title: "Saved", description: "Bought together variants updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Manage Bought Together
          </h1>
          {loadingCurrent ? (
            <p className="text-muted-foreground text-sm mt-1">Loading variant info…</p>
          ) : currentVariant ? (
            <p className="text-muted-foreground text-sm mt-1">
              <span className="font-medium text-foreground">
                {currentVariant.productModel?.product?.title} — {currentVariant.productModel?.title}
              </span>
              {currentVariant.sku && (
                <span className="ml-2 font-mono text-xs">({currentVariant.sku})</span>
              )}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{selectedIds.size} selected</Badge>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center p-4 border rounded-lg bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground mr-1">Filter:</span>

        {/* Category */}
        <div className="flex items-center gap-1">
          <div className="w-44">
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories
                  .filter((c) => !c.parent_id)
                  .map((parent) => {
                    const children = allCategories.filter((c) => c.parent_id === parent.id);
                    return [
                      <SelectItem key={parent.id} value={parent.id!.toString()}>
                        {parent.name}
                      </SelectItem>,
                      ...children.map((child) => (
                        <SelectItem key={child.id} value={child.id!.toString()}>
                          &nbsp;&nbsp;↳ {child.name}
                        </SelectItem>
                      )),
                    ];
                  })}
              </SelectContent>
            </Select>
          </div>
          {selectedCategoryId !== "all" && (
            <Button variant="ghost" size="icon" onClick={() => setSelectedCategoryId("all")}>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Base Product */}
        <div className="flex items-center gap-1">
          <div className="w-48">
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Base Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {baseProducts.map((p) => (
                  <SelectItem key={p.id} value={p.id!.toString()}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedProductId !== "all" && (
            <Button variant="ghost" size="icon" onClick={() => { setSelectedProductId("all"); setSelectedModelId("all"); }}>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Model */}
        <div className="flex items-center gap-1">
          <div className="w-44">
            <Select
              value={selectedModelId}
              onValueChange={setSelectedModelId}
              disabled={selectedProductId === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id!.toString()}>
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedModelId !== "all" && (
            <Button variant="ghost" size="icon" onClick={() => setSelectedModelId("all")}>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by SKU or title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Variant list */}
      <div className="border rounded-lg overflow-hidden">
        {loadingList ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading variants…
          </div>
        ) : variants.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
            No variants found. Try adjusting the filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="w-12 px-4 py-3 text-left"></th>
                <th className="px-4 py-3 text-left font-medium">Base Product / Model</th>
                <th className="px-4 py-3 text-left font-medium">SKU</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Categories</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => {
                const checked = selectedIds.has(v.id!);
                return (
                  <tr
                    key={v.id}
                    className={`border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/30 ${checked ? "bg-primary/5" : ""}`}
                    onClick={() => toggleVariant(v.id!)}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleVariant(v.id!)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium truncate max-w-[200px]">
                        {v.productModel?.product?.title || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {v.productModel?.title || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{v.sku || "—"}</td>
                    <td className="px-4 py-3">{v.price || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(v.categories ?? []).slice(0, 2).map((cat) => (
                          <Badge key={cat.id} variant="outline" className="text-xs font-normal">
                            {cat.name}
                          </Badge>
                        ))}
                        {(v.categories ?? []).length > 2 && (
                          <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                            +{(v.categories ?? []).length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {currentPage} of {totalPages} ({totalCount} variants)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
