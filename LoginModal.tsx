import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Lock, User, AlertCircle, LogIn, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { login, switchRole } = useAuth();
  const [username, setUsername] = useState('administrator');
  const [password, setPassword] = useState('123123Aa@');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = login(username, password);
    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleGmailLogin = () => {
    setErrorMessage('');
    setSuccessMessage('Đăng nhập nhanh bằng tài khoản Google Gmail thành công!');
    login('administrator', '123123Aa@');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handlePresetSelect = (role: UserRole, defaultUser: string) => {
    switchRole(role);
    setSuccessMessage(`Đã chuyển quyền sang ${role.toUpperCase()}`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Đăng Nhập CRM TRỌ - MINIHOUSE</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hệ thống quản lý vận hành tòa nhà & căn hộ cho thuê
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tên đăng nhập / Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="administrator"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="123123Aa@"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              * Super admin mặc định: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600">administrator</code> - Pass: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600">123123Aa@</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-medium">Hoặc</span>
          </div>
        </div>

        {/* Gmail Login Button */}
        <button
          type="button"
          onClick={handleGmailLogin}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Đăng nhập bằng Gmail</span>
        </button>

        {/* Quick Role Tester */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">Đăng nhập nhanh theo quyền thử nghiệm:</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => handlePresetSelect('super_admin', 'administrator')}
              className="px-2 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold"
            >
              Super Admin
            </button>
            <button
              onClick={() => handlePresetSelect('staff', 'sale_nam')}
              className="px-2 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 font-semibold"
            >
              Nhân viên Sale
            </button>
            <button
              onClick={() => handlePresetSelect('landlord', 'chutro_hung')}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-semibold"
            >
              Chủ Trọ
            </button>
            <button
              onClick={() => handlePresetSelect('tenant', 'khach_minh')}
              className="px-2 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 font-semibold"
            >
              Khách Thuê
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
