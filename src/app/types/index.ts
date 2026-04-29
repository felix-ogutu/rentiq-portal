// Type definitions for Rentiq Property Management System

export type UserRole = 'landlord' | 'tenant' | 'caretaker' | 'property-manager' | 'service-provider';

export interface Property {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
  imageUrl: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: string;
  rent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  propertyId: string;
  unitNumber: string;
  rent: number;
  leaseStart: string;
  leaseEnd: string;
  status: 'active' | 'arrears' | 'notice';
  balance: number;
  imageUrl: string;
  depositAmount?: number;
  depositPaidDate?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  type: 'rent' | 'water' | 'electricity' | 'service-charge' | 'garbage' | 'security' | 'parking';
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  method?: 'mpesa' | 'bank' | 'cash';
  reference?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  propertyName: string;
  category: 'repairs' | 'maintenance' | 'utilities' | 'salaries' | 'supplies' | 'other';
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'paid';
  approvedBy?: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  category: 'plumbing' | 'electrical' | 'appliance' | 'structural' | 'other';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  dateReported: string;
  dateResolved?: string;
  assignedTo?: string;
  cost?: number;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  type: 'notice' | 'complaint' | 'inquiry' | 'reminder';
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  items: InvoiceItem[];
  total: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paidDate?: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
  type: string;
}

export interface PropertyManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: string[];
  commission: number;
  totalEarnings: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  email: string;
  phone: string;
  rating: number;
  jobsCompleted: number;
}

export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netIncome: number;
  collectionRate: number;
  arrears: number;
  pendingMaintenance: number;
}

export interface DebitNotice {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  reason: string;
  description: string;
  date: string;
  status: 'pending' | 'processed' | 'cancelled';
  processedBy?: string;
  processedDate?: string;
}

export interface VacateNotice {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  vacateDate: string;
  reason: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
}

export interface TenantDocument {
  id: string;
  tenantId: string;
  documentType: 'id' | 'passport' | 'lease' | 'other';
  documentName: string;
  uploadDate: string;
  fileUrl: string;
  verified: boolean;
}

export interface TenantOnboarding {
  id: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitNumber: string;
  rent: number;
  depositAmount: number;
  leaseStart: string;
  leaseEnd: string;
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  createdDate: string;
  lastLogin?: string;
  assignedProperties?: string[]; // For property managers and caretakers
  permissions: UserPermissions;
  imageUrl?: string;
}

export interface UserPermissions {
  canViewFinancials: boolean;
  canManageProperties: boolean;
  canManageTenants: boolean;
  canManagePayments: boolean;
  canManageMaintenance: boolean;
  canApproveExpenses: boolean;
  canGenerateReports: boolean;
  canManageUsers: boolean;
}
