export enum DebitNoticeStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
}

export interface DebitNotice {
    id: number;
    tenantId?: number;
    tenantName: string;
    propertyId?: number;
    propertyName: string;
    amount: number;
    reason: string;
    description: string;
    status: DebitNoticeStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface DebitNoticeCreateRequest {
    tenantName: string;
    propertyName: string;
    amount: number;
    reason: string;
    description: string;
}

export interface DebitNoticeUpdateRequest {
    id: number;
    tenantName: string;
    propertyName: string;
    amount: number;
    reason: string;
    description: string;
    status: DebitNoticeStatus;
}

export interface DebitNoticeFilter {
    page: number;
    size: number;
    tenantName?: string;
    propertyName?: string;
    status?: DebitNoticeStatus;
}

export interface DebitNoticeResponse {
    status: number;
    message: string;
    totalResults: number;
    stats?: {
        pendingCount: number;
        processedCount: number;
        totalAmount: number;
    };
    data: DebitNotice[];
}