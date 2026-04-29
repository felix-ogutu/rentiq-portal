import { api } from "../lib/api";
import { DashboardResponse } from "../types/dashboard";

export const fetchDashboard = async (): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>("/api/dashboard");
    return response.data;
};