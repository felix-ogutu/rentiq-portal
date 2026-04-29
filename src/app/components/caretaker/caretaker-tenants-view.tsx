import { TenantOnboarding, VacateNotice } from '../../types';
import { UserPlus, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';

interface CaretakerTenantsViewProps {
  onboardings: TenantOnboarding[];
  vacateNotices: VacateNotice[];
}

export function CaretakerTenantsView({ onboardings, vacateNotices }: CaretakerTenantsViewProps) {
  const [onboardDialogOpen, setOnboardDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    property: '',
    unit: '',
    rent: '',
    deposit: '',
    leaseStart: '',
    leaseEnd: ''
  });

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const handleOnboardTenant = () => {
    if (!formData.tenantName || !formData.tenantEmail || !formData.tenantPhone || 
        !formData.property || !formData.unit || !formData.rent || !formData.deposit ||
        !formData.leaseStart || !formData.leaseEnd) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success('Tenant onboarding submitted for approval!');
    setOnboardDialogOpen(false);
    setFormData({
      tenantName: '',
      tenantEmail: '',
      tenantPhone: '',
      property: '',
      unit: '',
      rent: '',
      deposit: '',
      leaseStart: '',
      leaseEnd: ''
    });
  };

  const handleApproveVacate = (noticeId: string) => {
    toast.success('Vacate notice approved!');
  };

  const handleRejectVacate = (noticeId: string) => {
    toast.error('Vacate notice rejected!');
  };

  const getOnboardingStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock size={14} className="inline mr-1" />Pending Approval</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle size={14} className="inline mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700"><XCircle size={14} className="inline mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getVacateStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock size={14} className="inline mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle size={14} className="inline mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700"><XCircle size={14} className="inline mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tenant Management</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Onboard new tenants and manage vacate notices
          </p>
        </div>
        <Dialog open={onboardDialogOpen} onOpenChange={setOnboardDialogOpen}>
          <DialogTrigger asChild>
            <button 
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors w-fit"
              style={{ backgroundColor: '#272757' }}
            >
              <UserPlus size={16} />
              Onboard New Tenant
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Onboard New Tenant</DialogTitle>
              <DialogDescription>
                Submit tenant details for landlord approval. An automated invoice will be generated upon approval.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name">Tenant Name *</Label>
                  <Input
                    id="tenant-name"
                    placeholder="Full name"
                    value={formData.tenantName}
                    onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-email">Email Address *</Label>
                  <Input
                    id="tenant-email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.tenantEmail}
                    onChange={(e) => setFormData({...formData, tenantEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-phone">Phone Number *</Label>
                  <Input
                    id="tenant-phone"
                    placeholder="+254 XXX XXX XXX"
                    value={formData.tenantPhone}
                    onChange={(e) => setFormData({...formData, tenantPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-select">Property *</Label>
                  <select
                    id="property-select"
                    value={formData.property}
                    onChange={(e) => setFormData({...formData, property: e.target.value})}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">Select property...</option>
                    <option value="prop-1">Riverside Apartments</option>
                    <option value="prop-2">Parkview Heights</option>
                    <option value="prop-3">Garden City Residences</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-select">Unit Number *</Label>
                  <select
                    id="unit-select"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">Select unit...</option>
                    <option value="A101">A101</option>
                    <option value="A102">A102</option>
                    <option value="B201">B201</option>
                    <option value="B202">B202</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent-amount">Monthly Rent (KES) *</Label>
                  <Input
                    id="rent-amount"
                    type="number"
                    placeholder="65000"
                    value={formData.rent}
                    onChange={(e) => setFormData({...formData, rent: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Security Deposit (KES) *</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="65000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lease-start">Lease Start Date *</Label>
                  <Input
                    id="lease-start"
                    type="date"
                    value={formData.leaseStart}
                    onChange={(e) => setFormData({...formData, leaseStart: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lease-end">Lease End Date *</Label>
                  <Input
                    id="lease-end"
                    type="date"
                    value={formData.leaseEnd}
                    onChange={(e) => setFormData({...formData, leaseEnd: e.target.value})}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                <FileText size={16} className="inline mr-2" />
                Upon approval, an invoice will be automatically generated and sent to the tenant's email.
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={() => setOnboardDialogOpen(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOnboardTenant}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: '#272757' }}
              >
                Submit for Approval
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
                <p className="text-sm text-gray-600">Pending Onboarding</p>
                <p className="text-2xl font-bold text-gray-900">
                  {onboardings.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {onboardings.filter(o => o.status === 'approved').length}
                </p>
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
                <p className="text-sm text-gray-600">Vacate Notices</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vacateNotices.filter(v => v.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="onboarding" className="w-full">
        <TabsList>
          <TabsTrigger value="onboarding">Tenant Onboarding</TabsTrigger>
          <TabsTrigger value="vacate">Vacate Notices</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Onboarding Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Tenant Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Property/Unit</TableHead>
                      <TableHead className="text-right">Rent</TableHead>
                      <TableHead className="text-right">Deposit</TableHead>
                      <TableHead>Lease Period</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {onboardings.length > 0 ? (
                      onboardings.map((onboarding) => (
                        <TableRow key={onboarding.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(onboarding.submittedDate).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell className="font-medium">{onboarding.tenantName}</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div>{onboarding.tenantEmail}</div>
                              <div className="text-gray-500">{onboarding.tenantPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {onboarding.propertyName} - {onboarding.unitNumber}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(onboarding.rent)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(onboarding.depositAmount)}</TableCell>
                          <TableCell className="whitespace-nowrap text-xs">
                            {new Date(onboarding.leaseStart).toLocaleDateString('en-GB')} - {new Date(onboarding.leaseEnd).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell>{getOnboardingStatusBadge(onboarding.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No onboarding requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacate">
          <Card>
            <CardHeader>
              <CardTitle>Notice to Vacate Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Tenant Name</TableHead>
                      <TableHead>Property/Unit</TableHead>
                      <TableHead>Vacate Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vacateNotices.length > 0 ? (
                      vacateNotices.map((notice) => (
                        <TableRow key={notice.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(notice.submittedDate).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell className="font-medium">{notice.tenantName}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {notice.propertyName} - {notice.unitNumber}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(notice.vacateDate).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{notice.reason}</TableCell>
                          <TableCell>{getVacateStatusBadge(notice.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {notice.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveVacate(notice.id)}
                                    className="rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectVacate(notice.id)}
                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {notice.status !== 'pending' && (
                                <span className="text-xs text-gray-500">
                                  {notice.approvalDate
                                    ? new Date(notice.approvalDate).toLocaleDateString('en-GB')
                                    : '-'}
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No vacate notices found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
