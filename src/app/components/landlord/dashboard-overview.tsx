import {
  Building2,
  TrendingUp,
  DollarSign,
  Percent,
  AlertCircle,
  DoorOpen,
  Calendar,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDashboard } from "../../hooks/useDashboard";
import { SummaryCard, DashboardChart } from "../../types/dashboard";

//Helpers

const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

const formatValue = (card: SummaryCard): string => {
  switch (card.type) {
    case "currency":
      return formatCurrency(card.value);
    case "percentage":
      return `${card.value.toFixed(1)}%`;
    default:
      return card.value.toString();
  }
};

/** Pick the right Lucide icon for each summary card key */
const cardIcon = (key: string) => {
  switch (key) {
    case "totalProperties":
      return <Building2 size={24} />;
    case "occupancyRate":
      return <Percent size={24} />;
    case "monthlyRevenue":
      return <TrendingUp size={24} />;
    case "netIncome":
      return <DollarSign size={24} />;
    default:
      return <Building2 size={24} />;
  }
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ card }: { card: SummaryCard }) {
  return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.label}</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatValue(card)}
              </h3>
            </div>
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              {cardIcon(card.key)}
            </div>
          </div>
        </CardContent>
      </Card>
  );
}

function IncomeExpenseChart({ chart }: { chart: DashboardChart }) {
  if (!chart.series || !chart.xaxis) return null;

  const data = chart.xaxis.map((month, i) => ({
    month,
    ...Object.fromEntries(
        chart.series!.map((s) => [s.name, s.data[i] ?? 0])
    ),
  }));

  return (
      <Card>
        <CardHeader>
          <CardTitle>{chart.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Line
                  type="monotone"
                  dataKey="Income"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
              />
              <Line
                  type="monotone"
                  dataKey="Expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );
}

function RevenuePerPropertyChart({ chart }: { chart: DashboardChart }) {
  if (!chart.series || !chart.categories) return null;

  const data = chart.categories.map((cat, i) => ({
    name: cat,
    Revenue: chart.series![0].data[i] ?? 0,
  }));

  return (
      <Card>
        <CardHeader>
          <CardTitle>{chart.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="Revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );
}

const DONUT_COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"];

function OccupancyDonutChart({ chart }: { chart: DashboardChart }) {
  if (!chart.segments) return null;

  const occupied = chart.segments.find((s) => s.name === "Occupied")?.value ?? 0;
  const vacant = chart.segments.find((s) => s.name === "Vacant")?.value ?? 0;

  return (
      <Card>
        <CardHeader>
          <CardTitle>{chart.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie
                    data={chart.segments}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                >
                  {chart.segments.map((entry, index) => (
                      <Cell
                          key={`${entry.name}-${index}`}
                          fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                      />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-xl font-bold text-gray-900">{occupied}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vacant</p>
                <p className="text-xl font-bold text-gray-900">{vacant}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}

function renderChart(chart: DashboardChart) {
  switch (chart.key) {
    case "incomeVsExpense":
      return <IncomeExpenseChart key={chart.key} chart={chart} />;
    case "revenuePerProperty":
      return <RevenuePerPropertyChart key={chart.key} chart={chart} />;
    case "occupiedVacant":
      return <OccupancyDonutChart key={chart.key} chart={chart} />;
    default:
      return null;
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function DashboardOverview() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );
  }

  if (isError || !data) {
    return (
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <span>{error?.message ?? "Failed to load dashboard data."}</span>
          </div>
        </div>
    );
  }

  // Derive vacancy alert from the donut chart segments
  const occupancyChart = data.charts.find((c) => c.key === "occupiedVacant");
  const vacantUnits =
      occupancyChart?.segments?.find((s) => s.name === "Vacant")?.value ?? 0;

  // Split charts for layout
  const lineChart = data.charts.find((c) => c.key === "incomeVsExpense");
  const barChart = data.charts.find((c) => c.key === "revenuePerProperty");
  const donutChart = data.charts.find((c) => c.key === "occupiedVacant");

  const now = new Date();
  const monthLabel = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">
              Welcome back! Here's your portfolio summary.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 w-fit">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-sm text-gray-700">{monthLabel}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.summaryCards.map((card) => (
              <StatCard key={card.key} card={card} />
          ))}
        </div>

        {/* Line + Bar charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {lineChart && renderChart(lineChart)}
          {barChart && renderChart(barChart)}
        </div>

        {/* Donut + Alerts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {donutChart && renderChart(donutChart)}

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts &amp; Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vacantUnits > 0 && (
                    <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                      <DoorOpen size={20} className="mt-0.5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">
                          {vacantUnits} Vacant Unit{vacantUnits > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm text-blue-700">Ready for marketing</p>
                      </div>
                    </div>
                )}
                {vacantUnits === 0 && (
                    <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                      <TrendingUp size={20} className="mt-0.5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          Full Occupancy
                        </p>
                        <p className="text-sm text-green-700">
                          All units are currently occupied.
                        </p>
                      </div>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}