import { useState, useMemo } from 'react';
import {
  Home,
  Plus,
  Search,
  Eye,
  Edit2,
  AlertCircle,
  Loader2,
  User,
  DoorOpen,
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

import { toast } from 'sonner';
import { useUnits, useCreateUnit, useUpdateUnit } from "../../hooks/useUnits";
import { useProperties } from "../../hooks/useProperties";
import { Unit, UnitCreateRequest, UnitStatus, UnitType } from "../../types/unit";

export function UnitsView() {
  const [filters] = useState({ page: 0, size: 100 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | 'all'>('all');

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState<UnitCreateRequest>({
    propertyId: 0,
    unitNumber: '',
    unitType: UnitType.BEDSITTER,
    monthlyRent: 0,
    status: UnitStatus.VACANT,
  });

  const [formErrors, setFormErrors] = useState({
    propertyId: '',
    unitNumber: '',
    monthlyRent: '',
  });

  const { data: unitsData, isLoading, isError } = useUnits(filters);
  const { data: propertiesData } = useProperties({ page: 0, size: 50 });

  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();

  const units = unitsData?.data ?? [];
  const properties = propertiesData?.data ?? [];
  const stats = unitsData?.stats;

  const totalUnits = stats?.totalUnits ?? units.length;
  const occupiedCount = stats?.occupiedUnits ?? units.filter(u => u.status === UnitStatus.OCCUPIED).length;
  const vacantCount = stats?.vacantUnits ?? units.filter(u => u.status === UnitStatus.VACANT).length;

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch =
          unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.unitType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProperty = selectedPropertyId === 'all' || unit.propertyId === selectedPropertyId;
      const matchesStatus = selectedStatus === 'all' || unit.status === selectedStatus;

      return matchesSearch && matchesProperty && matchesStatus;
    });
  }, [units, searchQuery, selectedPropertyId, selectedStatus]);

  const getPropertyName = (propertyId: number) =>
      properties.find(p => p.id === propertyId)?.propertyName ?? `Property ${propertyId}`;

  const resetForm = () => {
    setFormData({
      propertyId: 0,
      unitNumber: '',
      unitType: UnitType.BEDSITTER,
      monthlyRent: 0,
      status: UnitStatus.VACANT,
    });
    setFormErrors({ propertyId: '', unitNumber: '', monthlyRent: '' });
  };

  // FORM VALIDATION
  const validateForm = (): boolean => {
    const errors = {
      propertyId: '',
      unitNumber: '',
      monthlyRent: '',
    };
    let isValid = true;

    if (!formData.propertyId || formData.propertyId <= 0) {
      errors.propertyId = 'Please select a property';
      isValid = false;
    }

    if (!formData.unitNumber.trim()) {
      errors.unitNumber = 'Unit number is required';
      isValid = false;
    } else if (formData.unitNumber.trim().length < 2) {
      errors.unitNumber = 'Unit number must be at least 2 characters';
      isValid = false;
    }

    if (formData.monthlyRent <= 0) {
      errors.monthlyRent = 'Monthly rent must be greater than 0';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const openAddDialog = () => {
    setIsEditing(false);
    resetForm();
    setShowFormDialog(true);
  };

  const openEditDialog = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsEditing(true);
    setFormData({
      propertyId: unit.propertyId,
      unitNumber: unit.unitNumber,
      unitType: unit.unitType,
      monthlyRent: unit.monthlyRent,
      status: unit.status,
    });
    setFormErrors({ propertyId: '', unitNumber: '', monthlyRent: '' });
    setShowFormDialog(true);
  };

  const openViewDialog = (unit: Unit) => {
    setSelectedUnit(unit);
    setViewDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && selectedUnit) {
        await updateUnit.mutateAsync({ id: selectedUnit.id, ...formData });
        toast.success('Unit updated successfully!');
      } else {
        await createUnit.mutateAsync(formData);
        toast.success('Unit created successfully!');
      }
      setShowFormDialog(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  const getStatusColor = (status: UnitStatus) => {
    switch (status) {
      case UnitStatus.OCCUPIED: return 'bg-green-100 text-green-700';
      case UnitStatus.VACANT: return 'bg-blue-100 text-blue-700';
      case UnitStatus.UNDER_MAINTENANCE: return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Units</h1>
            <p className="text-gray-600">Manage all property units</p>
          </div>
          <Button onClick={openAddDialog} className="bg-[#272757] hover:bg-[#1f1f4d]">
            <Plus size={18} className="mr-2" />
            Add New Unit
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Units</p>
                  <p className="text-3xl font-bold mt-1">{totalUnits}</p>
                </div>
                <Home size={28} className="text-[#272757]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupied</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{occupiedCount}</p>
                </div>
                <User size={28} className="text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vacant</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{vacantCount}</p>
                </div>
                <DoorOpen size={28} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    {stats?.occupancyRate?.toFixed(1) ?? 0}%
                  </p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Rate</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by unit number or type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#272757]"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
                <option key={p.id} value={p.id}>{p.propertyName}</option>
            ))}
          </select>

          <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as UnitStatus | 'all')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#272757]"
          >
            <option value="all">All Statuses</option>
            <option value={UnitStatus.OCCUPIED}>Occupied</option>
            <option value={UnitStatus.VACANT}>Vacant</option>
            <option value={UnitStatus.UNDER_MAINTENANCE}>Under Maintenance</option>
          </select>
        </div>

        {/* Units Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={40} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                  <AlertCircle size={40} />
                  <p className="mt-4">Failed to load units</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Unit Number</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Monthly Rent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            No units found
                          </TableCell>
                        </TableRow>
                    ) : (
                        filteredUnits.map((unit, index) => (
                            <TableRow key={unit.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                              <TableCell className="font-semibold">{unit.unitNumber}</TableCell>
                              <TableCell>{getPropertyName(unit.propertyId)}</TableCell>
                              <TableCell>{unit.unitType.replace('_', ' ')}</TableCell>
                              <TableCell className="text-right font-medium">
                                KES {unit.monthlyRent.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(unit.status)}>
                                  {unit.status.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 justify-center">
                                  <Button variant="outline" size="sm" onClick={() => openViewDialog(unit)}>
                                    <Eye size={16} />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => openEditDialog(unit)}>
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

        {/* Create / Edit Dialog with Validation */}
        <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Unit' : 'Add New Unit'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update unit information' : 'Create a new unit for the selected property'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Property <span className="text-red-500">*</span></Label>
                <select
                    className={`w-full rounded-lg border px-3 py-2 ${formErrors.propertyId ? 'border-red-500' : ''}`}
                    value={formData.propertyId || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, propertyId: parseInt(e.target.value) || 0 });
                      if (formErrors.propertyId) setFormErrors({ ...formErrors, propertyId: '' });
                    }}
                >
                  <option value="">Select Property</option>
                  {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.propertyName}</option>
                  ))}
                </select>
                {formErrors.propertyId && <p className="text-red-500 text-sm">{formErrors.propertyId}</p>}
              </div>

              <div className="space-y-2">
                <Label>Unit Number <span className="text-red-500">*</span></Label>
                <Input
                    placeholder="e.g. A101, Block B-05"
                    value={formData.unitNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, unitNumber: e.target.value });
                      if (formErrors.unitNumber) setFormErrors({ ...formErrors, unitNumber: '' });
                    }}
                    className={formErrors.unitNumber ? 'border-red-500' : ''}
                />
                {formErrors.unitNumber && <p className="text-red-500 text-sm">{formErrors.unitNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label>Unit Type</Label>
                <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value as UnitType })}
                >
                  {Object.values(UnitType).map((type) => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ')}
                      </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Monthly Rent (KES) <span className="text-red-500">*</span></Label>
                <Input
                    type="number"
                    min="0"
                    value={formData.monthlyRent}
                    onChange={(e) => {
                      setFormData({ ...formData, monthlyRent: parseInt(e.target.value)});
                      if (formErrors.monthlyRent) setFormErrors({ ...formErrors, monthlyRent: '' });
                    }}
                    className={formErrors.monthlyRent ? 'border-red-500' : ''}
                />
                {formErrors.monthlyRent && <p className="text-red-500 text-sm">{formErrors.monthlyRent}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UnitStatus })}
                >
                  <option value={UnitStatus.VACANT}>Vacant</option>
                  <option value={UnitStatus.OCCUPIED}>Occupied</option>
                  <option value={UnitStatus.UNDER_MAINTENANCE}>Under Maintenance</option>
                </select>
              </div>

              <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowFormDialog(false);
                      resetForm();
                    }}
                >
                  Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={createUnit.isPending || updateUnit.isPending}
                    className="bg-[#272757] hover:bg-[#1f1f4d]"
                >
                  {(createUnit.isPending || updateUnit.isPending) && (
                      <Loader2 size={16} className="animate-spin mr-2" />
                  )}
                  {isEditing ? 'Update Unit' : 'Create Unit'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Unit Details</DialogTitle>
            </DialogHeader>
            {selectedUnit && (
                <div className="space-y-6 py-4">
                  <div>
                    <p className="text-sm text-gray-500">Unit Number</p>
                    <p className="text-2xl font-bold">{selectedUnit.unitNumber}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Property</p>
                      <p className="font-medium">{getPropertyName(selectedUnit.propertyId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{selectedUnit.unitType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Rent</p>
                      <p className="font-medium text-emerald-600">
                        KES {selectedUnit.monthlyRent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={getStatusColor(selectedUnit.status)}>
                        {selectedUnit.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    if (selectedUnit) openEditDialog(selectedUnit);
                  }}
              >
                Edit Unit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}