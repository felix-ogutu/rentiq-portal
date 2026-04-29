import { useState, useMemo } from 'react';
import { Search, Filter, UserPlus, Phone, Mail, AlertCircle, CheckCircle, Eye, Edit, ChevronLeft, ChevronRight, X, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import {TenantCreateRequest, TenantFilter, TenantStatus, TenantUpdateRequest} from "../../types/tenant";
import {useCreateTenant, useTenants, useUpdateTenant} from "../../hooks/useTenants";


export function TenantsView() {
  const [filters] = useState<TenantFilter>({ page: 0, size: 100 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState<Omit<TenantCreateRequest, 'status'> & { status: TenantStatus }>({
    fullName: '',
    email: '',
    phone: '',
    unitId: 0,
    monthlyRent: 0,
    initialBalance: 0,
    leaseEndDate: '',
    status: 'ACTIVE',
  });

  const { data, isLoading, isError } = useTenants(filters);
  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();

  const tenants = data?.data ?? [];

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch =
          t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTenants = filteredTenants.slice(startIndex, startIndex + itemsPerPage);

  const activeCount   = tenants.filter(t => t.status === 'ACTIVE').length;
  const inactiveCount = tenants.filter(t => t.status === 'INACTIVE').length;
  const vacatedCount  = tenants.filter(t => t.status === 'VACATED').length;

  const resetForm = () => setFormData({
    fullName: '', email: '', phone: '', unitId: 0,
    monthlyRent: 0, initialBalance: 0, leaseEndDate: '', status: 'ACTIVE',
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTenant.mutateAsync(formData);
      toast.success('Tenant added successfully!');
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add tenant');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    try {
      await updateTenant.mutateAsync({ id: selectedTenant.id, ...formData } as TenantUpdateRequest);
      toast.success('Tenant updated successfully!');
      setShowEditModal(false);
      setSelectedTenant(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update tenant');
    }
  };

  const handleEdit = (tenant: any) => {
    setSelectedTenant(tenant);
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
    setShowEditModal(true);
  };

  const getStatusStyle = (status: TenantStatus) => {
    switch (status) {
      case 'ACTIVE':   return 'bg-green-100 text-green-700';
      case 'INACTIVE': return 'bg-red-100 text-red-700';
      case 'VACATED':  return 'bg-yellow-100 text-yellow-700';
      default:         return 'bg-gray-100 text-gray-700';
    }
  };

  const TenantForm = ({ onSubmit, isPending, submitLabel }: { onSubmit: (e: React.FormEvent) => void; isPending: boolean; submitLabel: string }) => (
      <form onSubmit={onSubmit} className="space-y-4">
        {[
          { label: 'Full Name', field: 'fullName', type: 'text', placeholder: 'Enter full name' },
          { label: 'Email', field: 'email', type: 'email', placeholder: 'Enter email' },
          { label: 'Phone', field: 'phone', type: 'tel', placeholder: 'Enter phone number' },
        ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <Input
                  type={type}
                  placeholder={placeholder}
                  value={(formData as any)[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required
              />
            </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
          <Input
              type="number"
              placeholder="Enter unit ID"
              value={formData.unitId || ''}
              onChange={(e) => setFormData({ ...formData, unitId: parseInt(e.target.value) || 0 })}
              required
              min="1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (KES)</label>
            <Input
                type="number"
                placeholder="Amount"
                value={formData.monthlyRent || ''}
                onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                required min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance (KES)</label>
            <Input
                type="number"
                placeholder="Amount"
                value={formData.initialBalance || ''}
                onChange={(e) => setFormData({ ...formData, initialBalance: parseInt(e.target.value) || 0 })}
                min="0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date</label>
          <Input
              type="date"
              value={formData.leaseEndDate}
              onChange={(e) => setFormData({ ...formData, leaseEndDate: e.target.value })}
              required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TenantStatus })}
          >
            <option value="ACTIVE">Active</option>
            <option value="IN_ARREARS">In Arrears</option>
            <option value="NOTICE_PERIOD">Notice_Period</option>
          </select>
        </div>
        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
  );

  return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tenants</h1>
            <p className="mt-1 text-sm text-gray-600">Manage tenant information and relationships</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <UserPlus size={20} />
            Add Tenant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total Tenants', value: tenants.length, color: 'text-gray-900', icon: <CheckCircle size={20} className="text-blue-600" /> },
            { label: 'Active',        value: activeCount,    color: 'text-green-600', icon: <CheckCircle size={20} className="text-green-600" /> },
            { label: 'Inactive',      value: inactiveCount,  color: 'text-red-600',   icon: <AlertCircle size={20} className="text-red-600" /> },
            { label: 'Vacated',       value: vacatedCount,   color: 'text-yellow-600',icon: <AlertCircle size={20} className="text-yellow-600" /> },
          ].map(({ label, value, color, icon }) => (
              <div key={label} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">{label}</p>
                    <p className={`mt-1 text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
                  </div>
                  {icon}
                </div>
              </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={18} />
              Filters
            </Button>
            {(searchQuery || statusFilter !== 'all') && (
                <Button variant="outline" className="flex items-center gap-2 text-red-600" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                  <X size={18} />
                  Clear
                </Button>
            )}
          </div>
          {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="VACATED">Vacated</option>
                </select>
              </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-gray-400" />
              </div>
          ) : isError ? (
              <div className="flex items-center justify-center gap-2 py-16 text-red-500">
                <AlertCircle size={20} />
                <span>Failed to load tenants</span>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 w-12">#</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contact</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Unit ID</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Rent</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Balance</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Lease End</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {paginatedTenants.map((tenant, index) => (
                      <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-600 font-medium">{startIndex + index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <User size={18} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{tenant.fullName}</p>
                              <p className="text-xs text-gray-500">ID: {tenant.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail size={13} className="text-gray-400" />{tenant.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone size={13} className="text-gray-400" />{tenant.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">{tenant.unitId}</td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{formatCurrency(tenant.monthlyRent)}</td>
                        <td className="py-4 px-6">
                      <span className={`font-semibold ${tenant.initialBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(tenant.initialBalance)}
                      </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{tenant.leaseEndDate}</td>
                        <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(tenant.status)}`}>
                        {tenant.status}
                      </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setSelectedTenant(tenant); setShowViewModal(true); }} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleEdit(tenant)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>

                {filteredTenants.length === 0 && (
                    <div className="text-center py-12">
                      <User className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">No tenants found</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredTenants.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredTenants.length)} of {filteredTenants.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                          <ChevronLeft size={16} /> Previous
                        </Button>
                        <span className="text-sm text-gray-600">{currentPage} / {totalPages}</span>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                          Next <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Tenant</h2>
                <TenantForm onSubmit={handleAdd} isPending={createTenant.isPending} submitLabel="Add Tenant" />
              </div>
            </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedTenant && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Tenant</h2>
                <TenantForm onSubmit={handleUpdate} isPending={updateTenant.isPending} submitLabel="Update Tenant" />
              </div>
            </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedTenant && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Tenant Details</h2>
                  <button onClick={() => { setShowViewModal(false); setSelectedTenant(null); }} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={28} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedTenant.fullName}</h3>
                      <p className="text-sm text-gray-500">ID: {selectedTenant.id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {[
                      { label: 'Email', value: selectedTenant.email },
                      { label: 'Phone', value: selectedTenant.phone },
                      { label: 'Unit ID', value: selectedTenant.unitId },
                      { label: 'Monthly Rent', value: formatCurrency(selectedTenant.monthlyRent) },
                      { label: 'Balance', value: formatCurrency(selectedTenant.initialBalance) },
                      { label: 'Lease End', value: selectedTenant.leaseEndDate },
                    ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-gray-500 mb-1">{label}</p>
                          <p className="font-semibold text-gray-900">{value}</p>
                        </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedTenant.status)}`}>
                  {selectedTenant.status}
                </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowViewModal(false); setSelectedTenant(null); }} className="flex-1">Close</Button>
                  <Button onClick={() => { setShowViewModal(false); handleEdit(selectedTenant); }} className="flex-1">Edit Tenant</Button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}