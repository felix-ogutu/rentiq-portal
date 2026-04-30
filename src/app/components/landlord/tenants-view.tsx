import { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Eye,
  Edit2,
  AlertCircle,
  Loader2,
  User,
  Phone,
  Mail,
} from 'lucide-react';

import { Card, CardContent } from '../ui/card';
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
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { toast } from 'sonner';
import { useTenants, useCreateTenant, useUpdateTenant } from "../../hooks/useTenants";
import { useUnits } from "../../hooks/useUnits";
import { Tenant, TenantCreateRequest, TenantStatus } from "../../types/tenant";

export function TenantsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'all'>('all');

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState<TenantCreateRequest>({
    fullName: '',
    email: '',
    phone: '',
    unitId: 0,
    monthlyRent: 0,
    initialBalance: 0,
    leaseEndDate: '',
    status: TenantStatus.ACTIVE,
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    unitId: '',
    monthlyRent: '',
    leaseEndDate: '',
  });

  // Fetch tenants and available units
  const { data: tenantsData, isLoading, isError } = useTenants({ page: 0, size: 100 });
  const { data: unitsData } = useUnits({ page: 0, size: 200 });   // Get all units for dropdown

  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();

  const tenants = tenantsData?.data ?? [];
  const units = unitsData?.data ?? [];        // Available units for dropdown

  const stats = tenantsData?.stats;

  const totalTenants = stats?.totalTenants ?? tenants.length;
  const activeCount = stats?.activeTenants ?? 0;
  const arrearsCount = stats?.inArrearsTenants ?? 0;
  const noticeCount = stats?.noticePeriodTenants ?? 0;

  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
      const matchesSearch =
          tenant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.phone.includes(searchQuery);

      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      unitId: 0,
      monthlyRent: 0,
      initialBalance: 0,
      leaseEndDate: '',
      status: TenantStatus.ACTIVE,
    });
    setFormErrors({ fullName: '', email: '', phone: '', unitId: '', monthlyRent: '', leaseEndDate: '' });
  };

  const validateForm = (): boolean => {
    const errors = { fullName: '', email: '', phone: '', unitId: '', monthlyRent: '', leaseEndDate: '' };
    let isValid = true;

    if (!formData.fullName.trim()) { errors.fullName = 'Full name is required'; isValid = false; }
    else if (formData.fullName.trim().length < 3) { errors.fullName = 'Full name must be at least 3 characters'; isValid = false; }

    if (!formData.email.trim()) { errors.email = 'Email is required'; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { errors.email = 'Please enter a valid email'; isValid = false; }

    if (!formData.phone.trim()) { errors.phone = 'Phone number is required'; isValid = false; }

    if (!formData.unitId || formData.unitId <= 0) {
      errors.unitId = 'Please select a unit';
      isValid = false;
    }

    if (formData.monthlyRent <= 0) { errors.monthlyRent = 'Monthly rent must be greater than 0'; isValid = false; }

    if (!formData.leaseEndDate) { errors.leaseEndDate = 'Lease end date is required'; isValid = false; }

    setFormErrors(errors);
    return isValid;
  };

  const openAddDialog = () => {
    setIsEditing(false);
    resetForm();
    setShowFormDialog(true);
  };

  const openEditDialog = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsEditing(true);
    setFormData({
      fullName: tenant.fullName,
      email: tenant.email,
      phone: tenant.phone,
      unitId: tenant.unitId,
      monthlyRent: tenant.monthlyRent,
      initialBalance: tenant.initialBalance,
      leaseEndDate: tenant.leaseEndDate,
      status: tenant.status,
    });
    setFormErrors({ fullName: '', email: '', phone: '', unitId: '', monthlyRent: '', leaseEndDate: '' });
    setShowFormDialog(true);
  };

  const openViewDialog = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedTenant(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && selectedTenant) {
        await updateTenant.mutateAsync({ id: selectedTenant.id, ...formData });
        toast.success('Tenant updated successfully!');
      } else {
        await createTenant.mutateAsync(formData);
        toast.success('Tenant created successfully!');
      }
      setShowFormDialog(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  const getStatusStyle = (status: TenantStatus) => {
    switch (status) {
      case TenantStatus.ACTIVE: return 'bg-green-100 text-green-700';
      case TenantStatus.IN_ARREARS: return 'bg-orange-100 text-orange-700';
      case TenantStatus.NOTICE_PERIOD: return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
            <p className="text-gray-600">Manage tenant information and relationships</p>
          </div>
          <Button onClick={openAddDialog} className="bg-[#272757] hover:bg-[#1f1f4d]">
            <UserPlus size={18} className="mr-2" />
            Add New Tenant
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tenants</p>
                  <p className="text-3xl font-bold mt-1">{totalTenants}</p>
                </div>
                <User size={28} className="text-[#272757]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{activeCount}</p>
                </div>
                <User size={28} className="text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Arrears</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{arrearsCount}</p>
                </div>
                <AlertCircle size={28} className="text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notice Period</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{noticeCount}</p>
                </div>
                <AlertCircle size={28} className="text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by name, email or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TenantStatus | 'all')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#272757]"
          >
            <option value="all">All Statuses</option>
            <option value={TenantStatus.ACTIVE}>Active</option>
            <option value={TenantStatus.IN_ARREARS}>In Arrears</option>
            <option value={TenantStatus.NOTICE_PERIOD}>Notice Period</option>
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
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                  <AlertCircle size={40} />
                  <p className="mt-4">Failed to load tenants</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Tenant Name</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Monthly Rent</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Lease End</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-12 text-gray-500">
                            No tenants found
                          </TableCell>
                        </TableRow>
                    ) : (
                        filteredTenants.map((tenant, index) => (
                            <TableRow key={tenant.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                              <TableCell className="font-medium">{tenant.fullName}</TableCell>
                              <TableCell>{tenant.propertyName || `Property ${tenant.propertyId}`}</TableCell>
                              <TableCell className="font-medium">{tenant.unitNumber || tenant.unitId}</TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div><Mail size={14} className="inline mr-1" /> {tenant.email}</div>
                                  <div><Phone size={14} className="inline mr-1" /> {tenant.phone}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">KES {tenant.monthlyRent.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-medium">
                        <span className={tenant.initialBalance > 0 ? "text-red-600" : "text-green-600"}>
                          KES {tenant.initialBalance.toLocaleString()}
                        </span>
                              </TableCell>
                              <TableCell>{tenant.leaseEndDate}</TableCell>
                              <TableCell>
                                <Badge className={getStatusStyle(tenant.status)}>
                                  {tenant.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 justify-center">
                                  <Button variant="outline" size="sm" onClick={() => openViewDialog(tenant)}>
                                    <Eye size={16} />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => openEditDialog(tenant)}>
                                    <Edit2 size={16} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* Create / Edit Dialog with Unit Dropdown */}
        <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update tenant information' : 'Register a new tenant'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name <span className="text-red-500">*</span></Label>
                <Input
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                    }}
                    className={formErrors.fullName ? 'border-red-500' : ''}
                />
                {formErrors.fullName && <p className="text-red-500 text-sm">{formErrors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Phone <span className="text-red-500">*</span></Label>
                  <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                      }}
                      className={formErrors.phone ? 'border-red-500' : ''}
                  />
                  {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                </div>
              </div>

              {/* Unit Dropdown - This is the main change */}
              <div className="space-y-2">
                <Label>Unit <span className="text-red-500">*</span></Label>
                <Select
                    value={formData.unitId ? String(formData.unitId) : ""}
                    onValueChange={(value) => {
                      const unitId = parseInt(value);
                      const selectedUnit = units.find(u => u.id === unitId);
                      setFormData({
                        ...formData,
                        unitId: unitId,
                        monthlyRent: selectedUnit?.monthlyRent || formData.monthlyRent, // Auto-fill rent if available
                      });
                      if (formErrors.unitId) setFormErrors({ ...formErrors, unitId: '' });
                    }}
                >
                  <SelectTrigger className={formErrors.unitId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.unitNumber}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.unitId && <p className="text-red-500 text-sm">{formErrors.unitId}</p>}
              </div>

              {/* Rest of the form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Rent (KES) <span className="text-red-500">*</span></Label>
                  <Input
                      type="number"
                      min="0"
                      value={formData.monthlyRent || ''}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                      className={formErrors.monthlyRent ? 'border-red-500' : ''}
                  />
                  {formErrors.monthlyRent && <p className="text-red-500 text-sm">{formErrors.monthlyRent}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Initial Balance (KES)</Label>
                  <Input
                      type="number"
                      min="0"
                      value={formData.initialBalance || ''}
                      onChange={(e) => setFormData({ ...formData, initialBalance: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lease End Date <span className="text-red-500">*</span></Label>
                <Input
                    type="date"
                    value={formData.leaseEndDate}
                    onChange={(e) => {
                      setFormData({ ...formData, leaseEndDate: e.target.value });
                      if (formErrors.leaseEndDate) setFormErrors({ ...formErrors, leaseEndDate: '' });
                    }}
                    className={formErrors.leaseEndDate ? 'border-red-500' : ''}
                />
                {formErrors.leaseEndDate && <p className="text-red-500 text-sm">{formErrors.leaseEndDate}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TenantStatus })}
                >
                  <option value={TenantStatus.ACTIVE}>Active</option>
                  <option value={TenantStatus.IN_ARREARS}>In Arrears</option>
                  <option value={TenantStatus.NOTICE_PERIOD}>Notice Period</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setShowFormDialog(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={createTenant.isPending || updateTenant.isPending}
                    className="bg-[#272757] hover:bg-[#1f1f4d]"
                >
                  {(createTenant.isPending || updateTenant.isPending) && <Loader2 size={16} className="animate-spin mr-2" />}
                  {isEditing ? 'Update Tenant' : 'Create Tenant'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Dialog - Same as before */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tenant Details</DialogTitle>
            </DialogHeader>

            {selectedTenant && (
                <div className="space-y-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={28} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedTenant.fullName}</h3>
                      <p className="text-sm text-gray-500">ID: {selectedTenant.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Property</p>
                      <p className="font-medium">{selectedTenant.propertyName || `Property ${selectedTenant.propertyId}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unit</p>
                      <p className="font-medium">{selectedTenant.unitNumber || selectedTenant.unitId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedTenant.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedTenant.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Rent</p>
                      <p className="font-medium text-emerald-600">KES {selectedTenant.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Initial Balance</p>
                      <p className={`font-medium ${selectedTenant.initialBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        KES {selectedTenant.initialBalance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lease End Date</p>
                      <p className="font-medium">{selectedTenant.leaseEndDate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={getStatusStyle(selectedTenant.status)}>
                      {selectedTenant.status}
                    </Badge>
                  </div>
                </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={closeViewDialog}>Close</Button>
              <Button onClick={() => { closeViewDialog(); if (selectedTenant) openEditDialog(selectedTenant); }}>
                Edit Tenant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}