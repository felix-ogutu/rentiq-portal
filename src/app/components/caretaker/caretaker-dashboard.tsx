import { MaintenanceRequest } from '../../types';
import { Wrench, AlertCircle, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface CaretakerDashboardProps {
  requests: MaintenanceRequest[];
}

export function CaretakerDashboard({ requests }: CaretakerDashboardProps) {
  // Stats
  const openCount = requests.filter(r => r.status === 'open').length;
  const inProgressCount = requests.filter(r => r.status === 'in-progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  // Complaints by category
  const categoryData = requests.reduce((acc, req) => {
    const category = req.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    complaints: value,
    uniqueKey: `cat-${name}-${index}`
  }));

  // Complaints by status (pie chart)
  const statusData = [
    { name: 'Open', value: openCount, color: '#f59e0b', id: 'status-open' },
    { name: 'In Progress', value: inProgressCount, color: '#3b82f6', id: 'status-in-progress' },
    { name: 'Completed', value: completedCount, color: '#10b981', id: 'status-completed' }
  ];

  // Complaints by priority
  const priorityData = requests.reduce((acc, req) => {
    const priority = req.priority;
    if (!acc[priority]) {
      acc[priority] = 0;
    }
    acc[priority]++;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = Object.entries(priorityData).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count: value,
    uniqueKey: `prior-${name}-${index}`
  }));

  // Mock weekly trend data
  const weeklyTrendData = [
    { day: 'Mon', complaints: 4, uniqueKey: 'day-mon' },
    { day: 'Tue', complaints: 6, uniqueKey: 'day-tue' },
    { day: 'Wed', complaints: 3, uniqueKey: 'day-wed' },
    { day: 'Thu', complaints: 8, uniqueKey: 'day-thu' },
    { day: 'Fri', complaints: 5, uniqueKey: 'day-fri' },
    { day: 'Sat', complaints: 2, uniqueKey: 'day-sat' },
    { day: 'Sun', complaints: 1, uniqueKey: 'day-sun' }
  ];

  // Recent urgent complaints
  const urgentComplaints = requests
    .filter(r => r.priority === 'urgent' && r.status !== 'completed')
    .slice(0, 5);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Caretaker Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage property maintenance and tenant complaints</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
          <Calendar size={18} className="text-gray-500" />
          <span className="text-sm text-gray-700">February 2026</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <div className="rounded-full bg-blue-50 p-3">
                <Wrench size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{openCount}</p>
              </div>
              <div className="rounded-full bg-yellow-50 p-3">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <div className="rounded-full bg-blue-50 p-3">
                <Clock size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Complaints by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="uniqueKey" 
                  tickFormatter={(value) => {
                    const item = categoryChartData.find(d => d.uniqueKey === value);
                    return item ? item.name : '';
                  }} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const item = categoryChartData.find(d => d.uniqueKey === value);
                    return item ? item.name : '';
                  }} 
                />
                <Bar dataKey="complaints" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Complaints Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Complaints Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="uniqueKey" 
                  tickFormatter={(value) => {
                    const item = weeklyTrendData.find(d => d.uniqueKey === value);
                    return item ? item.day : '';
                  }} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const item = weeklyTrendData.find(d => d.uniqueKey === value);
                    return item ? item.day : '';
                  }} 
                />
                <Line type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Open</p>
                  <p className="text-xl font-bold text-yellow-600">{openCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-xl font-bold text-blue-600">{inProgressCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-green-600">{completedCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={priorityChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="uniqueKey" 
                  type="category" 
                  width={80} 
                  tickFormatter={(value) => {
                    const item = priorityChartData.find(d => d.uniqueKey === value);
                    return item ? item.name : '';
                  }} 
                />
                <Tooltip 
                  labelFormatter={(value) => {
                    const item = priorityChartData.find(d => d.uniqueKey === value);
                    return item ? item.name : '';
                  }} 
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Urgent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              Urgent Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            {urgentComplaints.length > 0 ? (
              <div className="space-y-3">
                {urgentComplaints.map((complaint) => (
                  <div key={complaint.id} className="rounded-lg bg-red-50 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-red-900 capitalize">{complaint.category}</p>
                        <p className="text-sm text-red-700 mt-1">{complaint.unitNumber}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        complaint.status === 'open' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {complaint.status === 'in-progress' ? 'In Progress' : complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                <p className="text-sm text-gray-600">No urgent complaints</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
