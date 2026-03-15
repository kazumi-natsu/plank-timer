import { PlankRecord, DailyStats, WeeklyStats } from "@/types";

export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTodayString(): string {
  return getDateString(new Date());
}

export function groupByDate(records: PlankRecord[]): Record<string, PlankRecord[]> {
  return records.reduce((acc, record) => {
    if (!acc[record.date]) acc[record.date] = [];
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, PlankRecord[]>);
}

export function getDailyStats(records: PlankRecord[]): DailyStats[] {
  const grouped = groupByDate(records);
  return Object.entries(grouped).map(([date, recs]) => ({
    date,
    totalSeconds: recs.reduce((sum, r) => sum + r.actualSeconds, 0),
    setsCount: recs.length,
    records: recs,
  })).sort((a, b) => b.date.localeCompare(a.date));
}

export function getWeekString(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNo = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function getWeeklyStats(records: PlankRecord[]): WeeklyStats[] {
  const grouped: Record<string, PlankRecord[]> = {};
  records.forEach((record) => {
    const week = getWeekString(new Date(record.date));
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(record);
  });

  return Object.entries(grouped).map(([week, recs]) => {
    const uniqueDates = new Set(recs.map((r) => r.date));
    return {
      week,
      totalSeconds: recs.reduce((sum, r) => sum + r.actualSeconds, 0),
      daysCount: uniqueDates.size,
    };
  }).sort((a, b) => a.week.localeCompare(b.week));
}

export function getLast8Weeks(records: PlankRecord[]): { label: string; totalSeconds: number }[] {
  const now = new Date();
  const weeks: { label: string; totalSeconds: number }[] = [];

  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const weekStart = new Date(d);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const startStr = getDateString(weekStart);
    const endStr = getDateString(weekEnd);

    const weekRecords = records.filter((r) => r.date >= startStr && r.date <= endStr);
    const totalSeconds = weekRecords.reduce((sum, r) => sum + r.actualSeconds, 0);

    const month = weekStart.getMonth() + 1;
    const day = weekStart.getDate();
    weeks.push({ label: `${month}/${day}`, totalSeconds });
  }

  return weeks;
}

export function getCurrentWeekDailyStats(records: PlankRecord[]): { label: string; date: string; totalSeconds: number }[] {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const days = [];
  const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = getDateString(d);
    const dayRecords = records.filter((r) => r.date === dateStr);
    const totalSeconds = dayRecords.reduce((sum, r) => sum + r.actualSeconds, 0);
    days.push({ label: dayLabels[i], date: dateStr, totalSeconds });
  }

  return days;
}

export function getLongestRecord(records: PlankRecord[]): PlankRecord | null {
  if (records.length === 0) return null;
  return records.reduce((max, r) => (r.actualSeconds > max.actualSeconds ? r : max));
}

export function getCurrentStreak(records: PlankRecord[]): number {
  if (records.length === 0) return 0;

  const dates = [...new Set(records.map((r) => r.date))].sort((a, b) => b.localeCompare(a));
  const today = getTodayString();
  const yesterday = getDateString(new Date(Date.now() - 86400000));

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getLongestStreak(records: PlankRecord[]): number {
  if (records.length === 0) return 0;

  const dates = [...new Set(records.map((r) => r.date))].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

export function getMonthlyActiveDays(records: PlankRecord[], year: number, month: number): number {
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const dates = new Set(records.filter((r) => r.date.startsWith(monthStr)).map((r) => r.date));
  return dates.size;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
