export type DebitNoticeStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface DebitNotice {
    id: number;
    tenantName: string;
    propertyName: string;
    amount: number;
    reason: string;
    description: string;
    status: DebitNoticeStatus;
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
    startDate?: string;
    endDate?: string;
}

export interface DebitNoticeResponse {
    status: number;
    message: string;
    totalResults: number;
    data: DebitNotice[];
}