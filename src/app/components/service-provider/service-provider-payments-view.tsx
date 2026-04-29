import { useState, useMemo } from 'react';
import { MaintenanceRequest } from '../../types';
import { Search, ChevronLeft, ChevronRight, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';

interface ServiceProviderPaymentsViewProps {
  maintenanceRequests: MaintenanceRequest[];
}

// Mock payment data based on completed jobs
interface Payment {
  id: string;
  jobId: string;
  jobDescription: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'processing';
  paymentMethod: string;
  invoiceNumber: string;
}

export function ServiceProviderPaymentsView({ maintenanceRequests }: ServiceProviderPaymentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Generate mock payments from maintenance requests
  const payments: Payment[] = maintenanceRequests
    .filter(r => r.assignedTo === 'Service Provider' && r.cost)
    .map((request, index) => ({
      id: `PAY-${String(index + 1).padStart(4, '0')}`,
      jobId: request.id,
      jobDescription: request.issue,
      amount: request.cost || 0,
      date: request.reportedDate,
      status: request.status === 'completed' ? (index % 3 === 0 ? 'paid' : 'processing') : 'pending',
      paymentMethod: index % 2 === 0 ? 'Bank Transfer' : 'M-PESA',
      invoiceNumber: `INV-2026-${String(index + 100).padStart(4, '0')}`
    }));

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = payment.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           payment.jobId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'processing':
        return <Clock size={16} className="text-blue-600" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleDownloadInvoice = (paymentId: string) => {
    console.log('Download invoice:', paymentId);
    alert('Download invoice - Feature coming soon!');
  };

  // Calculate totals
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending' || p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Invoices</h1>
          <p className="mt-1 text-gray-600">Track your earnings and payment history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="mt-1 text-3xl font-bold text-blue-600">
                  KES {totalEarnings.toLocaleString()}
                </p>
              </div>
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="mt-1 text-3xl font-bold text-green-600">
                  KES {paidAmount.toLocaleString()}
                </p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="mt-1 text-3xl font-bold text-yellow-600">
                  KES {pendingAmount.toLocaleString()}
                </p>
              </div>
              <Clock size={24} className="text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="mt-1 text-3xl font-bold text-purple-600">{payments.length}</p>
              </div>
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by job, invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700 w-16">#</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Invoice #</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Job ID</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Description</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Payment Method</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment, index) => {
                const rowNumber = startIndex + index + 1;
                return (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="text-gray-600 font-medium">{rowNumber}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{payment.invoiceNumber}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">#{payment.jobId}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900 max-w-xs truncate">{payment.jobDescription}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{payment.date}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{payment.paymentMethod}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">
                        KES {payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(payment.status)}
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(payment.id)}
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No payments found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} payments
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                          currentPage === pageNum
                            ? 'text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        style={currentPage === pageNum ? { backgroundColor: '#272757' } : {}}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
