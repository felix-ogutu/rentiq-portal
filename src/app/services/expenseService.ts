import {ExpenseCreateRequest, ExpenseFilter, ExpenseResponse, ExpenseUpdateRequest} from "../types/expense";
import {api} from "../lib/api";

export const fetchExpenses = async (
    filters: ExpenseFilter = { page: 0, size: 20 },
): Promise<ExpenseResponse> => {
    const response = await api.post<ExpenseResponse>(
        "/api/v1/expenses/view",
        filters,
    );
    return response.data;
};

export const createExpense = async (data: ExpenseCreateRequest) => {
    const response = await api.post("/api/v1/expenses/create", data);
    return response.data;
};

export const updateExpense = async (data: ExpenseUpdateRequest) => {
    const response = await api.put("/api/v1/expenses/update", data);
    return response.data;
};