import { apiCall } from "@/utils/apiUtils";
import { Role } from "@/services/roles/rolesApi";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  status: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export const fetchAdminUsers = (page = 1, limit = 10, search = "") =>
  apiCall("/admin-users", { params: { page, limit, search } }) as Promise<{
    data: { list: AdminUser[]; pagination: { totalCount: number } };
  }>;

export const fetchAdminUser = (id: number) => apiCall(`/admin-users/${id}`) as Promise<{ data: { user: AdminUser } }>;

export const createAdminUser = (data: { username: string; email: string; password: string; role_ids: number[] }) =>
  apiCall("/admin-users", { method: "POST", data });

export const updateAdminUser = (
  id: number,
  data: { username?: string; email?: string; status?: boolean; role_ids?: number[] },
) => apiCall(`/admin-users/${id}`, { method: "PUT", data });

export const resetAdminUserPassword = (id: number, password: string) =>
  apiCall(`/admin-users/${id}/reset-password`, { method: "PUT", data: { password } });

export const deleteAdminUser = (id: number) => apiCall(`/admin-users/${id}`, { method: "DELETE" });
