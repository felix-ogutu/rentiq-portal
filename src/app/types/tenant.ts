// types/tenant.ts

export enum TenantStatus {
    ACTIVE = "ACTIVE",
    IN_ARREARS = "IN_ARREARS",
    NOTICE_PERIOD = "NOTICE_PERIOD",
}

export interface Tenant {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    propertyId: number;
    propertyName?: string;
    unitId: number;
    unitNumber?: string;
    monthlyRent: number;
    initialBalance: number;
    leaseEndDate: string;
    status: TenantStatus;
    dateCreated?: string;
    dateUpdated?: string;
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

export interface TenantUpdateRequest extends TenantCreateRequest {
    id: number;
}

export interface TenantFilter {
    fullName?: string;
    email?: string;
    phone?: string;
    unitId?: number;
    status?: TenantStatus;
    page: number;
    size: number;
}

export interface TenantResponse {
    status: number;
    message: string;
    totalResults: number;
    stats?: {
        totalTenants: number;
        activeTenants: number;
        inArrearsTenants: number;
        noticePeriodTenants: number;
    };
    data: Tenant[];
    timeStamp?: string;
}