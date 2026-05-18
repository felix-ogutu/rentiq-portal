// hooks/useSettings.ts

import { useMutation } from "@tanstack/react-query";
import {
    setNewPassword,
    updateProfile,
} from "../services/settingsService";

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: updateProfile,
    });
};

export const useSetNewPassword = () => {
    return useMutation({
        mutationFn: setNewPassword,
    });
};