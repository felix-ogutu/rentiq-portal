
export interface Property {
    id: number;
    propertyName: string;
    address: string;
    totalUnits: number;
    occupiedUnits: number;
    monthlyRevenue: number;
}

export interface PropertyCreateRequest {
    propertyName: string;
    address: string;
    totalUnits: number;
    occupiedUnits: number;
    monthlyRevenue: number;
}

export interface PropertyUpdateRequest {
    id: number;
    propertyName: string;
    address: string;
    totalUnits: number;
    occupiedUnits: number;
    monthlyRevenue: number;
}

export interface PropertyFilter {
    propertyName?: string;
    address?: string;
    page: number;
    size: number;
}

export interface PropertyResponse {
    status: number;
    message: string;
    totalResults: number;
    data: Property[];
}