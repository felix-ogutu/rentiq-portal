import { useState } from 'react';
import {
    ClipboardList, CheckCircle, XCircle, Loader2, AlertCircle, Filter,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useWorkflows, useApproveWorkflow, useRejectWorkflow } from '../../hooks/useWorkflows';
import { EntityType, Workflow, WorkflowPendingRequests } from '../../types/workflow';

type ActionType = 'approve' | 'reject' | null;

export function WorkflowsView() {
    const [filters, setFilters] = useState<WorkflowPendingRequests>({ page: 0, size: 20 });
    const [actionDialog, setActionDialog] = useState<{
        open: boolean; type: ActionType; workflow: Workflow | null;
    }>({ open: false, type: null, workflow: null });
    const [comment, setComment] = useState('');

    const { data, isLoading, isError } = useWorkflows(filters);
    const approveWorkflow = useApproveWorkflow();
    const rejectWorkflow = useRejectWorkflow();

    const workflows = data?.data ?? [];
    const isPending = approveWorkflow.isPending || rejectWorkflow.isPending;
    const isApprove = actionDialog.type === 'approve';

    const openAction = (type: ActionType, workflow: Workflow) => {
        setComment('');
        setActionDialog({ open: true, type, workflow });
    };

    const closeDialog = () => {
        setActionDialog({ open: false, type: null, workflow: null });
        setComment('');
    };

    const handleConfirm = async () => {
        const { type, workflow } = actionDialog;
        if (!workflow) return;
        const actionedBy = 1; // replace with auth user ID
        try {
            if (type === 'approve') {
                await approveWorkflow.mutateAsync({ workflowId: workflow.workflowId, actionedBy, comment });
                toast.success('Workflow approved successfully!');
            } else {
                await rejectWorkflow.mutateAsync({ workflowId: workflow.workflowId, actionedBy, comment });
                toast.success('Workflow rejected.');
            }
            closeDialog();
        } catch (err: any) {
            toast.error(err.message || 'Action failed');
        }
    };

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Workflows</h1>
                <p className="mt-1 text-sm text-gray-600">Review and action pending approval requests</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card><CardContent className="p-6 flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Pending</p>
                        <p className="mt-1 text-3xl font-bold text-[#272757]">{data?.stats?.pendingCount ?? 0}</p></div>
                    <ClipboardList size={28} className="text-[#272757]" />
                </CardContent></Card>
                <Card><CardContent className="p-6 flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Total results</p>
                        <p className="mt-1 text-3xl font-bold text-blue-600">{data?.totalResults ?? 0}</p></div>
                    <Filter size={28} className="text-blue-600" />
                </CardContent></Card>
                <Card><CardContent className="p-6 flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Approved</p>
                        <p className="mt-1 text-3xl font-bold text-green-600">{data?.stats?.approvedCount ?? 0}</p></div>
                    <CheckCircle size={28} className="text-green-600" />
                </CardContent></Card>
                <Card><CardContent className="p-6 flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Rejected</p>
                        <p className="mt-1 text-3xl font-bold text-red-500">{data?.stats?.rejectedCount ?? 0}</p></div>
                    <XCircle size={28} className="text-red-500" />
                </CardContent></Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <select
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    value={filters.entityType ?? ''}
                    onChange={(e) => setFilters((f) => ({
                        ...f, entityType: (e.target.value as EntityType) || undefined,
                    }))}
                >
                    <option value="">All entity types</option>
                    {Object.values(EntityType).map((et) => (
                        <option key={et} value={et}>{et}</option>
                    ))}
                </select>
                <select
                    className="w-full sm:w-36 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    value={filters.size}
                    onChange={(e) => setFilters((f) => ({ ...f, size: Number(e.target.value) }))}
                >
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={32} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center gap-2 py-16 text-red-500">
                    <AlertCircle size={20} /><span>Failed to load workflows</span>
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-16">#ID</TableHead>
                                    <TableHead>Entity type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Created by</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workflows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-16 text-gray-500">
                                            No pending workflows
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    workflows.map((workflow) => (
                                        <TableRow key={workflow.workflowId}>
                                            <TableCell className="text-gray-500 text-sm">
                                                #{workflow.workflowId}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {workflow.entityType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-sm">
                                                {workflow.description ?? `Entity ID: ${workflow.entityId}`}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {workflow.createdByUsername ?? workflow.createdBy ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {workflow.createdDate
                                                    ? new Date(workflow.createdDate).toLocaleDateString()
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-amber-100 text-amber-800 text-xs">
                                                    {workflow.status ?? 'PENDING'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openAction('approve', workflow)}
                                                        className="rounded-md bg-[#272757] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1f1f4d]"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => openAction('reject', workflow)}
                                                        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                                                        ···
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Approve / Reject Dialog */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isApprove ? 'Approve request' : 'Reject request'}</DialogTitle>
                        <DialogDescription>
                            Workflow #{actionDialog.workflow?.workflowId} · {actionDialog.workflow?.entityType}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label>Comment</Label>
                        <textarea
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#272757]"
                            rows={3}
                            placeholder="Add a comment (optional)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <button
                            onClick={closeDialog}
                            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isPending}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                                isApprove ? 'bg-[#272757] hover:bg-[#1f1f4d]' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {isPending && <Loader2 size={14} className="animate-spin" />}
                            {isApprove ? 'Confirm approval' : 'Confirm rejection'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}