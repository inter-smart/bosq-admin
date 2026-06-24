import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchAdminUser, createAdminUser, updateAdminUser } from "@/services/adminUsers/adminUsersApi";
import { fetchRoles, Role } from "@/services/roles/rolesApi";

export default function AdminUserForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<(number | string)[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const rolesResponse = await fetchRoles();
        setRoles(rolesResponse.data.roles);

        if (isEditing && id) {
          const response = await fetchAdminUser(parseInt(id));
          setUsername(response.data.user.username);
          setEmail(response.data.user.email);
          setStatus(response.data.user.status);
          setSelectedRoleIds(response.data.user.roles.map((r) => r.id));
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load staff user data", variant: "destructive" });
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [id, isEditing]);

  const handleSubmit = async () => {
    if (!username.trim() || !email.trim() || (!isEditing && !password.trim())) {
      toast({ title: "Error", description: "Username, email and password are required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const role_ids = selectedRoleIds.map((id) => Number(id));

      if (isEditing && id) {
        await updateAdminUser(parseInt(id), { username, email, status, role_ids });
        toast({ title: "Success", description: "Staff user updated successfully" });
      } else {
        await createAdminUser({ username, email, password, role_ids });
        toast({ title: "Success", description: "Staff user created successfully" });
      }
      navigate("/admin-users");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save staff user", variant: "destructive" });
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
        <Button variant="outline" size="icon" onClick={() => navigate("/admin-users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit" : "Add"} Staff User</h1>
          <p className="text-muted-foreground">{isEditing ? "Update" : "Create a new"} admin panel account and assign roles</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. seo.team" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. seo@bosq.ae" />
            </div>
            {!isEditing && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set initial password" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Roles</Label>
              <MultiSelect
                options={roles.map((role) => ({ id: role.id, name: role.name, slug: role.slug }))}
                selected={selectedRoleIds}
                onChange={setSelectedRoleIds}
                placeholder="Assign roles..."
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-4 max-w-md">
              <div className="space-y-0.5">
                <Label className="text-base">Status</Label>
                <p className="text-sm text-muted-foreground">Enable or disable login access</p>
              </div>
              <Switch checked={status} onCheckedChange={setStatus} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/admin-users")}>
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
