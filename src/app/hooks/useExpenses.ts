import {ExpenseCreateRequest, ExpenseFilter, ExpenseResponse, ExpenseUpdateRequest} from "../types/expense";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createExpense, fetchExpenses, updateExpense} from "../services/expenseService";

export const useExpenses = (
    filters: ExpenseFilter = { page: 0, size: 20 },
) => {
    return useQuery<ExpenseResponse, Error>({
        queryKey: ["expenses", filters],
        queryFn: () => fetchExpenses(filters),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ExpenseCreateRequest) => createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
};

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ExpenseUpdateRequest) => updateExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
};