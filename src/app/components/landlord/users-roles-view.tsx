import { useState } from 'react';
import {
  Users, Plus, Edit, ShieldCheck, ShieldOff, UserCog,
  CheckCircle, XCircle, Clock, Mail, Phone, Loader2, AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { PortalUser, PortalUserCreateRequests, PortalUserUpdateRequests } from '../../types/portalUser';
import {
  useActivatePortalUser, useAssignPermissions,
  useCreatePortalUser, useDeactivatePortalUser,
  usePermissions,
  usePortalUsers,
  useRoles,
  useUpdatePortalUser
} from "../../hooks/useRolesPermission";

export function UsersRolesView() {
  const { user: currentUser } = useAuth();

  // Data
  const { data: usersData, isLoading: usersLoading, isError: usersError } = usePortalUsers();
  const { data: rolesData } = useRoles({ page: 0, size: 100 });
  const { data: permissionsData } = usePermissions();

  const portalUsers = usersData?.data ?? [];
  const roles       = rolesData?.data ?? [];
  const permissions = permissionsData?.data ?? [];

  //Mutations
  const createPortalUser    = useCreatePortalUser();
  const updatePortalUser    = useUpdatePortalUser();
  const activatePortalUser  = useActivatePortalUser();
  const deactivatePortalUser = useDeactivatePortalUser();
  const assignPermissions   = useAssignPermissions();

  //Dialog state
  const [createDialogOpen, setCreateDialogOpen]             = useState(false);
  const [editDialogOpen, setEditDialogOpen]                 = useState(false);
  const [assignPermsDialogOpen, setAssignPermsDialogOpen]   = useState(false);
  const [selectedUser, setSelectedUser]                     = useState<PortalUser | null>(null);
  const [selectedPermIds, setSelectedPermIds]               = useState<number[]>([]);

  //Create form
  const defaultCreate: Omit<PortalUserCreateRequests, 'createdBy'> = {
    username: '', email: '', firstName: '', middleName: '',
    surname: '', phoneNumber: '', clientId: 0, roleId: 0,
  };
  const [createForm, setCreateForm] = useState(defaultCreate);

  // Edit form
  const defaultEdit: Omit<PortalUserUpdateRequests, 'portalUserId' | 'updatedBy'> = {
    username: '', firstName: '', middleName: '',
    surname: '', phoneNumber: '', clientId: 0, roleId: 0,
  };
  const [editForm, setEditForm] = useState(defaultEdit);

  // Derived lists
  const activeUsers   = portalUsers.filter(u => u.isactive === 1);
  const inactiveUsers = portalUsers.filter(u => u.isactive === 0);

  //Helpers
  const getInitials = (u: PortalUser) =>
      `${u.first_name?.[0] ?? ''}${u.surname?.[0] ?? ''}`.toUpperCase();

  const getRoleName = (u: PortalUser) => u.role?.roleName ?? '—';

  const getStatusBadge = (u: PortalUser) => {
    if (u.isactive === 1)
      return <Badge className="bg-green-100 text-green-700"><CheckCircle size={13} className="inline mr-1" />Active</Badge>;
    if (u.islocked === 1)
      return <Badge className="bg-red-100 text-red-700"><XCircle size={13} className="inline mr-1" />Locked</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-700"><Clock size={13} className="inline mr-1" />Inactive</Badge>;
  };

  // Handlers
  const handleCreate = async () => {
    if (!createForm.username || !createForm.email || !createForm.roleId) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createPortalUser.mutateAsync({
        ...createForm,
        createdBy: currentUser?.id ?? 0,
      });
      toast.success('User created successfully!');
      setCreateDialogOpen(false);
      setCreateForm(defaultCreate);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user');
    }
  };

  const handleOpenEdit = (u: PortalUser) => {
    setSelectedUser(u);
    setEditForm({
      username:    u.username,
      firstName:   u.first_name,
      middleName:  u.middle_name ?? '',
      surname:     u.surname,
      phoneNumber: u.phone_number,
      clientId:    u.client_id,
      roleId:      u.role?.roleId ?? 0,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await updatePortalUser.mutateAsync({
        portalUserId: selectedUser.id,
        updatedBy: currentUser?.id ?? 0,
        ...editForm,
      });
      toast.success('User updated successfully!');
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
    }
  };

  const handleToggleActive = async (u: PortalUser) => {
    try {
      if (u.isactive === 1) {
        await deactivatePortalUser.mutateAsync(u.id);
        toast.success(`${u.first_name} deactivated`);
      } else {
        await activatePortalUser.mutateAsync(u.id);
        toast.success(`${u.first_name} activated`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const handleOpenAssignPerms = (u: PortalUser) => {
    setSelectedUser(u);
    setSelectedPermIds([]);
    setAssignPermsDialogOpen(true);
  };

  const handleAssignPermissions = async () => {
    if (!selectedUser) return;
    try {
      await assignPermissions.mutateAsync({
        roleId: selectedUser.role?.roleId ?? 0,
        userId: selectedUser.id,
        permissionIds: selectedPermIds as any,
      });
      toast.success('Permissions assigned successfully!');
      setAssignPermsDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign permissions');
    }
  };

  const togglePerm = (id: number) =>
      setSelectedPermIds(prev =>
          prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
      );

  // ── Shared table row ──────────────────────────────────────────────────────
  const UserRow = ({ u, showStatus = true }: { u: PortalUser; showStatus?: boolean }) => (
      <TableRow key={u.id}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(u)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{u.fullName}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge className="bg-blue-100 text-blue-700">{u.roleName}</Badge>
        </TableCell>
        {showStatus && <TableCell>{getStatusBadge(u)}</TableCell>}
        <TableCell>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Mail size={13} className="text-gray-400" />{u.email}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Phone size={13} className="text-gray-400" />{u.phoneNumber}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => handleOpenEdit(u)} className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
              <Edit size={15} className="text-blue-600" />
            </button>
            <button onClick={() => handleToggleActive(u)} className="p-2 hover:bg-gray-100 rounded-lg" title={u.isactive === 1 ? 'Deactivate' : 'Activate'}>
              {u.isactive === 1
                  ? <ShieldOff size={15} className="text-orange-600" />
                  : <ShieldCheck size={15} className="text-green-600" />}
            </button>
            <button onClick={() => handleOpenAssignPerms(u)} className="p-2 hover:bg-gray-100 rounded-lg" title="Assign Permissions">
              <ShieldCheck size={15} className="text-purple-600" />
            </button>
          </div>
        </TableCell>
      </TableRow>
  );

  const TableColumns = ({ showStatus = true }: { showStatus?: boolean }) => (
      <TableRow>
        <TableHead>Full Name</TableHead>
        <TableHead>Role Name</TableHead>
        {showStatus && <TableHead>Status</TableHead>}
        <TableHead>Email</TableHead>
        <TableHead>Phone Number</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
  );

  // ── Create / Edit form shared fields ──────────────────────────────────────
  const UserFormFields = ({ form, setForm }: { form: any; setForm: any }) => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name *</Label>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
          </div>
          <div>
            <Label>Surname *</Label>
            <Input value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} placeholder="Doe" />
          </div>
        </div>
        <div>
          <Label>Middle Name</Label>
          <Input value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} placeholder="Optional" />
        </div>
        <div>
          <Label>Username *</Label>
          <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="johndoe" />
        </div>
        {'email' in form && (
            <div>
              <Label>Email Address *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
            </div>
        )}
        <div>
          <Label>Phone Number *</Label>
          <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+254 712 345 678" />
        </div>
        <div>
          <Label>Role *</Label>
          <Select
              value={form.roleId ? String(form.roleId) : ''}
              onValueChange={(v) => setForm({ ...form, roleId: parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map(r => (
                  <SelectItem key={r.roleId} value={String(r.roleId)}>
                    {r.roleName}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users & Roles</h1>
            <p className="mt-1 text-sm text-gray-600">Manage system users and their permissions</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <button
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white w-fit"
                  style={{ backgroundColor: '#272757' }}
              >
                <Plus size={16} />
                Add User
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user and assign their role.</DialogDescription>
              </DialogHeader>
              <UserFormFields form={createForm} setForm={setCreateForm} />
              <DialogFooter>
                <button onClick={() => setCreateDialogOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Cancel
                </button>
                <button
                    onClick={handleCreate}
                    disabled={createPortalUser.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60"
                    style={{ backgroundColor: '#272757' }}
                >
                  {createPortalUser.isPending && <Loader2 size={14} className="animate-spin" />}
                  Create User
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Users',       value: portalUsers.length,                              icon: <Users className="h-6 w-6 text-purple-600" />,  bg: 'bg-purple-100' },
            { label: 'Active Users',       value: activeUsers.length,                              icon: <CheckCircle className="h-6 w-6 text-green-600" />, bg: 'bg-green-100' },
            { label: 'Roles Defined',      value: roles.length,                                    icon: <UserCog className="h-6 w-6 text-blue-600" />,  bg: 'bg-blue-100' },
            { label: 'Permissions',        value: permissions.length,                              icon: <ShieldCheck className="h-6 w-6 text-orange-600" />, bg: 'bg-orange-100' },
          ].map(({ label, value, icon, bg }) => (
              <Card key={label}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
                    <div>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="text-2xl font-bold">{value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        {/* Users Table */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({portalUsers.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeUsers.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveUsers.length})</TabsTrigger>
          </TabsList>

          {usersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-gray-400" />
              </div>
          ) : usersError ? (
              <div className="flex items-center justify-center gap-2 py-16 text-red-500">
                <AlertCircle size={20} />
                <span>Failed to load users</span>
              </div>
          ) : (
              <>
                <TabsContent value="all">
                  <Card>
                    <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader><TableColumns /></TableHeader>
                          <TableBody>
                            {portalUsers.length > 0
                                ? portalUsers.map(u => <UserRow key={u.id} u={u} />)
                                : <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No users found</TableCell></TableRow>}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="active">
                  <Card>
                    <CardHeader><CardTitle>Active Users</CardTitle></CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader><TableColumns showStatus={false} /></TableHeader>
                          <TableBody>
                            {activeUsers.length > 0
                                ? activeUsers.map(u => <UserRow key={u.id} u={u} showStatus={false} />)
                                : <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No active users</TableCell></TableRow>}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inactive">
                  <Card>
                    <CardHeader><CardTitle>Inactive Users</CardTitle></CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader><TableColumns /></TableHeader>
                          <TableBody>
                            {inactiveUsers.length > 0
                                ? inactiveUsers.map(u => <UserRow key={u.id} u={u} />)
                                : <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No inactive users</TableCell></TableRow>}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
          )}
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and role.</DialogDescription>
            </DialogHeader>
            <UserFormFields form={editForm} setForm={setEditForm} />
            <DialogFooter>
              <button onClick={() => { setEditDialogOpen(false); setSelectedUser(null); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
              <button
                  onClick={handleUpdate}
                  disabled={updatePortalUser.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60"
                  style={{ backgroundColor: '#272757' }}
              >
                {updatePortalUser.isPending && <Loader2 size={14} className="animate-spin" />}
                Update User
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Permissions Dialog */}
        <Dialog open={assignPermsDialogOpen} onOpenChange={setAssignPermsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Permissions</DialogTitle>
              <DialogDescription>
                Assigning permissions to role: <strong>{selectedUser?.role?.roleName}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2 max-h-72 overflow-y-auto pr-1">
              {permissions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No permissions available</p>
              ) : permissions.map(perm => (
                  <label key={perm.permissionId} className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-50">
                    <input
                        type="checkbox"
                        checked={selectedPermIds.includes(perm.permissionId)}
                        onChange={() => togglePerm(perm.permissionId)}
                        className="rounded"
                    />
                    <span className="text-sm text-gray-800">{perm.permissionName}</span>
                  </label>
              ))}
            </div>
            <DialogFooter>
              <button onClick={() => setAssignPermsDialogOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
              <button
                  onClick={handleAssignPermissions}
                  disabled={assignPermissions.isPending || selectedPermIds.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-60"
                  style={{ backgroundColor: '#272757' }}
              >
                {assignPermissions.isPending && <Loader2 size={14} className="animate-spin" />}
                Assign ({selectedPermIds.length})
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}