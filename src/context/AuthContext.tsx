import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  fetchMe,
  getCurrentUser,
  getCachedPermissions,
  getCachedIsSuperAdmin,
  isAuthenticated,
  User,
  Role,
} from "@/services/auth/authApi";

interface AuthContextValue {
  user: User | null;
  roles: Role[];
  permissions: string[];
  isSuperAdmin: boolean;
  isLoading: boolean;
  hasPermission: (moduleKey?: string) => boolean;
  refresh: () => Promise<void>;
  setAuthData: (data: { user: User; roles: Role[]; permissions: string[]; isSuperAdmin: boolean }) => void;
  clear: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>(getCachedPermissions());
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(getCachedIsSuperAdmin());
  const [isLoading, setIsLoading] = useState(true);

  const setAuthData = ({
    user,
    roles,
    permissions,
    isSuperAdmin,
  }: {
    user: User;
    roles: Role[];
    permissions: string[];
    isSuperAdmin: boolean;
  }) => {
    setUser(user);
    setRoles(roles);
    setPermissions(permissions);
    setIsSuperAdmin(isSuperAdmin);
  };

  const clear = () => {
    setUser(null);
    setRoles([]);
    setPermissions([]);
    setIsSuperAdmin(false);
  };

  const refresh = async () => {
    if (!isAuthenticated()) {
      clear();
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetchMe();
      setAuthData(response.data);
    } catch {
      // Keep whatever was cached in localStorage; apiUtils already
      // handles redirecting to /login on a 401 from this call.
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const hasPermission = (moduleKey?: string) => {
    if (isSuperAdmin) return true;
    if (!moduleKey) return false;
    return permissions.includes(moduleKey);
  };

  return (
    <AuthContext.Provider
      value={{ user, roles, permissions, isSuperAdmin, isLoading, hasPermission, refresh, setAuthData, clear }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
