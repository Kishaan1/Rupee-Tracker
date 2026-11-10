/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { RupeeEntry, NavigationTab } from './types';
import {
  loadEntries,
  saveEntries,
  loadTheme,
  saveTheme,
  loadSoundPreference,
  saveSoundPreference,
} from './utils/storage';
import { computePeriodTotals, filterEntries, formatRupee, getTimeRanges } from './utils/formatters';
import { playSuccessChime, playDeleteClick } from './utils/audio';
import { Header } from './components/Header';
import { HeroInput } from './components/HeroInput';
import { StatsOverview } from './components/StatsOverview';
import { SearchBar } from './components/SearchBar';
import { Timeline } from './components/Timeline';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DataBackupModal } from './components/DataBackupModal';
import { RotateCcw, X, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WELCOME_SEEN_KEY = 'rupee_tracker_welcome_seen_v2';

export default function App() {
  const [entries, setEntries] = useState<RupeeEntry[]>([]);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>(loadTheme);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(loadSoundPreference);
  const [backupOpen, setBackupOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem(WELCOME_SEEN_KEY);
    } catch {
      return false;
    }
  });

  const [deletedUndoItem, setDeletedUndoItem] = useState<{
    entry: RupeeEntry;
    timeoutId: ReturnType<typeof setTimeout>;
  } | null>(null);

  // Focus trigger counter
  const [focusTrigger, setFocusTrigger] = useState(0);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Load entries on initial mount
  useEffect(() => {
    const loaded = loadEntries();
    setEntries(loaded);
  }, []);

  // Save entries whenever they change
  const updateEntriesAndPersist = (newEntries: RupeeEntry[]) => {
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  // Welcome screen completion handler
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    try {
      sessionStorage.setItem(WELCOME_SEEN_KEY, 'true');
    } catch {
      // Ignore
    }
    // Re-focus input after transition
    setFocusTrigger((prev) => prev + 1);
  };

  // Add a new rupee entry instantly with optional reason
  const handleAddAmount = (amount: number, reason?: string) => {
    const newEntry: RupeeEntry = {
      id: crypto.randomUUID(),
      amount,
      reason: reason?.trim() || undefined,
      timestamp: Date.now(),
    };

    // Prepend newest entry to the top
    const updated = [newEntry, ...entries];
    updateEntriesAndPersist(updated);

    if (soundEnabled) {
      playSuccessChime();
    }
  };

  // Update existing entry amount & reason (inline edit)
  const handleUpdateEntry = (id: string, newAmount: number, newReason?: string) => {
    const updated = entries.map((entry) => {
      if (entry.id === id) {
        return {
          ...entry,
          amount: newAmount,
          reason: newReason !== undefined ? (newReason.trim() || undefined) : entry.reason,
          updatedAt: Date.now(),
        };
      }
      return entry;
    });
    updateEntriesAndPersist(updated);

    if (soundEnabled) {
      playSuccessChime();
    }
  };

  // Delete an entry with non-disruptive Undo toast
  const handleDeleteEntry = (id: string) => {
    const toDelete = entries.find((e) => e.id === id);
    if (!toDelete) return;

    if (deletedUndoItem) {
      clearTimeout(deletedUndoItem.timeoutId);
    }

    const updated = entries.filter((e) => e.id !== id);
    updateEntriesAndPersist(updated);

    if (soundEnabled) {
      playDeleteClick();
    }

    // Set 5-second undo timer
    const timeoutId = setTimeout(() => {
      setDeletedUndoItem(null);
    }, 5000);

    setDeletedUndoItem({
      entry: toDelete,
      timeoutId,
    });
  };

  // Restore deleted entry
  const handleUndoDelete = () => {
    if (!deletedUndoItem) return;
    clearTimeout(deletedUndoItem.timeoutId);

    // Re-insert and sort by timestamp
    const restored = [...entries, deletedUndoItem.entry].sort(
      (a, b) => b.timestamp - a.timestamp
    );
    updateEntriesAndPersist(restored);
    setDeletedUndoItem(null);

    if (soundEnabled) {
      playSuccessChime();
    }
  };

  // Clear all entries
  const handleClearAll = () => {
    updateEntriesAndPersist([]);
  };

  // Import entries from backup
  const handleImportEntries = (imported: RupeeEntry[]) => {
    updateEntriesAndPersist(imported);
    if (soundEnabled) {
      playSuccessChime();
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      saveSoundPreference(next);
      return next;
    });
  };

  // Financial statistics
  const periodTotals = useMemo(() => computePeriodTotals(entries), [entries]);

  const { highestAmount, averageAmount } = useMemo(() => {
    if (entries.length === 0) return { highestAmount: 0, averageAmount: 0 };
    let max = 0;
    let sum = 0;
    for (const e of entries) {
      if (e.amount > max) max = e.amount;
      sum += e.amount;
    }
    return {
      highestAmount: max,
      averageAmount: Math.round(sum / entries.length),
    };
  }, [entries]);

  // Combined search and period filtering for History tab
  const filteredEntries = useMemo(() => {
    let result = entries;

    // Apply period filter if selected
    if (filterPeriod !== 'all') {
      const { dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd } = getTimeRanges();
      result = result.filter((e) => {
        const t = e.timestamp;
        if (filterPeriod === 'today') return t >= dayStart && t <= dayEnd;
        if (filterPeriod === 'week') return t >= weekStart && t <= weekEnd;
        if (filterPeriod === 'month') return t >= monthStart && t <= monthEnd;
        return true;
      });
    }

    // Apply text search
    if (searchQuery.trim()) {
      result = filterEntries(result, searchQuery);
    }

    return result;
  }, [entries, searchQuery, filterPeriod]);

  const totalFilteredAmount = useMemo(
    () => filteredEntries.reduce((sum, e) => sum + e.amount, 0),
    [filteredEntries]
  );

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-emerald-500 selection:text-white pb-16">
      {/* Animated Welcome Screen on First Launch or Replay */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        )}
      </AnimatePresence>

      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenBackup={() => setBackupOpen(true)}
        onOpenSettings={() => setActiveTab('settings')}
        onReplayWelcome={() => setShowWelcome(true)}
        entriesCount={entries.length}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {/* TAB 1: HOME (Fast Amount Entry + Financial Overview + Recent Preview) */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. Fast Amount Entry (Visual Center of Screen) */}
            <section aria-label="Amount input">
              <HeroInput
                key={focusTrigger}
                onAddAmount={handleAddAmount}
              />
            </section>

            {/* 2. Compact 4-Period Summaries (Today, This Week, This Month, All Time) */}
            <section aria-label="Financial statistics">
              <StatsOverview
                todayTotal={periodTotals.todayTotal}
                todayCount={periodTotals.todayCount}
                weekTotal={periodTotals.weekTotal}
                weekCount={periodTotals.weekCount}
                monthTotal={periodTotals.monthTotal}
                monthCount={periodTotals.monthCount}
                overallTotal={periodTotals.overallTotal}
                overallCount={periodTotals.overallCount}
                highestAmount={highestAmount}
                averageAmount={averageAmount}
              />
            </section>

            {/* 3. Recent Transactions Preview (Top 4) */}
            <section aria-label="Recent transactions preview" className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  Recent Transactions
                </span>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({entries.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {entries.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/60 dark:border-white/[0.06] text-xs text-zinc-400">
                  No records yet. Type an amount above and press Enter to start.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {entries.slice(0, 4).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#111318] border border-zinc-200/60 dark:border-white/[0.06]"
                    >
                      <div>
                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 font-mono">
                          {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                        {entry.reason && (
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {entry.reason}
                          </div>
                        )}
                      </div>
                      <div className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatRupee(entry.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: HISTORY (Full Timeline, Search, Date & Month Filter, Inline Edit & Delete) */}
        {activeTab === 'history' && (
          <div className="space-y-6 pb-6 animate-in fade-in duration-200">
            {/* Search and Period Filter */}
            <section aria-label="Search and filter entries">
              <SearchBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                matchesCount={filteredEntries.length}
                totalFilteredAmount={totalFilteredAmount}
                isFiltering={Boolean(searchQuery.trim() || filterPeriod !== 'all')}
                activeFilterPeriod={filterPeriod}
                onSelectFilterPeriod={setFilterPeriod}
              />
            </section>

            {/* Chronological Transaction Timeline */}
            <section aria-label="Transaction history">
              <Timeline
                entries={filteredEntries}
                onUpdateEntry={handleUpdateEntry}
                onDeleteEntry={handleDeleteEntry}
                onFocusInput={() => {
                  setActiveTab('home');
                  setFocusTrigger((prev) => prev + 1);
                }}
              />
            </section>
          </div>
        )}

        {/* TAB 3: ANALYTICS (Daily Trends SVG Chart, Reason Breakdown, Totals, Averages) */}
        {activeTab === 'analytics' && (
          <AnalyticsView entries={entries} />
        )}

        {/* TAB 4: CALENDAR (Calendar Grid, Day Subtotals, Highlighted Transaction Dates) */}
        {activeTab === 'calendar' && (
          <CalendarView entries={entries} />
        )}

        {/* TAB 5: SETTINGS (Theme Switcher, Currency, Backup/Restore, Data Reset, App Info) */}
        {activeTab === 'settings' && (
          <SettingsView
            theme={theme}
            onToggleTheme={handleToggleTheme}
            entries={entries}
            onImport={handleImportEntries}
            onClearAll={handleClearAll}
            onReplayWelcome={() => setShowWelcome(true)}
          />
        )}
      </main>

      {/* Modern Minimal Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Non-Disruptive Undo Toast */}
      <AnimatePresence>
        {deletedUndoItem && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-2xl border border-zinc-700/50 dark:border-white/20 text-xs font-medium"
          >
            <span>
              Deleted {formatRupee(deletedUndoItem.entry.amount)}
              {deletedUndoItem.entry.reason ? ` · ${deletedUndoItem.entry.reason}` : ''}
            </span>
            <button
              onClick={handleUndoDelete}
              className="flex items-center gap-1 font-semibold text-emerald-400 dark:text-emerald-700 hover:underline px-1.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Undo
            </button>
            <button
              onClick={() => {
                clearTimeout(deletedUndoItem.timeoutId);
                setDeletedUndoItem(null);
              }}
              className="text-zinc-400 hover:text-white dark:hover:text-zinc-900 ml-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backup & Export Modal (Quick access) */}
      <DataBackupModal
        isOpen={backupOpen}
        onClose={() => setBackupOpen(false)}
        entries={entries}
        onImport={handleImportEntries}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
