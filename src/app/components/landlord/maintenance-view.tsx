import { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

import { MaintenanceFilter, MaintenancePriority, MaintenanceStatus } from "../../types/maintenance";
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
      toast.success('Maintenance request created successfully!');
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
      toast.error(err?.response?.data?.message || err.message || 'Failed to create request');
    }
  };

  const handleUpdateStatus = async (id: number, status: MaintenanceStatus) => {
    try {
      await updateRequest.mutateAsync({ id, status });
      toast.success(`Request updated to ${status.replace('_', ' ')}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update request');
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

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCount = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  const urgentCount = requests.filter(r => r.priority === 'URGENT' && r.status !== 'COMPLETED').length;

  return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Requests</h1>
            <p className="text-gray-600">Track and manage property maintenance issues</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: '#272757' }} className="flex items-center gap-2">
                <Plus size={18} />
                New Request
              </Button>
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
                      rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Reported</Label>
                    <Input
                        type="date"
                        value={formData.dateReported}
                        onChange={(e) => setFormData({ ...formData, dateReported: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <select
                        className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as MaintenancePriority })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assigned Technician (Optional)</Label>
                  <Input
                      placeholder="Technician name"
                      value={formData.assignedTechnician}
                      onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    disabled={createRequest.isPending}
                    style={{ backgroundColor: '#272757' }}
                >
                  {createRequest.isPending && <Loader2 className="animate-spin mr-2" size={16} />}
                  Submit Request
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
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <AlertCircle size={28} className="text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                </div>
                <Clock size={28} className="text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
                <CheckCircle size={28} className="text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
                </div>
                <AlertCircle size={28} className="text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Search by category or description..."
                className="pl-10"
                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
            />
          </div>

          <select
              className="rounded-lg border border-gray-200 px-4 py-2"
              onChange={(e) => setFilters(f => ({ ...f, priority: (e.target.value || undefined) as MaintenancePriority | undefined }))}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
              className="rounded-lg border border-gray-200 px-4 py-2"
              onChange={(e) => setFilters(f => ({ ...f, status: (e.target.value || undefined) as MaintenanceStatus | undefined }))}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench size={20} />
              Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-gray-400" />
                </div>
            ) : isError ? (
                <div className="text-center py-12 text-red-500">
                  Failed to load maintenance requests
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No maintenance requests found
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">#{request.id}</TableCell>
                          <TableCell>{request.category}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {request.description}
                          </TableCell>
                          <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            {new Date(request.dateReported).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell>
                            {request.assignedTechnician || <span className="text-gray-400">-</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              {request.status === 'PENDING' && (
                                  <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(request.id, 'IN_PROGRESS')}
                                    >
                                      Start Work
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleUpdateStatus(request.id, 'CANCELLED')}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                              )}

                              {request.status === 'IN_PROGRESS' && (
                                  <Button
                                      size="sm"
                                      onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                                  >
                                    Mark Complete
                                  </Button>
                              )}

                              {(request.status === 'COMPLETED' || request.status === 'CANCELLED') && (
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
}