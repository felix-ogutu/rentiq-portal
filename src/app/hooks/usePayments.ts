import {InitiateMpesaPaymentRequest, PaymentApiResponse, PaymentCreateRequest, PaymentFilter} from "../types/payment";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createPayment, fetchPayments, initiateMpesaPayment} from "../services/paymentService";

export const usePayments = (filters: PaymentFilter = { page: 0, size: 20 }) => {
    return useQuery<PaymentApiResponse, Error>({
        queryKey: ["payments", filters],
        queryFn: () => fetchPayments(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PaymentCreateRequest) => createPayment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            // Payment affects tenant balance
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
        },
    });
};

export const useInitiateMpesaPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InitiateMpesaPaymentRequest) => initiateMpesaPayment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
};