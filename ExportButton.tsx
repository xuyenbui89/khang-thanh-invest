import React from 'react';
import { Download, Printer } from 'lucide-react';
import { exportToCSV, printElement } from '../../lib/utils';

interface ExportButtonProps {
  filename: string;
  data: Record<string, any>[];
  printElementId?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ filename, data, printElementId }) => {
  const handleExportCSV = () => {
    exportToCSV(filename, data);
  };

  const handlePrint = () => {
    if (printElementId) {
      printElement(printElementId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition shadow-sm"
        title="Xuất file CSV/Excel UTF-8"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Xuất Excel / CSV</span>
      </button>

      {printElementId && (
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition shadow-sm"
          title="In hoặc Xuất PDF"
        >
          <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>In / Xuất PDF</span>
        </button>
      )}
    </div>
  );
};
