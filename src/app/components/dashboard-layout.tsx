import {
  Building2,
  LayoutDashboard,
  Users,
  Receipt,
  TrendingDown,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  FileText,
  UserCog, BarcodeIcon
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {WorkflowsView} from "./landlord/workflows-view";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userRole: string;
}

export function DashboardLayout({ children, activeTab, onTabChange, onLogout, userRole }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }
    ];

    switch (userRole) {
      case 'LANDLORD':
        return [
          ...baseItems,
          { id: 'properties',    label: 'Properties',    icon: <Building2 size={20} /> },
          { id: 'units',         label: 'Units',         icon: <Home size={20} /> },
          { id: 'tenants',       label: 'Tenants',       icon: <Users size={20} /> },
          { id: 'payments',      label: 'Payments',      icon: <Receipt size={20} /> },
          { id: 'debit-notices', label: 'Debit Notices', icon: <FileText size={20} /> },
          { id: 'expenses',      label: 'Expenses',      icon: <TrendingDown size={20} /> },
          { id: 'maintenance',   label: 'Maintenance',   icon: <Wrench size={20} /> },
          // { id: 'reports',       label: 'Reports',       icon: <BarChart3 size={20} /> },
          { id: 'workflows',      label: 'Workflows',      icon: <BarcodeIcon size={20} /> },
          { id: 'users-roles',   label: 'Users & Roles', icon: <UserCog size={20} /> },
          { id: 'settings',      label: 'Settings',      icon: <Settings size={20} /> },
        ];

      case 'PROPERTY_MANAGER':
        return [
          ...baseItems,
          { id: 'properties', label: 'Properties', icon: <Building2 size={20} /> },
          { id: 'units',      label: 'Units',       icon: <Home size={20} /> },
          { id: 'settings',   label: 'Settings',    icon: <Settings size={20} /> },
        ];

      case 'SERVICE_PROVIDER':
        return [
          ...baseItems,
          { id: 'jobs',        label: 'Active Jobs',  icon: <Wrench size={20} /> },
          { id: 'payments',    label: 'Payments',     icon: <Receipt size={20} /> },
          { id: 'maintenance', label: 'Maintenance',  icon: <Wrench size={20} /> },
          { id: 'settings',    label: 'Settings',     icon: <Settings size={20} /> },
        ];

      case 'CARETAKER':
        return [
          ...baseItems,
          { id: 'tenants',     label: 'Tenants',     icon: <Users size={20} /> },
          { id: 'payments',    label: 'Payments',     icon: <Receipt size={20} /> },
          { id: 'maintenance', label: 'Maintenance',  icon: <Wrench size={20} /> },
          { id: 'settings',    label: 'Settings',     icon: <Settings size={20} /> },
        ];

      default: // TENANT
        return [
          ...baseItems,
          { id: 'payments',    label: 'Payments',    icon: <Receipt size={20} /> },
          { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
          { id: 'settings',    label: 'Settings',    icon: <Settings size={20} /> },
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  const roleLabel = userRole
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());

  return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Mobile Menu Button */}
        <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed top-4 left-4 z-50 lg:hidden rounded-lg p-2 text-white"
            style={{ backgroundColor: '#272757' }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Sidebar */}
        <aside
            className={`fixed lg:relative inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ backgroundColor: '#272757' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-gray-700 px-4 sm:px-6 py-5">
            <div className="rounded-lg p-2" style={{ backgroundColor: '#4A90E2' }}>
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Rentiq</h2>
              <p className="text-xs text-gray-300">{roleLabel} Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                  <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 sm:px-4 py-3 text-left text-sm transition-colors ${
                          activeTab === item.id
                              ? 'text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      style={activeTab === item.id ? { backgroundColor: '#4A90E2' } : {}}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
              ))}
            </div>
          </nav>

          {/* User info + logout */}
          <div className="border-t border-gray-700 p-4 space-y-3">
            {user && (
                <div className="flex items-center gap-3 px-1">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
            )}
            <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 sm:px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-red-600 hover:text-white"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto w-full lg:w-auto">
          <div className="lg:hidden h-16" />
          {children}
        </main>
      </div>
  );
}