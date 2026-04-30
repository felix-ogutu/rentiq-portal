import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PropertyCreateRequest, PropertyFilter, PropertyResponse, PropertyUpdateRequest} from "../types/property";
import {createProperty, fetchProperties, updateProperty} from "../services/propertyService";

export const useProperties = (
    filters: PropertyFilter = { page: 0, size: 20 },
) => {
    return useQuery<PropertyResponse, Error>({
        queryKey: ["properties", filters],
        queryFn: () => fetchProperties(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export const useCreateProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PropertyCreateRequest) => createProperty(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
        onError: (error:any) => {
            console.error("Error creating property:", error);
        }
    });
};

export const useUpdateProperty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PropertyUpdateRequest) => updateProperty(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
        onError: (error:any) => {
            console.error("Error updating property:", error);
        }
    });
};