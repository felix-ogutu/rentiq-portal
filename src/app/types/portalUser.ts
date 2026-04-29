import { Role } from "./rolePermission";

export interface PortalUserFormData {
    username: string;
    email: string;
    firstName: string;
    middleName: string;
    surname: string;
    phoneNumber: string;
    roleId: string;
    clientId: string;
}

export interface PortalUserCreateRequests {
    username: string;
    email: string;
    firstName: string;
    middleName: string;
    surname: string;
    phoneNumber: string;
    clientId: number;
    roleId: number;
    createdBy: number;
}

export interface PortalUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    middle_name: string | null;
    surname: string;
    phone_number: string;
    client_id: number;

    role: Role;

    isexpired: number | null;
    isactive: number;
    islocked: number;
    firstlogin: number;

    createdby: number;
    created_date: string;

    approve_status: string | null;
    approved_by: number | null;
    approve_remarks: string | null;
    approved_date: string | null;

    updatedby: number | null;
    updated_date: string | null;

    password_reset_state: number | null;
    password_reset_by: number | null;
    password_reset_comments: string | null;
    password_reset_date: string | null;
    password_reset_approved_by: number | null;
    password_reset_approved_remarks: string | null;
    password_reset_approved_date: string | null;

    deactivated_by: number | null;
    deactivated_comments: string | null;
    deactivated_date: string | null;

    trials: number | null;
}

export interface PortalUserResponse {
    status: number;
    message: string;
    totalResults: number;
    data: PortalUser[];
    stats?: PortalUserCounts;
}

export interface PortalUserFilter {
    page?: number;
    size?: number;
    username?: string;
    email?: string;
    first_name?: string;
    middle_name?: string;
    surname?: string;
    phone_number?: string;
    client_id?: number;
}

//Interface for the update
export interface PortalUserUpdateRequests {
    portalUserId: number;
    username: string;
    firstName: string;
    middleName: string;
    surname: string;
    phoneNumber: string;
    clientId: number;
    roleId: number;
    updatedBy: number;
}

export interface SetPasswordRequests {
    token: string;
    newPassword: string;
}

export interface PasswordResetRequests {
    email: string;
    userId: number;
    initiatedBy: number;
}
export interface PortalUserCounts {
    active: number;
    inactive: number;
    admin: number;
}

export interface PortalUserStatusRequest {
    portalUserId: number;
    actionedBy: number;
}
export interface UpdateProfileRequest {
    firstName: string;
    middleName: string;
    surname: string;
    phoneNumber: string;
    currentPassword?: string;
    newPassword?: string;
}
