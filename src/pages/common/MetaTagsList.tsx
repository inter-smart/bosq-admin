import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Tags } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { fetchMetaTagsList, MetaTag } from "@/services/common/metaTagsApi";
import { MetaTagsForm } from "./MetaTagsForm";


export default function MetaTagsList() {
  const [editingMetaTag, setEditingMetaTag] = useState<MetaTag | null>(null);
  const [metaTagsData, setMetaTagsData] = useState<MetaTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [reload, setReload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const pageSize = 15;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch meta tags
  useEffect(() => {
    const loadMetaTags = async () => {
      try {
        if (debouncedSearchQuery) {
          setSearching(true);
        } else {
          setIsLoading(true);
        }
        setError(null);
        const response = await fetchMetaTagsList(
          currentPage,
          pageSize,
          debouncedSearchQuery || undefined
        );
        setMetaTagsData(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
        setSearching(false);
      }
    };

    loadMetaTags();
  }, [currentPage, debouncedSearchQuery, reload]);

  const columns: ColumnDef<MetaTag>[] = [
    {
      accessorKey: "page",
      header: "Page",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("page")}</div>
      ),
    },
    {
      accessorKey: "meta_title",
      header: "Meta Title",
      cell: ({ row }) => (
        <div
          className="max-w-[250px] truncate"
          title={row.getValue("meta_title")}
        >
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
        <div
          className="max-w-[300px] truncate"
          title={row.getValue("meta_description")}
        >
          {row.getValue("meta_description")}
        </div>
      ),
    },
    {
      accessorKey: "meta_keywords",
      header: "Keywords",
      enableHiding: true,
      meta: { defaultVisible: false },
      cell: ({ row }) => (
        <div
          className="max-w-[200px] truncate"
          title={row.getValue("meta_keywords")}
        >
          {row.getValue("meta_keywords")}
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
          onClick={() => setEditingMetaTag(row.original)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      ),
    },
  ];

  const handleEditComplete = () => {
    setEditingMetaTag(null);
    setCurrentPage(1); // Reset to first page and reload
    setReload((prev) => !prev); // 👈 Trigger reload
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Tags className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Meta Tags</h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">
              Error loading meta tags: {error.message}
            </p>
            <Button onClick={() => setCurrentPage(1)} className="mt-4">
              Try Again
            </Button>
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
              <h1 className="text-2xl font-bold">Meta Tags</h1>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={metaTagsData}
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
            searchPlaceholder="Search by page, title, description, or keywords..."
          />
        </CardContent>
      </Card>

      {editingMetaTag && (
        <MetaTagsForm
          metaTag={editingMetaTag}
          onClose={() => setEditingMetaTag(null)}
          onSuccess={handleEditComplete}
        />
      )}
    </div>
  );
};
