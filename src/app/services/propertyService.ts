import {PropertyCreateRequest, PropertyFilter, PropertyResponse, PropertyUpdateRequest} from "../types/property";
import {api} from "../lib/api";

export const createProperty = async (data: PropertyCreateRequest) => {
    const response = await api.post("/api/v1/properties/create", data);
    return response.data;
};

export const fetchProperties = async (
    filters: PropertyFilter = { page: 0, size: 20 }
): Promise<PropertyResponse> => {
    const response = await api.post<PropertyResponse>(
        "/api/v1/properties/view",
        filters
    );
    return response.data;
};

export const updateProperty = async (data: PropertyUpdateRequest) => {
    const response = await api.put("/api/v1/properties/update", data);
    return response.data;
};