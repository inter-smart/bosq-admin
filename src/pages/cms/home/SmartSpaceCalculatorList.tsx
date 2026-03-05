import React, { useState, useEffect } from "react";
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
  const [searching, setSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

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
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadCalculatorItems();
  }, [currentPage, pageSize, debouncedSearchQuery]);

  const loadCalculatorItems = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }
      const response = await fetchSmartSpaceCalculatorList(
        currentPage,
        pageSize,
        debouncedSearchQuery
      );
      setCalculatorItems(response.data.list);
      setTotalCount(response.data.pagination?.totalCount || 0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load smart space calculator items",
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
        <div className="font-mono text-sm">
          {(currentPage - 1) * pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "media_path",
      header: "Image",
      cell: ({ row }) => (
        <ImageCell
          src={row.getValue("media_path")}
          alt={row.original.media_alt || row.original.title}
        />
      ),
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

  const ImageCell = React.memo(({ src, alt }: { src: string; alt: string }) => {
    const fullSrc = `${import.meta.env.VITE_IMAGE_URL}/${src}`;

    return (
      <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
        {src ? (
          <img
            loading="lazy"
            decoding="async"
            src={fullSrc}
            alt={alt}
            className="w-full h-full object-cover rounded"
            style={{ contentVisibility: "auto" }}
          />
        ) : (
          <div className="w-full h-full bg-muted-foreground/20 rounded" />
        )}
      </div>
    );
  });

  if (loading) {
    return <div>Loading smart space calculator items...</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={calculatorItems}
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
