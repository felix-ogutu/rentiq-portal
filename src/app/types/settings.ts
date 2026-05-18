// types/settings.ts

export interface UserProfile {
    email: string;
    fullName: string;
    phoneNumber: string;
}

export interface UpdateProfileRequest {
    email: string;
    fullName: string;
    phoneNumber: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface SettingsResponse {
    status: number;
    message: string;
    data?: UserProfile;
    timeStamp?: string;
}