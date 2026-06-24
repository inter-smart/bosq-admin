import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchPermissionsCatalog, fetchRole, createRole, updateRole, Permission } from "@/services/roles/rolesApi";

export default function RoleForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const catalog = await fetchPermissionsCatalog();
        setPermissions(catalog.data.permissions);

        if (isEditing && id) {
          const response = await fetchRole(parseInt(id));
          setName(response.data.role.name);
          setSlug(response.data.role.slug);
          setSelectedSlugs(response.data.role.permissions.map((p) => p.slug));
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load role data", variant: "destructive" });
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [id, isEditing]);

  const toggleModule = (permSlug: string) => {
    setSelectedSlugs((prev) => (prev.includes(permSlug) ? prev.filter((s) => s !== permSlug) : [...prev, permSlug]));
  };

  const handleSubmit = async () => {
    if (!name.trim() || (!isEditing && !slug.trim())) {
      toast({ title: "Error", description: "Name and slug are required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      if (isEditing && id) {
        await updateRole(parseInt(id), { name, module_keys: selectedSlugs });
        toast({ title: "Success", description: "Role updated successfully" });
      } else {
        await createRole({ name, slug, module_keys: selectedSlugs });
        toast({ title: "Success", description: "Role created successfully" });
      }
      navigate("/admin-roles");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save role", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin-roles")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit" : "Add"} Role</h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} role and choose which sidebar modules it can access</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SEO Team" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. seo_team"
                disabled={isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visible Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center gap-2">
                <Checkbox
                  id={`perm-${permission.id}`}
                  checked={selectedSlugs.includes(permission.slug)}
                  onCheckedChange={() => toggleModule(permission.slug)}
                />
                <Label htmlFor={`perm-${permission.id}`} className="cursor-pointer">
                  {permission.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/admin-roles")}>
          Cancel
        </Button>
        <Button type="button" disabled={loading} onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : isEditing ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
}
