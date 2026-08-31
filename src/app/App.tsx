import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/login-page';
import { DashboardLayout } from './components/dashboard-layout';
import { DashboardOverview } from './components/landlord/dashboard-overview';
import { PropertiesViewNew } from './components/landlord/properties-view-new';
import { UnitsView } from './components/landlord/units-view';
import { TenantsView } from './components/landlord/tenants-view';
import { PaymentsView } from './components/landlord/payments-view';
import { ExpensesView } from './components/landlord/expenses-view';
import { MaintenanceView } from './components/landlord/maintenance-view';
import { ReportsView } from './components/landlord/reports-view';
import { SettingsView } from './components/landlord/settings-view';
import { DebitNoticesView } from './components/landlord/debit-notices-view';
import { UsersRolesView } from './components/landlord/users-roles-view';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {WorkflowsView} from "./components/landlord/workflows-view";
import {InvoicesView} from "./components/landlord/InvoicesView";
import {PaymentLinkView} from "./components/landlord/PaymentLinkView";

type RouteDefinition = {
    path: string;
    element: React.ReactNode;
};

const ROLE_ROUTES: Record<string, RouteDefinition[]> = {
    LANDLORD: [
        { path: 'dashboard',     element: <DashboardOverview /> },
        { path: 'properties',    element: <PropertiesViewNew /> },
        { path: 'units',         element: <UnitsView /> },
        { path: 'tenants',       element: <TenantsView /> },
        { path: 'payments',      element: <PaymentsView /> },
        { path: 'debit-notices', element: <DebitNoticesView /> },
        { path: 'expenses',      element: <ExpensesView /> },
        { path: 'maintenance',   element: <MaintenanceView /> },
        { path: 'users-roles',   element: <UsersRolesView /> },
        { path: 'settings',      element: <SettingsView /> },
        { path: 'workflows',      element: <WorkflowsView /> },
        { path: 'invoices',      element: <InvoicesView /> },

    ],
    TENANT: [
        { path: 'dashboard',   element: <DashboardOverview /> },
        { path: 'payments',    element: <PaymentsView /> },
        { path: 'maintenance', element: <MaintenanceView /> },
        { path: 'settings',    element: <SettingsView /> },
    ],
    CARETAKER: [
        { path: 'dashboard',   element: <DashboardOverview /> },
        { path: 'tenants',     element: <TenantsView /> },
        { path: 'payments',    element: <PaymentsView /> },
        { path: 'maintenance', element: <MaintenanceView /> },
        { path: 'settings',    element: <SettingsView /> },
    ],
    PROPERTY_MANAGER: [
        { path: 'dashboard',  element: <DashboardOverview /> },
        { path: 'properties', element: <PropertiesViewNew /> },
        { path: 'units',      element: <UnitsView /> },
        { path: 'settings',   element: <SettingsView /> },
    ],
    SERVICE_PROVIDER: [
        { path: 'dashboard',   element: <DashboardOverview /> },
        { path: 'maintenance', element: <MaintenanceView /> },
        { path: 'payments',    element: <PaymentsView /> },
        { path: 'settings',    element: <SettingsView /> },
    ],
};

function LoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        </div>
    );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <LoadingScreen />;
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    return <>{children}</>;
}

function RedirectIfAuthenticated() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <LoadingScreen />;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return (
        <>
            <LoginPage />
            <Toaster />
        </>
    );
}

function Portal() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const role = user?.role ?? 'LANDLORD';
    const routes = ROLE_ROUTES[role] ?? ROLE_ROUTES.LANDLORD;

    // Derive active tab from current URL (now clean URLs)
    const activeTab = location.pathname.split('/').filter(Boolean).pop() ?? 'dashboard';

    return (
        <>
            <DashboardLayout
                activeTab={activeTab}
                onTabChange={(tab) => navigate(`/${tab}`)}   // Changed: now uses clean URLs
                onLogout={logout}
                userRole={role}
            >
                <Routes>
                    {/* Default: / → /dashboard */}
                    <Route index element={<Navigate to="dashboard" replace />} />

                    {/* Role-based routes at root level */}
                    {routes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}

                    {/* Catch all unknown routes */}
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
            </DashboardLayout>
            <Toaster />
        </>
    );
}

// MAIN APP ROUTES

function AppRoutes() {
    return (
        <Routes>
            {/* Login Route */}
            <Route path="/login" element={<RedirectIfAuthenticated />} />

            {/* Public payment link — no auth, no sidebar */}
            <Route path="/pay/:token" element={<PaymentLinkView />} />

            {/* Root → redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* All protected routes (clean URLs) */}
            <Route
                path="/*"
                element={
                    <RequireAuth>
                        <Portal />
                    </RequireAuth>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

// Query Client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
        },
    },
});

// Root App
export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}