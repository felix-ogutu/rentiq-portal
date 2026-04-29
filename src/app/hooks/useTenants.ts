import {TenantCreateRequest, TenantFilter, TenantResponse, TenantUpdateRequest} from "../types/tenant";
import {createTenant, fetchTenants, updateTenant} from "../services/tenantService";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export const useTenants = (
    filters: TenantFilter = { page: 0, size: 20 },
) => {
    return useQuery<TenantResponse, Error>({
        queryKey: ["tenants", filters],
        queryFn: () => fetchTenants(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateTenant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TenantCreateRequest) => createTenant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            // Creating a tenant occupies a unit
            queryClient.invalidateQueries({ queryKey: ["units"] });
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
    });
};

export const useUpdateTenant = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TenantUpdateRequest) => updateTenant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            queryClient.invalidateQueries({ queryKey: ["units"] });
        },
    });
};