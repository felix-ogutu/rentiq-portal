import {UnitCreateRequest, UnitFilter, UnitResponse, UnitUpdateRequest} from "../types/unit";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createUnit, fetchUnits, updateUnit} from "../services/unitService";

export const useUnits = (
    filters: UnitFilter = { page: 0, size: 20 },
) => {
    return useQuery<UnitResponse, Error>({
        queryKey: ["units", filters],
        queryFn: () => fetchUnits(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateUnit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UnitCreateRequest) => createUnit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
        },
    });
};

export const useUpdateUnit = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UnitUpdateRequest) => updateUnit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            // Units affect property occupancy stats
            queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
    });
};
