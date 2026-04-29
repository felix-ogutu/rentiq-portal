import {
    DebitNoticeCreateRequest,
    DebitNoticeFilter,
    DebitNoticeResponse,
    DebitNoticeUpdateRequest
} from "../types/debitNotice";
import {api} from "../lib/api";

export const fetchDebitNotices = async (
    filters: DebitNoticeFilter = { page: 0, size: 20 },
): Promise<DebitNoticeResponse> => {
    const response = await api.post<DebitNoticeResponse>(
        "/api/v1/debit-notices/view",
        filters,
    );
    return response.data;
};

export const createDebitNotice = async (data: DebitNoticeCreateRequest) => {
    const response = await api.post("/api/v1/debit-notices/create", data);
    return response.data;
};

export const updateDebitNotice = async (data: DebitNoticeUpdateRequest) => {
    const response = await api.put("/api/v1/debit-notices/update", data);
    return response.data;
};