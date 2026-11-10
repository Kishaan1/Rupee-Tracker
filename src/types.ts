/**
 * Core data models for Rupee Entry Tracker
 */

export interface RupeeEntry {
  id: string;
  amount: number;
  reason?: string; // Optional reason/category e.g. "Food", "College", "Travel"
  timestamp: number; // Unix epoch ms
  updatedAt?: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type NavigationTab = 'home' | 'history' | 'analytics' | 'calendar' | 'settings';

export interface DayGroup {
  dateKey: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Today, 7 Nov"
  total: number;
  entries: RupeeEntry[];
}

