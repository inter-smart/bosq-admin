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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { MoreHorizontal, Edit, Trash2, Filter } from "lucide-react";
import {
  fetchMaterialsList,
  deleteMaterial,
  Material,
} from "@/services/cms/materials/materialsItemApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import {
  fetchMaterialCategoryList,
  MaterialCategory,
} from "@/services/cms/materials/materialsCategoryApi";

export default function MaterialsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
    useCommonTableActions<Material>({
      modelName: "Materials",
      data: materials,
      setData: setMaterials,
    });

  useEffect(() => {
    loadCategories();
    loadMaterials();
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [selectedCategory]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const categoryParam =
        selectedCategory === "all" ? undefined : parseInt(selectedCategory);
      const response = await fetchMaterialsList(1, 100, undefined, categoryParam);
      setMaterials(response.data.list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetchMaterialCategoryList(1, 100);
      setCategories(response?.data?.list || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Material categories",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteMaterial(deleteItemId);
      setMaterials((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Material deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const columns: ColumnDef<Material>[] = [
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
      accessorKey: "material_categories",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.material_categories;
        return <div className="text-sm">{category?.title || "N/A"}</div>;
      },
    },
    {
      accessorKey: "media_path",
      header: "Image",
      cell: ({ row }) => {
        const mediaPath = row.getValue("media_path") as string;
        if (mediaPath) {
          return (
            <img
              src={`${import.meta.env.VITE_IMAGE_URL}/${mediaPath}`}
              alt={row.original.media_alt || "Material"}
              className="h-10 w-10 object-cover rounded"
            />
          );
        }
        return <div className="text-sm text-muted-foreground">No image</div>;
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
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/materials/edit/${item.id}`)}
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filter Section */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by Category:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id!.toString()}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategory !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Clear Filter
            </Button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={materials}
          title="Materials"
          searchPlaceholder="Search materials..."
          onAdd={() => navigate("/materials/create")}
          addButtonText="Add Material"
        />
      </div>

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
              material and remove its data from the servers.
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