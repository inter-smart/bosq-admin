import { apiCall } from "@/utils/apiUtils";

export interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export const fetchPermissionsCatalog = () => apiCall("/roles/permissions-catalog") as Promise<{ data: { permissions: Permission[] } }>;

export const fetchRoles = () => apiCall("/roles") as Promise<{ data: { roles: Role[] } }>;

export const fetchRole = (id: number) => apiCall(`/roles/${id}`) as Promise<{ data: { role: Role } }>;

export const createRole = (data: { name: string; slug: string; module_keys: string[] }) =>
  apiCall("/roles", { method: "POST", data });

export const updateRole = (id: number, data: { name?: string; module_keys?: string[] }) =>
  apiCall(`/roles/${id}`, { method: "PUT", data });

export const deleteRole = (id: number) => apiCall(`/roles/${id}`, { method: "DELETE" });
