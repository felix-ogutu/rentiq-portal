import {
    WorkflowAction,
    WorkflowPendingRequests,
    WorkflowResponse,
} from "../types/workflow";
import { api } from "../lib/api";

export const fetchWorkflows = async (
    filters: WorkflowPendingRequests = { page: 0, size: 20 },
): Promise<WorkflowResponse> => {
    const response = await api.post<WorkflowResponse>(
        "/api/v1/workflow/pending",
        filters,
    );
    return response.data as WorkflowResponse;
};

export const approveWorkflow = async (data: WorkflowAction) => {
    const response = await api.post("/api/v1/workflow/approve", data);
    return response.data;
};

export const rejectWorkflow = async (data: WorkflowAction) => {
    const response = await api.post("/api/v1/workflow/reject", data);
    return response.data;
};
