import React from 'react';
import { NavigationTab } from '../types';
import { Home, Clock, BarChart3, Calendar, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'history' as NavigationTab, label: 'History', icon: Clock },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: BarChart3 },
    { id: 'calendar' as NavigationTab, label: 'Calendar', icon: Calendar },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-[#090a0f]/85 backdrop-blur-xl border-t border-zinc-200/80 dark:border-white/[0.08] transition-colors safe-area-pb">
      <div className="max-w-md mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer select-none ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-normal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight font-sans leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
