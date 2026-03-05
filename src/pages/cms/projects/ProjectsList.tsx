import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, FilterOption } from "@/components/common/DataTable";
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
import { MoreHorizontal, Edit, Trash2, Filter, Award, Image, ChevronDown, ChevronUp} from "lucide-react";
import {
  fetchProjectsList,
  deleteProject,
  Project,
  updateProject,
} from "@/services/cms/projects/projectsApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useCommonTableActions } from "@/hooks/useCommonTableActions";
import {
  fetchProjectCategoryList,
  ProjectCategory,
} from "@/services/cms/projects/projectCategoryApi";

export default function ProjectsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const { editingSortOrder, handleStatusChange, handleSortOrderChange } =
    useCommonTableActions<Project>({
      modelName: "Projects",
      data: projects,
      setData: setProjects,
    });

  useEffect(() => {
    loadCategories();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedCategory, startDate, endDate]);

  // Load projects when dependencies change
  useEffect(() => {
    loadProjects();
  }, [currentPage, pageSize, debouncedSearchQuery, selectedCategory, startDate, endDate]);

  const loadProjects = async () => {
    try {
      // Set appropriate loading state
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const categoryParam =
        selectedCategory === "all" ? undefined : parseInt(selectedCategory);

      const response = await fetchProjectsList(
        currentPage,
        pageSize,
        debouncedSearchQuery || undefined,
        categoryParam,
        startDate,
        endDate
      );

      setProjects(response.data.list);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetchProjectCategoryList(1, 100);
      setCategories(response?.data?.list || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Project categories",
        variant: "destructive",
      });
    }
  };

  const handleShowInHomeToggle = async (id: number, currentValue: boolean) => {
    try {
      // Create FormData to match your API signature
      const formData = new FormData();
      formData.append("show_in_home", String(!currentValue));

      // Call API
      await updateProject(id, formData);

      // Update local state optimistically
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, show_in_home: !currentValue } : item
        )
      );

      toast({
        title: "Success",
        description: "Show In Home status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Show In Home",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      await deleteProject(deleteItemId);
      setProjects((prev) => prev.filter((item) => item.id !== deleteItemId));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const columns: ColumnDef<Project>[] = [
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
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        const thumbnail = row.getValue("thumbnail") as string;
        if (thumbnail) {
          return (
            <img
              src={`${import.meta.env.VITE_IMAGE_URL}/${thumbnail}`}
              alt={row.original.title || "Project"}
              className="h-10 w-10 object-cover rounded"
            />
          );
        }
        return <div className="text-sm text-muted-foreground">No image</div>;
      },
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
      accessorKey: "category_id",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.original.category_id;
        const category = categories.find((cat) => cat.id === categoryId);
        return <div className="text-sm">{category?.name || "N/A"}</div>;
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
      accessorKey: "show_in_home",
      header: "Show In Home",
      cell: ({ row }) => {
        const item = row.original;
        const show_in_home = row.getValue("show_in_home") as boolean;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={show_in_home}
              onCheckedChange={() =>
                handleShowInHomeToggle(item.id!, show_in_home)
              }
            />
            <Badge variant={show_in_home ? "default" : "secondary"}>
              {show_in_home ? "active" : "inactive"}
            </Badge>
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
                onClick={() => navigate(`/projects/edit/${item.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/specialised-areas?projectId=${item.id}`)
                }
              >
                <Award className="mr-2 h-4 w-4" />
                Specialised Areas
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/project-images?projectId=${item.id}`)
                }
              >
                <Image className="mr-2 h-4 w-4" />
                Project Images
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


  const filters: FilterOption[] = [
    {
      id: "dateRange",
      label: "Date Range",
      type: "dateRange",
      startDate: startDate,
      endDate: endDate,
      onStartDateChange: setStartDate,
      onEndDateChange: setEndDate,
    },
  ];



  return (
    <>
      <div className="space-y-4">
        {/* Filter Section */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Filter by Category:</span>

            <div className="flex items-center gap-4">

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id!.toString()}>
                      {category.name}
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
          </div>
        </div>

        <DataTable
          columns={columns}
          data={projects}
          loading={loading}
          searching={searching}
          searchQuery={searchQuery}
          filters={filters}
          onSearchChange={setSearchQuery}
          pagination={{
            currentPage,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
          }}
          title="Projects"
          searchPlaceholder="Search projects..."
          onAdd={() => navigate("/projects/create")}
          addButtonText="Add Project"
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
              project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
