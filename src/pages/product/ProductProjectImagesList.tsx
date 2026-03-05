import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Trash2, MoreHorizontal, Edit, ChevronDown, ChevronUp} from "lucide-react";
import {
  fetchProductProjectImages,
  deleteProductProjectImage,
  ProductProjectImage,
} from "@/services/product/productProjectImagesApi";
import { fetchBaseProductById, BaseProduct } from "@/services/product/baseProductApi";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function ProductProjectImagesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productId } = useParams();
  const [images, setImages] = useState<ProductProjectImage[]>([]);
  const [product, setProduct] = useState<BaseProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  useEffect(() => {
    if (productId) {
      loadProduct(parseInt(productId));
      loadImages();
    }
  }, [productId]);

  const loadProduct = async (id: number) => {
    try {
      const response = await fetchBaseProductById(id);
      setProduct(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product information",
        variant: "destructive",
      });
    }
  };

  const loadImages = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const response = await fetchProductProjectImages(parseInt(productId));

      if (response.success) {
        const sortedImages = response.data.list.sort((a, b) => a.sort_order - b.sort_order);
        setImages(sortedImages);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteProductProjectImage(deleteItemId);
      setImages((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Project image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project image",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const { editingSortOrder, handleStatusChange, handleSortOrderChange } = useCommonTableActions<ProductProjectImage>({
    modelName: "ProductProjectImage",
    data: images,
    setData: setImages,
  });

  const columns: ColumnDef<ProductProjectImage>[] = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => <div className="w-12 text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "media_path",
      header: "Preview",
      cell: ({ row }) => {
        const image = row.original;
        return (
          <div className="min-w-[100px]">
            <img
              src={`${import.meta.env.VITE_IMAGE_URL}/${image.media_path}`}
              alt={image.media_alt || `Project Image ${image.id}`}
              className="w-20 h-20 object-cover rounded border"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "media_alt",
      header: "Alt Text (EN)",
      cell: ({ row }) => {
        const altText = row.getValue("media_alt") as string;
        return <div className="min-w-[150px] max-w-[200px] truncate">{altText || "N/A"}</div>;
      },
    },
    {
      accessorKey: "media_alt_ar",
      header: "Alt Text (AR)",
      cell: ({ row }) => {
        const altText = row.getValue("media_alt_ar") as string;
        return <div className="min-w-[150px] max-w-[200px] truncate" dir="rtl">{altText || "N/A"}</div>;
      },
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
            <Switch checked={status} onCheckedChange={() => handleStatusChange(item.id!, status)} />
            <Badge variant={status ? "default" : "secondary"}>{status ? "active" : "inactive"}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return createdAt ? (
          <div className="text-sm text-muted-foreground min-w-[120px]">{new Date(createdAt).toLocaleDateString()}</div>
        ) : (
          <div className="text-sm text-muted-foreground min-w-[120px]">N/A</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="min-w-[80px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/product-project-images/${productId}/edit/${item.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteItemId(item.id!)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/base-products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Project Images{product ? `: ${product.title}` : ""}</h1>
            <p className="text-muted-foreground">Manage project images for this product</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={images}
          loading={loading}
          searchQuery=""
          onSearchChange={() => {}}
          searching={false}
          pagination={{
            currentPage: 1,
            pageSize: images.length,
            totalCount: images.length,
            totalPages: 1,
            onPageChange: () => {},
            onPageSizeChange: () => {},
          }}
          title=""
          searchPlaceholder="Search project images..."
          onAdd={() => navigate(`/product-project-images/${productId}/create`)}
          addButtonText="Add Project Image"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete this project image.</AlertDialogDescription>
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
