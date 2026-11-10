import React, { useState, useMemo } from 'react';
import { RupeeEntry } from '../types';
import { formatRupee, formatTime } from '../utils/formatters';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Tag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  entries: RupeeEntry[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ entries }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  // Map of dateKey -> entries and total
  const dateMap = useMemo(() => {
    const map = new Map<string, { total: number; entries: RupeeEntry[] }>();

    for (const e of entries) {
      const d = new Date(e.timestamp);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;

      if (!map.has(key)) {
        map.set(key, { total: 0, entries: [] });
      }
      const item = map.get(key)!;
      item.total += e.amount;
      item.entries.push(e);
    }

    return map;
  }, [entries]);

  // Calendar generation for currentMonthDate
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthLabel = currentMonthDate.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Calendar grid math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Selected date data
  const selectedData = dateMap.get(selectedDateKey);
  const selectedDateFormatted = useMemo(() => {
    const [y, m, d] = selectedDateKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDateKey]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-200/80 dark:border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-500" />
            Calendar & Date History
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Browse transactions by calendar date
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/[0.04] p-1 rounded-2xl border border-zinc-200/60 dark:border-white/[0.06]">
          <button
            onClick={handlePrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 px-2 min-w-[110px] text-center">
            {monthLabel}
          </span>
          <button
            onClick={handleNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 sm:p-6 shadow-xs space-y-4">
        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono font-semibold text-zinc-400">
          {daysOfWeek.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* Empty prefix cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-12" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const mStr = String(month + 1).padStart(2, '0');
            const dStr = String(dayNum).padStart(2, '0');
            const dateKey = `${year}-${mStr}-${dStr}`;
            const isSelected = selectedDateKey === dateKey;
            const data = dateMap.get(dateKey);
            const hasData = Boolean(data && data.total > 0);

            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDateKey(dateKey)}
                className={`relative h-11 sm:h-13 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer p-1 ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-emerald-500 dark:text-zinc-950 font-bold shadow-sm'
                    : hasData
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-zinc-900 dark:text-zinc-100 font-semibold border border-emerald-500/30'
                    : 'hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 font-normal'
                }`}
              >
                <span className="text-xs sm:text-sm font-mono leading-none">{dayNum}</span>

                {data && data.total > 0 && (
                  <span
                    className={`text-[9px] font-mono leading-none mt-1 truncate max-w-full ${
                      isSelected
                        ? 'text-emerald-300 dark:text-zinc-900 font-bold'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    ₹{data.total >= 1000 ? `${(data.total / 1000).toFixed(0)}k` : data.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details & Transactions */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/[0.06]">
          <div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Selected Date
            </span>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {selectedDateFormatted}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Day Total
            </span>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatRupee(selectedData?.total || 0)}
            </div>
          </div>
        </div>

        {/* Transactions list on this selected date */}
        {!selectedData || selectedData.entries.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400">
            No transactions recorded on this date.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedData.entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xs font-bold">
                    ₹
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 font-mono">
                        {formatTime(entry.timestamp)}
                      </span>
                      {entry.reason && (
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-medium">
                          <Tag className="w-2.5 h-2.5 text-emerald-500" />
                          {entry.reason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-sm font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50">
                  {formatRupee(entry.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
