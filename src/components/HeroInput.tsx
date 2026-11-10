import React, { useState, useRef, useEffect } from 'react';
import { CornerDownLeft, Check, Keyboard, ArrowUpRight, FileText, Tag, X, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatRupee } from '../utils/formatters';

interface HeroInputProps {
  onAddAmount: (amount: number, reason?: string) => void;
}

const REASON_SUGGESTIONS = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Personal',
];

export const HeroInput: React.FC<HeroInputProps> = ({ onAddAmount }) => {
  const [value, setValue] = useState('');
  const [reason, setReason] = useState<string>('');
  const [isReasonSheetOpen, setIsReasonSheetOpen] = useState(false);
  const [tempReasonText, setTempReasonText] = useState('');
  const [lastSaved, setLastSaved] = useState<{ amount: number; reason?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [physicalKeyboardDetected, setPhysicalKeyboardDetected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reasonInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount and keep focus on window refocus
  useEffect(() => {
    inputRef.current?.focus();

    const handleWindowFocus = () => {
      if (!isReasonSheetOpen) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [isReasonSheetOpen]);

  // Global physical keyboard listener (Auto-routes numeric keys to the Hero Input)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // If the reason sheet is open, do not route keys
      if (isReasonSheetOpen) return;

      const activeEl = document.activeElement;
      const isOtherInput =
        activeEl &&
        activeEl !== inputRef.current &&
        (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      if (isOtherInput) return;

      if (!physicalKeyboardDetected) {
        setPhysicalKeyboardDetected(true);
      }

      // Check if user typed a number or decimal point
      const isDigit = /^[0-9]$/.test(e.key) || (e.code && e.code.startsWith('Numpad') && /^[0-9]$/.test(e.key));
      const isDecimal = e.key === '.' || e.key === 'Decimal';

      if (isDigit || isDecimal) {
        if (activeEl !== inputRef.current) {
          inputRef.current?.focus();
        }
      }

      // If user hit Enter outside an input
      if (e.key === 'Enter' || e.code === 'NumpadEnter') {
        if (activeEl !== inputRef.current && !isOtherInput) {
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [physicalKeyboardDetected, isReasonSheetOpen]);

  // Auto-focus the reason input when bottom sheet opens
  useEffect(() => {
    if (isReasonSheetOpen) {
      setTimeout(() => {
        reasonInputRef.current?.focus();
        reasonInputRef.current?.select();
      }, 100);
    }
  }, [isReasonSheetOpen]);

  const handleContainerClick = () => {
    if (!isReasonSheetOpen) {
      inputRef.current?.focus();
    }
  };

  const handleCommit = (amountToSave?: number) => {
    let target = amountToSave;

    if (target === undefined) {
      const cleanVal = value.trim();
      if (!cleanVal) return;

      // Evaluate simple math expressions like 100+50 or pure numbers
      try {
        if (/^[0-9+\-*/. ]+$/.test(cleanVal)) {
          // eslint-disable-next-line no-new-func
          const evaluated = Function(`"use strict"; return (${cleanVal})`)();
          target = Number(evaluated);
        } else {
          target = parseFloat(cleanVal.replace(/[^0-9.]/g, ''));
        }
      } catch {
        target = parseFloat(cleanVal.replace(/[^0-9.]/g, ''));
      }
    }

    if (target && !isNaN(target) && target > 0) {
      const attachedReason = reason.trim() || undefined;
      onAddAmount(target, attachedReason);
      setLastSaved({ amount: target, reason: attachedReason });
      setValue('');
      setReason('');
      setErrorMsg(null);

      // Flash success briefly
      setTimeout(() => {
        setLastSaved((prev) => (prev?.amount === target ? null : prev));
      }, 2400);

      // Retain keyboard focus immediately without interruption
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
    } else {
      setErrorMsg('Please enter a valid amount');
      setTimeout(() => setErrorMsg(null), 2000);
    }
  };

  // Keyboard navigation & Enter commit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
      handleCommit();
    }
  };

  // Reason Sheet Handlers
  const handleOpenReasonSheet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempReasonText(reason);
    setIsReasonSheetOpen(true);
  };

  const handleSaveReason = () => {
    setReason(tempReasonText.trim());
    setIsReasonSheetOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
  };

  const handleCancelReason = () => {
    setIsReasonSheetOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
  };

  const handleReasonKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSaveReason();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      handleCancelReason();
    }
  };

  // Quick Add Button handler: Adds amount to input field WITHOUT auto-saving
  const handleQuickAdd = (amountToAdd: number) => {
    let current = 0;
    try {
      if (value.trim()) {
        const clean = value.replace(/[^0-9.]/g, '');
        current = parseFloat(clean) || 0;
      }
    } catch {
      current = 0;
    }
    const nextAmount = current > 0 ? current + amountToAdd : amountToAdd;
    setValue(nextAmount.toString());
    inputRef.current?.focus();
  };

  const PRESETS = [50, 100, 250, 500, 1000, 2000];

  return (
    <>
      <div
        onClick={handleContainerClick}
        className="group relative w-full rounded-3xl bg-white dark:bg-[#111318] border border-zinc-200/80 dark:border-white/[0.07] p-6 sm:p-8 shadow-xs hover:shadow-sm transition-all focus-within:border-emerald-500/40 dark:focus-within:border-emerald-500/40 cursor-text"
      >
        <div className="flex flex-col items-center justify-center text-center">
          {/* Micro Header & Status indicator */}
          <div className="h-6 flex items-center justify-center mb-2">
            <AnimatePresence mode="wait">
              {lastSaved !== null ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    Recorded {formatRupee(lastSaved.amount)}
                    {lastSaved.reason ? ` · ${lastSaved.reason}` : ''}
                  </span>
                </motion.div>
              ) : errorMsg ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-rose-500"
                >
                  {errorMsg}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium"
                >
                  <span className="uppercase tracking-widest text-[10px] font-semibold font-mono">
                    FAST AMOUNT ENTRY
                  </span>
                  {physicalKeyboardDetected && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                      <Keyboard className="w-3 h-3" />
                      Keyboard active
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Visual Center: Large, Elegant Typography with Subtle ₹ and Refined Underline */}
          <div className="w-full flex items-center justify-center gap-2 sm:gap-3 py-1">
            <span
              className="text-4xl sm:text-6xl font-light text-zinc-300 dark:text-zinc-600 select-none transition-colors group-focus-within:text-emerald-500/80"
              aria-hidden="true"
            >
              ₹
            </span>

            <div className="relative inline-flex items-center">
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoFocus
                value={value}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9+\-*/. ]*$/.test(val)) {
                    setValue(val);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="0"
                className="w-full max-w-[240px] sm:max-w-xs text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 bg-transparent text-left focus:outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-mono tabular-nums border-b-2 border-transparent focus:border-emerald-500/40 transition-colors pb-0.5"
              />
            </div>

            {/* Quick Commit Action Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCommit();
              }}
              disabled={!value.trim()}
              className="shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-zinc-900 text-white dark:bg-emerald-500 dark:text-zinc-950 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              title="Press Enter to save immediately"
              aria-label="Save amount"
            >
              <CornerDownLeft className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </button>
          </div>

          {/* 2. Premium Add Reason Button (Positioned ~2 cm below amount input) */}
          <div className="mt-6 sm:mt-7 flex items-center justify-center min-h-[34px]">
            {reason ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 font-medium shadow-2xs"
              >
                <Tag className="w-3 h-3" />
                <span>
                  Reason: <strong className="text-zinc-900 dark:text-zinc-100">{reason}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleOpenReasonSheet}
                  className="hover:underline text-[11px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 flex items-center gap-0.5 ml-0.5 cursor-pointer"
                  title="Edit reason"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReason('')}
                  className="w-4 h-4 rounded-full hover:bg-emerald-500/20 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 ml-0.5 cursor-pointer"
                  title="Remove reason"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenReasonSheet}
                className="group/btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 bg-zinc-100/70 hover:bg-zinc-200/70 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-zinc-200/80 dark:border-white/[0.08] transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="Add an optional reason for this amount"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover/btn:text-emerald-500 transition-colors" />
                <span>+ Add Reason</span>
              </button>
            )}
          </div>

          {/* Micro guidance line */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
            <span>Type number</span>
            <span className="text-zinc-300 dark:text-zinc-700">→</span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Press Enter</span>
            <span className="text-zinc-300 dark:text-zinc-700">→</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Instant Save</span>
          </div>

          {/* Quick Presets Chips */}
          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-white/[0.05] w-full flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono font-semibold mr-1">
              Quick add:
            </span>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAdd(preset);
                }}
                className="group/chip inline-flex items-center gap-0.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl bg-zinc-100 hover:bg-zinc-200/90 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-white/[0.04] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
                title={`Add ₹${preset} to input field`}
              >
                <span>+₹{preset}</span>
                <ArrowUpRight className="w-2.5 h-2.5 opacity-40 group-hover/chip:opacity-100 group-hover/chip:text-emerald-500 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Reason Interaction: Premium Bottom Sheet with Amount Visible Behind */}
      <AnimatePresence>
        {isReasonSheetOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={handleCancelReason}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white dark:bg-[#12141a] rounded-t-3xl border-t border-x border-zinc-200 dark:border-white/[0.08] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Grab handle for bottom sheet visual cue */}
              <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto -mt-2 mb-2" />

              {/* Header */}
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 font-sans">
                    Add a reason
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    What was this amount for?
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancelReason}
                  className="w-8 h-8 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Clean Text Input */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    ref={reasonInputRef}
                    type="text"
                    value={tempReasonText}
                    onChange={(e) => setTempReasonText(e.target.value)}
                    onKeyDown={handleReasonKeyDown}
                    placeholder="Enter reason or note..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans"
                  />
                  {tempReasonText && (
                    <button
                      type="button"
                      onClick={() => setTempReasonText('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Optional Suggestion Chips: Food, Travel, Shopping, Bills, Education, Personal */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {REASON_SUGGESTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTempReasonText(cat)}
                      className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                        tempReasonText.toLowerCase() === cat.toLowerCase()
                          ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                          : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-zinc-200/50 dark:border-white/[0.04]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleCancelReason}
                  className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReason}
                  className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white dark:bg-emerald-500 dark:text-zinc-950 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  Save Reason
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
