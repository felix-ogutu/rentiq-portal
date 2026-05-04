// types/payment.ts
export enum PaymentType {
    RENT = "RENT",
    UTILITY = "UTILITY",
    SERVICE_CHARGE = "SERVICE_CHARGE",
    OTHER = "OTHER",
}

export enum PaymentMethod {
    MPESA = "MPESA",
    BANK = "BANK",
    CASH = "CASH",
}

export interface Payment {
    id: number;
    tenantName: string;
    propertyName: string;
    unitName: string;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    reference: string;
    paymentDate: string;
}

export interface PaymentCreateRequest {
    tenantId: number;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: PaymentMethod;
    reference: string;
    paymentDate: string;
    notes?: string;
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

export interface PaymentApiResponse {
    status: number;
    message: string;
    totalResults: number;
    stats?: {
        mpesaAmount: number;
        bankAmount: number;
        cashAmount: number;
    };
    data: Payment[];
    timeStamp?: string;
}