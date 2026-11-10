import React, { useState } from 'react';
import { formatRupee } from '../utils/formatters';
import { Wallet, Calendar, CalendarDays, CalendarRange, TrendingUp, Award, Layers } from 'lucide-react';

interface StatsOverviewProps {
  todayTotal: number;
  todayCount: number;
  weekTotal: number;
  weekCount: number;
  monthTotal: number;
  monthCount: number;
  overallTotal: number;
  overallCount: number;
  highestAmount?: number;
  averageAmount?: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  todayTotal,
  todayCount,
  weekTotal,
  weekCount,
  monthTotal,
  monthCount,
  overallTotal,
  overallCount,
  highestAmount = 0,
  averageAmount = 0,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const periodData = {
    today: {
      label: "Today's Total",
      sublabel: 'Recorded since 12:00 AM',
      amount: todayTotal,
      count: todayCount,
      icon: Calendar,
    },
    week: {
      label: "This Week's Total",
      sublabel: 'Current week (Mon - Sun)',
      amount: weekTotal,
      count: weekCount,
      icon: CalendarDays,
    },
    month: {
      label: "This Month's Total",
      sublabel: 'Current calendar month',
      amount: monthTotal,
      count: monthCount,
      icon: CalendarRange,
    },
    all: {
      label: 'All Time Total',
      sublabel: 'Cumulative recorded balance',
      amount: overallTotal,
      count: overallCount,
      icon: Wallet,
    },
  };

  const active = periodData[selectedPeriod];
  const ActiveIcon = active.icon;

  return (
    <div className="w-full space-y-3">
      {/* 1. Premium Balance Card: Inspired by high-end fintech black card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border border-zinc-800/80 dark:border-white/[0.08] p-5 sm:p-6 shadow-sm">
        {/* Subtle decorative emerald glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 font-semibold">
                TOTAL RECORDED BALANCE
              </span>
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-mono tabular-nums text-white flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-light text-emerald-400">₹</span>
              <span>{formatRupee(overallTotal, { showSymbol: false })}</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Stored locally on device · 100% offline & persistent
            </p>
          </div>

          {/* Quick Micro Financial Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-zinc-800/80 sm:pl-5">
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-mono flex items-center gap-1">
                <Layers className="w-3 h-3 text-zinc-400" />
                Entries
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-zinc-100">
                {overallCount}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Average
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 truncate">
                {formatRupee(averageAmount)}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-mono flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-400" />
                Highest
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-amber-300 truncate">
                {formatRupee(highestAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Elegant Summary Cards (Today, This Week, This Month, All Time) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['today', 'week', 'month', 'all'] as const).map((key) => {
          const item = periodData[key];
          const isSelected = selectedPeriod === key;
          const Icon = item.icon;

          return (
            <button
              key={key}
              onClick={() => setSelectedPeriod(key)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-[#161920] border-emerald-500/60 shadow-xs ring-1 ring-emerald-500/20'
                  : 'bg-white/80 dark:bg-[#111318]/70 border-zinc-200/80 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] hover:bg-white dark:hover:bg-[#111318]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                <span className="font-medium truncate">{item.label.replace("'s Total", '').replace(' Total', '')}</span>
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-500' : 'text-zinc-400'}`} />
              </div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-50 truncate">
                {formatRupee(item.amount)}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                {item.count} {item.count === 1 ? 'entry' : 'entries'}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Daily Total Information Bar (Inspired by Section 7) */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200/70 dark:border-white/[0.05] text-xs">
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium truncate mr-2">
          <ActiveIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{active.label}:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{formatRupee(active.amount)}</span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-mono">{active.count} {active.count === 1 ? 'Entry' : 'Entries'}</span>
        </div>
        <div className="text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm tabular-nums shrink-0">
          {formatRupee(active.amount)}
        </div>
      </div>
    </div>
  );
};
