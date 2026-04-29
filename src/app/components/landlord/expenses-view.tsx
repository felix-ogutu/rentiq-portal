import { useState } from 'react';
import { TrendingDown, Plus, Download, Search, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {ExpenseFilter, ExpenseStatus} from "../../types/expense";
import {useCreateExpense, useExpenses, useUpdateExpense} from "../../hooks/useExpenses";


export function ExpensesView() {
  const [filters, setFilters] = useState<ExpenseFilter>({ page: 0, size: 20 });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: '',
    category: '',
    description: '',
    amount: '',
    status: 'PENDING' as ExpenseStatus,
  });

  const { data, isLoading, isError } = useExpenses(filters);
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const expenses = data?.data ?? [];

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = expenses.filter(e => e.status === 'PAID').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = expenses.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + e.amount, 0);
  const totalApproved = expenses.filter(e => e.status === 'APPROVED').reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleCreate = async () => {
    if (!formData.propertyName || !formData.category || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createExpense.mutateAsync({ ...formData, amount: parseFloat(formData.amount) });
      toast.success('Expense created successfully!');
      setCreateDialogOpen(false);
      setFormData({ propertyName: '', category: '', description: '', amount: '', status: 'PENDING' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create expense');
    }
  };

  const handleApprove = async (expense: typeof expenses[0]) => {
    try {
      await updateExpense.mutateAsync({ ...expense, status: 'APPROVED' });
      toast.success('Expense approved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve expense');
    }
  };

  const getStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle size={14} className="mr-1" />Paid</Badge>;
      case 'APPROVED':
        return <Badge className="bg-blue-100 text-blue-700"><CheckCircle size={14} className="mr-1" />Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock size={14} className="mr-1" />Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-700"><AlertCircle size={14} className="mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="mt-1 text-sm text-gray-600">Track and manage property expenses</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Download size={18} />
              Export
            </button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white"
                    style={{ backgroundColor: '#272757' }}
                >
                  <Plus size={18} />
                  Add Expense
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                  <DialogDescription>Record a new property expense.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Property Name</Label>
                    <Input
                        placeholder="Enter property name"
                        value={formData.propertyName}
                        onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select category...</option>
                      <option value="Repairs">Repairs</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Supplies">Supplies</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Describe the expense..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
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
                    <Label>Status</Label>
                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ExpenseStatus })}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PAID">Paid</option>
                    </select>
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
                      disabled={createExpense.isPending}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      style={{ backgroundColor: '#272757' }}
                  >
                    {createExpense.isPending && <Loader2 size={14} className="animate-spin" />}
                    Add Expense
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
                  <p className="mt-1 text-xs text-gray-500">{expenses.length} records</p>
                </div>
                <TrendingDown size={24} className="text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                  <p className="mt-1 text-xs text-gray-500">{expenses.filter(e => e.status === 'PAID').length} expenses</p>
                </div>
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="mt-1 text-2xl font-bold text-blue-600">{formatCurrency(totalApproved)}</p>
                  <p className="mt-1 text-xs text-gray-500">{expenses.filter(e => e.status === 'APPROVED').length} expenses</p>
                </div>
                <CheckCircle size={24} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="mt-1 text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
                  <p className="mt-1 text-xs text-gray-500">{expenses.filter(e => e.status === 'PENDING').length} expenses</p>
                </div>
                <Clock size={24} className="text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Filter by property name..."
                className="pl-10"
                onChange={(e) => setFilters(f => ({ ...f, propertyName: e.target.value || undefined }))}
            />
          </div>
          <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
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
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, status: (e.target.value || undefined) as ExpenseStatus | undefined }))}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
            <option value="REJECTED">Rejected</option>
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
                  <span>Failed to load expenses</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.length > 0 ? expenses.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">{expense.propertyName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{expense.category}</Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(expense.amount)}</TableCell>
                            <TableCell>{getStatusBadge(expense.status)}</TableCell>
                            <TableCell className="text-right">
                              {expense.status === 'PENDING' ? (
                                  <button
                                      onClick={() => handleApprove(expense)}
                                      disabled={updateExpense.isPending}
                                      className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                              ) : (
                                  <span className="text-sm text-gray-400">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                      )) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No expenses found
                            </TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        {Object.keys(categoryTotals).length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">Expenses by Category</h3>
                <div className="space-y-4">
                  {Object.entries(categoryTotals).map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">{category}</span>
                          <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                              className="h-2 rounded-full"
                              style={{ width: `${(amount / totalExpenses) * 100}%`, backgroundColor: '#272757' }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {((amount / totalExpenses) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  );
}