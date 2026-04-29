export interface Role {
    roleId: number;
    roleName: string;
    description: string;
    dateCreated: string;
    dateUpdated: string;
}

export interface RoleCreateRequests {
    roleName: string;
    description: string;
}

export interface RoleUpdateRequests {
    roleId: number;
    data: RoleCreateRequests;
}

export interface Permission {
    permissionId: number;
    permissionName: string;
}

export interface AssignPermissions {
    roleId: number;
    userId: number;
    permissionIds: [];
}

export interface AssignedPermissions {
    roleId: number;
}

export interface RoleFilter {
    page?: number;
    size?: number;
    roleName?: string;
}

export interface PermissionFilters {
    page?: number;
    size?: number;
}

export interface RoleResponse {
    status: number;
    message: string;
    totalResults: number;
    data: Role[];
}

export interface PermissionResponses {
    status: number;
    message: string;
    totalResults: number;
    data: Permission[];
}

export interface AssignedPermissionResponse {
    status: number;
    message: string;
    totalResults: number;
    data: AssignedPermissions;
}

export interface AssignPermissionResponse {
    status: number;
    message: string;
    totalResults: number;
    data: AssignPermissions[];
}
