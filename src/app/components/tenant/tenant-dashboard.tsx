import { Payment, Invoice, MaintenanceRequest } from '../../types';
import { Receipt, Wrench, CreditCard, Home, Calendar, AlertCircle, Shield, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

interface TenantDashboardProps {
  tenant: {
    name: string;
    unitNumber: string;
    propertyName: string;
    rent: number;
    balance: number;
    leaseEnd: string;
    depositAmount?: number;
    depositPaidDate?: string;
  };
  invoices: Invoice[];
  payments: Payment[];
  maintenanceRequests: MaintenanceRequest[];
}

export function TenantDashboard({ tenant, invoices, payments, maintenanceRequests }: TenantDashboardProps) {
  const [vacateDialogOpen, setVacateDialogOpen] = useState(false);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [vacateDate, setVacateDate] = useState('');
  const [vacateReason, setVacateReason] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('id');

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const currentInvoice = invoices.find(inv => inv.status === 'sent' || inv.status === 'overdue');
  const recentPayments = payments.filter(p => p.status === 'paid').slice(0, 5);
  const activeRequests = maintenanceRequests.filter(r => r.status !== 'completed');

  const handleVacateSubmit = () => {
    if (!vacateDate || !vacateReason) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success('Notice to vacate submitted successfully! Awaiting approval.');
    setVacateDialogOpen(false);
    setVacateDate('');
    setVacateReason('');
  };

  const handleDocumentUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    toast.success(`${documentType.toUpperCase()} document uploaded successfully!`);
    setDocumentsDialogOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {tenant.name}!</h1>
        <p className="mt-1 text-gray-600">
          {tenant.propertyName} - Unit {tenant.unitNumber}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-3">
                <Home size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Rent</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(tenant.rent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-3 ${tenant.balance < 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <CreditCard size={24} className={tenant.balance < 0 ? 'text-red-600' : 'text-green-600'} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className={`text-xl font-bold ${tenant.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(Math.abs(tenant.balance))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-50 p-3">
                <Shield size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Security Deposit</p>
                <p className="text-xl font-bold text-gray-900">
                  {tenant.depositAmount ? formatCurrency(tenant.depositAmount) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-50 p-3">
                <Wrench size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Requests</p>
                <p className="text-xl font-bold text-gray-900">{activeRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Invoice */}
      {currentInvoice && (
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Invoice</CardTitle>
              <Badge className={currentInvoice.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                {currentInvoice.status === 'overdue' ? 'Overdue' : 'Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentInvoice.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.description}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(currentInvoice.total)}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Due Date: {new Date(currentInvoice.dueDate).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  className="flex-1 rounded-lg px-4 py-3 font-medium text-white transition-colors"
                  style={{ backgroundColor: '#272757' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e1e40'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#272757'}
                >
                  Pay Now via M-PESA
                </button>
                <button className="rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Download Invoice
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lease Information */}
      {tenant.balance < 0 && (
        <Card className="border-l-4 border-l-red-600 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="mt-0.5 text-red-600" />
              <div>
                <h3 className="font-bold text-red-900">Outstanding Balance</h3>
                <p className="mt-1 text-sm text-red-700">
                  You have an outstanding balance of {formatCurrency(Math.abs(tenant.balance))}. 
                  Please make payment to avoid late fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-gray-500">{payment.method?.toUpperCase()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No payment history</p>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Maintenance Requests</CardTitle>
              <button className="text-sm text-blue-600 hover:underline">
                + New Request
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {activeRequests.length > 0 ? (
              <div className="space-y-3">
                {activeRequests.map((request) => (
                  <div key={request.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{request.category}</p>
                        <p className="text-sm text-gray-600">{request.description}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Reported: {new Date(request.dateReported).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <Badge className={
                        request.status === 'in-progress' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }>
                        {request.status === 'in-progress' ? 'In Progress' : 'Open'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No active requests</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lease Info */}
      <Card>
        <CardHeader>
          <CardTitle>Lease Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Property</p>
              <p className="mt-1 font-medium text-gray-900">{tenant.propertyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unit Number</p>
              <p className="mt-1 font-medium text-gray-900">{tenant.unitNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Expires</p>
              <p className="mt-1 font-medium text-gray-900">
                {new Date(tenant.leaseEnd).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Download Lease Agreement
            </button>
            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              Request Lease Renewal
            </button>
            
            <Dialog open={vacateDialogOpen} onOpenChange={setVacateDialogOpen}>
              <DialogTrigger asChild>
                <button className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50">
                  <FileText size={16} className="inline mr-2" />
                  Submit Notice to Vacate
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Notice to Vacate</DialogTitle>
                  <DialogDescription>
                    Submit your notice to vacate the property. This will be sent for approval.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="vacate-date">Intended Vacate Date</Label>
                    <Input
                      id="vacate-date"
                      type="date"
                      value={vacateDate}
                      onChange={(e) => setVacateDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacate-reason">Reason for Leaving</Label>
                    <Textarea
                      id="vacate-reason"
                      placeholder="Please provide your reason for leaving..."
                      value={vacateReason}
                      onChange={(e) => setVacateReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                    <AlertCircle size={16} className="inline mr-2" />
                    Your security deposit will be refunded after inspection and settlement of any outstanding bills.
                  </div>
                </div>
                <DialogFooter>
                  <button
                    onClick={() => setVacateDialogOpen(false)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVacateSubmit}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: '#272757' }}
                  >
                    Submit Notice
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={documentsDialogOpen} onOpenChange={setDocumentsDialogOpen}>
              <DialogTrigger asChild>
                <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <Upload size={16} className="inline mr-2" />
                  Upload Documents
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                  <DialogDescription>
                    Upload your identification or other required documents.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="doc-type">Document Type</Label>
                    <select
                      id="doc-type"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      <option value="id">National ID</option>
                      <option value="passport">Passport</option>
                      <option value="lease">Lease Agreement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doc-file">Select File</Label>
                    <Input
                      id="doc-file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                  {selectedFile && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                      <FileText size={16} className="inline mr-2" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <button
                    onClick={() => setDocumentsDialogOpen(false)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDocumentUpload}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: '#272757' }}
                  >
                    Upload Document
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
