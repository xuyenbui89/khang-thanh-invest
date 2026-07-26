import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ExportButton } from '../components/common/ExportButton';
import { formatCurrency, formatDate } from '../lib/utils';
import { DollarSign, ArrowUpRight, ArrowDownRight, Printer, FileSpreadsheet, ShieldAlert } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { contracts, users } = useData();

  const [filterMonth, setFilterMonth] = useState('2025-05');
  const [selectedStaffForSlip, setSelectedStaffForSlip] = useState<any | null>(null);

  // Total company income from confirmed landlord commission payments
  const totalRevenue = contracts
    .filter(c => c.commissionStatus === 'admin_confirmed')
    .reduce((acc, c) => acc + c.commissionAmount, 0);

  // Total payroll payouts to staff
  const staffUsers = users.filter(u => u.role === 'staff');

  const exportFinancialLedger = contracts.map(c => ({
    'Mã Giao Dịch': c.id,
    'Bất Động Sản': c.propertyName,
    'Phòng': c.roomNumber,
    'Giá Thuê': formatCurrency(c.rentPrice),
    'Hoa Hồng Thu Về': formatCurrency(c.commissionAmount),
    'Trạng Thái Quỹ Công Ty': c.commissionStatus === 'admin_confirmed' ? 'Đã Vào Quỹ' : 'Chưa Vào Quỹ',
    'Ngày Ghi Nhận': formatDate(c.startDate)
  }));

  if (currentUser.role === 'tenant') {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="font-bold">Bạn không có quyền truy cập sổ sách tài chính doanh nghiệp.</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Sổ Sách Tài Chính, Thu Chi & Phiếu Chi Lương Hoa Hồng</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quản lý dòng tiền hoa hồng công ty, xuất phiếu lương chi trả cho nhân viên Sale / Nguồn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton filename="So_Sach_Tai_Chinh_CRM" data={exportFinancialLedger} printElementId="finance-print-area" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="finance-print-area">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Tổng Thu Hoa Hồng Quỹ Công Ty</span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalRevenue)}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Đã xác nhận tiền về tài khoản công ty</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Số Lượng Nhân Viên Sale Nhận Lương</span>
          <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {staffUsers.length} Nhân Viên
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Tự động tính lương & thưởng KPI</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Tổng Doanh Số Đã Chốt</span>
          <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {formatCurrency(contracts.reduce((a, b) => a + b.rentPrice, 0))}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Toàn bộ hợp đồng hiện hữu</p>
        </div>
      </div>

      {/* Staff Payroll Slips Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">
          Bảng Thanh Toán Lương & Hoa Hồng Nhân Viên
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Nhân Viên</th>
                <th className="py-2.5 px-3">Lương Cứng</th>
                <th className="py-2.5 px-3">Chỉ Tiêu KPI</th>
                <th className="py-2.5 px-3">Hoa Hồng Được Chia</th>
                <th className="py-2.5 px-3">Thưởng KPI</th>
                <th className="py-2.5 px-3">Tổng Thực Nhận</th>
                <th className="py-2.5 px-3 text-right">Phiếu Lương</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {staffUsers.map(st => {
                const myClosed = contracts.filter(c => c.staffId === st.id || c.sourceOwnerId === st.id);
                const commEarned = myClosed.reduce((a, b) => a + b.commissionAmount * 0.5, 0); // ~50%
                const baseSalary = 5000000;
                const totalReceive = baseSalary + commEarned;

                return (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {st.fullName} ({st.username})
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(baseSalary)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {formatCurrency(st.kpiTarget || 50000000)}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">
                      {formatCurrency(commEarned)}
                    </td>
                    <td className="py-3 px-3 text-amber-600 font-bold">
                      +500.000đ
                    </td>
                    <td className="py-3 px-3 font-black text-blue-600 dark:text-blue-400">
                      {formatCurrency(totalReceive + 500000)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedStaffForSlip({ ...st, totalReceive: totalReceive + 500000, commEarned })}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-white font-bold text-[10px] hover:bg-slate-900 transition"
                      >
                        In Phiếu Lương
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip View Modal */}
      {selectedStaffForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative" id="printable-payslip">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">PHIẾU CHI LƯƠNG & HOA HỒNG</h3>
              <button onClick={() => setSelectedStaffForSlip(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <p><strong>CÔNG TY CRM TRỌ - MINIHOUSE</strong></p>
              <p><strong>Nhân viên nhận:</strong> {selectedStaffForSlip.fullName}</p>
              <p><strong>Số điện thoại:</strong> {selectedStaffForSlip.phone}</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <p>• Lương cơ bản: {formatCurrency(5000000)}</p>
                <p>• Hoa hồng doanh số chốt: {formatCurrency(selectedStaffForSlip.commEarned)}</p>
                <p>• Thưởng KPI đạt chỉ tiêu: {formatCurrency(500000)}</p>
                <p className="font-bold text-blue-600 pt-1 border-t">
                  TỔNG THỰC NHẬN: {formatCurrency(selectedStaffForSlip.totalReceive)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setSelectedStaffForSlip(null)} className="px-4 py-2 border rounded-xl">Đóng</button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1">
                <Printer className="w-4 h-4" />
                <span>In Phiếu</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
