import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resetAdminUserPassword } from "@/services/adminUsers/adminUsersApi";

export default function AdminUserResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim() || !id) {
      toast({ title: "Error", description: "Password is required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await resetAdminUserPassword(parseInt(id), password);
      toast({ title: "Success", description: "Password reset successfully" });
      navigate("/admin-users");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reset password", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin-users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Set a new password for this staff account</p>
        </div>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>New Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/admin-users")}>
          Cancel
        </Button>
        <Button type="button" disabled={loading} onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
}
