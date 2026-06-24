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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { fetchRoles, deleteRole, Role } from "@/services/roles/rolesApi";
import { useToast } from "@/hooks/use-toast";

export default function RolesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await fetchRoles();
      setRoles(response.data.roles);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load roles", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleDelete = async (role: Role) => {
    if (!confirm(`Delete role "${role.name}"?`)) return;
    try {
      await deleteRole(role.id);
      toast({ title: "Success", description: "Role deleted successfully" });
      loadRoles();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete role", variant: "destructive" });
    }
  };

  const columns: ColumnDef<Role>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    {
      id: "modules",
      header: "Visible Modules",
      cell: ({ row }) => {
        const role = row.original;
        if (role.slug === "super_admin") {
          return <Badge>All modules</Badge>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-md">
            {role.permissions.map((p) => (
              <Badge key={p.id} variant="outline">
                {p.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const role = row.original;
        const isSuperAdmin = role.slug === "super_admin";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={isSuperAdmin} onClick={() => navigate(`/admin-roles/edit/${role.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isSuperAdmin} onClick={() => handleDelete(role)} className="text-destructive">
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
        data={roles}
        loading={loading}
        title="Roles & Permissions"
        onAdd={() => navigate("/admin-roles/create")}
        addButtonText="Add Role"
      />
    </div>
  );
}
