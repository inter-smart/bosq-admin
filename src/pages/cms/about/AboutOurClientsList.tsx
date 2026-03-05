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
import { MoreHorizontal, Edit, Trash2, ChevronDown, ChevronUp} from "lucide-react";
import {
  fetchAboutOurClientsById,
  fetchAboutOurClientsList,
  deleteAboutOurClients,
  AboutOurClients,
} from "@/services/cms/about/aboutOurClientsApi";
import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function AboutOurClientsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientItems, setclientItems] = useState<AboutOurClients[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const {
    editingSortOrder,
    handleStatusChange,
    handleSortOrderChange,
  } = useCommonTableActions<AboutOurClients>({
    modelName: "AboutOurClients",
    data: clientItems,
    setData: setclientItems,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadclientItems();
  }, [currentPage, pageSize, debouncedSearchQuery]);

  const loadclientItems = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchAboutOurClientsList(
        currentPage,
        pageSize,
        debouncedSearchQuery
      );

      if (response.success) {
        setclientItems(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load About Our Clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteAboutOurClients(deleteItemId);
      setclientItems((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "client deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const columns: ColumnDef<AboutOurClients>[] = [
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
      header: "Logo",
      cell: ({ row }) => {
        return (
          <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center">
            {row.getValue("media_path") ? (
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${row.getValue(
                  "media_path"
                )}`}
                alt={row.original.title}
                className="w-full h-full rounded object-contain p-1"
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
        <div className="font-medium max-w-[200px] truncate">
          {row.getValue("title")}
        </div>
      ),
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
              <DropdownMenuItem
                onClick={() => navigate(`/about-our-clients/edit/${item.id}`)}
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

  return (
    <>
      <DataTable
        columns={columns}
        data={clientItems}
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
        title="Clients"
        searchPlaceholder="Search clients..."
        onAdd={() => navigate("/about-our-clients/create")}
        addButtonText="Add client"
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
              client and remove its data from the servers.
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
