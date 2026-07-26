import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CustomerLead, HouseViewingSchedule } from '../types';
import { ExportButton } from '../components/common/ExportButton';
import { formatCurrency, formatDate } from '../lib/utils';
import {
  Users,
  Calendar,
  Plus,
  Search,
  Phone,
  Clock,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

export const CustomerManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { customers, viewings, addCustomerLead, addViewingSchedule } = useData();

  const [activeTab, setActiveTab] = useState<'leads' | 'viewings'>('leads');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  // New Customer Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState(5000000);
  const [preferredArea, setPreferredArea] = useState('Bình Thạnh');
  const [notes, setNotes] = useState('');

  // New Viewing Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [propertyName, setPropertyName] = useState('Tòa Minihouse Nguyễn Xí');
  const [roomNumber, setRoomNumber] = useState('P.201');
  const [viewingDate, setViewingDate] = useState(new Date().toISOString().slice(0, 10));
  const [viewingTime, setViewingTime] = useState('14:30');

  const filteredCustomers = customers.filter(
    c =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.preferredArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomerLead({
      fullName,
      phone,
      budget: Number(budget),
      preferredArea,
      status: 'new',
      assignedStaffId: currentUser.id,
      assignedStaffName: currentUser.fullName,
      notes
    });
    setFullName('');
    setPhone('');
    setIsCustomerModalOpen(false);
  };

  const handleCreateViewing = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === selectedCustomerId) || customers[0];
    addViewingSchedule({
      customerId: cust.id,
      customerName: cust.fullName,
      customerPhone: cust.phone,
      propertyId: 'p1',
      propertyName,
      roomNumber,
      viewingDate,
      viewingTime,
      staffId: currentUser.id,
      staffName: currentUser.fullName,
      status: 'scheduled',
      notes: 'Hẹn dẫn khách xem phòng thực tế'
    });
    setIsViewingModalOpen(false);
  };

  const exportCustomerData = filteredCustomers.map(c => ({
    'Mã KH': c.id,
    'Họ Và Tên': c.fullName,
    'Số Điện Thoại': c.phone,
    'Tài Chính (VNĐ)': formatCurrency(c.budget),
    'Khu Vực Cần Thuê': c.preferredArea,
    'Nhân Viên Phụ Trách': c.assignedStaffName,
    'Trạng Thái': c.status
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Quản Lý Khách Hàng Nhu Cầu & Lịch Xem Nhà Tránh Trùng</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lưu vết lead khách hàng, kiểm tra nhân viên nào có lịch hẹn dẫn khách xem phòng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ExportButton filename="Danh_Sach_Khach_Hang_CRM" data={exportCustomerData} />
          
          <button
            onClick={() => setIsCustomerModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khách Nhu Cầu Mới</span>
          </button>

          <button
            onClick={() => setIsViewingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Đặt Lịch Hẹn Dẫn Khách</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
            activeTab === 'leads'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Danh Sách Khách Hàng Lead ({customers.length})
        </button>

        <button
          onClick={() => setActiveTab('viewings')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
            activeTab === 'viewings'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Lịch Hẹn Dẫn Xem Nhà Tránh Trùng ({viewings.length})
        </button>
      </div>

      {/* Leads Tab Content */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, SĐT, khu vực..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Khách Hàng</th>
                    <th className="py-3 px-4">SĐT</th>
                    <th className="py-3 px-4">Mức Tài Chính</th>
                    <th className="py-3 px-4">Khu Vực Cần Thuê</th>
                    <th className="py-3 px-4">Sales Phụ Trách</th>
                    <th className="py-3 px-4">Trạng Thái Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredCustomers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {cust.fullName}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-semibold">
                        {cust.phone}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        {formatCurrency(cust.budget, 'đ/tháng')}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {cust.preferredArea}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {cust.assignedStaffName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                          Mới Nhận Lead
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* House Viewing Schedule Tab Content */}
      {activeTab === 'viewings' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Sơ Đồ Lịch Hẹn Dẫn Khách Tránh Trùng Giờ Nhân Viên</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {viewings.map(v => (
              <div key={v.id} className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 text-xs space-y-2">
                <div className="flex justify-between font-bold text-purple-900 dark:text-purple-300">
                  <span>{v.propertyName} ({v.roomNumber})</span>
                  <span className="px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-[10px]">
                    {v.viewingTime}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  Khách: {v.customerName} ({v.customerPhone})
                </p>
                <p className="text-slate-500">
                  Sales dẫn khách: <strong className="text-slate-800 dark:text-slate-200">{v.staffName}</strong>
                </p>
                <p className="text-slate-400 text-[10px]">Ngày hẹn: {formatDate(v.viewingDate)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-xs">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Thêm Khách Nhu Cầu Lead</h3>
              <button onClick={() => setIsCustomerModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Họ tên khách</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
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
              <div>
                <label className="block font-semibold mb-1">Ngân sách thuê (VNĐ)</label>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Khu vực muốn thuê</label>
                <input
                  type="text"
                  required
                  value={preferredArea}
                  onChange={e => setPreferredArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-4 py-2 border rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">Lưu Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Viewing Modal */}
      {isViewingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-xs">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Đặt Lịch Xem Nhà Tránh Trùng</h3>
              <button onClick={() => setIsViewingModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateViewing} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Chọn khách hàng</label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Tên tòa nhà & phòng</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={propertyName}
                    onChange={e => setPropertyName(e.target.value)}
                    className="w-2/3 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                    className="w-1/3 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Ngày hẹn</label>
                  <input
                    type="date"
                    required
                    value={viewingDate}
                    onChange={e => setViewingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Giờ hẹn</label>
                  <input
                    type="time"
                    required
                    value={viewingTime}
                    onChange={e => setViewingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsViewingModalOpen(false)} className="px-4 py-2 border rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold">Lưu Lịch Hẹn</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
