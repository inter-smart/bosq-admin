import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  fetchFaqListList,
  deleteFaqList,
  FaqList,
  getDropdown,
  getFaqModelsDropdown,
  getFaqVariantsDropdown,
} from "@/services/cms/faq/faqListApi";
import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import { Switch } from "@/components/ui/switch";
import { renderHTML } from "@/lib/utils";

export default function ProductFaqList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [faqItems, setFaqItems] = useState<FaqList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  // Filter state
  const [baseProducts, setBaseProducts] = useState<{ id: number; title: string }[]>([]);
  const [models, setModels] = useState<{ id: number; title: string; title_ar: string; slug: string }[]>([]);
  const [variants, setVariants] = useState<{ id: number; title: string; title_ar: string; sku: string; design_title: string; design_title_ar: string }[]>([]);

  const [selectedBase, setSelectedBase] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedVariant, setSelectedVariant] = useState<string>("all");

  // Pagination & search
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
    useCommonTableActions<FaqList>({
      modelName: "FaqList",
      data: faqItems,
      setData: setFaqItems,
    });

  // Load base products on mount
  useEffect(() => {
    loadBaseProducts();
  }, []);

  // Cascade: load models when base changes
  useEffect(() => {
    setSelectedModel("all");
    setSelectedVariant("all");
    setModels([]);
    setVariants([]);
    if (selectedBase !== "all") {
      loadModels(parseInt(selectedBase, 10));
    }
  }, [selectedBase]);

  // Cascade: load variants when model changes
  useEffect(() => {
    setSelectedVariant("all");
    setVariants([]);
    if (selectedModel !== "all") {
      loadVariants(parseInt(selectedModel, 10));
    }
  }, [selectedModel]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedBase, selectedModel, selectedVariant]);

  // Reload list on dependency change
  useEffect(() => {
    loadFaqItems();
  }, [currentPage, pageSize, debouncedSearchQuery, selectedBase, selectedModel, selectedVariant]);

  const loadBaseProducts = async () => {
    try {
      const response = await getDropdown();
      setBaseProducts(response?.data?.products || []);
    } catch {
      toast({ title: "Error", description: "Failed to load base products", variant: "destructive" });
    }
  };

  const loadModels = async (baseId: number) => {
    try {
      const response = await getFaqModelsDropdown(baseId);
      setModels(response?.data?.models || []);
    } catch {
      toast({ title: "Error", description: "Failed to load models", variant: "destructive" });
    }
  };

  const loadVariants = async (modelId: number) => {
    try {
      const response = await getFaqVariantsDropdown(modelId);
      setVariants(response?.data?.variants || []);
    } catch {
      toast({ title: "Error", description: "Failed to load variants", variant: "destructive" });
    }
  };

  const loadFaqItems = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const baseParam = selectedBase !== "all" ? parseInt(selectedBase, 10) : undefined;
      const modelParam = selectedModel !== "all" ? parseInt(selectedModel, 10) : undefined;
      const variantParam = selectedVariant !== "all" ? parseInt(selectedVariant, 10) : undefined;

      const response = await fetchFaqListList(
        currentPage,
        pageSize,
        debouncedSearchQuery || undefined,
        undefined,       // faq_category
        "product",       // always product type
        variantParam,    // product_variant (most specific — overrides model/base on server)
        variantParam ? undefined : baseParam,  // base_id (only if no specific variant)
        variantParam ? undefined : modelParam  // model_id (only if no specific variant)
      );

      setFaqItems(response.data.list);
      setTotalCount(response.data.pagination.totalCount);
    } catch {
      toast({ title: "Error", description: "Failed to load product FAQs", variant: "destructive" });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;
    try {
      await deleteFaqList(deleteItemId);
      setFaqItems((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({ title: "Success", description: "FAQ deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete FAQ", variant: "destructive" });
    } finally {
      setDeleteItemId(null);
    }
  };

  const clearFilters = () => {
    setSelectedBase("all");
    setSelectedModel("all");
    setSelectedVariant("all");
  };

  const hasActiveFilters =
    selectedBase !== "all" || selectedModel !== "all" || selectedVariant !== "all";

  const columns: ColumnDef<FaqList>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {(currentPage - 1) * pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <div className="font-medium max-w-[250px] truncate">
          {row.getValue("question")}
        </div>
      ),
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
          {renderHTML(row.getValue("answer"))}
        </div>
      ),
    },
    {
      accessorKey: "product_variant",
      header: "Variant",
      cell: ({ row }) => {
        const variant = row.original.product_variant;
        return variant ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium truncate max-w-[160px]">{variant.title}</span>
            <Badge variant="outline" className="w-fit text-xs">{variant.sku}</Badge>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "sort_order",
      header: "Sort Order",
      enableSorting: true,
      cell: ({ row }) => {
        const item = row.original;
        const currentVal =
          editingSortOrder[item.id!] !== undefined
            ? editingSortOrder[item.id!]
            : String(row.getValue("sort_order") || 1);
        const numVal = Math.max(1, parseInt(currentVal, 10) || 1);
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleSortOrderChange(item.id!, String(Math.max(1, numVal - 1)))}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min={1}
              value={currentVal}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                if (!isNaN(num) && num >= 1) {
                  handleSortOrderChange(item.id!, String(num));
                }
              }}
              className="w-14 h-7 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleSortOrderChange(item.id!, String(numVal + 1))}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const item = row.original;
        const status = row.getValue("status") as boolean;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={status}
              onCheckedChange={() => handleStatusChange(item.id!, status)}
            />
            <Badge variant={status ? "default" : "secondary"}>
              {status ? "active" : "inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/faq-list/edit/${item.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteItemId(item.id!)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {/* Cascading Filters */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Base Product */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Base Product
            </label>
            <Select value={selectedBase} onValueChange={setSelectedBase}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {baseProducts.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model (only when base selected) */}
          {selectedBase !== "all" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Model
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  {models.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Variant (only when model selected) */}
          {selectedModel !== "all" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Variant
              </label>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="All Variants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Variants</SelectItem>
                  {variants.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.title} ({v.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground invisible">
                Clear
              </label>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <DataTable
          columns={columns}
          data={faqItems}
          loading={loading}
          searching={searching}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          pagination={{
            currentPage,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
          }}
          title="Product FAQs"
          searchPlaceholder="Search product FAQs..."
          onAdd={() => navigate("/faq-list/create")}
          addButtonText="Add FAQ"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FAQ
              and remove its data from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
