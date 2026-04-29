export type SummaryCardType = "number" | "percentage" | "currency";

export interface SummaryCard {
    key: string;
    label: string;
    value: number;
    type: SummaryCardType;
}

export type ChartType = "line" | "bar" | "donut";

export interface ChartSeries {
    name: string;
    data: number[];
}

export interface ChartSegment {
    name: string;
    value: number;
}

export interface DashboardChart {
    key: string;
    label: string;
    chartType: ChartType;
    categories: string[] | null;
    series: ChartSeries[] | null;
    segments: ChartSegment[] | null;
    xaxis: string[] | null;
}

export interface DashboardTable {
    // Extend as needed when tables are populated
    [key: string]: unknown;
}

export interface DashboardResponse {
    role: string;
    summaryCards: SummaryCard[];
    charts: DashboardChart[];
    tables: DashboardTable[];
}