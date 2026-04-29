export type PaymentType = 'RENT' | 'DEPOSIT' | 'UTILITY' | 'PENALTY' | 'OTHER';
export type PaymentMethod = 'MPESA' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';

export interface Payment {
    id: number;
    tenantId: number;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    reference: string;
    paymentDate: string;
    notes: string;
}

export interface PaymentCreateRequest {
    tenantId: number;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    reference: string;
    paymentDate: string;
    notes: string;
}

export interface PaymentFilter {
    page: number;
    size: number;
    propertyId?: number;
    unitId?: number;
    paymentType?: PaymentType;
    paymentMethod?: PaymentMethod;
    reference?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface PaymentResponse {
    status: number;
    message: string;
    totalResults: number;
    data: Payment[];
}