import React from 'react';
import { RupeeEntry, DayGroup } from '../types';
import { groupEntriesByDay, formatRupee } from '../utils/formatters';
import { EntryItem } from './EntryItem';
import { Clock, PlusCircle } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

interface TimelineProps {
  entries: RupeeEntry[];
  onUpdateEntry: (id: string, newAmount: number, newReason?: string) => void;
  onDeleteEntry: (id: string) => void;
  onFocusInput: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  entries,
  onUpdateEntry,
  onDeleteEntry,
  onFocusInput,
}) => {
  const dayGroups: DayGroup[] = groupEntriesByDay(entries);

  if (entries.length === 0) {
    return (
      <div className="w-full py-14 px-4 text-center rounded-3xl bg-white/40 dark:bg-[#111318]/40 border border-dashed border-zinc-200 dark:border-white/[0.08] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-400 dark:text-zinc-500 flex items-center justify-center mb-3">
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          No records found
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1 mb-4">
          Type an amount in the box above (e.g., 50, 250, 1500) and press Enter to save instantly.
        </p>
        <button
          onClick={onFocusInput}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.08] dark:text-zinc-100 dark:hover:bg-white/[0.14] rounded-xl transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
          Start typing
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.08] pb-2 px-1">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <h2 className="text-[11px] font-mono font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            TRANSACTION TIMELINE
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          Newest first
        </span>
      </div>

      {/* Day Groups */}
      <div className="space-y-6">
        {dayGroups.map((group) => (
          <div key={group.dateKey} className="space-y-2">
            {/* Day Header with subtotal */}
            <div className="flex items-center justify-between px-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {group.displayDate}
              </span>
              <span className="font-mono text-[11px] tabular-nums">
                Day subtotal: <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{formatRupee(group.total)}</strong>
              </span>
            </div>

            {/* List of items */}
            <div className="space-y-1.5">
              <AnimatePresence initial={false}>
                {group.entries.map((entry) => (
                  <EntryItem
                    key={entry.id}
                    entry={entry}
                    onUpdate={onUpdateEntry}
                    onDelete={onDeleteEntry}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
