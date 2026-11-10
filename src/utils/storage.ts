import { RupeeEntry } from '../types';

const STORAGE_KEY = 'rupee_tracker_records_v1';
const THEME_STORAGE_KEY = 'rupee_tracker_theme_v1';
const SOUND_STORAGE_KEY = 'rupee_tracker_sound_v1';

// Starter demo entries to showcase the layout on very first load
const INITIAL_DEMO_ENTRIES: RupeeEntry[] = [
  {
    id: 'demo-1',
    amount: 1500,
    timestamp: Date.now() - 1000 * 60 * 18, // 18m ago
  },
  {
    id: 'demo-2',
    amount: 250,
    timestamp: Date.now() - 1000 * 60 * 95, // ~1.5h ago
  },
  {
    id: 'demo-3',
    amount: 100,
    timestamp: Date.now() - 1000 * 60 * 240, // 4h ago
  },
  {
    id: 'demo-4',
    amount: 50,
    timestamp: Date.now() - 1000 * 60 * 60 * 26, // yesterday
  },
];

export function loadEntries(): RupeeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: save initial starter data so app looks great immediately
      saveEntries(INITIAL_DEMO_ENTRIES);
      return INITIAL_DEMO_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        id: String(item.id || crypto.randomUUID()),
        amount: Number(item.amount) || 0,
        reason: item.reason ? String(item.reason).trim() : undefined,
        timestamp: Number(item.timestamp) || Date.now(),
        updatedAt: item.updatedAt ? Number(item.updatedAt) : undefined,
      }));
    }
    return [];
  } catch (err) {
    console.error('Failed to load entries from storage:', err);
    return [];
  }
}

export function saveEntries(entries: RupeeEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save entries to storage:', err);
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

export function loadSoundPreference(): boolean {
  try {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore
  }
}

/**
 * Generate CSV string from entries
 */
export function exportEntriesToCSV(entries: RupeeEntry[]): string {
  const headers = ['ID', 'Date', 'Time', 'Amount (INR)', 'Reason', 'Timestamp'];
  const rows = entries.map((e) => {
    const d = new Date(e.timestamp);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toLocaleTimeString('en-IN', { hour12: false });
    const reasonEscaped = e.reason ? `"${e.reason.replace(/"/g, '""')}"` : '""';
    return [e.id, dateStr, timeStr, e.amount, reasonEscaped, e.timestamp].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
