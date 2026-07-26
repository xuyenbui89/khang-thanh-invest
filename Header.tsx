import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import {
  Building2,
  Sun,
  Moon,
  Bell,
  LogOut,
  MapPin,
  ChevronDown,
  CheckCircle2,
  Database
} from 'lucide-react';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenAccount }) => {
  const { currentUser, theme, toggleTheme, logout, switchRole } = useAuth();
  const { notifications, markNotificationRead, syncWithSupabase } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'staff': return 'Nhân viên Sale/Nguồn';
      case 'landlord': return 'Chủ trọ / Chủ nhà';
      case 'tenant': return 'Khách thuê';
    }
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await syncWithSupabase();
    setTimeout(() => setIsSyncing(false), 600);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/60 backdrop-blur-xl border-b border-white/10 transition-colors shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              MINIHOUSE CRM
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">PRO</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Quản lý vận hành bất động sản cho thuê chuyên nghiệp
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Real-time Supabase Status Badge */}
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 transition-all shadow-sm"
            title="Đồng bộ dữ liệu Supabase Realtime"
          >
            <Database className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : 'text-emerald-400'}`} />
            <span>Supabase Sync</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-500/50"></span>
          </button>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 transition"
            >
              <span>{getRoleLabel(currentUser.role)}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0a0f1e]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Chuyển quyền kiểm thử
                </div>
                <button
                  onClick={() => { switchRole('super_admin'); setShowRoleDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between text-slate-200 transition"
                >
                  <span className="font-semibold text-rose-400">Super Admin</span>
                  {currentUser.role === 'super_admin' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                </button>
                <button
                  onClick={() => { switchRole('staff'); setShowRoleDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between text-slate-200 transition"
                >
                  <span className="font-semibold text-indigo-400">Nhân viên Sale/Nguồn</span>
                  {currentUser.role === 'staff' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
                <button
                  onClick={() => { switchRole('landlord'); setShowRoleDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between text-slate-200 transition"
                >
                  <span className="font-semibold text-emerald-400">Chủ Trọ / Chủ Nhà</span>
                  {currentUser.role === 'landlord' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => { switchRole('tenant'); setShowRoleDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-white/10 flex items-center justify-between text-slate-200 transition"
                >
                  <span className="font-semibold text-purple-400">Khách Thuê</span>
                  {currentUser.role === 'tenant' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 border border-white/5 transition"
            title="Chuyển chế độ sáng/tối"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notifications dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-300 hover:bg-white/10 border border-white/5 relative transition"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0a0f1e]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Thông báo hệ thống ({notifications.length})</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} chưa đọc
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-center text-slate-400">Chưa có thông báo nào.</p>
                  ) : (
                    notifications.map(item => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationRead(item.id)}
                        className={`p-3.5 text-xs hover:bg-white/10 cursor-pointer transition ${!item.isRead ? 'bg-indigo-500/10' : ''}`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-100 mb-1">
                          <span>{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-2 hover:opacity-80 transition"
              title="Hồ sơ cá nhân & Đổi mật khẩu"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-md"
              />
              <span className="text-xs font-bold text-slate-200 hidden md:block max-w-[120px] truncate">
                {currentUser.fullName}
              </span>
            </button>

            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
