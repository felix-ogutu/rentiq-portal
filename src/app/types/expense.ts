// types/expense.ts

export enum ExpenseStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
}

export interface Expense {
    id: number;
    propertyName: string;
    category: string;
    description: string;
    amount: number;
    status: ExpenseStatus;
    dateCreated?: string;
    dateUpdated?: string;
}

export interface ExpenseCreateRequest {
    propertyName: string;
    category: string;
    description: string;
    amount: number;
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
    stats?: {
        totalExpenses: number;
        paidCount: number;
        paidAmount: number;
        approvedCount: number;
        approvedAmount: number;
        pendingCount: number;
        pendingAmount: number;
    };
    data: Expense[];
}