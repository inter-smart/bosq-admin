import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, KeyRound } from "lucide-react";
import { fetchAdminUsers, deleteAdminUser, AdminUser } from "@/services/adminUsers/adminUsersApi";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAdminUsers(currentPage, pageSize, searchQuery);
      setUsers(response.data.list);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load staff users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, searchQuery]);

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Delete staff account "${admin.username}"?`)) return;
    try {
      await deleteAdminUser(admin.id);
      toast({ title: "Success", description: "Staff account deleted successfully" });
      loadUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete staff account", variant: "destructive" });
    }
  };

  const columns: ColumnDef<AdminUser>[] = [
    { accessorKey: "username", header: "Username" },
    { accessorKey: "email", header: "Email" },
    {
      id: "roles",
      header: "Roles",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((role) => (
            <Badge key={role.id} variant={role.slug === "super_admin" ? "default" : "outline"}>
              {role.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;
        return <Badge variant={status ? "default" : "secondary"}>{status ? "active" : "inactive"}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const admin = row.original;
        const isSelf = admin.id === currentUser?.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/admin-users/edit/${admin.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/admin-users/${admin.id}/reset-password`)}>
                <KeyRound className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isSelf} onClick={() => handleDelete(admin)} className="text-destructive">
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
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pagination={{
          currentPage,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
        title="Staff Users"
        searchPlaceholder="Search staff users..."
        onAdd={() => navigate("/admin-users/create")}
        addButtonText="Add Staff User"
      />
    </div>
  );
}
