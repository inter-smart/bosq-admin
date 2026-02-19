import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Edit, Trash2, ArrowLeft } from "lucide-react";
import { fetchAttributeValueList, deleteAttributeValue, AttributeValue } from "@/services/product/attributeValuesApi";
import { fetchProductAttributeById, ProductAttribute } from "@/services/product/productAttributesApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function AttributeValuesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { attributeId } = useParams();
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [attribute, setAttribute] = useState<ProductAttribute | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } = useCommonTableActions<AttributeValue>({
    modelName: "AttributeValues",
    data: attributeValues,
    setData: setAttributeValues,
  });

  // Load attribute info on mount
  useEffect(() => {
    if (attributeId) {
      loadAttribute(parseInt(attributeId));
    }
  }, [attributeId]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (attributeId) {
      loadAttributeValues();
    }
  }, [currentPage, pageSize, debouncedSearchQuery, attributeId]);

  const loadAttribute = async (id: number) => {
    try {
      const response = await fetchProductAttributeById(id);
      setAttribute(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attribute information",
        variant: "destructive",
      });
    }
  };

  const loadAttributeValues = async () => {
    if (!attributeId) return;

    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchAttributeValueList(parseInt(attributeId), currentPage, pageSize, debouncedSearchQuery);

      if (response.success) {
        setAttributeValues(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attribute values",
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
      await deleteAttributeValue(deleteItemId);
      setAttributeValues((prev) => prev.filter((item) => item.id !== deleteItemId));
      setTotalCount((prev) => prev - 1);
      toast({
        title: "Success",
        description: "Attribute value deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete attribute value",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const columns: ColumnDef<AttributeValue>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-sm">{(currentPage - 1) * pageSize + row.index + 1}</div>,
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => <div className="font-medium max-w-[200px] truncate">{row.getValue("value")}</div>,
    },

    {
      accessorKey: "media_path",
      header: "Media",
      cell: ({ row }) => {
        const mediaPath = row.getValue("media_path") as string;
        return mediaPath ? (
          <img src={`${import.meta.env.VITE_IMAGE_URL}/${mediaPath}`} alt={row.getValue("value")} className="w-10 h-10 object-cover rounded" />
        ) : (
          <span className="text-muted-foreground">No image</span>
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
            value={editingSortOrder[item.id!] !== undefined ? editingSortOrder[item.id!] : row.getValue("sort_order") || 0}
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
            <Switch checked={status} onCheckedChange={() => handleStatusChange(item.id!, status)} />
          </div>
        );
      },
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
              <DropdownMenuItem onClick={() => navigate(`/product-attributes/${attributeId}/values/edit/${item.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteItemId(item.id!)}>
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/product-attributes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Attribute Values{attribute ? `: ${attribute.name}` : ""}</h1>
            <p className="text-muted-foreground">Manage values for this product attribute</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={attributeValues}
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
          title=""
          searchPlaceholder="Search attribute values..."
          onAdd={() => navigate(`/product-attributes/${attributeId}/values/create`)}
          addButtonText="Add Value"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the attribute value and remove its data from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
