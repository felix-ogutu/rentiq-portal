export interface Workflow {
    workflowId: number;
    entityType: EntityType;
    entityId: number;
    actionType?: string;
    createdBy?: string;
    createdByUsername?: number;
    createdId?: number;
    createdDate?: string;
    status?: string;
    requestPayload?: string;
    description?: string;
}

export interface WorkflowStats {
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
}

export enum EntityType {
    USER = "USER",
    PROPERTIES = "PROPERTIES",
    UNITS = "UNITS",
    TENANTS = "TENANTS",
    DEBITNOTICE = "DEBITNOTICE",
    PAYMENTS = "PAYMENTS",
    EXPENSES = "EXPENSES",
    MAINTENANCEREQUEST = "MAINTENANCEREQUEST",
}

export interface WorkflowPendingRequests {
    page?: number;
    size?: number;
    entityType?: EntityType;
}

export interface WorkflowAction {
    workflowId: number;
    actionedBy: number;
    comment: string;
}

export interface WorkflowResponse {
    status: number;
    message: string;
    totalResults: number;
    stats?: WorkflowStats;
    data: Workflow[];
}
