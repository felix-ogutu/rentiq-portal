import { useState } from 'react';
import { FileText, Plus, Check, X, Clock, Loader2, AlertCircle, Edit } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { toast } from 'sonner';
import { useDebitNotices, useCreateDebitNotice, useUpdateDebitNotice } from "../../hooks/useDebitNotices";
import { useTenants } from "../../hooks/useTenants";
import { useProperties } from "../../hooks/useProperties";
import { DebitNoticeCreateRequest, DebitNoticeUpdateRequest, DebitNoticeStatus } from "../../types/debitNotice";
import { Tenant } from "../../types/tenant";
import { Property } from "../../types/property";

export function DebitNoticesView() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const [formData, setFormData] = useState<DebitNoticeCreateRequest>({
    tenantName: '',
    propertyName: '',
    amount: 0,
    reason: '',
    description: '',
  });

  const [processData, setProcessData] = useState({
    status: DebitNoticeStatus.PROCESSED as DebitNoticeStatus,
    comment: '',
  });

  const [formErrors, setFormErrors] = useState({
    tenantName: '',
    propertyName: '',
    amount: '',
    reason: '',
    description: '',
  });

  const { data, isLoading, isError } = useDebitNotices({ page: 0, size: 20 });
  const { data: tenantsData } = useTenants({ page: 0, size: 100 });
  const { data: propertiesData } = useProperties({ page: 0, size: 100 });

  const createDebitNotice = useCreateDebitNotice();
  const updateDebitNotice = useUpdateDebitNotice();

  const notices = data?.data ?? [];
  const stats = data?.stats;
  const tenants = tenantsData?.data ?? [];
  const properties = propertiesData?.data ?? [];

  const resetCreateForm = () => {
    setFormData({ tenantName: '', propertyName: '', amount: 0, reason: '', description: '' });
    setFormErrors({ tenantName: '', propertyName: '', amount: '', reason: '', description: '' });
  };

  // Create Form Validation
  const validateCreateForm = (): boolean => {
    const errors = { tenantName: '', propertyName: '', amount: '', reason: '', description: '' };
    let isValid = true;

    if (!formData.tenantName) { errors.tenantName = 'Please select a tenant'; isValid = false; }
    if (!formData.propertyName) { errors.propertyName = 'Please select a property'; isValid = false; }
    if (!formData.amount || formData.amount <= 0) { errors.amount = 'Amount must be greater than 0'; isValid = false; }
    if (!formData.reason) { errors.reason = 'Reason is required'; isValid = false; }
    if (!formData.description?.trim()) { errors.description = 'Description is required'; isValid = false; }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateCreateForm()) return;

    try {
      await createDebitNotice.mutateAsync(formData);
      toast.success('Debit notice created successfully!');
      setCreateDialogOpen(false);
      resetCreateForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create debit notice');
    }
  };

  // Open Process Dialog
  const openProcessDialog = (notice: any) => {
    setSelectedNotice(notice);
    setProcessData({
      status: DebitNoticeStatus.PROCESSED,
      comment: '',
    });
    setProcessDialogOpen(true);
  };

  const handleProcess = async () => {
    if (!selectedNotice) return;

    const updatePayload: DebitNoticeUpdateRequest = {
      id: selectedNotice.id,
      tenantName: selectedNotice.tenantName,
      propertyName: selectedNotice.propertyName,
      amount: selectedNotice.amount,
      reason: selectedNotice.reason,
      description: selectedNotice.description,
      status: processData.status,
    };

    try {
      await updateDebitNotice.mutateAsync(updatePayload);
      toast.success(`Debit notice ${processData.status.toLowerCase()} successfully!`);
      setProcessDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update debit notice');
    }
  };

  const getStatusBadge = (status: DebitNoticeStatus) => {
    switch (status) {
      case DebitNoticeStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock size={14} className="mr-1" />Pending</Badge>;
      case DebitNoticeStatus.PROCESSED:
        return <Badge className="bg-blue-100 text-blue-700"><Check size={14} className="mr-1" />Processed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Debit Notices</h1>
            <p className="text-gray-600">Issue debit notices for refunds or adjustments</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#272757] hover:bg-[#1f1f4d]">
                <Plus size={18} className="mr-2" />
                Create Debit Notice
              </Button>
            </DialogTrigger>
            {/* Create Dialog - (Same as previous version) */}
            {/* You can keep your existing create dialog here */}
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-50 p-3">
                  <Clock size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats?.pendingCount ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-50 p-3">
                  <Check size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Processed</p>
                  <p className="text-2xl font-bold">{stats?.processedCount ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 p-3">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    KES {(stats?.totalAmount ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={40} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center py-20 text-red-500">
                  <AlertCircle size={40} />
                  <p className="mt-4">Failed to load debit notices</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            No debit notices found
                          </TableCell>
                        </TableRow>
                    ) : (
                        notices.map((notice) => (
                            <TableRow key={notice.id}>
                              <TableCell className="font-medium">{notice.tenantName}</TableCell>
                              <TableCell>{notice.propertyName}</TableCell>
                              <TableCell>{notice.reason}</TableCell>
                              <TableCell className="max-w-xs truncate">{notice.description}</TableCell>
                              <TableCell className="text-right font-medium">KES {notice.amount.toLocaleString()}</TableCell>
                              <TableCell>{getStatusBadge(notice.status)}</TableCell>
                              <TableCell>
                                {notice.status === DebitNoticeStatus.PENDING && (
                                    <Button
                                        size="sm"
                                        onClick={() => openProcessDialog(notice)}
                                        className="bg-[#272757] hover:bg-[#1f1f4d]"
                                    >
                                      <Edit size={14} className="mr-1" />
                                      Process
                                    </Button>
                                )}
                              </TableCell>
                            </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* Process Confirmation Dialog */}
        <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Process Debit Notice</DialogTitle>
              <DialogDescription>
                #{selectedNotice?.id} — {selectedNotice?.tenantName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Action</Label>
                <Select
                    value={processData.status}
                    onValueChange={(value) => setProcessData({ ...processData, status: value as DebitNoticeStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DebitNoticeStatus.PROCESSED}>Process</SelectItem>
                    <SelectItem value={DebitNoticeStatus.PENDING}>Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Comment (Optional)</Label>
                <Textarea
                    placeholder="Add any comment..."
                    value={processData.comment}
                    onChange={(e) => setProcessData({ ...processData, comment: e.target.value })}
                    rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setProcessDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                  onClick={handleProcess}
                  disabled={updateDebitNotice.isPending}
                  className="bg-[#272757] hover:bg-[#1f1f4d]"
              >
                {updateDebitNotice.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                Confirm {processData.status === DebitNoticeStatus.PROCESSED ? 'Processed' : 'Rejection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}