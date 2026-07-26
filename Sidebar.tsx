import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  Users,
  Home,
  UserCheck,
  FileText,
  DollarSign,
  MapPin,
  Trophy,
  AlertTriangle,
  Settings
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'properties'
  | 'landlords'
  | 'my_rooms'
  | 'tenants'
  | 'contracts'
  | 'commissions'
  | 'attendance'
  | 'honor'
  | 'incidents'
  | 'settings'
  | 'customers'
  | 'finance'
  | 'users';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  const role = currentUser.role;

  const navItems: { id: string; label: string; icon: React.FC<{ className?: string }>; roles: string[] }[] = [
    { id: 'dashboard', label: 'Tổng quan hệ thống', icon: LayoutDashboard, roles: ['super_admin', 'staff', 'landlord', 'tenant'] },
    { id: 'properties', label: 'Kho tài sản & Nguồn hàng', icon: Building, roles: ['super_admin', 'staff', 'landlord'] },
    { id: 'customers', label: 'Khách hàng & Lịch xem nhà', icon: UserCheck, roles: ['super_admin', 'staff'] },
    { id: 'contracts', label: 'Hợp đồng & Doanh số', icon: FileText, roles: ['super_admin', 'staff', 'landlord'] },
    { id: 'finance', label: 'Sổ sách & Bảng lương', icon: DollarSign, roles: ['super_admin', 'staff', 'landlord'] },
    { id: 'users', label: 'Quản trị thành viên', icon: Users, roles: ['super_admin'] }
  ];

  const filteredNavs = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 flex-shrink-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-2xl shadow-black/20 min-h-[calc(100vh-6rem)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Menu Vận Hành
          </div>
          <nav className="space-y-1.5 mt-2">
            {filteredNavs.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/15 shadow-lg shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'opacity-70'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick System Badge */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-500/50"></div>
          <div className="text-[11px] font-bold text-emerald-400">
            Hệ thống: Hoạt động 100%
          </div>
        </div>
      </div>

      {/* Footer Role Card */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Người dùng</div>
        <div className="text-xs font-bold text-white mt-0.5 truncate">{currentUser.fullName}</div>
        <div className="text-[10px] text-indigo-400 font-semibold uppercase mt-0.5">{currentUser.role}</div>
      </div>
    </aside>
  );
};
