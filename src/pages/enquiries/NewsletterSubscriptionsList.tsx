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
  fetchNewsletterSubscriptions,
  deleteNewsletterSubscription,
  NewsletterSubscription,
} from "@/services/enquiries/newsletterApi";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, formatDateForExcel } from "@/utils/exportUtils";

export default function NewsletterSubscriptionsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
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

  // Fetch subscriptions
  useEffect(() => {
    loadSubscriptions();
  }, [currentPage, pageSize, debouncedSearchQuery, startDate, endDate]);

  const loadSubscriptions = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchNewsletterSubscriptions(
        currentPage,
        pageSize,
        debouncedSearchQuery,
        startDate,
        endDate
      );

      if (response.success) {
        setSubscriptions(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load newsletter subscriptions",
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
      await deleteNewsletterSubscription(deleteItemId);
      toast({
        title: "Success",
        description: "Newsletter subscription deleted successfully",
      });
      loadSubscriptions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete newsletter subscription",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const handleExport = async (type: "csv" | "excel" | "pdf", selectedRows?: NewsletterSubscription[]) => {
    if (type !== "excel") return;

    try {
      let dataToExport = selectedRows;

      if (!dataToExport || dataToExport.length === 0) {
        const response = await fetchNewsletterSubscriptions(1, 100000, debouncedSearchQuery, startDate, endDate);
        if (response.success) {
          dataToExport = response.data.list;
        } else {
          throw new Error("Failed to fetch data for export");
        }
      }

      const formattedData = dataToExport.map((item, index) => ({
        "S.No": index + 1,
        "Email": item.email,
        "Subscribed At": formatDateForExcel(item.createdAt),
      }));

      const dateStr = new Date().toISOString().split('T')[0];

      const columnWidths = [
        { wch: 10 }, // S.No
        { wch: 40 }, // Email
        { wch: 25 }, // Subscribed At
      ];

      exportToExcel(formattedData, `newsletter_subscriptions_${dateStr}`, 'Newsletter Subscriptions', columnWidths);

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

  const columns: ColumnDef<NewsletterSubscription>[] = [
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
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="font-medium max-w-[300px] truncate">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Subscribed At",
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
                onClick={() => navigate(`/newsletter-subscriptions/${item.id}`)}
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
        data={subscriptions}
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
        title="Newsletter Subscriptions"
        searchPlaceholder="Search by email..."
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
              newsletter subscription and remove its data from the servers.
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
