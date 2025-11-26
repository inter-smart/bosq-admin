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
  fetchHomeBannerList,
  deleteHomeBanner,
  HomeBanner,
} from "@/services/cms/home/homeBannerApi";
import { updateStatus, updateSortOrder } from "@/services/commonApi";
import { useToast } from "@/hooks/use-toast";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";

export default function HomeBannerSliderList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bannerItems, setBannerItems] = useState<HomeBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [updateTimeouts, setUpdateTimeouts] = useState<{
    [key: number]: NodeJS.Timeout;
  }>({});

    const {
    statusToggleItem,
    setStatusToggleItem,
    editingSortOrder,
    handleStatusChange,
    handleSortOrderChange,
    confirmStatusToggle,
  } = useCommonTableActions<HomeBanner>({
    modelName: "HomeBanner",
    data: bannerItems,
    setData: setBannerItems,
  });
  


  useEffect(() => {
    loadBannerItems();
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(updateTimeouts).forEach(clearTimeout);
    };
  }, [updateTimeouts]);

  const loadBannerItems = async () => {
    try {
      setLoading(true);
      const response = await fetchHomeBannerList(1, 100);

      console.log(response.data);

      setBannerItems(response.data.list);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load home banner items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteHomeBanner(deleteItemId);
      setBannerItems((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };




  const columns: ColumnDef<HomeBanner>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "media_desktop_path",
      header: "Image",
      cell: ({ row }) => {
        console.log(
          `${import.meta.env.VITE_IMAGE_URL}/${row.getValue(
            "media_desktop_path"
          )}`
        );
        return (
          <>
            <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center">
              {row.getValue("media_desktop_path") ? (
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/${row.getValue(
                    "media_desktop_path"
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
                onClick={() => navigate(`/home-banner-slider/edit/${item.id}`)}
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
    return <div>Loading home banner items...</div>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={bannerItems}
        title="Home Banner Slider"
        searchPlaceholder="Search banners..."
        onAdd={() => navigate("/home-banner-slider/create")}
        addButtonText="Add Banner"
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
              banner and remove its data from the servers.
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
              banner? This will change its visibility on the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusToggle}>
              {statusToggleItem?.newStatus ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>  {/* Status Toggle Confirmation Dialog */}
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
              banner? This will change its visibility on the home page.
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
