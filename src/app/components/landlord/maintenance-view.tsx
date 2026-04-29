import { useState } from 'react';
import { Wrench, Plus, Search, AlertCircle, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import {MaintenanceFilter, MaintenancePriority, MaintenanceStatus} from "../../types/maintenance";
import {
  useCreateMaintenanceRequest,
  useMaintenanceRequests,
  useUpdateMaintenanceRequest
} from "../../hooks/useMaintenance";


export function MaintenanceView() {
  const [filters, setFilters] = useState<MaintenanceFilter>({ page: 0, size: 20 });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    dateReported: new Date().toISOString().split('T')[0],
    priority: 'LOW' as MaintenancePriority,
    status: 'PENDING' as MaintenanceStatus,
    assignedTechnician: '',
  });

  const { data, isLoading, isError } = useMaintenanceRequests(filters);
  const createRequest = useCreateMaintenanceRequest();
  const updateRequest = useUpdateMaintenanceRequest();

  const requests = data?.data ?? [];

  const handleCreate = async () => {
    if (!formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createRequest.mutateAsync(formData);
      toast.success('Maintenance request created!');
      setCreateDialogOpen(false);
      setFormData({
        category: '',
        description: '',
        dateReported: new Date().toISOString().split('T')[0],
        priority: 'LOW',
        status: 'PENDING',
        assignedTechnician: '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create request');
    }
  };

  const handleUpdateStatus = async (request: typeof requests[0], status: MaintenanceStatus) => {
    try {
      await updateRequest.mutateAsync({ ...request, status });
      toast.success(`Request marked as ${status.toLowerCase().replace('_', ' ')}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update request');
    }
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle size={14} className="mr-1" />Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-100 text-blue-700"><Clock size={14} className="mr-1" />In Progress</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700"><AlertCircle size={14} className="mr-1" />Pending</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-gray-100 text-gray-700"><XCircle size={14} className="mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'URGENT': return <Badge className="bg-red-600 text-white">Urgent</Badge>;
      case 'HIGH':   return <Badge className="bg-orange-100 text-orange-700">High</Badge>;
      case 'MEDIUM': return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>;
      case 'LOW':    return <Badge className="bg-blue-100 text-blue-700">Low</Badge>;
      default:       return <Badge>{priority}</Badge>;
    }
  };

  const pendingCount    = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCount = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const completedCount  = requests.filter(r => r.status === 'COMPLETED').length;
  const urgentCount     = requests.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED').length;

  return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="mt-1 text-sm text-gray-600">Track and manage maintenance issues</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <button
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm text-white w-full sm:w-auto"
                  style={{ backgroundColor: '#272757' }}
              >
                <Plus size={18} />
                New Request
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Maintenance Request</DialogTitle>
                <DialogDescription>Log a new maintenance issue for a property.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                      placeholder="e.g. Plumbing, Electrical, HVAC"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                      placeholder="Describe the issue in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Reported</Label>
                  <Input
                      type="date"
                      value={formData.dateReported}
                      onChange={(e) => setFormData({ ...formData, dateReported: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as MaintenancePriority })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as MaintenanceStatus })}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Technician</Label>
                  <Input
                      placeholder="Technician name (optional)"
                      value={formData.assignedTechnician}
                      onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                    onClick={() => setCreateDialogOpen(false)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                    onClick={handleCreate}
                    disabled={createRequest.isPending}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    style={{ backgroundColor: '#272757' }}
                >
                  {createRequest.isPending && <Loader2 size={14} className="animate-spin" />}
                  Submit Request
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="mt-1 text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="mt-1 text-2xl font-bold text-blue-600">{inProgressCount}</p>
                </div>
                <Clock size={24} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">{urgentCount}</p>
                </div>
                <AlertCircle size={24} className="text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Filter by category..."
                className="pl-10"
                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
            />
          </div>
          <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, priority: (e.target.value || undefined) as MaintenancePriority | undefined }))}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              onChange={(e) => setFilters(f => ({ ...f, status: (e.target.value || undefined) as MaintenanceStatus | undefined }))}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
        ) : isError ? (
            <div className="flex items-center justify-center gap-2 py-16 text-red-500">
              <AlertCircle size={20} />
              <span>Failed to load maintenance requests</span>
            </div>
        ) : requests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-gray-100 p-6 mb-4">
                  <Wrench size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No maintenance requests</h3>
                <p className="mt-2 text-sm text-gray-600">All maintenance issues have been resolved</p>
              </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {requests.map((request) => (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 rounded-full p-2 ${
                              request.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                                  request.priority === 'HIGH'   ? 'bg-orange-100 text-orange-600' :
                                      request.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                                          'bg-blue-100 text-blue-600'
                          }`}>
                            <Wrench size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{request.category}</h3>
                              {getPriorityBadge(request.priority)}
                            </div>
                            <p className="text-sm text-gray-600">{request.description}</p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Reported:</span>
                          <span className="text-gray-900">
                      {new Date(request.dateReported).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </span>
                        </div>
                        {request.assignedTechnician && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Technician:</span>
                              <span className="font-medium text-blue-600">{request.assignedTechnician}</span>
                            </div>
                        )}
                      </div>

                      {request.priority === 'URGENT' && request.status === 'PENDING' && (
                          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm">
                            <p className="font-medium text-red-900">⚠️ Urgent Attention Required</p>
                            <p className="text-red-700">This request needs immediate action</p>
                          </div>
                      )}

                      <div className="flex gap-2">
                        {request.status === 'PENDING' && (
                            <>
                              <button
                                  onClick={() => handleUpdateStatus(request, 'IN_PROGRESS')}
                                  disabled={updateRequest.isPending}
                                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              >
                                Start Work
                              </button>
                              <button
                                  onClick={() => handleUpdateStatus(request, 'CANCELLED')}
                                  disabled={updateRequest.isPending}
                                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                        )}
                        {request.status === 'IN_PROGRESS' && (
                            <>
                              <button className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                View Progress
                              </button>
                              <button
                                  onClick={() => handleUpdateStatus(request, 'COMPLETED')}
                                  disabled={updateRequest.isPending}
                                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                Mark Complete
                              </button>
                            </>
                        )}
                        {(request.status === 'COMPLETED' || request.status === 'CANCELLED') && (
                            <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                              View Details
                            </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        )}
      </div>
  );
}