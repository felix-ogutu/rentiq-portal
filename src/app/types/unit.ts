export enum UnitType {
    BEDSITTER = "BEDSITTER",
    STUDIO = "STUDIO",
    ONE_BEDROOM = "ONE_BEDROOM",
    TWO_BEDROOM = "TWO_BEDROOM",
    THREE_BEDROOM = "THREE_BEDROOM",
    SHOP = "SHOP",
    OFFICE = "OFFICE"
}
export enum UnitStatus {
    VACANT = "VACANT",
    OCCUPIED = "OCCUPIED",
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
}

export interface Unit {
    id: number;
    propertyId: number;
    unitNumber: string;
    unitType: UnitType;
    monthlyRent: number;
    status: UnitStatus;
    dateCreated?: string;
    dateUpdated?: string;
}

export interface UnitCreateRequest {
    propertyId: number;
    unitNumber: string;
    unitType: UnitType;
    monthlyRent: number;
    status: UnitStatus;
}

export interface UnitUpdateRequest extends UnitCreateRequest {
    id: number;
}

export interface UnitFilter {
    propertyId?: number;
    unitNumber?: string;
    unitType?: UnitType;
    status?: UnitStatus;
    page: number;
    size: number;
}

export interface UnitResponse {
    status: number;
    message: string;
    totalResults: number;
    stats?: {
        totalUnits: number;
        occupiedUnits: number;
        vacantUnits: number;
        occupancyRate: number;
    };
    data: Unit[];
    timeStamp?: string;
}
