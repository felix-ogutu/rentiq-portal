import { useState, useMemo } from 'react';
import { MaintenanceRequest, Property } from '../../types';
import { Search, ChevronLeft, ChevronRight, Wrench, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';

interface ServiceProviderJobsViewProps {
  maintenanceRequests: MaintenanceRequest[];
  properties: Property[];
}

export function ServiceProviderJobsView({ maintenanceRequests, properties }: ServiceProviderJobsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get only jobs assigned to this service provider
  const assignedJobs = maintenanceRequests.filter(r => r.assignedTo === 'Service Provider');

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return assignedJobs.filter(job => {
      const matchesSearch = job.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.unitNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [assignedJobs, searchQuery, statusFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartJob = (jobId: string) => {
    console.log('Start job:', jobId);
    alert('Job started! Feature coming soon.');
  };

  const handleCompleteJob = (jobId: string) => {
    console.log('Complete job:', jobId);
    alert('Mark job as complete - Feature coming soon.');
  };

  // Stats
  const pendingCount = assignedJobs.filter(j => j.status === 'pending').length;
  const inProgressCount = assignedJobs.filter(j => j.status === 'in-progress').length;
  const completedCount = assignedJobs.filter(j => j.status === 'completed').length;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Job Assignments</h1>
          <p className="mt-1 text-gray-600">Manage your assigned maintenance tasks</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assigned</p>
                <p className="mt-1 text-3xl font-bold text-blue-600">{assignedJobs.length}</p>
              </div>
              <Wrench size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="mt-1 text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock size={24} className="text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="mt-1 text-3xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <Wrench size={24} className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="mt-1 text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <MapPin size={24} className="text-green-600" />
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
              placeholder="Search by issue or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="appliance">Appliance</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700 w-16">#</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Job ID</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Issue</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Property</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Unit</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Priority</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-gray-700">Cost</th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job, index) => {
                const rowNumber = startIndex + index + 1;
                return (
                  <tr
                    key={job.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="text-gray-600 font-medium">{rowNumber}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">#{job.id}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900 max-w-xs truncate">{job.issue}</p>
                      <p className="text-xs text-gray-500">{job.reportedDate}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{getPropertyName(job.propertyId)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700">{job.unitNumber}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700 capitalize">{job.category}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getPriorityBadgeClass(job.priority)}`}>
                        {job.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">
                        {job.cost ? `KES ${job.cost.toLocaleString()}` : '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {job.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartJob(job.id)}
                          >
                            Start
                          </Button>
                        )}
                        {job.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteJob(job.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Complete
                          </Button>
                        )}
                        {job.status === 'completed' && (
                          <span className="text-xs text-gray-500">Done</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No jobs found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} jobs
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
