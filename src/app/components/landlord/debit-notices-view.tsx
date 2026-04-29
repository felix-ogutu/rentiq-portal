import { useState } from 'react';
import { FileText, Plus, Check, X, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {DebitNoticeFilter, DebitNoticeStatus} from "../../types/debitNotice";
import {useCreateDebitNotice, useDebitNotices, useUpdateDebitNotice} from "../../hooks/useDebitNotices";

export function DebitNoticesView() {
  const [filters] = useState<DebitNoticeFilter>({ page: 0, size: 20 });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    propertyName: '',
    amount: '',
    reason: '',
    description: '',
  });

  const { data, isLoading, isError } = useDebitNotices(filters);
  const createDebitNotice = useCreateDebitNotice();
  const updateDebitNotice = useUpdateDebitNotice();

  const notices = data?.data ?? [];

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const handleCreate = async () => {
    if (!formData.tenantName || !formData.amount || !formData.reason || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await createDebitNotice.mutateAsync({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success('Debit notice created successfully!');
      setCreateDialogOpen(false);
      setFormData({ tenantName: '', propertyName: '', amount: '', reason: '', description: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create debit notice');
    }
  };

  const handleUpdateStatus = async (notice: typeof notices[0], status: DebitNoticeStatus) => {
    try {
      await updateDebitNotice.mutateAsync({ ...notice, status });
      toast.success(`Debit notice ${status === 'APPROVED' ? 'approved' : 'rejected'}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update notice');
    }
  };

  const getStatusBadge = (status: DebitNoticeStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock size={14} className="inline mr-1" />Pending</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-700"><Check size={14} className="inline mr-1" />Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700"><X size={14} className="inline mr-1" />Rejected</Badge>;
      case 'PAID':
        return <Badge className="bg-blue-100 text-blue-700"><Check size={14} className="inline mr-1" />Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const pendingCount = notices.filter(n => n.status === 'PENDING').length;
  const approvedCount = notices.filter(n => n.status === 'APPROVED').length;
  const totalAmount = notices.filter(n => n.status === 'APPROVED').reduce((sum, n) => sum + n.amount, 0);

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Debit Notices</h1>
            <p className="mt-1 text-sm text-gray-600">Issue debit notices for refunds or adjustments</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <button
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white w-fit"
                  style={{ backgroundColor: '#272757' }}
              >
                <Plus size={16} />
                Create Debit Notice
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Debit Notice</DialogTitle>
                <DialogDescription>Issue a debit notice to a tenant for refunds or adjustments.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tenant Name</Label>
                  <Input
                      placeholder="Enter tenant name"
                      value={formData.tenantName}
                      onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property Name</Label>
                  <Input
                      placeholder="Enter property name"
                      value={formData.propertyName}
                      onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount (KES)</Label>
                  <Input
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <select
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  >
                    <option value="">Select reason...</option>
                    <option value="Security Deposit Refund">Security Deposit Refund</option>
                    <option value="Overpayment Refund">Overpayment Refund</option>
                    <option value="Billing Error Correction">Billing Error Correction</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                      placeholder="Provide details about this debit notice..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                    onClick={() => setCreateDialogOpen(false)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                    onClick={handleCreate}
                    disabled={createDebitNotice.isPending}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    style={{ backgroundColor: '#272757' }}
                >
                  {createDebitNotice.isPending && <Loader2 size={14} className="animate-spin" />}
                  Create Notice
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-50 p-3">
                  <Clock size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
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
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
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
                  <p className="text-sm text-gray-600">Approved Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Debit Notices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={32} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center gap-2 py-16 text-red-500">
                  <AlertCircle size={20} />
                  <span>Failed to load debit notices</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notices.length > 0 ? notices.map((notice) => (
                          <TableRow key={notice.id}>
                            <TableCell className="font-medium">{notice.tenantName}</TableCell>
                            <TableCell>{notice.propertyName}</TableCell>
                            <TableCell>{notice.reason}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{notice.description}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(notice.amount)}</TableCell>
                            <TableCell>{getStatusBadge(notice.status)}</TableCell>
                            <TableCell className="text-right">
                              {notice.status === 'PENDING' && (
                                  <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(notice, 'APPROVED')}
                                        disabled={updateDebitNotice.isPending}
                                        className="rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                                    >
                                      Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(notice, 'REJECTED')}
                                        disabled={updateDebitNotice.isPending}
                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </div>
                              )}
                              {notice.status !== 'PENDING' && (
                                  <span className="text-xs text-gray-400 capitalize">{notice.status.toLowerCase()}</span>
                              )}
                            </TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              No debit notices found
                            </TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}