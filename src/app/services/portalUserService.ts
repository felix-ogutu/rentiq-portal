//Service Method to Create Portal User
import {
    PasswordResetRequests,
    PortalUserCreateRequests,
    PortalUserFilter,
    PortalUserResponse,
    PortalUserStatusRequest,
    PortalUserUpdateRequests,
    SetPasswordRequests,
    UpdateProfileRequest,
} from "../types/portalUser";
import { api } from "../lib/api";
export const createPortalUser = async (data: PortalUserCreateRequests) => {
    const response = await api.post("/api/v1/user/create", data);
    return response.data;
};

//Service Method to View Portal Users
export const fetchPortalUsers = async (
    filters: PortalUserFilter = { page: 0, size: 20 },
): Promise<PortalUserResponse> => {
    const response = await api.post<PortalUserResponse>(
        "/api/v1/user/view",
        filters,
    );
    return response.data as PortalUserResponse;
};
//Service Method to Update Portal Users
export const updatePortalUser = async (data: PortalUserUpdateRequests) => {
    const response = await api.put(`/api/v1/user/update`, data);
    return response.data;
};

//Service Method to Activate the portal users
export const activatePortalUser = async (data: PortalUserStatusRequest) => {
    const response = await api.put(`/api/v1/user/activate`, data);
    return response.data;
};

//Service Method to deactivate the portal Users
export const deactivatePortalUser = async (data: PortalUserStatusRequest) => {
    const response = await api.put(`/api/v1/user/deactivate`, data);
    return response.data;
};
export const setPassword = async (data: SetPasswordRequests) => {
    const response = await api.put("/api/v1/portaluser/setPassword", data);
    return response.data;
};
export const passwordReset = async (data: PasswordResetRequests) => {
    const response = await api.post("/api/v1/portaluser/password-reset", data);
    return response.data;
};

export const updateUserProfile = async (data: UpdateProfileRequest) => {
    const response = await api.put("/api/v1/user/update-profile", data);
    return response.data;
};
