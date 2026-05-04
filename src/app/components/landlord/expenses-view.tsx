import { useState } from 'react';
import { TrendingDown, Plus, Search, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

import { toast } from 'sonner';
import { useExpenses, useCreateExpense, useUpdateExpense } from "../../hooks/useExpenses";
import { useProperties } from "../../hooks/useProperties";
import { ExpenseCreateRequest, ExpenseUpdateRequest, ExpenseStatus } from "../../types/expense";
import { Property } from "../../types/property";

export function ExpensesView() {
  const [filters, setFilters] = useState({
    page: 0,
    size: 20,
    propertyName: undefined as string | undefined,
    category: undefined as string | undefined,
    status: undefined as ExpenseStatus | undefined,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState<ExpenseCreateRequest>({
    propertyName: '',
    category: '',
    description: '',
    amount: 0,
  });

  const [formErrors, setFormErrors] = useState({
    propertyName: '',
    category: '',
    amount: '',
    description: '',
  });

  const { data, isLoading, isError } = useExpenses(filters);
  const { data: propertiesData } = useProperties({ page: 0, size: 100 });

  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const expenses = data?.data ?? [];
  const stats = data?.stats;
  const properties = propertiesData?.data ?? [];

  const resetForm = () => {
    setFormData({ propertyName: '', category: '', description: '', amount: 0 });
    setFormErrors({ propertyName: '', category: '', amount: '', description: '' });
  };

  const validateForm = (): boolean => {
    const errors = { propertyName: '', category: '', amount: '', description: '' };
    let isValid = true;

    if (!formData.propertyName) {
      errors.propertyName = 'Please select a property';
      isValid = false;
    }
    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
      isValid = false;
    }
    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      await createExpense.mutateAsync(formData);
      toast.success('Expense recorded successfully!');
      setCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create expense');
    }
  };

  // Updated to send full payload as required by backend
  const handleProcessExpense = async (expense: any) => {
    const updatePayload: ExpenseUpdateRequest = {
      id: expense.id,
      propertyName: expense.propertyName,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      status: ExpenseStatus.PROCESSED,
    };

    try {
      await updateExpense.mutateAsync(updatePayload);
      toast.success('Expense processed successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to process expense');
    }
  };

  const getStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case ExpenseStatus.PROCESSED:
        return <Badge className="bg-green-100 text-green-700"><CheckCircle size={14} className="mr-1" />Processed</Badge>;
      case ExpenseStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock size={14} className="mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600">Track and manage property expenses</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#272757] hover:bg-[#1f1f4d]">
                <Plus size={18} className="mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogDescription>Record a new property expense</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Property <span className="text-red-500">*</span></Label>
                  <select
                      className={`w-full rounded-lg border px-3 py-2 ${formErrors.propertyName ? 'border-red-500' : ''}`}
                      value={formData.propertyName}
                      onChange={(e) => {
                        setFormData({ ...formData, propertyName: e.target.value });
                        if (formErrors.propertyName) setFormErrors({ ...formErrors, propertyName: '' });
                      }}
                  >
                    <option value="">Select Property</option>
                    {properties.map((prop: Property) => (
                        <option key={prop.id} value={prop.propertyName}>
                          {prop.propertyName} - {prop.address}
                        </option>
                    ))}
                  </select>
                  {formErrors.propertyName && <p className="text-red-500 text-sm">{formErrors.propertyName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Category <span className="text-red-500">*</span></Label>
                  <select
                      className={`w-full rounded-lg border px-3 py-2 ${formErrors.category ? 'border-red-500' : ''}`}
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value });
                        if (formErrors.category) setFormErrors({ ...formErrors, category: '' });
                      }}
                  >
                    <option value="">Select category</option>
                    <option value="Repairs">Repairs</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Description <span className="text-red-500">*</span></Label>
                  <Textarea
                      placeholder="Describe the expense..."
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                        if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                      }}
                      rows={3}
                      className={formErrors.description ? 'border-red-500' : ''}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
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
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setCreateDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    disabled={createExpense.isPending}
                    className="bg-[#272757] hover:bg-[#1f1f4d]"
                >
                  {createExpense.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                  Add Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    KES {(stats?.totalExpenses || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingDown size={28} className="text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Processed</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">
                    KES {(stats?.approvedAmount || stats?.paidAmount || 0).toLocaleString()}
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
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="mt-1 text-3xl font-bold text-yellow-600">
                    KES {(stats?.pendingAmount || 0).toLocaleString()}
                  </p>
                </div>
                <Clock size={28} className="text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by property..."
                className="pl-10"
                onChange={(e) => setFilters(f => ({ ...f, propertyName: e.target.value || undefined }))}
            />
          </div>

          <select
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
          >
            <option value="">All Categories</option>
            <option value="Repairs">Repairs</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Utilities">Utilities</option>
            <option value="Salaries">Salaries</option>
            <option value="Supplies">Supplies</option>
            <option value="Other">Other</option>
          </select>

          <select
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, status: (e.target.value || undefined) as ExpenseStatus }))}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSED">Processed</option>
          </select>
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
                  <p className="mt-4">Failed to load expenses</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                            No expenses found
                          </TableCell>
                        </TableRow>
                    ) : (
                        expenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell className="font-medium">{expense.propertyName}</TableCell>
                              <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                              <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                              <TableCell className="text-right font-medium text-red-600">
                                KES {expense.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>{getStatusBadge(expense.status)}</TableCell>
                              <TableCell>
                                {expense.status === ExpenseStatus.PENDING && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleProcessExpense(expense)}
                                    >
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
      </div>
  );
}