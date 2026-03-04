import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, FilterOption } from "@/components/common/DataTable";
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
  fetchCustomizationEnquiries,
  deleteCustomizationEnquiry,
  CustomizationEnquiry,
} from "@/services/enquiries/customizationEnquiriesApi";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, formatDateForExcel } from "@/utils/exportUtils";

export default function CustomizationEnquiriesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<CustomizationEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, startDate, endDate]);

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
  }, [currentPage, pageSize, debouncedSearchQuery, startDate, endDate]);

  const loadEnquiries = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchCustomizationEnquiries(
        currentPage,
        pageSize,
        debouncedSearchQuery,
        startDate,
        endDate
      );

      if (response.success) {
        setEnquiries(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load General Enquiries",
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
      await deleteCustomizationEnquiry(deleteItemId);
      toast({
        title: "Success",
        description: "General Enquiry deleted successfully",
      });
      loadEnquiries();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete General Enquiry",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleExport = async (type: "csv" | "excel" | "pdf", selectedRows?: CustomizationEnquiry[]) => {
    if (type !== "excel") return;

    try {
      let dataToExport = selectedRows;

      if (!dataToExport || dataToExport.length === 0) {
        const response = await fetchCustomizationEnquiries(1, 100000, debouncedSearchQuery, startDate, endDate);
        if (response.success) {
          dataToExport = response.data.list;
        } else {
          throw new Error("Failed to fetch data for export");
        }
      }

      const formattedData = dataToExport.map((item, index) => ({
        "S.No": index + 1,
        "Name": `${item.first_name} ${item.last_name}`,
        "Company": item.company_name || "-",
        "Email": item.email,
        "Option": item.dropdown?.title || "-",
        "Message": item.message,
        "State": item.state?.name || "-",
        "Submitted At": formatDateForExcel(item.createdAt),
      }));

      const dateStr = new Date().toISOString().split('T')[0];

      const columnWidths = [
        { wch: 10 }, // S.No
        { wch: 25 }, // Name
        { wch: 25 }, // Company
        { wch: 35 }, // Email
        { wch: 25 }, // Option
        { wch: 50 }, // Message
        { wch: 20 }, // State
        { wch: 25 }, // Submitted At
      ];

      exportToExcel(formattedData, `general_enquiries_${dateStr}`, 'General Enquiries', columnWidths);

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

  const columns: ColumnDef<CustomizationEnquiry>[] = [
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
      accessorKey: "first_name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium max-w-[150px] truncate">
          {row.original.first_name} {row.original.last_name}
        </div>
      ),
    },
    {
      accessorKey: "company_name",
      header: "Company",
      cell: ({ row }) => (
        <div className="text-sm max-w-[150px] truncate">
          {row.getValue("company_name") || "-"}
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
      id: "dropdown",
      header: "Request Data",
      cell: ({ row }) => (
        <div className="text-sm max-w-[150px] truncate">
          {row.original.dropdown?.title || "-"}
        </div>
      ),
    },
   
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div className="text-sm max-w-[150px] truncate">
          {row.original.state?.name || "-"}
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
                onClick={() => navigate(`/customization-enquiries/${item.id}`)}
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
      <DataTable
        columns={columns}
        data={enquiries}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searching={searching}
        filters={filters}
        pagination={{
          currentPage,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
        onExport={handleExport}
        title="General Enquiries"
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
              General Enquiry and remove its data from the servers.
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
