import { useState } from 'react';
import { Receipt, Search, Filter, Plus, Download, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import {PaymentFilter, PaymentMethod, PaymentType} from "../../types/payment";
import {useCreatePayment, usePayments} from "../../hooks/usePayments";

export function PaymentsView() {
  const [filters, setFilters] = useState<PaymentFilter>({ page: 0, size: 20 });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenantId: 0,
    paymentType: 'RENT' as PaymentType,
    amount: '',
    paymentMethod: 'MPESA' as PaymentMethod,
    reference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data, isLoading, isError } = usePayments(filters);
  const createPayment = useCreatePayment();

  const payments = data?.data ?? [];

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (method: PaymentMethod) => (
      <Badge className="bg-green-100 text-green-700">
        <CheckCircle size={14} className="mr-1" />
        {method}
      </Badge>
  );

  const handleCreate = async () => {
    if (!formData.tenantId || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createPayment.mutateAsync({
        ...formData,
        amount: parseFloat(formData.amount),
        paymentDate: new Date(formData.paymentDate).toISOString(),
      });
      toast.success('Payment recorded successfully!');
      setCreateDialogOpen(false);
      setFormData({
        tenantId: 0,
        paymentType: 'RENT',
        amount: '',
        paymentMethod: 'MPESA',
        reference: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment');
    }
  };

  return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payments</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Track and manage all rental payments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Download size={18} />
              Export
            </button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <button
                    className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-white"
                    style={{ backgroundColor: '#272757' }}
                >
                  <Plus size={18} />
                  Record Payment
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>Record a new payment from a tenant.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tenant ID</Label>
                    <Input
                        type="number"
                        placeholder="Enter tenant ID"
                        value={formData.tenantId || ''}
                        onChange={(e) => setFormData({ ...formData, tenantId: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Type</Label>
                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        value={formData.paymentType}
                        onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentType })}
                    >
                      <option value="RENT">Rent</option>
                      <option value="DEPOSIT">Deposit</option>
                      <option value="UTILITY">Utility</option>
                      <option value="PENALTY">Penalty</option>
                      <option value="OTHER">Other</option>
                    </select>
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
                    <Label>Payment Method</Label>
                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    >
                      <option value="MPESA">M-PESA</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CASH">Cash</option>
                      <option value="CHEQUE">Cheque</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input
                        placeholder="e.g. MPESA transaction code"
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Date</Label>
                    <Input
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                        placeholder="Optional notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                      disabled={createPayment.isPending}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      style={{ backgroundColor: '#272757' }}
                  >
                    {createPayment.isPending && <Loader2 size={14} className="animate-spin" />}
                    Record Payment
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Recorded</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
                  <p className="mt-1 text-xs text-gray-500">{payments.length} payments</p>
                </div>
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Results</p>
                  <p className="mt-1 text-2xl font-bold text-blue-600">{data?.totalResults ?? 0}</p>
                  <p className="mt-1 text-xs text-gray-500">All time</p>
                </div>
                <Receipt size={24} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Page</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{payments.length}</p>
                  <p className="mt-1 text-xs text-gray-500">of {data?.totalResults ?? 0} total</p>
                </div>
                <Clock size={24} className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by reference..."
                className="pl-10"
                onChange={(e) => setFilters(f => ({ ...f, reference: e.target.value || undefined }))}
            />
          </div>
          <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, paymentType: (e.target.value || undefined) as PaymentType | undefined }))}
          >
            <option value="">All Types</option>
            <option value="RENT">Rent</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="UTILITY">Utility</option>
            <option value="PENALTY">Penalty</option>
            <option value="OTHER">Other</option>
          </select>
          <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, paymentMethod: (e.target.value || undefined) as PaymentMethod | undefined }))}
          >
            <option value="">All Methods</option>
            <option value="MPESA">M-PESA</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={32} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center gap-2 py-16 text-red-500">
                  <AlertCircle size={20} />
                  <span>Failed to load payments</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Tenant ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.length > 0 ? payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {new Date(payment.paymentDate).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="font-medium">{payment.tenantId}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{payment.paymentType}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{getStatusBadge(payment.paymentMethod)}</TableCell>
                            <TableCell>
                              {payment.reference
                                  ? <code className="rounded bg-gray-100 px-2 py-1 text-xs">{payment.reference}</code>
                                  : <span className="text-gray-400">-</span>}
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">{payment.notes || '-'}</TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              No payments found
                            </TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {(data?.totalResults ?? 0) > filters.size && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {filters.page + 1} of {Math.ceil((data?.totalResults ?? 0) / filters.size)}
              </p>
              <div className="flex gap-2">
                <button
                    disabled={filters.page === 0}
                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                    disabled={(filters.page + 1) * filters.size >= (data?.totalResults ?? 0)}
                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
        )}
      </div>
  );
}