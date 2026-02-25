import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import {
  fetchProjectEnquiries,
  deleteProjectEnquiry,
  ProjectEnquiry,
} from "@/services/enquiries/projectEnquiriesApi";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, formatDateForExcel } from "@/utils/exportUtils";

export default function ProjectEnquiriesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch enquiries
  useEffect(() => {
    loadEnquiries();
  }, [currentPage, pageSize, debouncedSearchQuery]);

  const loadEnquiries = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchProjectEnquiries(
        currentPage,
        pageSize,
        debouncedSearchQuery
      );

      if (response.success) {
        setEnquiries(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project enquiries",
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
      await deleteProjectEnquiry(deleteItemId);
      toast({
        title: "Success",
        description: "Project enquiry deleted successfully",
      });
      loadEnquiries();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project enquiry",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleExport = async (type: "csv" | "excel" | "pdf", selectedRows?: ProjectEnquiry[]) => {
    if (type !== "excel") return;

    try {
      let dataToExport = selectedRows;

      if (!dataToExport || dataToExport.length === 0) {
        const response = await fetchProjectEnquiries(1, 100000, debouncedSearchQuery);
        if (response.success) {
          dataToExport = response.data.list;
        } else {
          throw new Error("Failed to fetch data for export");
        }
      }

      const formattedData = dataToExport.map((item, index) => ({
        "S.No": index + 1,
        "Name": item.name,
        "Email": item.email,
        "Phone": item.phone || "-",
        "Project": item.project?.title || "-",
        "Message": item.message,
        "Submitted At": formatDateForExcel(item.createdAt),
      }));

      const dateStr = new Date().toISOString().split('T')[0];

      const columnWidths = [
        { wch: 10 }, // S.No
        { wch: 25 }, // Name
        { wch: 35 }, // Email
        { wch: 20 }, // Phone
        { wch: 30 }, // Project
        { wch: 50 }, // Message
        { wch: 25 }, // Submitted At
      ];

      exportToExcel(formattedData, `project_enquiries_${dateStr}`, 'Project Enquiries', columnWidths);

      toast({
        title: "Success",
        description: "Excel file exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<ProjectEnquiry>[] = [
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium max-w-[150px] truncate">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="text-sm max-w-[130px] truncate">
          {row.getValue("phone") || "-"}
        </div>
      ),
    },
    {
      id: "project",
      header: "Project",
      cell: ({ row }) => (
        <div className="text-sm max-w-[150px] truncate">
          {row.original.project?.title || "-"}
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-[250px] truncate">
          {row.getValue("message")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Submitted At",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}{" "}
          {new Date(row.getValue("createdAt")).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
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
                onClick={() => navigate(`/project-enquiries/${item.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteItemId(item.id)}
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
        data={enquiries}
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
        onExport={handleExport}
        title="Project Enquiries"
        searchPlaceholder="Search enquiries by Name, Email..."
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
              project enquiry and remove its data from the servers.
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
