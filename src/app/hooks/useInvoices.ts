// hooks/useInvoices.ts

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    InvoiceCreateRequest,
    InvoiceEmailRequest,
    InvoiceFilter,
    InvoiceResponse, PaymentInitiateRequest, PaymentLinkRequest,
} from "../types/invoice";

import {
    createInvoice,
    fetchInvoices, fetchPaymentInvoice, generatePaymentLink, initiatePayment,
    sendInvoiceViaEmail,
} from "../services/invoiceService";

export const useInvoices = (
    filters: InvoiceFilter = {
        page: 0,
        size: 20,
    },
) => {
    return useQuery<InvoiceResponse, Error>({
        queryKey: ["invoices", filters],
        queryFn: () => fetchInvoices(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InvoiceCreateRequest) =>
            createInvoice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["invoices"],
            });
        },
    });
};

export const useSendInvoiceViaEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InvoiceEmailRequest) =>
            sendInvoiceViaEmail(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["invoices"],
            });
        },
    });
};

// Generate link
export const useGeneratePaymentLink = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PaymentLinkRequest) =>
            generatePaymentLink(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["invoices"],
            });
        },
    });
};

// Fetch invoice via token
export const usePaymentInvoice = (token?: string) => {
    return useQuery({
        queryKey: ["payment-link", token],
        queryFn: () => fetchPaymentInvoice(token!),
        enabled: !!token,
    });
};

// Initiate payment
export const useInitiatePayment = () => {
    return useMutation({
        mutationFn: ({
                         token,
                         data,
                     }: {
            token: string;
            data: PaymentInitiateRequest;
        }) => initiatePayment(token, data),
    });
};