import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Edit, Tags, Download, UploadCloud } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import {
  fetchProductVariantMetaList,
  ProductVariantMeta,
} from "@/services/product/productVariantMetaApi";
import { MetaExportDialog, MetaUploadDialog } from "./ProductVariantMetaBulkDialogs";

export default function ProductVariantMetaList() {
  const navigate = useNavigate();
  const [metaData, setMetaData] = useState<ProductVariantMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (debouncedSearchQuery) {
          setSearching(true);
        } else {
          setIsLoading(true);
        }
        setError(null);
        const response = await fetchProductVariantMetaList(
          currentPage,
          pageSize,
          debouncedSearchQuery || undefined
        );
        setMetaData(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
        setSearching(false);
      }
    };
    loadData();
  }, [currentPage, debouncedSearchQuery, refreshKey]);

  const columns: ColumnDef<ProductVariantMeta>[] = [
    {
      accessorKey: "product_title",
      header: "Product Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("product_title")}</div>
      ),
    },
    {
      accessorKey: "product_slug",
      header: "Slug",
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate" title={row.getValue("product_slug")}>
          {row.getValue("product_slug")}
        </div>
      ),
    },
    {
      accessorKey: "meta_title",
      header: "Meta Title",
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate" title={row.getValue("meta_title")}>
          {row.getValue("meta_title")}
        </div>
      ),
    },
    {
      accessorKey: "meta_description",
      header: "Meta Description",
      enableHiding: true,
      meta: { defaultVisible: false },
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate" title={row.getValue("meta_description")}>
          {row.getValue("meta_description")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/product-variant-meta-tags/${row.original.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Tags className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Variant Meta Tags</h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Error loading variant meta tags: {error.message}</p>
            <Button onClick={() => setCurrentPage(1)} className="mt-4">Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tags className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Variant Meta Tags</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
                <Download className="h-4 w-4 mr-1" />
                Download Sheet
              </Button>
              <Button variant="outline" size="sm" onClick={() => setUploadDialogOpen(true)}>
                <UploadCloud className="h-4 w-4 mr-1" />
                Bulk Upload
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={metaData}
            loading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searching={searching}
            pagination={{
              totalCount,
              totalPages: Math.ceil(totalCount / pageSize),
              currentPage,
              pageSize,
              onPageChange: setCurrentPage,
            }}
            searchPlaceholder="Search by product title, slug, or meta tags..."
          />
        </CardContent>
      </Card>

      <MetaExportDialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} />
      <MetaUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onCompleted={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
