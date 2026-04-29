import {api} from "../lib/api";
import {TenantCreateRequest, TenantFilter, TenantResponse, TenantUpdateRequest} from "../types/tenant";

export const createTenant = async (data: TenantCreateRequest) => {
    const response = await api.post("/api/v1/tenants/create", data);
    return response.data;
};

export const fetchTenants = async (
    filters: TenantFilter = { page: 0, size: 20 },
): Promise<TenantResponse> => {
    const response = await api.post<TenantResponse>(
        "/api/v1/tenants/view",
        filters,
    );
    return response.data;
};

export const updateTenant = async (data: TenantUpdateRequest) => {
    const response = await api.put("/api/v1/tenants/update", data);
    return response.data;
};
