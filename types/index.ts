export type PlankRecord = {
  id: string;
  date: string; // "YYYY-MM-DD"
  targetSeconds: number;
  actualSeconds: number;
  completedAt: string; // ISO 8601
};

export type TimerState = "idle" | "running" | "paused" | "completed";

export type Settings = {
  defaultTargetSeconds: number;
  restEnabled: boolean;
  restSeconds: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
};

export type WeeklyStats = {
  week: string; // "YYYY-WW"
  totalSeconds: number;
  daysCount: number;
};

export type DailyStats = {
  date: string;
  totalSeconds: number;
  setsCount: number;
  records: PlankRecord[];
};
