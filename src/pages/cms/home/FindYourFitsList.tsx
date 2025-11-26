import { useState, useEffect } from "react";
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
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import {
  fetchFindYourFitsList,
  deleteFindYourFit,
  FindYourFit,
} from "@/services/cms/home/findYourFitsApi";
import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function FindYourFitsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fitItems, setFitItems] = useState<FindYourFit[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const {
    editingSortOrder,
    handleStatusChange,
    handleSortOrderChange,
  } = useCommonTableActions<FindYourFit>({
    modelName: "FindYourFits",
    data: fitItems,
    setData: setFitItems,
  });

  useEffect(() => {
    loadFitItems();
  }, []);

  const loadFitItems = async () => {
    try {
      setLoading(true);
      const response = await fetchFindYourFitsList(1, 100);
      setFitItems(response.data.list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Find Your Fits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteFindYourFit(deleteItemId);
      setFitItems((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Find Your Fit deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Find Your Fit",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const columns: ColumnDef<FindYourFit>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "media_path",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="w-20 h-16 rounded-md bg-muted flex items-center justify-center">
            {row.getValue("media_path") ? (
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${row.getValue(
                  "media_path"
                )}`}
                alt={row.original.media_alt || row.original.title}
                className="w-full h-full rounded object-cover"
              />
            ) : (
              <div className="w-full h-full rounded bg-muted-foreground/20" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">
            {row.getValue("title")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => {
        const link = row.getValue("link") as string;
        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <ExternalLink className="h-3 w-3" />
            Link
          </a>
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
        return (
          <Input
            type="number"
            value={
              editingSortOrder[item.id!] !== undefined
                ? editingSortOrder[item.id!]
                : row.getValue("sort_order") || 0
            }
            onChange={(e) =>
              handleSortOrderChange(item.id!, e.target.value)
            }
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
                onClick={() => navigate(`/find-your-fits/edit/${item.id}`)}
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
    return <div>Loading Find Your Fits...</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={fitItems}
        title="Find Your Fits"
        searchPlaceholder="Search items..."
        onAdd={() => navigate("/find-your-fits/create")}
        addButtonText="Add Fits"
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
              Find Your Fit item and remove its data from the servers.
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