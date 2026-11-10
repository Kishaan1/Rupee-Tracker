import React, { useState, useMemo } from 'react';
import { RupeeEntry } from '../types';
import { formatRupee, getTimeRanges } from '../utils/formatters';
import { BarChart3, PieChart, TrendingUp, Wallet, Layers, Award, Tag, Calendar, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyticsViewProps {
  entries: RupeeEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ entries }) => {
  const [trendPeriod, setTrendPeriod] = useState<'7days' | '30days'>('7days');

  // Compute overall analytics
  const totalAmount = useMemo(() => entries.reduce((sum, e) => sum + e.amount, 0), [entries]);
  const totalCount = entries.length;
  const averageAmount = totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;
  const highestAmount = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.max(...entries.map((e) => e.amount));
  }, [entries]);

  // Comparative metrics (Today vs Yesterday, This Week vs Last Week, This Month vs Last Month)
  const comparisons = useMemo(() => {
    const now = new Date();
    const { dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd } = getTimeRanges();

    // Yesterday
    const yestStart = dayStart - 86400000;
    const yestEnd = dayEnd - 86400000;

    // Last Week
    const lastWeekStart = weekStart - 7 * 86400000;
    const lastWeekEnd = weekEnd - 7 * 86400000;

    // Last Month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime();

    let today = 0, yest = 0;
    let thisWeek = 0, lastWeek = 0;
    let thisMonth = 0, lastMonth = 0;

    for (const e of entries) {
      const t = e.timestamp;
      if (t >= dayStart && t <= dayEnd) today += e.amount;
      if (t >= yestStart && t <= yestEnd) yest += e.amount;

      if (t >= weekStart && t <= weekEnd) thisWeek += e.amount;
      if (t >= lastWeekStart && t <= lastWeekEnd) lastWeek += e.amount;

      if (t >= monthStart && t <= monthEnd) thisMonth += e.amount;
      if (t >= lastMonthStart && t <= lastMonthEnd) lastMonth += e.amount;
    }

    return {
      today,
      yest,
      thisWeek,
      lastWeek,
      thisMonth,
      lastMonth,
    };
  }, [entries]);

  // Daily entry trends (Last 7 or 30 days)
  const dailyTrends = useMemo(() => {
    const daysCount = trendPeriod === '7days' ? 7 : 30;
    const result: { dateStr: string; displayLabel: string; total: number; count: number }[] = [];
    const now = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

      let dayTotal = 0;
      let dayCount = 0;

      for (const e of entries) {
        if (e.timestamp >= startOfDay && e.timestamp <= endOfDay) {
          dayTotal += e.amount;
          dayCount += 1;
        }
      }

      const displayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'narrow', day: 'numeric' });
      const dateStr = d.toISOString().split('T')[0];

      result.push({
        dateStr,
        displayLabel,
        total: dayTotal,
        count: dayCount,
      });
    }

    return result;
  }, [entries, trendPeriod]);

  // Max daily amount for bar scaling
  const maxDaily = useMemo(() => {
    const max = Math.max(...dailyTrends.map((d) => d.total));
    return max > 0 ? max : 1;
  }, [dailyTrends]);

  // Category / Reason breakdown
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();

    for (const e of entries) {
      const cat = e.reason && e.reason.trim() ? e.reason.trim() : 'Unspecified';
      const curr = map.get(cat) || { total: 0, count: 0 };
      map.set(cat, {
        total: curr.total + e.amount,
        count: curr.count + 1,
      });
    }

    const items = Array.from(map.entries()).map(([name, data]) => ({
      name,
      total: data.total,
      count: data.count,
      percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
    }));

    // Sort descending by total amount
    items.sort((a, b) => b.total - a.total);
    return items;
  }, [entries, totalAmount]);

  return (
    <div className="w-full space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Top Banner / Heading */}
      <div className="border-b border-zinc-200/80 dark:border-white/[0.08] pb-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          Financial Analytics & Trends
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Calculated from all {totalCount} locally saved transactions
        </p>
      </div>

      {/* 4 Summary Micro-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.06] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Total Logged</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50 truncate">
            {formatRupee(totalAmount)}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.06] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Entries Count</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
            {totalCount}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.06] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Avg Entry</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            {formatRupee(averageAmount)}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.06] shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Highest Entry</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-500 dark:text-amber-400 truncate">
            {formatRupee(highestAmount)}
          </div>
        </div>
      </div>

      {/* Period Comparisons (Weekly & Monthly comparison) */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
          Period Comparisons
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Today vs Yesterday */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04] space-y-1">
            <span className="text-[11px] font-mono text-zinc-400">Daily: Today vs Yesterday</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {formatRupee(comparisons.today)}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                vs {formatRupee(comparisons.yest)}
              </span>
            </div>
          </div>

          {/* This Week vs Last Week */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04] space-y-1">
            <span className="text-[11px] font-mono text-zinc-400">Weekly: This Week vs Prior</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {formatRupee(comparisons.thisWeek)}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                vs {formatRupee(comparisons.lastWeek)}
              </span>
            </div>
          </div>

          {/* This Month vs Last Month */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04] space-y-1">
            <span className="text-[11px] font-mono text-zinc-400">Monthly: Current vs Prior</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {formatRupee(comparisons.thisMonth)}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                vs {formatRupee(comparisons.lastMonth)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
              Daily Entry Trends
            </h3>
            <p className="text-[11px] text-zinc-400">
              Amount recorded per day
            </p>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-zinc-100 dark:bg-white/[0.04] rounded-xl border border-zinc-200/60 dark:border-white/[0.04]">
            <button
              onClick={() => setTrendPeriod('7days')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer ${
                trendPeriod === '7days'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTrendPeriod('30days')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer ${
                trendPeriod === '30days'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Clean Bar Chart */}
        <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-6 px-1 border-b border-zinc-100 dark:border-white/[0.04]">
          {dailyTrends.map((d, i) => {
            const heightPercent = maxDaily > 0 ? Math.max(6, Math.round((d.total / maxDaily) * 100)) : 6;
            const hasValue = d.total > 0;

            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group/bar relative">
                {/* Tooltip on Hover */}
                {hasValue && (
                  <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-mono px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none shadow-md z-10">
                    {formatRupee(d.total)} ({d.count})
                  </div>
                )}

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-colors ${
                    hasValue
                      ? 'bg-emerald-500 hover:bg-emerald-400'
                      : 'bg-zinc-100 dark:bg-white/[0.04]'
                  }`}
                />

                <span className="text-[10px] font-mono text-zinc-400 mt-2 truncate max-w-full">
                  {d.displayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category / Reason Breakdown */}
      <div className="rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                Category & Reason Breakdown
              </h3>
              <p className="text-[11px] text-zinc-400">
                Distribution across recorded reasons
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {categoryBreakdown.length} {categoryBreakdown.length === 1 ? 'category' : 'categories'}
          </span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No transaction records available yet.
          </div>
        ) : (
          <div className="space-y-3.5">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-emerald-500" />
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">({cat.count})</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatRupee(cat.total)}
                    </span>
                    <span className="text-zinc-400 text-[11px] w-12 text-right">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(2, cat.percentage)}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
