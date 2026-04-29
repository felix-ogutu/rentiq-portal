export enum UserRole {
    LANDLORD = "LANDLORD",
    PROPERTY_MANAGER = "PROPERTY_MANAGER",
    CARETAKER = "CARETAKER",
    ACCOUNTANT = "ACCOUNTANT",
    TENANT = "TENANT",
    SERVICE_PROVIDER = "SERVICE_PROVIDER"
}


export interface User {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    roleId: number;
    isExpired: number;
    isActive: number;
    isLocked: number;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export interface LoginResponse {
    status: number;
    message: string;
    token: string;
    tokenType: string;
    totalResults: number;
    data: User;
    timeStamp: string;
}
