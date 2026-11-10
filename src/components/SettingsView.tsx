import React, { useRef } from 'react';
import { RupeeEntry } from '../types';
import { exportEntriesToCSV, downloadFile } from '../utils/storage';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  ShieldCheck,
  FileText,
  Download,
  Upload,
  Trash2,
  Info,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  entries: RupeeEntry[];
  onImport: (imported: RupeeEntry[]) => void;
  onClearAll: () => void;
  onReplayWelcome?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  entries,
  onImport,
  onClearAll,
  onReplayWelcome,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            if (window.confirm(`Restore ${validated.length} transactions from backup file?`)) {
              onImport(validated);
            }
          }
        }
      } catch (err) {
        alert('Invalid JSON backup file format');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-white/[0.08] pb-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-emerald-500" />
          Settings & Data Management
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          App preferences, offline storage and backups
        </p>
      </div>

      {/* 1. Theme Configuration */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
              Appearance & Theme
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Switch between Dark and Light mode
            </p>
          </div>

          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 pt-1 border-t border-zinc-100 dark:border-white/[0.04]">
          Active: <strong className="text-zinc-700 dark:text-zinc-300 capitalize">{theme} Theme</strong> · Saved automatically
        </div>
      </div>

      {/* 2. Currency & Fast Entry Info */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
              Currency & Regional Format
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Configured for Indian Rupee standard
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold">
            ₹ INR
          </span>
        </div>
      </div>

      {/* 3. Backup and Restore */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
            Backup & Export
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Export all {entries.length} records safely to your device
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 p-3 text-xs font-mono font-medium rounded-2xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            Download CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 p-3 text-xs font-mono font-medium rounded-2xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            JSON Backup
          </button>
        </div>

        <div className="pt-2 border-t border-zinc-100 dark:border-white/[0.04]">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-3 text-xs font-mono font-medium rounded-2xl border border-dashed border-zinc-300 dark:border-white/[0.1] hover:bg-zinc-50 dark:hover:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-zinc-400" />
            Restore from JSON Backup File
          </button>
        </div>
      </div>

      {/* 4. Privacy & Security */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-sm font-semibold font-sans">
            100% Offline & Private
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Rupee Tracker stores all data exclusively on this device using local SQLite / browser storage. No accounts, telemetry, or external servers are contacted.
        </p>
      </div>

      {/* 5. Welcome Screen Replay & Info */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
              About Rupee Tracker
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Version 2.5.0 · Fintech Edition
            </p>
          </div>
          {onReplayWelcome && (
            <button
              onClick={onReplayWelcome}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Play Welcome Intro
            </button>
          )}
        </div>
      </div>

      {/* 6. Danger Zone */}
      <div className="rounded-3xl bg-rose-500/5 border border-rose-500/20 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400 font-sans">
              Clear All Data
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Permanently erase all transaction records
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete ALL recorded transactions? Make sure you have exported a backup.')) {
                onClearAll();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};
