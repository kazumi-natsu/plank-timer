import { PlankRecord, Settings } from "@/types";

const RECORDS_KEY = "plank_records";
const SETTINGS_KEY = "plank_settings";
const MAX_RECORDS = 10000;

export const defaultSettings: Settings = {
  defaultTargetSeconds: 60,
  restEnabled: false,
  restSeconds: 30,
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: true,
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getRecords(): PlankRecord[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PlankRecord[];
  } catch {
    return [];
  }
}

export function saveRecord(record: PlankRecord): void {
  if (!isClient()) return;
  const records = getRecords();
  records.push(record);

  // 上限を超えたら古いものから削除
  if (records.length > MAX_RECORDS) {
    records.splice(0, records.length - MAX_RECORDS);
  }

  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function deleteAllRecords(): void {
  if (!isClient()) return;
  localStorage.removeItem(RECORDS_KEY);
}

export function exportRecords(): string {
  const records = getRecords();
  return JSON.stringify(records, null, 2);
}

export function getSettings(): Settings {
  if (!isClient()) return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) } as Settings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings): void {
  if (!isClient()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
