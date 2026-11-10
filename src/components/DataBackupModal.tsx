import React, { useRef } from 'react';
import { RupeeEntry } from '../types';
import { exportEntriesToCSV, downloadFile } from '../utils/storage';
import { X, Download, Upload, FileText, Trash2, ShieldCheck } from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: RupeeEntry[];
  onImport: (imported: RupeeEntry[]) => void;
  onClearAll: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  entries,
  onImport,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const csv = exportEntriesToCSV(entries);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(csv, `rupee-tracker-${dateStr}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(entries, null, 2);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(json, `rupee-tracker-${dateStr}.json`, 'application/json');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          const validated: RupeeEntry[] = parsed
            .filter((item) => typeof item.amount === 'number' && item.amount > 0)
            .map((item) => ({
              id: item.id || crypto.randomUUID(),
              amount: Number(item.amount),
              reason: item.reason ? String(item.reason).trim() : undefined,
              timestamp: Number(item.timestamp) || Date.now(),
              updatedAt: item.updatedAt ? Number(item.updatedAt) : undefined,
            }));
          if (validated.length > 0) {
            onImport(validated);
            onClose();
          }
        }
      } catch (err) {
        console.error('Invalid backup format', err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-[#111318] rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-base">
              ₹
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 font-sans">
                Data & Storage
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                {entries.length} local {entries.length === 1 ? 'record' : 'records'} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04] text-xs text-zinc-600 dark:text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>All transactions remain 100% on this device. No servers, trackers or cloud dependencies.</span>
        </div>

        {/* Export Data */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Export Records
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 p-3 text-xs font-mono font-medium rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              Spreadsheet (CSV)
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-2 p-3 text-xs font-mono font-medium rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              JSON Backup
            </button>
          </div>
        </div>

        {/* Restore Data */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Restore Backup
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 text-xs font-mono font-medium rounded-xl border border-dashed border-zinc-300 dark:border-white/[0.12] hover:bg-zinc-50 dark:hover:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-zinc-400" />
            Upload JSON Backup
          </button>
        </div>

        {/* Reset */}
        <div className="pt-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Clear all saved data
          </span>
          <button
            onClick={() => {
              if (window.confirm('Reset all records? This cannot be undone unless you have a backup.')) {
                onClearAll();
                onClose();
              }
            }}
            className="px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset all
          </button>
        </div>
      </div>
    </div>
  );
};
