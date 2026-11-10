import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { formatRupee } from '../utils/formatters';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  matchesCount: number;
  totalFilteredAmount: number;
  isFiltering: boolean;
  activeFilterPeriod?: 'all' | 'today' | 'week' | 'month';
  onSelectFilterPeriod?: (period: 'all' | 'today' | 'week' | 'month') => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  matchesCount,
  totalFilteredAmount,
  isFiltering,
  activeFilterPeriod = 'all',
  onSelectFilterPeriod,
}) => {
  const periods = [
    { key: 'all' as const, label: 'All Entries' },
    { key: 'today' as const, label: 'Today' },
    { key: 'week' as const, label: 'This Week' },
    { key: 'month' as const, label: 'This Month' },
  ];

  return (
    <div className="w-full space-y-2.5">
      {/* Search Input Box */}
      <div className="relative w-full flex items-center">
        <div className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by amount (e.g. 1500) or date..."
          className="w-full pl-10 pr-9 py-2.5 text-sm rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.08] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-mono shadow-xs"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Filter Periods & Result Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        {onSelectFilterPeriod && (
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-zinc-400 mr-1 hidden sm:inline-block" />
            {periods.map((p) => {
              const isActive = activeFilterPeriod === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => onSelectFilterPeriod(p.key)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}

        {isFiltering && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
            <span>{matchesCount} {matchesCount === 1 ? 'match' : 'matches'}</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
              Sum: {formatRupee(totalFilteredAmount)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
