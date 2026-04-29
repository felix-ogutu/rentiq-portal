export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MaintenanceRequest {
    id: number;
    category: string;
    description: string;
    dateReported: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    assignedTechnician: string;
}

export interface MaintenanceCreateRequest {
    category: string;
    description: string;
    dateReported: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    assignedTechnician: string;
}

export interface MaintenanceUpdateRequest {
    id: number;
    category: string;
    description: string;
    dateReported: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    assignedTechnician: string;
}

export interface MaintenanceFilter {
    page: number;
    size: number;
    category?: string;
    priority?: MaintenancePriority;
    status?: MaintenanceStatus;
}

export interface MaintenanceResponse {
    status: number;
    message: string;
    totalResults: number;
    data: MaintenanceRequest[];
}