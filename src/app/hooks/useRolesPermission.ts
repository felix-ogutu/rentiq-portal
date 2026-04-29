import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    RoleCreateRequests,
    RoleUpdateRequests,
    RoleFilter,
    RoleResponse,
    PermissionFilters,
    PermissionResponses,
    AssignPermissions,
} from "../types/rolePermission";
import {
    PortalUserCreateRequests,
    PortalUserUpdateRequests,
    PortalUserFilter,
    PortalUserResponse,
    PortalUserStatusRequest,
} from "../types/portalUser";
import {
    fetchRoles,
    createRole,
    updateRole,
    fetchPermissions,
    assignPermissionsToRole,
    fetchAssignedPermissions,
} from "../services/rolePermissionService";
import {
    fetchPortalUsers,
    createPortalUser,
    updatePortalUser,
    activatePortalUser,
    deactivatePortalUser,
} from "../services/portalUserService";
import { useAuth } from "../context/AuthContext";

// ─── ROLE HOOKS ───────────────────────────────────────────────────────────────

export const useRoles = (filters: RoleFilter = { page: 0, size: 20 }) => {
    return useQuery<RoleResponse, Error>({
        queryKey: ["roles", filters],
        queryFn: () => fetchRoles(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RoleCreateRequests) => createRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RoleUpdateRequests) => updateRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
};

// ─── PERMISSION HOOKS ─────────────────────────────────────────────────────────

export const usePermissions = (
    filters: PermissionFilters = { page: 0, size: 100 },
) => {
    return useQuery<PermissionResponses, Error>({
        queryKey: ["permissions", filters],
        queryFn: () => fetchPermissions(filters),
        staleTime: 1000 * 60 * 10, // permissions change rarely
    });
};

export const useAssignedPermissions = (roleId: number) => {
    return useQuery({
        queryKey: ["assignedPermissions", roleId],
        queryFn: () => fetchAssignedPermissions(roleId),
        enabled: !!roleId, // only fetch when roleId is valid
        staleTime: 1000 * 60 * 5,
    });
};

export const useAssignPermissions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AssignPermissions) => assignPermissionsToRole(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["assignedPermissions", variables.roleId] });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
};

// ─── PORTAL USER HOOKS ────────────────────────────────────────────────────────

export const usePortalUsers = (
    filters: PortalUserFilter = { page: 0, size: 20 },
) => {
    return useQuery<PortalUserResponse, Error>({
        queryKey: ["portalUsers", filters],
        queryFn: () => fetchPortalUsers(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreatePortalUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PortalUserCreateRequests) => createPortalUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portalUsers"] });
        },
    });
};

export const useUpdatePortalUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PortalUserUpdateRequests) => updatePortalUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portalUsers"] });
        },
    });
};

export const useActivatePortalUser = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    return useMutation({
        mutationFn: (portalUserId: number) =>
            activatePortalUser({ portalUserId, actionedBy: user?.id ?? 0 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portalUsers"] });
        },
    });
};

export const useDeactivatePortalUser = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    return useMutation({
        mutationFn: (portalUserId: number) =>
            deactivatePortalUser({ portalUserId, actionedBy: user?.id ?? 0 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portalUsers"] });
        },
    });
};