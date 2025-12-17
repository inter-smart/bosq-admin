import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  fetchErgonomicsChairFeatureList,
  deleteErgonomicsChairFeature,
  ErgonomicsChairFeature,
} from "@/services/cms/ergonomic-guide/ergonomicsFeaturesApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function ErgonomicsChairFeatureList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [features, setFeatures] = useState<ErgonomicsChairFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
    useCommonTableActions<ErgonomicsChairFeature>({
      modelName: "ErgonomicFeatures",
      data: features,
      setData: setFeatures,
    });

  /* =======================
     Debounce Search
  ======================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadFeatures();
  }, [currentPage, pageSize, debouncedSearchQuery]);

  /* =======================
     Data Load
  ======================= */
  const loadFeatures = async () => {
    try {
      debouncedSearchQuery ? setSearching(true) : setLoading(true);

      const response = await fetchErgonomicsChairFeatureList(
        currentPage,
        pageSize,
        debouncedSearchQuery
      );

      if (response.success) {
        setFeatures(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load ergonomics chair features",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  /* =======================
     Delete
  ======================= */
  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteErgonomicsChairFeature(deleteItemId);
      setFeatures((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Feature deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete feature",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  /* =======================
     Columns
  ======================= */
  const columns: ColumnDef<ErgonomicsChairFeature>[] = [
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
      accessorKey: "media_path",
      header: "Image",
      cell: ({ row }) => {
        const mediaPath = row.getValue("media_path") as string;
        return mediaPath ? (
          <img
            src={`${import.meta.env.VITE_IMAGE_URL}/${mediaPath}`}
            alt={row.original.media_alt || "Feature"}
            className="h-10 w-10 object-cover rounded"
          />
        ) : (
          <div className="text-sm text-muted-foreground">No image</div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        const plainText = description?.replace(/<[^>]*>/g, "") || "";
        return (
          <div className="max-w-[250px] truncate text-sm text-muted-foreground">
            {plainText || "No description"}
          </div>
        );
      },
    },
    {
      accessorKey: "sort_order",
      header: "Sort Order",
      enableSorting: true,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Input
            type="number"
            value={
              editingSortOrder[item.id!] !== undefined
                ? editingSortOrder[item.id!]
                : row.getValue("sort_order") || 0
            }
            onChange={(e) => handleSortOrderChange(item.id!, e.target.value)}
            className="w-20"
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
      enableSorting: true,
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
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/ergonomic-chair-features/edit/${item.id}`)
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
  ];

  /* =======================
     Render
  ======================= */
  return (
    <>
      <DataTable
        columns={columns}
        data={features}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searching={searching}
        pagination={{
          currentPage,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
        title="Ergonomics Chair Features"
        searchPlaceholder="Search features..."
        onAdd={() => navigate("/ergonomic-chair-features/create")}
        addButtonText="Add Feature"
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={() => setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              feature.
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
