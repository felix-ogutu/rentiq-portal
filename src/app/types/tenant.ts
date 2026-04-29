
export enum TenantStatus {
    ACTIVE = "ACTIVE",
    IN_ARREARS = "IN_ARREARS",
    NOTICE_PERIOD = "NOTICE_PERIOD"
}

export interface Tenant {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    unitId: number;
    monthlyRent: number;
    initialBalance: number;
    leaseEndDate: string;
    status: TenantStatus;
}

export interface TenantCreateRequest {
    fullName: string;
    email: string;
    phone: string;
    unitId: number;
    monthlyRent: number;
    initialBalance: number;
    leaseEndDate: string;
    status: TenantStatus;
}

export interface TenantUpdateRequest {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    unitId: number;
    monthlyRent: number;
    initialBalance: number;
    leaseEndDate: string;
    status: TenantStatus;
}

export interface TenantFilter {
    fullName?: string;
    email?: string;
    phone?: string;
    propertyId?: number;
    unitId?: number;
    unitNumber?: string;
    status?: TenantStatus;
    leaseEndDateFrom?: string;
    leaseEndDateTo?: string;
    page: number;
    size: number;
}

export interface TenantResponse {
    status: number;
    message: string;
    totalResults: number;
    data: Tenant[];
}
