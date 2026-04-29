import { useState, useMemo } from 'react';
import { Home, Plus, Search, Eye, Edit, User, DoorOpen, ChevronLeft, ChevronRight, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import {UnitCreateRequest, UnitFilter, UnitStatus} from "../../types/unit";
import {useCreateUnit, useUnits, useUpdateUnit} from "../../hooks/useUnits";
import {useProperties} from "../../hooks/useProperties";


export function UnitsView() {
  const [filters] = useState<UnitFilter>({ page: 0, size: 100 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState<UnitCreateRequest>({
    propertyId: 0,
    unitNumber: '',
    unitType: 'BEDSITTER',
    monthlyRent: 0,
    status: 'VACANT',
  });

  const { data: unitsData, isLoading, isError } = useUnits(filters);
  const { data: propertiesData } = useProperties({ page: 0, size: 20 });
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();

  const units      = unitsData?.data ?? [];
  const properties = propertiesData?.data ?? [];

  const getPropertyName = (id: number) => properties.find(p => p.id === id)?.propertyName ?? `Property ${id}`;

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch =
          unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.unitType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProperty = selectedPropertyId === 'all' || unit.propertyId === selectedPropertyId;
      const matchesStatus   = selectedStatus === 'all' || unit.status === selectedStatus;
      return matchesSearch && matchesProperty && matchesStatus;
    });
  }, [units, searchQuery, selectedPropertyId, selectedStatus]);

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUnits = filteredUnits.slice(startIndex, startIndex + itemsPerPage);

  const occupiedCount     = units.filter(u => u.status === 'OCCUPIED').length;
  const vacantCount       = units.filter(u => u.status === 'VACANT').length;
  const maintenanceCount  = units.filter(u => u.status === 'UNDER_MAINTENANCE').length;

  const resetForm = () => setFormData({ propertyId: 0, unitNumber: '', unitType: 'BEDSITTER', monthlyRent: 0, status: 'VACANT' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUnit.mutateAsync(formData);
      toast.success('Unit added successfully!');
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add unit');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    try {
      await updateUnit.mutateAsync({ id: selectedUnit.id, ...formData } as UnitUpdateRequest);
      toast.success('Unit updated successfully!');
      setShowEditModal(false);
      setSelectedUnit(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update unit');
    }
  };

  const handleEdit = (unit: any) => {
    setSelectedUnit(unit);
    setFormData({
      propertyId: unit.propertyId,
      unitNumber: unit.unitNumber,
      unitType: unit.unitType,
      monthlyRent: unit.monthlyRent,
      status: unit.status,
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case 'OCCUPIED':          return 'bg-green-100 text-green-700';
      case 'VACANT':            return 'bg-blue-100 text-blue-700';
      case 'UNDER_MAINTENANCE': return 'bg-yellow-100 text-yellow-700';
      default:                  return 'bg-gray-100 text-gray-700';
    }
  };

  const UnitForm = ({ onSubmit, isPending, submitLabel }: { onSubmit: (e: React.FormEvent) => void; isPending: boolean; submitLabel: string }) => (
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
          <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.propertyId || ''}
              onChange={(e) => setFormData({ ...formData, propertyId: parseInt(e.target.value) || 0 })}
              required
          >
            <option value="">Select a property</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.propertyName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number</label>
          <Input
              placeholder="e.g. A101"
              value={formData.unitNumber}
              onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
          <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.unitType}
              onChange={(e) => setFormData({ ...formData, unitType: e.target.value as UnitType })}
              required
          >
            <option value="BEDSITTER">Bedsitter</option>
            <option value="ONE_BEDROOM">1 Bedroom</option>
            <option value="TWO_BEDROOM">2 Bedroom</option>
            <option value="THREE_BEDROOM">3 Bedroom</option>
            <option value="STUDIO">Studio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (KES)</label>
          <Input
              type="number"
              placeholder="Enter rent amount"
              value={formData.monthlyRent || ''}
              onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
              required min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as UnitStatus })}
          >
            <option value="VACANT">Vacant</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Units</h1>
            <p className="mt-1 text-sm text-gray-600">Manage all property units</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <Plus size={20} />
            Add Unit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total Units',  value: units.length,      icon: <Home size={18} className="text-blue-600" /> },
            { label: 'Occupied',     value: occupiedCount,     icon: <User size={18} className="text-green-600" /> },
            { label: 'Vacant',       value: vacantCount,       icon: <DoorOpen size={18} className="text-blue-600" /> },
            { label: 'Maintenance',  value: maintenanceCount,  icon: <Home size={18} className="text-yellow-600" /> },
          ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs sm:text-sm text-gray-600">{label}</p>
                  {icon}
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
              </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                  placeholder="Search by unit number or type..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
              />
            </div>
            <select
                value={selectedPropertyId}
                onChange={(e) => { setSelectedPropertyId(e.target.value === 'all' ? 'all' : parseInt(e.target.value)); setCurrentPage(1); }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All Properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.propertyName}</option>)}
            </select>
            <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value as UnitStatus | 'all'); setCurrentPage(1); }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="VACANT">Vacant</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            </select>
          </div>
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
                <span>Failed to load units</span>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 w-12">#</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Unit</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Property</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Rent (KES)</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {paginatedUnits.map((unit, index) => (
                      <tr key={unit.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-600">{startIndex + index + 1}</td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-gray-900">{unit.unitNumber}</p>
                          <p className="text-xs text-gray-500">ID: {unit.id}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{getPropertyName(unit.propertyId)}</td>
                        <td className="py-4 px-6 text-gray-700">{unit.unitType.replace('_', ' ')}</td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{unit.monthlyRent.toLocaleString()}</td>
                        <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                        {unit.status.replace('_', ' ')}
                      </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setSelectedUnit(unit); setShowViewModal(true); }} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleEdit(unit)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>

                {filteredUnits.length === 0 && (
                    <div className="text-center py-12">
                      <Home className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600">No units found</p>
                    </div>
                )}

                {filteredUnits.length > 0 && (
                    <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredUnits.length)} of {filteredUnits.length}
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Unit</h2>
                <UnitForm onSubmit={handleAdd} isPending={createUnit.isPending} submitLabel="Add Unit" />
              </div>
            </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedUnit && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Unit</h2>
                <UnitForm onSubmit={handleUpdate} isPending={updateUnit.isPending} submitLabel="Update Unit" />
              </div>
            </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedUnit && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-lg w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Unit Details</h2>
                  <button onClick={() => { setShowViewModal(false); setSelectedUnit(null); }} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Unit Number',  value: selectedUnit.unitNumber },
                    { label: 'Unit ID',      value: selectedUnit.id },
                    { label: 'Property',     value: getPropertyName(selectedUnit.propertyId) },
                    { label: 'Type',         value: selectedUnit.unitType.replace('_', ' ') },
                    { label: 'Monthly Rent', value: `KES ${selectedUnit.monthlyRent.toLocaleString()}` },
                  ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="font-semibold text-gray-900">{value}</p>
                      </div>
                  ))}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUnit.status)}`}>
                  {selectedUnit.status.replace('_', ' ')}
                </span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowViewModal(false); setSelectedUnit(null); }} className="flex-1">Close</Button>
                  <Button onClick={() => { setShowViewModal(false); handleEdit(selectedUnit); }} className="flex-1">Edit Unit</Button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}