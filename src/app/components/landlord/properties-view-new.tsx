import { useState } from 'react';
import {
  Home,
  Plus,
  Search,
  AlertCircle,
  Loader2,
  Users,
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import {
  useProperties,
  useCreateProperty,
  useUpdateProperty
} from "../../hooks/useProperties"; // Adjust path if needed

export function PropertiesViewNew() {
  const [filters, setFilters] = useState({
    propertyName: undefined as string | undefined,
    address: undefined as string | undefined,
    page: 0,
    size: 20,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const [formData, setFormData] = useState({
    propertyName: '',
    address: '',
    totalUnits: 0,
    occupiedUnits: 0,
    monthlyRevenue: 0,
  });

  const { data, isLoading, isError } = useProperties(filters);
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  const properties = data?.data ?? [];

  // Summary calculations
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const totalOccupied = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
  const totalRevenue = properties.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const occupancyRate = totalUnits > 0
      ? Math.round((totalOccupied / totalUnits) * 100)
      : 0;

  const handleCreate = async () => {
    if (!formData.propertyName || !formData.address) {
      toast.error('Property name and address are required');
      return;
    }
    if (formData.occupiedUnits > formData.totalUnits) {
      toast.error('Occupied units cannot exceed total units');
      return;
    }

    try {
      await createProperty.mutateAsync(formData);
      toast.success('Property created successfully!');
      setCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create property');
    }
  };

  const handleUpdate = async () => {
    if (!editingProperty || !formData.propertyName || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateProperty.mutateAsync({
        id: editingProperty.id,
        ...formData,
      });
      toast.success('Property updated successfully!');
      setEditingProperty(null);
      setCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update property');
    }
  };

  const resetForm = () => {
    setFormData({
      propertyName: '',
      address: '',
      totalUnits: 0,
      occupiedUnits: 0,
      monthlyRevenue: 0,
    });
  };

  const openEditDialog = (property: any) => {
    setEditingProperty(property);
    setFormData({
      propertyName: property.propertyName,
      address: property.address,
      totalUnits: property.totalUnits,
      occupiedUnits: property.occupiedUnits,
      monthlyRevenue: property.monthlyRevenue,
    });
    setCreateDialogOpen(true);
  };

  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Properties</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your real estate portfolio</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <button
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-white w-full sm:w-auto"
                  style={{ backgroundColor: '#272757' }}
                  onClick={() => {
                    setEditingProperty(null);
                    resetForm();
                  }}
              >
                <Plus size={18} />
                Add Property
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </DialogTitle>
                <DialogDescription>
                  {editingProperty
                      ? 'Update property information'
                      : 'Register a new property in your portfolio'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Property Name</Label>
                  <Input
                      placeholder="e.g. Sunset Apartments"
                      value={formData.propertyName}
                      onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                      placeholder="Full address of the property"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Units</Label>
                    <Input
                        type="number"
                        min="1"
                        value={formData.totalUnits}
                        onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Occupied Units</Label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.occupiedUnits}
                        onChange={(e) => setFormData({ ...formData, occupiedUnits: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Revenue (KES)</Label>
                  <Input
                      type="number"
                      min="0"
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData({ ...formData, monthlyRevenue: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                  />
                </div>
              </div>

              <DialogFooter>
                <button
                    onClick={() => {
                      setCreateDialogOpen(false);
                      setEditingProperty(null);
                      resetForm();
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                    onClick={editingProperty ? handleUpdate : handleCreate}
                    disabled={createProperty.isPending || updateProperty.isPending}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    style={{ backgroundColor: '#272757' }}
                >
                  {(createProperty.isPending || updateProperty.isPending) && (
                      <Loader2 size={14} className="animate-spin" />
                  )}
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </button>
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
                  <p className="mt-1 text-3xl font-bold text-gray-900">{totalProperties}</p>
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
                  <p className="mt-1 text-3xl font-bold text-blue-600">{totalUnits}</p>
                </div>
                <Users size={28} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">{occupancyRate}%</p>
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
                  <p className="mt-1 text-3xl font-bold text-emerald-600">
                    KES {totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign size={28} className="text-emerald-600" />
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
                onChange={(e) => setFilters(f => ({ ...f, propertyName: e.target.value || undefined }))}
            />
          </div>
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by address..."
                className="pl-10"
                onChange={(e) => setFilters(f => ({ ...f, address: e.target.value || undefined }))}
            />
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        ) : isError ? (
            <div className="flex items-center justify-center gap-2 py-16 text-red-500">
              <AlertCircle size={20} />
              <span>Failed to load properties</span>
            </div>
        ) : properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-gray-100 p-6 mb-4">
                  <Home size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
                <p className="mt-2 text-sm text-gray-600">Start by adding your first property</p>
              </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {properties.map((property) => {
                const occupancy = property.totalUnits > 0
                    ? Math.round((property.occupiedUnits / property.totalUnits) * 100)
                    : 0;

                return (
                    <Card key={property.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 rounded-full bg-[#272757]/10 p-3 text-[#272757]">
                              <Home size={22} />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{property.propertyName}</h3>
                              <p className="text-sm text-gray-600 mt-1">{property.address}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {occupancy}% Occupied
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4 border-y">
                          <div>
                            <p className="text-xs text-gray-500">Total Units</p>
                            <p className="font-semibold text-lg">{property.totalUnits}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Occupied</p>
                            <p className="font-semibold text-lg text-green-600">{property.occupiedUnits}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Monthly Revenue</p>
                            <p className="font-semibold text-lg text-emerald-600">
                              KES {property.monthlyRevenue.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                              onClick={() => openEditDialog(property)}
                              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Edit Details
                          </button>
                          <button className="flex-1 rounded-lg bg-[#272757] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f1f4d]">
                            View Tenants
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                );
              })}
            </div>
        )}
      </div>
  );
}