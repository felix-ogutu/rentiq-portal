import {api} from "../lib/api";
import {UnitCreateRequest, UnitFilter, UnitResponse, UnitUpdateRequest} from "../types/unit";

export const createUnit = async (data: UnitCreateRequest) => {
    const response = await api.post("/api/v1/units/create", data);
    return response.data;
};

export const fetchUnits = async (
    filters: UnitFilter = { page: 0, size: 20 },
): Promise<UnitResponse> => {
    const response = await api.post<UnitResponse>(
        "/api/v1/units/view",
        filters,
    );
    return response.data;
};

export const updateUnit = async (data: UnitUpdateRequest) => {
    const response = await api.put("/api/v1/units/update", data);
    return response.data;
};
