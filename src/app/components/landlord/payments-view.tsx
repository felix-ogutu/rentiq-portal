import { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  DollarSign,
  CreditCard,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

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

import { toast } from 'sonner';
import {
  usePayments,
  useCreatePayment,
  useInitiateMpesaPayment,
} from "../../hooks/usePayments";

import { useTenants } from "../../hooks/useTenants";
import {
  Payment,
  PaymentCreateRequest,
  PaymentType,
  PaymentMethod,
  InitiateMpesaPaymentRequest,
} from "../../types/payment";

export function PaymentsView() {
  const [filters, setFilters] = useState({
    page: 0,
    size: 20,
    paymentType: undefined as PaymentType | undefined,
    paymentMethod: undefined as PaymentMethod | undefined,
    reference: undefined as string | undefined,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mpesaDialogOpen, setMpesaDialogOpen] = useState(false);

  const [formData, setFormData] = useState<PaymentCreateRequest>({
    tenantId: 0,
    paymentType: PaymentType.RENT,
    amount: 0,
    paymentMethod: PaymentMethod.MPESA,
    reference: '',
    paymentDate: new Date().toISOString(),
    notes: '',
  });

  const [mpesaForm, setMpesaForm] = useState<InitiateMpesaPaymentRequest>({
    amount: 0,
    phone: '',
  });

  const [formErrors, setFormErrors] = useState({
    tenantId: '',
    amount: '',
    paymentDate: '',
  });

  const { data, isLoading, isError } = usePayments(filters);
  const createPayment = useCreatePayment();
  const initiateMpesa = useInitiateMpesaPayment();
  const { data: tenantsData } = useTenants({ page: 0, size: 100 });

  const payments = data?.data ?? [];
  const stats = data?.stats;
  const tenants = tenantsData?.data ?? [];

  const resetForm = () => {
    setFormData({
      tenantId: 0,
      paymentType: PaymentType.RENT,
      amount: 0,
      paymentMethod: PaymentMethod.MPESA,
      reference: '',
      paymentDate: new Date().toISOString(),
      notes: '',
    });
    setFormErrors({ tenantId: '', amount: '', paymentDate: '' });
  };

  const validateForm = (): boolean => {
    const errors = { tenantId: '', amount: '', paymentDate: '' };
    let isValid = true;

    if (!formData.tenantId || formData.tenantId <= 0) {
      errors.tenantId = 'Please select a tenant';
      isValid = false;
    }
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
      isValid = false;
    }
    if (!formData.paymentDate) {
      errors.paymentDate = 'Payment date is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createPayment.mutateAsync({
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success('Payment recorded successfully!');
      setCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleInitiateMpesa = async () => {
    if (!mpesaForm.amount || !mpesaForm.phone) {
      toast.error("Please provide both amount and phone number");
      return;
    }

    try {
      await initiateMpesa.mutateAsync(mpesaForm);
      toast.success("M-Pesa payment request sent successfully! Check your phone.");
      setMpesaDialogOpen(false);
      setMpesaForm({ amount: 0, phone: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initiate M-Pesa payment");
    }
  };

  const getMethodBadge = (method: PaymentMethod) => {
    const colors: Record<PaymentMethod, string> = {
      [PaymentMethod.MPESA]: 'bg-green-100 text-green-700',
      [PaymentMethod.BANK]: 'bg-blue-100 text-blue-700',
      [PaymentMethod.CASH]: 'bg-amber-100 text-amber-700',
    };
    return colors[method] || 'bg-gray-100 text-gray-700';
  };

  return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600">Track and manage all rental payments</p>
          </div>

          <div className="flex gap-3">
            {/* M-Pesa Quick Initiate Button */}
            <Button
                onClick={() => setMpesaDialogOpen(true)}
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
            >
              <CreditCard size={18} className="mr-2" />
              Initiate M-Pesa
            </Button>

            {/* Record Payment Button */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#272757] hover:bg-[#1f1f4d]">
                  <Plus size={18} className="mr-2" />
                  Record Payment
                </Button>
              </DialogTrigger>

              {/* Record Payment Dialog */}
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>Record a new payment from a tenant</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tenant <span className="text-red-500">*</span></Label>
                    <select
                        className={`w-full rounded-lg border px-3 py-2 ${formErrors.tenantId ? 'border-red-500' : 'border-gray-300'}`}
                        value={formData.tenantId || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, tenantId: parseInt(e.target.value) || 0 });
                          if (formErrors.tenantId) setFormErrors({ ...formErrors, tenantId: '' });
                        }}
                    >
                      <option value="">Select Tenant</option>
                      {tenants.map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.fullName}
                          </option>
                      ))}
                    </select>
                    {formErrors.tenantId && <p className="text-red-500 text-sm">{formErrors.tenantId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Type</Label>
                    <select
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        value={formData.paymentType}
                        onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentType })}
                    >
                      <option value={PaymentType.RENT}>Rent</option>
                      <option value={PaymentType.UTILITY}>Utility</option>
                      <option value={PaymentType.SERVICE_CHARGE}>Service Charge</option>
                      <option value={PaymentType.OTHER}>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount (KES) <span className="text-red-500">*</span></Label>
                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 });
                          if (formErrors.amount) setFormErrors({ ...formErrors, amount: '' });
                        }}
                        className={formErrors.amount ? 'border-red-500' : ''}
                    />
                    {formErrors.amount && <p className="text-red-500 text-sm">{formErrors.amount}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <select
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    >
                      <option value={PaymentMethod.MPESA}>M-PESA</option>
                      <option value={PaymentMethod.BANK}>Bank Transfer</option>
                      <option value={PaymentMethod.CASH}>Cash</option>
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
                    <Label>Payment Date <span className="text-red-500">*</span></Label>
                    <Input
                        type="datetime-local"
                        value={formData.paymentDate.slice(0, 16)}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        className={formErrors.paymentDate ? 'border-red-500' : ''}
                    />
                    {formErrors.paymentDate && <p className="text-red-500 text-sm">{formErrors.paymentDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Input
                        placeholder="Additional notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => { setCreateDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button
                      onClick={handleCreate}
                      disabled={createPayment.isPending}
                      className="bg-[#272757] hover:bg-[#1f1f4d]"
                  >
                    {createPayment.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                    Record Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">M-PESA Amount</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">
                    KES {(stats?.mpesaAmount || 0).toLocaleString()}
                  </p>
                </div>
                <CheckCircle size={28} className="text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bank Amount</p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">
                    KES {(stats?.bankAmount || 0).toLocaleString()}
                  </p>
                </div>
                <Receipt size={28} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cash Amount</p>
                  <p className="mt-1 text-3xl font-bold text-amber-600">
                    KES {(stats?.cashAmount || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign size={28} className="text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by reference..."
                className="pl-10"
                onChange={(e) => setFilters(f => ({ ...f, reference: e.target.value || undefined }))}
            />
          </div>

          <select
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, paymentType: (e.target.value || undefined) as PaymentType }))}
          >
            <option value="">All Payment Types</option>
            <option value={PaymentType.RENT}>Rent</option>
            <option value={PaymentType.UTILITY}>Utility</option>
            <option value={PaymentType.SERVICE_CHARGE}>Service Charge</option>
            <option value={PaymentType.OTHER}>Other</option>
          </select>

          <select
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, paymentMethod: (e.target.value || undefined) as PaymentMethod }))}
          >
            <option value="">All Methods</option>
            <option value={PaymentMethod.MPESA}>M-PESA</option>
            <option value={PaymentMethod.BANK}>Bank</option>
            <option value={PaymentMethod.CASH}>Cash</option>
          </select>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt size={20} />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={40} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                  <AlertCircle size={40} />
                  <p className="mt-4">Failed to load payments</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                            No payments found
                          </TableCell>
                        </TableRow>
                    ) : (
                        payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{new Date(payment.paymentDate).toLocaleDateString('en-GB')}</TableCell>
                              <TableCell className="font-medium">{payment.tenantName}</TableCell>
                              <TableCell>{payment.propertyName || '-'}</TableCell>
                              <TableCell>{payment.unitName || '-'}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{payment.paymentType}</Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium text-emerald-600">
                                KES {payment.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge className={getMethodBadge(payment.paymentMethod)}>
                                  {payment.paymentMethod}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {payment.reference || '-'}
                                </code>
                              </TableCell>
                            </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* M-Pesa Initiation Dialog */}
        <Dialog open={mpesaDialogOpen} onOpenChange={setMpesaDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Initiate M-Pesa Payment</DialogTitle>
              <DialogDescription>
                Send STK Push payment request to tenant
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Phone Number (254...) <span className="text-red-500">*</span></Label>
                <Input
                    placeholder="254712345678"
                    value={mpesaForm.phone}
                    onChange={(e) => setMpesaForm({ ...mpesaForm, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount (KES) <span className="text-red-500">*</span></Label>
                <Input
                    type="number"
                    placeholder="Enter amount"
                    value={mpesaForm.amount || ''}
                    onChange={(e) => setMpesaForm({ ...mpesaForm, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setMpesaDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                  onClick={handleInitiateMpesa}
                  disabled={initiateMpesa.isPending}
                  className="bg-green-600 hover:bg-green-700"
              >
                {initiateMpesa.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
                Send M-Pesa Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}