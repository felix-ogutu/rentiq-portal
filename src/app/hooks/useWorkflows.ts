// src/hooks/useWorkflows.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Workflow,
    WorkflowResponse,
    WorkflowPendingRequests,
    WorkflowAction,
} from "../types/workflow";
import {
    fetchWorkflows,
    approveWorkflow,
    rejectWorkflow,
} from "../services/workflowService";

// Fetch pending workflows with filters
export const useWorkflows = (
    filters: WorkflowPendingRequests = { page: 0, size: 20 },
) => {
    return useQuery<WorkflowResponse, Error>({
        queryKey: ["workflows", filters],
        queryFn: () => fetchWorkflows(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Approve workflow
export const useApproveWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approveWorkflow,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workflows"],
                exact: false,

            });
        },
    });
};

// Reject workflow
export const useRejectWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectWorkflow,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workflows"],
                exact: false,
            });
        },
    });
};
