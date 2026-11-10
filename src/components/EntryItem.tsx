import React, { useState, useRef, useEffect } from 'react';
import { RupeeEntry } from '../types';
import { formatRupee, formatTime, formatRelativeOrTime } from '../utils/formatters';
import { Edit2, Trash2, Check, X, ArrowDownLeft, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface EntryItemProps {
  entry: RupeeEntry;
  onUpdate: (id: string, newAmount: number, newReason?: string) => void;
  onDelete: (id: string) => void;
}

export const EntryItem: React.FC<EntryItemProps> = ({
  entry,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(entry.amount.toString());
  const [editReason, setEditReason] = useState(entry.reason || '');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const parsed = parseFloat(editAmount.trim());
    if (!isNaN(parsed) && parsed > 0) {
      onUpdate(entry.id, parsed, editReason.trim() || undefined);
      setIsEditing(false);
    } else {
      // Revert if invalid
      setEditAmount(entry.amount.toString());
      setEditReason(entry.reason || '');
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditAmount(entry.amount.toString());
      setEditReason(entry.reason || '');
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex items-center justify-between py-3.5 px-4 sm:px-5 rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/70 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] hover:shadow-xs transition-all"
    >
      {/* Left: Indicator Icon & Timestamp */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <ArrowDownLeft className="w-4 h-4" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono tabular-nums">
              {formatTime(entry.timestamp)}
            </span>
            <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700 text-xs">·</span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {formatRelativeOrTime(entry.timestamp)}
            </span>
          </div>
          {entry.updatedAt && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              Edited
            </span>
          )}
        </div>
      </div>

      {/* Right: Rupee Amount, Reason & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-zinc-400">₹</span>
              <input
                ref={editInputRef}
                type="number"
                step="any"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Amount"
                className="w-20 sm:w-24 px-2 py-1 text-sm sm:text-base font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Reason (optional)"
                className="w-28 sm:w-32 px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                title="Save changes (Enter)"
                className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditAmount(entry.amount.toString());
                  setEditReason(entry.reason || '');
                  setIsEditing(false);
                }}
                title="Cancel (Esc)"
                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              onDoubleClick={() => setIsEditing(true)}
              title="Double click to edit amount or reason"
              className="cursor-pointer select-none flex flex-col items-end"
            >
              <div className="text-lg sm:text-xl font-bold font-mono tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatRupee(entry.amount)}
              </div>
              {entry.reason && (
                <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-[130px] sm:max-w-[220px] flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 opacity-60 shrink-0" />
                  <span className="truncate">{entry.reason}</span>
                </div>
              )}
            </div>

            {/* Action buttons (accessible on mobile, subtle on desktop hover) */}
            <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Edit entry"
                aria-label="Edit amount and reason"
                className="w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.08] flex items-center justify-center transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                title="Delete entry"
                aria-label="Delete entry"
                className="w-7 h-7 rounded-lg text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
