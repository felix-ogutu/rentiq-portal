import {
    MaintenanceCreateRequest,
    MaintenanceFilter,
    MaintenanceResponse,
    MaintenanceUpdateRequest
} from "../types/maintenance";
import {api} from "../lib/api";

export const fetchMaintenanceRequests = async (
    filters: MaintenanceFilter = { page: 0, size: 20 },
): Promise<MaintenanceResponse> => {
    const response = await api.post<MaintenanceResponse>(
        "/api/v1/maintenance-requests/view",
        filters,
    );
    return response.data;
};

export const createMaintenanceRequest = async (
    data: MaintenanceCreateRequest,
) => {
    const response = await api.post(
        "/api/v1/maintenance-requests/create",
        data,
    );
    return response.data;
};

export const updateMaintenanceRequest = async (
    data: MaintenanceUpdateRequest,
) => {
    const response = await api.put(
        "/api/v1/maintenance-requests/update",
        data,
    );
    return response.data;
};