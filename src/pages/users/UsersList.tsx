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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import { fetchUsers, User } from "@/services/users/usersApi";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { updateStatus } from "@/services/commonApi";
import { exportToExcel, formatDateForExcel } from "@/utils/exportUtils";

export default function UsersList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
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

  // Fetch users
  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, debouncedSearchQuery]);

  const loadUsers = async () => {
    try {
      if (debouncedSearchQuery) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const response = await fetchUsers(
        currentPage,
        pageSize,
        debouncedSearchQuery
      );

      if (response.success) {
        setUsers(response.data.list);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleExport = async (type: "csv" | "excel" | "pdf", selectedRows?: User[]) => {
    if (type !== "excel") return;

    try {
      let dataToExport = selectedRows;

      // If no rows selected, export all data (from the current view/search)
      if (!dataToExport || dataToExport.length === 0) {
        // Fetch all data for export (using a large limit)
        const response = await fetchUsers(1, 100000, debouncedSearchQuery);
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
        "Phone": item.mobile ? `${item.country_code} ${item.mobile}` : "-",
      }));

      const dateStr = new Date().toISOString().split('T')[0];

      const columnWidths = [
        { wch: 10 }, // S.No
        { wch: 25 }, // Name
        { wch: 35 }, // Email
        { wch: 20 }, // Phone
      ];

      exportToExcel(formattedData, `users_list_${dateStr}`, 'Users', columnWidths);

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

  const handleStatusChange = async (userId: number, newStatus: boolean) => {
    try {
      await updateStatus({
        model_name: "Users",
        row_id: userId,
        status: newStatus ? "active" : "inactive",
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: newStatus ? "active" : "inactive" } : u
        )
      );
      toast({
        title: "Success",
        description: `User ${newStatus ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "mobile",
      header: "Phone",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-sm">
            {user.mobile ? `${user.country_code} ${user.mobile}` : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        const isActive = user.status === "active";
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
            />
            <Badge variant={isActive ? "default" : "secondary"}>
              {user.status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.getValue("created_at")).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}{" "}
          {new Date(row.getValue("created_at")).toLocaleTimeString("en-US", {
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
                onClick={() => navigate(`/users/${item.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
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
      title="Users"
      searchPlaceholder="Search users..."
    />
  );
}
