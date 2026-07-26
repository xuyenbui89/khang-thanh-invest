import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ExportButton } from '../components/common/ExportButton';
import { formatCurrency, formatDate } from '../lib/utils';
import { FileText, DollarSign, CheckCircle2, Plus, Users, ShieldAlert } from 'lucide-react';

export const ContractManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { contracts, properties, addContract, adminConfirmCommission, landlordConfirmCommission } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Contract Form
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [roomNumber, setRoomNumber] = useState('P.201');
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [rentPrice, setRentPrice] = useState(4800000);
  const [depositAmount, setDepositAmount] = useState(4800000);
  const [commissionRate, setCommissionRate] = useState(50); // 50% tháng đầu
  const [sourceOwnerName, setSourceOwnerName] = useState('Nam Sale Nguồn');
  const [sourceRatio, setSourceRatio] = useState(40); // 40% nguồn, 60% chốt

  const selectedProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProp) return;

    const commAmount = (Number(rentPrice) * Number(commissionRate)) / 100;

    addContract({
      propertyId: selectedProp.id,
      propertyName: selectedProp.title,
      roomNumber,
      tenantName,
      tenantPhone,
      landlordId: selectedProp.landlordId,
      landlordName: selectedProp.landlordName,
      staffId: currentUser.id,
      staffName: currentUser.fullName,
      sourceOwnerId: 'usr_staff_source',
      sourceOwnerName,
      rentPrice: Number(rentPrice),
      depositAmount: Number(depositAmount),
      commissionRate: Number(commissionRate),
      commissionAmount: commAmount,
      sourceRatio: Number(sourceRatio),
      closingRatio: 100 - Number(sourceRatio),
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      commissionStatus: 'pending'
    });

    setIsModalOpen(false);
  };

  const exportData = contracts.map(c => ({
    'Mã HĐ': c.id,
    'Tòa Nhà': c.propertyName,
    'Phòng': c.roomNumber,
    'Khách Thuê': c.tenantName,
    'SĐT Khách': c.tenantPhone,
    'Giá Thuê': formatCurrency(c.rentPrice),
    'Hoa Hồng Tổng': formatCurrency(c.commissionAmount),
    'NV Chốt': c.staffName,
    'NV Nguồn': c.sourceOwnerName,
    'Trạng Thái HH': c.commissionStatus
  }));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Quản Lý Hợp Đồng & Phân Bổ Hoa Hồng Nguồn / Sale</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ghi nhận giao dịch chốt phòng và tính toán chia % tỷ lệ hoa hồng tự động
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton filename="Danh_Sach_Hop_Dong" data={exportData} />

          {(currentUser.role === 'super_admin' || currentUser.role === 'staff') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Hợp Đồng Chốt Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Contract List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Phòng & BĐS</th>
                <th className="py-3 px-4">Khách Thuê</th>
                <th className="py-3 px-4">Giá Thuê / Tháng</th>
                <th className="py-3 px-4">Tổng Hoa Hồng</th>
                <th className="py-3 px-4">Phân Chia Nguồn / Sale</th>
                <th className="py-3 px-4">Trạng Thái HH</th>
                <th className="py-3 px-4 text-right">Thao Tác Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {contracts.map(c => {
                const sourceCommission = (c.commissionAmount * c.sourceRatio) / 100;
                const closingCommission = (c.commissionAmount * c.closingRatio) / 100;

                return (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {c.propertyName} (<span className="text-blue-600">{c.roomNumber}</span>)
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <span className="font-bold block">{c.tenantName}</span>
                      <span className="text-[10px] text-slate-400">{c.tenantPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(c.rentPrice)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      {formatCurrency(c.commissionAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] space-y-0.5">
                      <p className="text-blue-600 font-semibold">
                        Nguồn ({c.sourceRatio}%): {c.sourceOwnerName} ({formatCurrency(sourceCommission, 'đ')})
                      </p>
                      <p className="text-purple-600 font-semibold">
                        Sale ({c.closingRatio}%): {c.staffName} ({formatCurrency(closingCommission, 'đ')})
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.commissionStatus === 'admin_confirmed' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          Admin Đã XN Nhận Vốn
                        </span>
                      )}
                      {c.commissionStatus === 'landlord_paid' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                          Chủ Trọ Đã CK - Chờ Admin
                        </span>
                      )}
                      {c.commissionStatus === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                          Chưa Thanh Toán
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {currentUser.role === 'landlord' && c.commissionStatus === 'pending' && (
                        <button
                          onClick={() => landlordConfirmCommission(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]"
                        >
                          Xác Nhận Đã Chuyển
                        </button>
                      )}

                      {currentUser.role === 'super_admin' && c.commissionStatus !== 'admin_confirmed' && (
                        <button
                          onClick={() => adminConfirmCommission(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px]"
                        >
                          Duyệt Vốn Công Ty
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Tạo Hợp Đồng Chốt Mới</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateContract} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Chọn Tòa Nhà BĐS</label>
                <select
                  value={selectedPropId}
                  onChange={e => setSelectedPropId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.address})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Số phòng</label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Giá thuê (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={rentPrice}
                    onChange={e => setRentPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Tên khách thuê</label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={e => setTenantName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">SĐT khách thuê</label>
                  <input
                    type="text"
                    required
                    value={tenantPhone}
                    onChange={e => setTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Tỷ lệ HH tổng (%)</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={e => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">% Phân bổ Nguồn</label>
                  <input
                    type="number"
                    value={sourceRatio}
                    onChange={e => setSourceRatio(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">Lưu Hợp Đồng</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
