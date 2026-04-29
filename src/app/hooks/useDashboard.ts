import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../services/dashboardService";
import { DashboardResponse } from "../types/dashboard";

export const useDashboard = () => {
    return useQuery<DashboardResponse, Error>({
        queryKey: ["dashboard"],
        queryFn: fetchDashboard,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};