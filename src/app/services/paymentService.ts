import {PaymentApiResponse, PaymentCreateRequest, PaymentFilter} from "../types/payment";
import {api} from "../lib/api";

export const fetchPayments = async (
    filters: PaymentFilter = { page: 0, size: 20 },
): Promise<PaymentApiResponse> => {
    const response = await api.post<PaymentApiResponse>(
        "/api/v1/payments/view",
        filters,
    );
    return response.data;
};

export const createPayment = async (data: PaymentCreateRequest) => {
    const response = await api.post("/api/v1/payments/create", data);
    return response.data;
};