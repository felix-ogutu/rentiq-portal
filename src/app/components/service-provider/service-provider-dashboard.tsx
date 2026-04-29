import { MaintenanceRequest } from '../../types';
import { Wrench, CheckCircle, Clock, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ServiceProviderDashboardProps {
  maintenanceRequests: MaintenanceRequest[];
}

export function ServiceProviderDashboard({ maintenanceRequests }: ServiceProviderDashboardProps) {
  // Calculate stats
  const assignedJobs = maintenanceRequests.filter(r => r.assignedTo === 'Service Provider');
  const pendingJobs = assignedJobs.filter(r => r.status === 'pending' || r.status === 'in-progress');
  const completedJobs = assignedJobs.filter(r => r.status === 'completed');
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.cost || 0), 0);

  // Jobs by status
  const jobsByStatus = [
    { status: 'Pending', count: assignedJobs.filter(r => r.status === 'pending').length, color: '#f59e0b', uniqueKey: 'job-status-pending' },
    { status: 'In Progress', count: assignedJobs.filter(r => r.status === 'in-progress').length, color: '#3b82f6', uniqueKey: 'job-status-in-progress' },
    { status: 'Completed', count: assignedJobs.filter(r => r.status === 'completed').length, color: '#10b981', uniqueKey: 'job-status-completed' },
    { status: 'On Hold', count: assignedJobs.filter(r => r.status === 'on-hold').length, color: '#ef4444', uniqueKey: 'job-status-on-hold' }
  ].filter(s => s.count > 0);

  // Jobs by category
  const jobsByCategory = [
    { category: 'Plumbing', count: assignedJobs.filter(r => r.category === 'plumbing').length, color: '#3b82f6', id: 'job-cat-plumbing' },
    { category: 'Electrical', count: assignedJobs.filter(r => r.category === 'electrical').length, color: '#f59e0b', id: 'job-cat-electrical' },
    { category: 'HVAC', count: assignedJobs.filter(r => r.category === 'hvac').length, color: '#10b981', id: 'job-cat-hvac' },
    { category: 'Appliance', count: assignedJobs.filter(r => r.category === 'appliance').length, color: '#8b5cf6', id: 'job-cat-appliance' },
    { category: 'Other', count: assignedJobs.filter(r => r.category === 'other').length, color: '#ec4899', id: 'job-cat-other' }
  ].filter(c => c.count > 0);

  // Monthly job completion trend (mock data)
  const monthlyTrend = [
    { month: 'Aug', jobs: 8, uniqueKey: 'trend-aug' },
    { month: 'Sep', jobs: 12, uniqueKey: 'trend-sep' },
    { month: 'Oct', jobs: 10, uniqueKey: 'trend-oct' },
    { month: 'Nov', jobs: 15, uniqueKey: 'trend-nov' },
    { month: 'Dec', jobs: 9, uniqueKey: 'trend-dec' },
    { month: 'Jan', jobs: 14, uniqueKey: 'trend-jan' },
    { month: 'Feb', jobs: completedJobs.length, uniqueKey: 'trend-feb' }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Provider Dashboard</h1>
          <p className="mt-1 text-gray-600">View job assignments and submit invoices</p>
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
                <p className="text-sm text-gray-600">Assigned Jobs</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{assignedJobs.length}</p>
                <p className="mt-1 text-xs text-gray-500">{pendingJobs.length} active</p>
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
                <p className="text-sm text-gray-600">Completed Jobs</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{completedJobs.length}</p>
                <p className="mt-1 text-xs text-gray-500">This month</p>
              </div>
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Jobs</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingJobs.length}</p>
                <p className="mt-1 text-xs text-gray-500">Awaiting action</p>
              </div>
              <div className="rounded-full bg-yellow-50 p-3">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  KES {(totalEarnings / 1000).toFixed(0)}K
                </p>
                <p className="mt-1 text-xs text-gray-500">This month</p>
              </div>
              <div className="rounded-full bg-purple-50 p-3">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Jobs by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {jobsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="uniqueKey" 
                    tickFormatter={(value) => {
                      const item = jobsByStatus.find(d => d.uniqueKey === value);
                      return item ? item.status : '';
                    }} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const item = jobsByStatus.find(d => d.uniqueKey === value);
                      return item ? item.status : '';
                    }} 
                  />
                  <Bar dataKey="count" fill="#3b82f6" name="Jobs">
                    {jobsByStatus.map((entry) => (
                      <Cell key={entry.uniqueKey} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No jobs assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Job Completion Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Job Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="uniqueKey" 
                  tickFormatter={(value) => {
                    const item = monthlyTrend.find(d => d.uniqueKey === value);
                    return item ? item.month : '';
                  }} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const item = monthlyTrend.find(d => d.uniqueKey === value);
                    return item ? item.month : '';
                  }} 
                />
                <Line type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={2} name="Jobs Completed" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Jobs by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {jobsByCategory.length > 0 ? (
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={jobsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {jobsByCategory.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {jobsByCategory.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div>
                      <p className="text-xs text-gray-600">{category.category}</p>
                      <p className="text-sm font-semibold">{category.count} jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500">No jobs assigned yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
