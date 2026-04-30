import { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  AlertCircle,
  Loader2,
  Edit2,
  Eye,
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
  useProperties,
  useCreateProperty,
  useUpdateProperty,
} from "../../hooks/useProperties";

import { Property } from "../../types/property";

export function PropertiesViewNew() {
  const [filters, setFilters] = useState({
    propertyName: undefined as string | undefined,
    address: undefined as string | undefined,
    page: 0,
    size: 20,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null); // For View

  const [formData, setFormData] = useState({
    propertyName: '',
    address: '',
    totalUnits: 0,
    occupiedUnits: 0,
    monthlyRevenue: 0,
  });

  const [errors, setErrors] = useState({
    propertyName: '',
    address: '',
    totalUnits: '',
    occupiedUnits: '',
    monthlyRevenue: '',
  });

  const { data, isLoading, isError } = useProperties(filters);
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  const properties = data?.data ?? [];
  const stats = data?.stats;

  const totalProperties = stats?.totalProperties ?? properties.length;
  const totalUnits = stats?.totalUnits ?? 0;
  const totalOccupied = stats?.totalOccupiedUnits ?? 0;
  const totalRevenue = stats?.totalMonthlyRevenue ?? 0;
  const occupancyRate = stats?.occupancyRate ?? 0;

  const resetForm = () => {
    setFormData({
      propertyName: '',
      address: '',
      totalUnits: 0,
      occupiedUnits: 0,
      monthlyRevenue: 0,
    });
    setErrors({
      propertyName: '',
      address: '',
      totalUnits: '',
      occupiedUnits: '',
      monthlyRevenue: '',
    });
  };

  const validateForm = (): boolean => {
    const newErrors = {
      propertyName: '',
      address: '',
      totalUnits: '',
      occupiedUnits: '',
      monthlyRevenue: '',
    };
    let isValid = true;

    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'Property name is required';
      isValid = false;
    } else if (formData.propertyName.trim().length < 3) {
      newErrors.propertyName = 'Property name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
      isValid = false;
    }

    if (formData.totalUnits < 1) {
      newErrors.totalUnits = 'Total units must be at least 1';
      isValid = false;
    }

    if (formData.occupiedUnits < 0) {
      newErrors.occupiedUnits = 'Occupied units cannot be negative';
      isValid = false;
    }
    if (formData.occupiedUnits > formData.totalUnits) {
      newErrors.occupiedUnits = `Occupied units cannot exceed total units (${formData.totalUnits})`;
      isValid = false;
    }

    if (formData.monthlyRevenue < 0) {
      newErrors.monthlyRevenue = 'Monthly revenue cannot be negative';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const openViewDialog = (property: Property) => {
    setSelectedProperty(property);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedProperty(null);
  };

  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      propertyName: property.propertyName,
      address: property.address,
      totalUnits: property.totalUnits,
      occupiedUnits: property.occupiedUnits,
      monthlyRevenue: property.monthlyRevenue,
    });
    setErrors({
      propertyName: '',
      address: '',
      totalUnits: '',
      occupiedUnits: '',
      monthlyRevenue: '',
    });
    setCreateDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      await createProperty.mutateAsync(formData);
      toast.success('Property created successfully!');
      setCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create property');
    }
  };

  const handleUpdate = async () => {
    if (!editingProperty || !validateForm()) return;
    try {
      await updateProperty.mutateAsync({
        id: editingProperty.id,
        ...formData,
      });
      toast.success('Property updated successfully!');
      setCreateDialogOpen(false);
      setEditingProperty(null);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update property');
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return "bg-green-100 text-green-700";
    if (occupancy >= 75) return "bg-blue-100 text-blue-700";
    if (occupancy >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600">Manage your real estate portfolio</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                  onClick={() => {
                    setEditingProperty(null);
                    resetForm();
                  }}
                  className="bg-[#272757] hover:bg-[#1f1f4d]"
              >
                <Plus size={18} className="mr-2" />
                Add New Property
              </Button>
            </DialogTrigger>

            {/* Create / Edit Dialog */}
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </DialogTitle>
                <DialogDescription>
                  {editingProperty ? 'Update the property details' : 'Register a new property in your portfolio'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Property Name <span className="text-red-500">*</span></Label>
                  <Input
                      placeholder="e.g. Sunset Apartments"
                      value={formData.propertyName}
                      onChange={(e) => {
                        setFormData({ ...formData, propertyName: e.target.value });
                        if (errors.propertyName) setErrors({ ...errors, propertyName: '' });
                      }}
                      className={errors.propertyName ? 'border-red-500' : ''}
                  />
                  {errors.propertyName && <p className="text-red-500 text-sm">{errors.propertyName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Address <span className="text-red-500">*</span></Label>
                  <Input
                      placeholder="Full address of the property"
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (errors.address) setErrors({ ...errors, address: '' });
                      }}
                      className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Units <span className="text-red-500">*</span></Label>
                    <Input
                        type="number"
                        min="1"
                        value={formData.totalUnits}
                        onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                        className={errors.totalUnits ? 'border-red-500' : ''}
                    />
                    {errors.totalUnits && <p className="text-red-500 text-sm">{errors.totalUnits}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Occupied Units</Label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.occupiedUnits}
                        onChange={(e) => setFormData({ ...formData, occupiedUnits: parseInt(e.target.value) || 0 })}
                        className={errors.occupiedUnits ? 'border-red-500' : ''}
                    />
                    {errors.occupiedUnits && <p className="text-red-500 text-sm">{errors.occupiedUnits}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Revenue (KES)</Label>
                  <Input
                      type="number"
                      min="0"
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseFloat(e.target.value) || 0 })}
                      className={errors.monthlyRevenue ? 'border-red-500' : ''}
                  />
                  {errors.monthlyRevenue && <p className="text-red-500 text-sm">{errors.monthlyRevenue}</p>}
                </div>
              </div>

              <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => {
                      setCreateDialogOpen(false);
                      setEditingProperty(null);
                      resetForm();
                    }}
                >
                  Cancel
                </Button>
                <Button
                    onClick={editingProperty ? handleUpdate : handleCreate}
                    disabled={createProperty.isPending || updateProperty.isPending}
                    className="bg-[#272757] hover:bg-[#1f1f4d]"
                >
                  {(createProperty.isPending || updateProperty.isPending) && (
                      <Loader2 size={16} className="animate-spin mr-2" />
                  )}
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold mt-1">{totalProperties}</p>
                </div>
                <Home size={28} className="text-[#272757]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Units</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{totalUnits}</p>
                </div>
                <Home size={28} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{occupancyRate.toFixed(1)}%</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Good</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    KES {totalRevenue.toLocaleString()}
                  </p>
                </div>
                <span className="text-2xl">💰</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by property name..."
                className="pl-10"
                value={filters.propertyName || ''}
                onChange={(e) => setFilters(f => ({ ...f, propertyName: e.target.value || undefined }))}
            />
          </div>
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by address..."
                className="pl-10"
                value={filters.address || ''}
                onChange={(e) => setFilters(f => ({ ...f, address: e.target.value || undefined }))}
            />
          </div>
        </div>

        {/* Properties Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 size={40} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                  <AlertCircle size={40} />
                  <p className="mt-4">Failed to load properties</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Property Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-center">Total Units</TableHead>
                      <TableHead className="text-right">Monthly Revenue</TableHead>
                      <TableHead className="text-center w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                            No properties found. Add your first property to get started.
                          </TableCell>
                        </TableRow>
                    ) : (
                        properties.map((property: Property, index: number) => {
                          const occupancy = property.totalUnits > 0
                              ? Math.round((property.occupiedUnits / property.totalUnits) * 100)
                              : 0;

                          return (
                              <TableRow key={property.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                                <TableCell className="font-medium">{property.propertyName}</TableCell>
                                <TableCell className="text-gray-600">{property.address}</TableCell>
                                <TableCell className="text-center font-semibold">{property.totalUnits}</TableCell>
                                <TableCell className="text-right font-medium text-emerald-600">
                                  KES {property.monthlyRevenue.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openViewDialog(property)}
                                    >
                                      <Eye size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(property)}
                                    >
                                      <Edit2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* ===================== VIEW DIALOG ===================== */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Property Details</DialogTitle>
              <DialogDescription>Complete information for this property</DialogDescription>
            </DialogHeader>

            {selectedProperty ? (
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedProperty.propertyName}</h3>
                    <p className="text-gray-600 mt-1">{selectedProperty.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Total Units</p>
                      <p className="text-2xl font-semibold">{selectedProperty.totalUnits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupied Units</p>
                      <p className="text-2xl font-semibold text-green-600">
                        {selectedProperty.occupiedUnits}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      KES {selectedProperty.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedProperty.totalUnits > 0
                          ? Math.round((selectedProperty.occupiedUnits / selectedProperty.totalUnits) * 100)
                          : 0}%
                    </p>
                  </div>
                </div>
            ) : (
                <p className="text-center text-red-500 py-8">No property selected</p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={closeViewDialog}>
                Close
              </Button>
              <Button
                  onClick={() => {
                    closeViewDialog();
                    if (selectedProperty) openEditDialog(selectedProperty);
                  }}
              >
                Edit Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}