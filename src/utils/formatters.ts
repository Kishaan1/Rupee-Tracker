import { RupeeEntry, DayGroup } from '../types';

/**
 * Format number into Indian Rupee format.
 * E.g. 50000 -> "₹50,000", 1250000 -> "₹12,50,000"
 */
export function formatRupee(
  amount: number,
  options: { showSymbol?: boolean; decimals?: boolean } = {}
): string {
  const { showSymbol = true, decimals = false } = options;

  const hasFractions = amount % 1 !== 0;
  const fractionDigits = decimals || hasFractions ? 2 : 0;

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format timestamp into exact readable time (e.g. "09:42 AM")
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Human friendly relative time or exact time
 */
export function formatRelativeOrTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 30) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 6) return `${diffHour}h ago`;

  return formatTime(timestamp);
}

/**
 * Get YYYY-MM-DD key for a timestamp in local timezone
 */
export function getDateKey(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Group entries by day in chronological reverse order (newest day first, newest entry first)
 */
export function groupEntriesByDay(entries: RupeeEntry[]): DayGroup[] {
  const todayKey = getDateKey(Date.now());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDateKey(yesterday.getTime());

  // Sort entries newest first
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  const groupsMap = new Map<string, RupeeEntry[]>();

  for (const entry of sorted) {
    const key = getDateKey(entry.timestamp);
    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(entry);
  }

  const result: DayGroup[] = [];

  for (const [dateKey, dayEntries] of groupsMap.entries()) {
    const entryDate = new Date(dayEntries[0].timestamp);
    let displayDate: string;

    if (dateKey === todayKey) {
      displayDate = 'Today';
    } else if (dateKey === yesterdayKey) {
      displayDate = 'Yesterday';
    } else {
      displayDate = new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: entryDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      }).format(entryDate);
    }

    const total = dayEntries.reduce((sum, item) => sum + item.amount, 0);

    result.push({
      dateKey,
      displayDate,
      total,
      entries: dayEntries,
    });
  }

  return result;
}

/**
 * Get timestamps for Day, Week, and Month boundaries in local timezone
 */
export function getTimeRanges(): {
  dayStart: number;
  dayEnd: number;
  weekStart: number;
  weekEnd: number;
  monthStart: number;
  monthEnd: number;
} {
  const now = new Date();

  // Day Range
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // Week Range (Monday to Sunday)
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday, 0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);

  // Month Range
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    dayStart: startOfDay.getTime(),
    dayEnd: endOfDay.getTime(),
    weekStart: startOfWeek.getTime(),
    weekEnd: endOfWeek.getTime(),
    monthStart: startOfMonth.getTime(),
    monthEnd: endOfMonth.getTime(),
  };
}

/**
 * Compute daily, weekly, monthly, and overall totals
 */
export function computePeriodTotals(entries: RupeeEntry[]): {
  todayTotal: number;
  todayCount: number;
  weekTotal: number;
  weekCount: number;
  monthTotal: number;
  monthCount: number;
  overallTotal: number;
  overallCount: number;
} {
  const { dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd } = getTimeRanges();

  let todayTotal = 0;
  let todayCount = 0;
  let weekTotal = 0;
  let weekCount = 0;
  let monthTotal = 0;
  let monthCount = 0;
  let overallTotal = 0;

  for (const entry of entries) {
    const t = entry.timestamp;
    overallTotal += entry.amount;

    if (t >= dayStart && t <= dayEnd) {
      todayTotal += entry.amount;
      todayCount += 1;
    }

    if (t >= weekStart && t <= weekEnd) {
      weekTotal += entry.amount;
      weekCount += 1;
    }

    if (t >= monthStart && t <= monthEnd) {
      monthTotal += entry.amount;
      monthCount += 1;
    }
  }

  return {
    todayTotal,
    todayCount,
    weekTotal,
    weekCount,
    monthTotal,
    monthCount,
    overallTotal,
    overallCount: entries.length,
  };
}

/**
 * Filter entries by search query (matches amount, date, day name, or month name)
 */
export function filterEntries(entries: RupeeEntry[], query: string): RupeeEntry[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return entries;

  return entries.filter((entry) => {
    // Match amount
    const amtStr = entry.amount.toString();
    if (amtStr.includes(clean)) return true;

    // Match formatted rupee
    const formatted = formatRupee(entry.amount, { showSymbol: false }).toLowerCase();
    if (formatted.includes(clean)) return true;

    // Match reason
    if (entry.reason && entry.reason.toLowerCase().includes(clean)) return true;

    // Match date
    const d = new Date(entry.timestamp);
    const dateFormatted = d.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).toLowerCase();

    const timeFormatted = formatTime(entry.timestamp).toLowerCase();

    return dateFormatted.includes(clean) || timeFormatted.includes(clean);
  });
}
