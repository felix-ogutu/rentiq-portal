export enum InvoiceStatus {
    PENDING = "PENDING",
    PARTIAL = "PARTIAL",
    PAID = "PAID",
}

export interface Invoice {
    id: number;
    tenantName: string;
    propertyName?: string;
    unitNumber?: string;
    billingPeriod?: string;

    rentAmount: number;
    waterAmount: number;
    securityAmount: number;

    totalAmount: number;
    paidAmount: number;
    balance: number;

    status: InvoiceStatus;
    dueDate: string;
    createdAt?: string;

    paymentLinkToken?: string;
}

export interface InvoiceStats {
    totalInvoices: number;
    paid: number;
    pending: number;
    partial: number;

    totalAmount: number;
    totalPaid: number;
    totalOutstanding: number;
}

export interface InvoiceFilter {
    tenantId?: number;
    status?: InvoiceStatus;
    page: number;
    size: number;
}

export interface InvoiceCreateRequest {
    tenantId: number;
    waterAmount: number;
    securityAmount: number;
    dueDate: string;
}

export interface InvoiceEmailRequest {
    id: number;
}

export interface InvoiceResponse {
    status: number;
    message: string;
    totalResults: number;

    stats: InvoiceStats;

    data: Invoice[];

    timeStamp?: string;
}
export interface PaymentLinkRequest {
    id: number;
}

export interface PaymentLinkResponse {
    status: number;
    message: string;
    token: string;
}

export interface PaymentInvoiceLink {
    id: number;
    tenantName: string;
    amount: number;
    status: string;
    dueDate: string;
}

export interface PaymentInitiateRequest {
    amount: number;
    phoneNumber: string;
}