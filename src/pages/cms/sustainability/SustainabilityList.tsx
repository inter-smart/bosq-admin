import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

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

import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import {
  fetchSustainabilityList,
  deleteSustainability,
  SustainabilityItem,
} from "@/services/cms/sustainablility/sustainabilityApi";

import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import { renderHTML } from "@/lib/utils";

export default function SustainabilityList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ===================== STATE =====================
  const [items, setItems] = useState<SustainabilityItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // ===================== COMMON ACTIONS =====================
  const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
    useCommonTableActions<SustainabilityItem>({
      modelName: "TwoImage",
      data: items,
      setData: setItems,
    });

  // ===================== DEBOUNCE SEARCH =====================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ===================== FETCH DATA =====================
  const loadItems = useCallback(async () => {
    try {
      setIsFetching(true);

      const response = await fetchSustainabilityList(
        currentPage,
        pageSize,
        debouncedSearchQuery || undefined
      );

      setItems(response.data.list);
      setTotalCount(response.data.pagination.totalCount);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load sustainability items",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  }, [currentPage, pageSize, debouncedSearchQuery, toast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // ===================== DELETE =====================
  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteSustainability(deleteItemId);
      setItems((prev) => prev.filter((item) => item.id !== deleteItemId));

      toast({
        title: "Success",
        description: "Sustainability item deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete sustainability item",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  // ===================== COLUMNS =====================
  const columns = useMemo<ColumnDef<SustainabilityItem>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {(currentPage - 1) * pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "img1_path",
      header: "Images",
      cell: ({ row }) => {
        const img1 = row.original.img1_path;
        const img2 = row.original.img2_path;

        const imageUrl1 = img1
          ? `${import.meta.env.VITE_IMAGE_URL}/${img1}`
          : null;
        const imageUrl2 = img2
          ? `${import.meta.env.VITE_IMAGE_URL}/${img2}`
          : null;

        return (
          <div className="flex gap-1">
            {[imageUrl1, imageUrl2].map(
              (src, idx) =>
                src && (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-md bg-muted overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`Image ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  </div>
                )
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium truncate max-w-[200px]">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[300px] text-sm text-muted-foreground truncate">
          {renderHTML(row.getValue("description"))}
        </div>
      ),
    },
    {
      accessorKey: "sort_order",
      header: "Sort Order",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Input
            type="number"
            className="w-20"
            value={
              editingSortOrder[item.id!] ??
              row.getValue("sort_order") ??
              0
            }
            onChange={(e) =>
              handleSortOrderChange(item.id!, e.target.value)
            }
          />
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
              onCheckedChange={() =>
                handleStatusChange(item.id!, status)
              }
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
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/sustainability/${item.id}/edit`)
                }
              >
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
  ], [currentPage, pageSize, editingSortOrder]);

  // ===================== RENDER =====================
  if (isFetching && !items.length) {
    return <div>Loading sustainability items...</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        loading={isFetching}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searching={!!debouncedSearchQuery && isFetching}
        pagination={{
          currentPage,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
        title="Sustainability Items"
        searchPlaceholder="Search sustainability items..."
        onAdd={() => navigate("/sustainability/create")}
        addButtonText="Add Item"
      />

      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={() => setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
