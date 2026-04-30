
export interface Property {
    id: number;
    propertyName: string;
    address: string;
    totalUnits: number;
    occupiedUnits: number;
    monthlyRevenue: number;
    dateCreated?: string;
    dateUpdated?: string;
}

export interface PropertyCreateRequest {
    propertyName: string;
    address: string;
    totalUnits: number;
    occupiedUnits: number;
    monthlyRevenue: number;
}

export interface PropertyUpdateRequest extends PropertyCreateRequest {
    id: number;
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
    stats?: {
        totalProperties: number;
        totalUnits: number;
        totalOccupiedUnits: number;
        totalMonthlyRevenue: number;
        occupancyRate: number;
    };
    data: Property[];
    timeStamp?: string;
}