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
  fetchFaqCategoryList,
  deleteFaqCategory,
  FaqCategory,
  updateFaqCategory,
} from "@/services/cms/faq/faqCategoryApi";
import { useToast } from "@/hooks/use-toast";

export default function FaqCategoryList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [statusToggleItem, setStatusToggleItem] = useState<{
    id: number;
    newStatus: boolean;
  } | null>(null);
  const [editingSortOrder, setEditingSortOrder] = useState<{
    [key: number]: string;
  }>({});
  const [updateTimeouts, setUpdateTimeouts] = useState<{
    [key: number]: NodeJS.Timeout;
  }>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchFaqCategoryList(1, 100);

      console.log(response.data);

      setCategories(response.data.list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load FAQ categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmStatusToggle = async () => {
    if (!statusToggleItem) return;

    try {
      const { id, newStatus } = statusToggleItem;
      const formData = new FormData();
      formData.append("status", String(newStatus));

      await updateFaqCategory(id, formData);

      setCategories((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: statusToggleItem.newStatus }
            : item
        )
      );

      toast({
        title: "Success",
        description: "Category status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category status",
        variant: "destructive",
      });
    } finally {
      setStatusToggleItem(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteFaqCategory(deleteItemId);
      setCategories((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleSortOrderChange = (id: number, value: string) => {
    setEditingSortOrder((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (updateTimeouts[id]) {
      clearTimeout(updateTimeouts[id]);
    }

    const timeoutId = setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append("sort_order", value);

        await updateFaqCategory(id, formData);

        setCategories((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, sort_order: parseInt(value) } : item
          )
        );

        toast({
          title: "Success",
          description: "Sort order updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update sort order",
          variant: "destructive",
        });
      }
    }, 1000);

    setUpdateTimeouts((prev) => ({
      ...prev,
      [id]: timeoutId,
    }));
  };

  const columns: ColumnDef<FaqCategory>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px] truncate">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "sort_order",
      header: "Sort Order",
      cell: ({ row }) => {
        const id = row.original.id!;
        const currentValue =
          editingSortOrder[id] !== undefined
            ? editingSortOrder[id]
            : String(row.getValue("sort_order") || 0);

        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => handleSortOrderChange(id, e.target.value)}
            className="w-20 h-8"
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;
        return (
          <Badge variant={status ? "default" : "secondary"}>
            {status ? "active" : "inactive"}
          </Badge>
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
              <DropdownMenuItem
                onClick={() => navigate(`/faq-category/edit/${item.id}`)}
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

  if (loading) {
    return <div>Loading FAQ categories...</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        title="FAQ Categories"
        searchPlaceholder="Search categories..."
        onAdd={() => navigate("/faq-category/create")}
        addButtonText="Add Category"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={() => setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and remove its data from the servers.
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

      {/* Status Toggle Confirmation Dialog */}
      <AlertDialog
        open={!!statusToggleItem}
        onOpenChange={() => setStatusToggleItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {statusToggleItem?.newStatus ? "activate" : "deactivate"} this
              category?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusToggle}>
              {statusToggleItem?.newStatus ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
