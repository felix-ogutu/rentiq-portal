import { useState, useMemo } from 'react';
import { Property, Unit } from '../../types';
import { Home, Search, ChevronLeft, ChevronRight, MapPin, DollarSign, Maximize } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';

interface PropertyManagerVacantUnitsViewProps {
  units: Unit[];
  properties: Property[];
}

export function PropertyManagerVacantUnitsView({ units, properties }: PropertyManagerVacantUnitsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get only vacant units
  const vacantUnits = units.filter(unit => unit.status === 'vacant');

  // Filter vacant units
  const filteredUnits = useMemo(() => {
    return vacantUnits.filter(unit => {
      const matchesSearch = unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           unit.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProperty = propertyFilter === 'all' || unit.propertyId === propertyFilter;
      const matchesType = typeFilter === 'all' || unit.type === typeFilter;
      return matchesSearch && matchesProperty && matchesType;
    });
  }, [vacantUnits, searchQuery, propertyFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUnits = filteredUnits.slice(startIndex, endIndex);

  // Get unique unit types
  const unitTypes = Array.from(new Set(vacantUnits.map(u => u.type)));

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const handleContactTenant = (unitId: string) => {
    console.log('Schedule viewing for unit:', unitId);
    alert('Viewing scheduling feature - Coming soon!');
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vacant Units</h1>
          <p className="mt-1 text-gray-600">Available properties ready for marketing</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vacant</p>
                <p className="mt-1 text-3xl font-bold text-blue-600">{vacantUnits.length}</p>
              </div>
              <Home size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rent</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {vacantUnits.length > 0
                    ? formatCurrency(Math.round(vacantUnits.reduce((sum, u) => sum + u.rent, 0) / vacantUnits.length))
                    : 'KES 0'}
                </p>
              </div>
              <DollarSign size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Properties</p>
                <p className="mt-1 text-3xl font-bold text-purple-600">
                  {new Set(vacantUnits.map(u => u.propertyId)).size}
                </p>
              </div>
              <MapPin size={24} className="text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Largest Unit</p>
                <p className="mt-1 text-2xl font-bold text-orange-600">
                  {Math.max(...vacantUnits.map(u => u.size))} sqft
                </p>
              </div>
              <Maximize size={24} className="text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by unit number or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {unitTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vacant Units Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700 w-16">#</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Unit Number</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Property</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Size</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Rent</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Floor</th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUnits.map((unit, index) => {
                const rowNumber = startIndex + index + 1;
                return (
                  <tr
                    key={unit.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="text-gray-600 font-medium">{rowNumber}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">{unit.unitNumber}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{getPropertyName(unit.propertyId)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{unit.type}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{unit.size} sqft</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(unit.rent)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{unit.floor}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleContactTenant(unit.id)}
                        >
                          Schedule Viewing
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUnits.length === 0 && (
          <div className="text-center py-12">
            <Home className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No vacant units found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredUnits.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredUnits.length)} of {filteredUnits.length} units
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
