import { Property } from '../../types';
import { Home, Eye, TrendingUp, DollarSign, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface PropertyManagerDashboardProps {
  properties: Property[];
}

export function PropertyManagerDashboard({ properties }: PropertyManagerDashboardProps) {
  // Calculate stats
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0);
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : 0;

  // Available units by property - with truly unique IDs
  const availableUnitsByProperty = properties
    .map((property, index) => ({
      name: property.name,
      vacant: property.totalUnits - property.occupiedUnits,
      total: property.totalUnits,
      uniqueKey: `prop-${property.id}-${index}`
    }))
    .filter(p => p.vacant > 0);

  // Monthly leasing performance (mock data) - with unique IDs
  const monthlyPerformance = [
    { month: 'Aug', leases: 4, commission: 85000, id: 'perf-aug-2025' },
    { month: 'Sep', leases: 6, commission: 120000, id: 'perf-sep-2025' },
    { month: 'Oct', leases: 5, commission: 95000, id: 'perf-oct-2025' },
    { month: 'Nov', leases: 7, commission: 140000, id: 'perf-nov-2025' },
    { month: 'Dec', leases: 3, commission: 65000, id: 'perf-dec-2025' },
    { month: 'Jan', leases: 8, commission: 160000, id: 'perf-jan-2026' },
    { month: 'Feb', leases: 3, commission: 125000, id: 'perf-feb-2026' }
  ];

  // Create a properly structured dataset for the LineChart
  const leasesChartData = monthlyPerformance.map((m, index) => ({
    month: m.month,
    leases: m.leases,
    uniqueKey: `lease-chart-${m.id}-${index}`
  }));

  // Unit type distribution (mock data)
  const unitTypeData = [
    { name: 'Studio', value: 3, color: '#3b82f6', id: 'unit-type-studio' },
    { name: '1 Bedroom', value: 5, color: '#10b981', id: 'unit-type-1bed' },
    { name: '2 Bedroom', value: 4, color: '#f59e0b', id: 'unit-type-2bed' },
    { name: '3 Bedroom', value: 2, color: '#8b5cf6', id: 'unit-type-3bed' }
  ];

  // Viewings data
  const viewingStats = {
    scheduled: 5,
    completed: 12,
    conversionRate: 25
  };

  // Commission breakdown
  const commissionData = [
    { category: 'New Leases', amount: 95000 },
    { category: 'Renewals', amount: 20000 },
    { category: 'Bonuses', amount: 10000 }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Manager Dashboard</h1>
          <p className="mt-1 text-gray-600">Market vacancies and track your performance</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
          <Calendar size={18} className="text-gray-500" />
          <span className="text-sm text-gray-700">February 2026</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Units</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{vacantUnits}</p>
                <p className="mt-1 text-xs text-gray-500">Out of {totalUnits} total</p>
              </div>
              <div className="rounded-full bg-blue-50 p-3">
                <Home size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Viewings Scheduled</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{viewingStats.scheduled}</p>
                <p className="mt-1 text-xs text-gray-500">{viewingStats.completed} completed</p>
              </div>
              <div className="rounded-full bg-yellow-50 p-3">
                <Eye size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month's Leases</p>
                <p className="mt-2 text-3xl font-bold text-green-600">3</p>
                <p className="mt-1 text-xs text-gray-500">8 last month</p>
              </div>
              <div className="rounded-full bg-green-50 p-3">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Available Units by Property */}
        <Card>
          <CardHeader>
            <CardTitle>Available Units by Property</CardTitle>
          </CardHeader>
          <CardContent>
            {availableUnitsByProperty.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={availableUnitsByProperty}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="uniqueKey" 
                    tickFormatter={(value) => {
                      const item = availableUnitsByProperty.find(d => d.uniqueKey === value);
                      return item ? item.name : '';
                    }} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const item = availableUnitsByProperty.find(d => d.uniqueKey === value);
                      return item ? item.name : '';
                    }} 
                  />
                  <Bar dataKey="vacant" fill="#3b82f6" name="Vacant Units" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No vacant units available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Leasing Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Leasing Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leasesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="uniqueKey" 
                  tickFormatter={(value) => {
                    const item = leasesChartData.find(d => d.uniqueKey === value);
                    return item ? item.month : '';
                  }} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const item = leasesChartData.find(d => d.uniqueKey === value);
                    return item ? item.month : '';
                  }} 
                />
                <Line type="monotone" dataKey="leases" stroke="#10b981" strokeWidth={2} name="Leases Signed" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Vacant Unit Types */}
        <Card>
          <CardHeader>
            <CardTitle>Vacant Unit Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie
                    data={unitTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {unitTypeData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {unitTypeData.map((type) => (
                  <div key={type.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <div>
                      <p className="text-xs text-gray-600">{type.name}</p>
                      <p className="text-sm font-semibold">{type.value} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-blue-600">{occupancyRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{occupiedUnits} of {totalUnits} occupied</p>
              </div>
              
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">{viewingStats.conversionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Viewings to leases</p>
              </div>
              
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-gray-600">Properties Listed</p>
                <p className="text-2xl font-bold text-purple-600">{properties.length}</p>
                <p className="text-xs text-gray-500 mt-1">Active listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
