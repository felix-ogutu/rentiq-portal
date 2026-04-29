import {
    DebitNoticeCreateRequest,
    DebitNoticeFilter,
    DebitNoticeResponse,
    DebitNoticeUpdateRequest
} from "../types/debitNotice";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createDebitNotice, fetchDebitNotices, updateDebitNotice} from "../services/debitNoticeService";

export const useDebitNotices = (
    filters: DebitNoticeFilter = { page: 0, size: 20 },
) => {
    return useQuery<DebitNoticeResponse, Error>({
        queryKey: ["debitNotices", filters],
        queryFn: () => fetchDebitNotices(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateDebitNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DebitNoticeCreateRequest) => createDebitNotice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["debitNotices"] });
        },
    });
};

export const useUpdateDebitNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DebitNoticeUpdateRequest) => updateDebitNotice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["debitNotices"] });
        },
    });
};