import { api } from "../lib/api";
import {
    AssignedPermissionResponse,
    AssignPermissionResponse,
    AssignPermissions,
    PermissionFilters,
    PermissionResponses,
    RoleCreateRequests,
    RoleFilter,
    RoleResponse,
    RoleUpdateRequests,
} from "../types/rolePermission";

export const fetchRoles = async (
    filters: RoleFilter = { page: 0, size: 20 },
): Promise<RoleResponse> => {
    const response = await api.post<RoleResponse>("/api/v1/roles/view", filters);
    return response.data as RoleResponse;
};

export const createRole = async (data: RoleCreateRequests) => {
    const response = await api.post("/api/v1/roles/create", data);
    return response.data;
};

export const updateRole = async ({ roleId, data }: RoleUpdateRequests) => {
    const response = await api.put(`/api/v1/roles/update/${roleId}`, data);
    return response.data;
};

export const fetchPermissions = async (
    filters: PermissionFilters = { page: 0, size: 100 },
): Promise<PermissionResponses> => {
    const response = await api.post<PermissionResponses>(
        "/api/v1/permissions/view-all",
        filters,
    );
    return response.data as PermissionResponses;
};

export const assignPermissionsToRole = async (
    data: AssignPermissions,
): Promise<AssignPermissionResponse> => {
    const response = await api.post<AssignPermissionResponse>(
        "/api/v1/roles/assign-permissions",
        data,
    );
    return response.data as AssignPermissionResponse;
};

// Optional: Fetch assigned permissions for a specific role
export const fetchAssignedPermissions = async (
    roleId: number,
): Promise<AssignedPermissionResponse> => {
    const response = await api.post<AssignedPermissionResponse>(
        `/api/v1/roles/assigned-permissions/${roleId}`,
    );
    return response.data as AssignedPermissionResponse;
};
