import {
    MaintenanceCreateRequest,
    MaintenanceFilter,
    MaintenanceResponse,
    MaintenanceUpdateRequest
} from "../types/maintenance";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createMaintenanceRequest, fetchMaintenanceRequests, updateMaintenanceRequest} from "../services/maintenance";

export const useMaintenanceRequests = (
    filters: MaintenanceFilter = { page: 0, size: 20 },
) => {
    return useQuery<MaintenanceResponse, Error>({
        queryKey: ["maintenanceRequests", filters],
        queryFn: () => fetchMaintenanceRequests(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateMaintenanceRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: MaintenanceCreateRequest) =>
            createMaintenanceRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenanceRequests"] });
        },
    });
};

export const useUpdateMaintenanceRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: MaintenanceUpdateRequest) =>
            updateMaintenanceRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenanceRequests"] });
        },
    });
};