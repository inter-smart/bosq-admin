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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  fetchSmartSpaceCalculatorList,
  deleteSmartSpaceCalculator,
  SmartSpaceCalculator,
} from "@/services/cms/home/smartSpaceCalculatorApi";
import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function SmartSpaceCalculatorList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calculatorItems, setCalculatorItems] = useState<SmartSpaceCalculator[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [updateTimeouts, setUpdateTimeouts] = useState<{
    [key: number]: NodeJS.Timeout;
  }>({});

  const {
    editingSortOrder,
    handleStatusChange,
    handleSortOrderChange,
  } = useCommonTableActions<SmartSpaceCalculator>({
    modelName: "SmartSpaceCalculator",
    data: calculatorItems,
    setData: setCalculatorItems,
  });

  useEffect(() => {
    loadCalculatorItems();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(updateTimeouts).forEach(clearTimeout);
    };
  }, [updateTimeouts]);

  const loadCalculatorItems = async () => {
    try {
      setLoading(true);
      const response = await fetchSmartSpaceCalculatorList(1, 100);
      setCalculatorItems(response.data.list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load smart space calculator items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteSmartSpaceCalculator(deleteItemId);
      setCalculatorItems((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Calculator item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete calculator item",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const columns: ColumnDef<SmartSpaceCalculator>[] = [
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
          <>
            <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center">
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
          </>
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
                onClick={() => navigate(`/smart-space-calculator/edit/${item.id}`)}
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
    return <div>Loading smart space calculator items...</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={calculatorItems}
        title="Smart Space Calculator"
        searchPlaceholder="Search calculators..."
        onAdd={() => navigate("/smart-space-calculator/create")}
        addButtonText="Add Calculator"
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
              calculator item and remove its data from the servers.
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
