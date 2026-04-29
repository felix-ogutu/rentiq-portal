import { UserRole } from '../types';
import { Building2, Users, Wrench, Briefcase, HardHat } from 'lucide-react';

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: (role: UserRole) => void;
}

function RoleCard({ role, title, description, icon, onSelect }: RoleCardProps) {
  return (
    <button
      onClick={() => onSelect(role)}
      className="group relative flex flex-col items-center gap-4 rounded-xl border-2 border-gray-200 bg-white p-8 text-center transition-all hover:shadow-lg"
      style={{ 
        borderColor: undefined,
        '--hover-border-color': '#4A90E2',
        '--hover-bg-color': '#272757'
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#4A90E2';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
      }}
    >
      <div 
        className="rounded-full p-6 transition-colors group-hover:text-white"
        style={{ 
          backgroundColor: '#E8F0FE',
          color: '#4A90E2'
        }}
        onMouseEnter={(e) => {
          const parent = e.currentTarget.parentElement;
          if (parent?.matches(':hover')) {
            e.currentTarget.style.backgroundColor = '#272757';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#E8F0FE';
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </button>
  );
}

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const roles = [
    {
      role: 'landlord' as UserRole,
      title: 'Landlord',
      description: 'Manage properties, tenants, finances and reports',
      icon: <Building2 size={40} />
    },
    {
      role: 'tenant' as UserRole,
      title: 'Tenant',
      description: 'View invoices, make payments and submit requests',
      icon: <Users size={40} />
    },
    {
      role: 'caretaker' as UserRole,
      title: 'Caretaker',
      description: 'Handle complaints and manage maintenance',
      icon: <Wrench size={40} />
    },
    {
      role: 'property-manager' as UserRole,
      title: 'Property Manager',
      description: 'Market vacancies and manage properties',
      icon: <Briefcase size={40} />
    },
    {
      role: 'service-provider' as UserRole,
      title: 'Service Provider',
      description: 'View job assignments and submit invoices',
      icon: <HardHat size={40} />
    }
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: '#272757' }}>
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Rentiq</h1>
        </div>
        <p className="text-xl text-gray-600">Property Management Solution</p>
        <p className="mt-2 text-gray-500">Select your role to continue</p>
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <RoleCard
            key={role.role}
            role={role.role}
            title={role.title}
            description={role.description}
            icon={role.icon}
            onSelect={onRoleSelect}
          />
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>© 2026 Rentiq. All rights reserved.</p>
      </div>
    </div>
  );
}
