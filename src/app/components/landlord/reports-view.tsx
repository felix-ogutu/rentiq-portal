import { DashboardStats, Property, Payment, Expense } from '../../types';
import { Download, FileText, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ReportsViewProps {
  stats: DashboardStats;
  properties: Property[];
  payments: Payment[];
  expenses: Expense[];
}

export function ReportsView({ stats, properties, payments, expenses }: ReportsViewProps) {
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  // Monthly income trend (mock data for past 12 months)
  const monthlyData = [
    { month: 'Mar 25', income: 4200000, expenses: 89000 },
    { month: 'Apr 25', income: 4350000, expenses: 92000 },
    { month: 'May 25', income: 4500000, expenses: 88000 },
    { month: 'Jun 25', income: 4600000, expenses: 95000 },
    { month: 'Jul 25', income: 4700000, expenses: 91000 },
    { month: 'Aug 25', income: 4800000, expenses: 95000 },
    { month: 'Sep 25', income: 4950000, expenses: 102000 },
    { month: 'Oct 25', income: 5100000, expenses: 98000 },
    { month: 'Nov 25', income: 5050000, expenses: 105000 },
    { month: 'Dec 25', income: 5200000, expenses: 110000 },
    { month: 'Jan 26', income: 5150000, expenses: 108000 },
    { month: 'Feb 26', income: stats.monthlyRevenue, expenses: stats.monthlyExpenses }
  ];

  // Property performance
  const propertyPerformance = properties.map(p => ({
    name: p.name,
    revenue: p.monthlyRevenue,
    occupancy: (p.occupiedUnits / p.totalUnits) * 100
  }));

  // Payment types breakdown
  const paymentTypes = [
    { name: 'Rent', value: payments.filter(p => p.type === 'rent' && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) },
    { name: 'Utilities', value: payments.filter(p => ['water', 'electricity'].includes(p.type) && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) },
    { name: 'Other', value: payments.filter(p => ['service-charge', 'garbage', 'security', 'parking'].includes(p.type) && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  // Expense categories
  const expenseCategories = Object.entries(
    expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) acc[exp.category] = 0;
      acc[exp.category] += exp.amount;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const reportTypes = [
    { name: 'Income Statement', description: 'Detailed revenue and expenses report', icon: FileText },
    { name: 'Rent Roll', description: 'Complete tenant and payment listing', icon: FileText },
    { name: 'Vacancy Report', description: 'Available units and occupancy trends', icon: FileText },
    { name: 'Maintenance Report', description: 'All maintenance requests and costs', icon: FileText },
    { name: 'Arrears Report', description: 'Outstanding payments by tenant', icon: FileText },
    { name: 'Property Performance', description: 'Individual property metrics', icon: FileText }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Comprehensive financial and operational insights</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 w-full sm:w-auto">
          <Calendar size={16} className="text-gray-500" />
          <select className="border-none bg-transparent text-xs sm:text-sm text-gray-700 focus:outline-none flex-1 sm:flex-none">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
                <p className="mt-1 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                <div className="mt-2 flex items-center gap-1 text-xs sm:text-sm text-green-600">
                  <TrendingUp size={14} />
                  <span>+8.3% YoY</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyExpenses)}</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                  <TrendingUp size={16} />
                  <span>+2.1% YoY</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Operating Income</p>
                <p className="mt-1 text-2xl font-bold text-green-600">{formatCurrency(stats.netIncome)}</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={16} />
                  <span>+9.5% YoY</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">
                  {((stats.netIncome / stats.monthlyRevenue) * 100).toFixed(1)}%
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={16} />
                  <span>+1.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Income vs Expenses - 12 Month Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses - 12 Month Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {paymentTypes.map((type, index) => (
                  <div key={type.name}>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm text-gray-600">{type.name}</span>
                    </div>
                    <p className="ml-5 font-medium text-gray-900">{formatCurrency(type.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Property Revenue Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{category.name}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(category.value)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(category.value / expenseCategories.reduce((sum, c) => sum + c.value, 0)) * 100}%`,
                        backgroundColor: '#272757'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((report) => (
              <div
                key={report.name}
                className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:shadow-md"
              >
                <div className="rounded-lg bg-blue-50 p-3">
                  <report.icon size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="mt-1 text-sm text-gray-600">{report.description}</p>
                  <button className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                    <Download size={16} />
                    Generate PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
