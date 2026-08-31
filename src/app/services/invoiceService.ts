// services/invoiceService.ts

import { api } from "../lib/api";
import {
    InvoiceCreateRequest,
    InvoiceEmailRequest,
    InvoiceFilter,
    InvoiceResponse, PaymentInitiateRequest, PaymentLinkRequest, PaymentLinkResponse,
} from "../types/invoice";

export const fetchInvoices = async (
    filters: InvoiceFilter,
): Promise<InvoiceResponse> => {
    const response = await api.post<InvoiceResponse>(
        "/api/v1/invoices/view",
        filters,
    );
    return response.data;
};

export const createInvoice = async (
    data: InvoiceCreateRequest,
) => {
    const response = await api.post(
        "/api/v1/invoices/create",
        data,
    );
    return response.data;
};

export const sendInvoiceViaEmail = async (
    data: InvoiceEmailRequest,
) => {
    const response = await api.post(
        "/api/v1/invoices/send-via-email",
        data,
    );
    return response.data;
};
export const generatePaymentLink = async (
    data: PaymentLinkRequest,
) => {
    const response = await api.post<PaymentLinkResponse>(
        "/api/v1/payment-link/generate-link",
        data,
    );
    return response.data;
};

export const fetchPaymentInvoice = async (token: string) => {
    const response = await api.get(
        `/api/v1/payment-link/fetch-invoice/${token}`,
    );
    return response.data.data;
};

export const initiatePayment = async (
    token: string,
    data: PaymentInitiateRequest,
) => {
    const response = await api.post(
        `/api/v1/payment-link/initiate-payment/${token}`,
        data,
    );
    return response.data;
};