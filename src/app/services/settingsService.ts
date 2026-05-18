// services/settingsService.ts

import { api } from "../lib/api";
import {
    ChangePasswordRequest,
    SettingsResponse,
    UpdateProfileRequest,
} from "../types/settings";

export const updateProfile = async (
    data: UpdateProfileRequest,
): Promise<SettingsResponse> => {
    const response = await api.put<SettingsResponse>(
        "/api/v1/user/update-profile",
        data,
    );

    return response.data;
};

export const setNewPassword = async (
    data: ChangePasswordRequest,
): Promise<SettingsResponse> => {
    const response = await api.put<SettingsResponse>(
        "/api/v1/user/set-new-password",
        data,
    );

    return response.data;
};