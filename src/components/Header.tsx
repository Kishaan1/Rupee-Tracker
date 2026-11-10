import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Download, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenBackup: () => void;
  onOpenSettings?: () => void;
  onReplayWelcome?: () => void;
  entriesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onOpenBackup,
  onOpenSettings,
  onReplayWelcome,
  entriesCount,
}) => {
  return (
    <header className="w-full sticky top-0 z-30 border-b border-zinc-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#090a0f]/85 backdrop-blur-xl transition-colors">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onReplayWelcome}
            title="Replay Welcome Intro"
            className="group relative w-9 h-9 rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 dark:from-zinc-900 dark:to-black border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-2xs hover:border-emerald-500/60 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span className="group-hover:scale-110 transition-transform">₹</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#090a0f]" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-sm font-extrabold tracking-[0.16em] uppercase text-zinc-900 dark:text-zinc-50 font-sans">
                RUPEE TRACKER
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                OFFLINE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-normal truncate max-w-[170px] sm:max-w-none">
              Every rupee matters · Track it effortlessly
            </p>
          </div>
        </div>

        {/* Right: Actions (Audio, Backup, Theme, Settings) */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Welcome Screen Replay */}
          {onReplayWelcome && (
            <button
              onClick={onReplayWelcome}
              title="Play Welcome Intro"
              aria-label="Welcome screen"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio' : 'Enable audio feedback'}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 dark:text-zinc-500" />
            )}
          </button>

          {/* Backup / Export */}
          <button
            onClick={onOpenBackup}
            title="Export or backup data"
            aria-label="Export or backup data"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Settings Tab Direct Access */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Settings & Info"
              aria-label="Settings"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
