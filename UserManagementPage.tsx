import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, UserRole } from '../types';
import { ExportButton } from '../components/common/ExportButton';
import { Users, UserPlus, Shield, Lock, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { users, addUser } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123123Aa@');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [phone, setPhone] = useState('0901234567');
  const [email, setEmail] = useState('');
  const [kpiTarget, setKpiTarget] = useState(50000000);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      username,
      fullName,
      role,
      phone,
      email: email || `${username}@crmtro.vn`,
      kpiTarget: Number(kpiTarget)
    });

    setUsername('');
    setFullName('');
    setIsModalOpen(false);
  };

  const exportUserData = users.map(u => ({
    'Mã ID': u.id,
    'Tên Đăng Nhập': u.username,
    'Họ Và Tên': u.fullName,
    'Phân Quyền': u.role.toUpperCase(),
    'Số Điện Thoại': u.phone,
    'Email': u.email || '---',
    'KPI Target': u.kpiTarget ? `${u.kpiTarget.toLocaleString('vi-VN')}đ` : '---'
  }));

  if (currentUser.role !== 'super_admin') {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border">
        <Shield className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold">Trang này chỉ dành cho Super Admin quản trị tài khoản hệ thống.</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Quản Trị Thành Viên & Phân Quyền Vai Trò System</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quản lý tài khoản Super Admin, Nhân viên Sale/Nguồn, Chủ Trọ và Khách Thuê
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton filename="Danh_Sach_Thanh_Vien_System" data={exportUserData} />

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo Tài Khoản Mới</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Tài Khoản & Họ Tên</th>
                <th className="py-3 px-4">Quyền Hạn (Role)</th>
                <th className="py-3 px-4">Số Điện Thoại</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Chỉ Tiêu KPI</th>
                <th className="py-3 px-4 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{u.fullName}</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400">@{u.username}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.role === 'super_admin' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                        Super Admin
                      </span>
                    )}
                    {u.role === 'staff' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                        Nhân Viên Sale
                      </span>
                    )}
                    {u.role === 'landlord' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        Chủ Trọ
                      </span>
                    )}
                    {u.role === 'tenant' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                        Khách Thuê
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {u.phone}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {u.email || '---'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">
                    {u.kpiTarget ? `${u.kpiTarget.toLocaleString('vi-VN')}đ` : '---'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Hoạt Động
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Thêm Tài Khoản Mới</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Phân quyền vai trò</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  <option value="staff">Nhân Viên Sale / Nguồn</option>
                  <option value="landlord">Chủ Trọ / Landlord</option>
                  <option value="tenant">Khách Thuê</option>
                  <option value="super_admin">Super Admin QTV</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tên đăng nhập (Username)</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mật khẩu ban đầu</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Số điện thoại</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              {role === 'staff' && (
                <div>
                  <label className="block font-semibold mb-1">Chỉ tiêu KPI Doanh Số (VNĐ)</label>
                  <input
                    type="number"
                    value={kpiTarget}
                    onChange={e => setKpiTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">Tạo Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
