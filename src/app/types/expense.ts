export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Expense {
    id: number;
    propertyName: string;
    category: string;
    description: string;
    amount: number;
    status: ExpenseStatus;
}

export interface ExpenseCreateRequest {
    propertyName: string;
    category: string;
    description: string;
    amount: number;
    status: ExpenseStatus;
}

export interface ExpenseUpdateRequest {
    id: number;
    propertyName: string;
    category: string;
    description: string;
    amount: number;
    status: ExpenseStatus;
}

export interface ExpenseFilter {
    page: number;
    size: number;
    propertyName?: string;
    category?: string;
    status?: ExpenseStatus;
}

export interface ExpenseResponse {
    status: number;
    message: string;
    totalResults: number;
    data: Expense[];
}