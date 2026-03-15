"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ProgressRing } from "@/components/Timer/ProgressRing";
import { TimerControls } from "@/components/Timer/TimerControls";
import { PresetSelector } from "@/components/Timer/PresetSelector";
import { SettingsModal } from "@/components/SettingsModal";
import { GoalSuggestionCard } from "@/components/GoalSuggestionCard";
import { useTimer } from "@/hooks/useTimer";
import { useRecords } from "@/hooks/useRecords";
import { useSettings } from "@/hooks/useSettings";
import { useWakeLock } from "@/hooks/useWakeLock";
import { PlankRecord } from "@/types";
import { getTodayString } from "@/lib/stats";
import { getSuggestion, getGreeting, getCurrentStreak as calcStreak } from "@/lib/goalSuggestion";

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-300 text-xs font-semibold border border-orange-500/20">
      🔥 {streak}日連続
    </span>
  );
}

export default function TimerPage() {
  const { settings, updateSettings } = useSettings();
  const { records, addRecord } = useRecords();
  const [targetSeconds, setTargetSeconds] = useState(60);
  const [showSettings, setShowSettings] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(true);

  useEffect(() => {
    setTargetSeconds(settings.defaultTargetSeconds);
  }, [settings.defaultTargetSeconds]);

  const suggestion = useMemo(() => getSuggestion(records), [records]);
  const greeting = useMemo(() => getGreeting(), []);
  const streak = useMemo(() => calcStreak(records), [records]);

  const { state, remainingSeconds, actualSeconds, progress, isWarning, start, pause, reset } = useTimer({
    targetSeconds,
    soundEnabled: settings.soundEnabled,
    vibrationEnabled: settings.vibrationEnabled,
  });

  useWakeLock(state === "running");

  const handleSaveRecord = useCallback(() => {
    const record: PlankRecord = {
      id: crypto.randomUUID(),
      date: getTodayString(),
      targetSeconds,
      actualSeconds,
      completedAt: new Date().toISOString(),
    };
    addRecord(record);
    setSavedMessage(true);
    reset();
    setTimeout(() => setSavedMessage(false), 2500);
  }, [targetSeconds, actualSeconds, addRecord, reset]);

  const handleApplySuggestion = useCallback((sec: number) => {
    setTargetSeconds(sec);
    setShowSuggestion(false);
  }, []);

  const isIdle = state === "idle";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 pt-safe pt-4 pb-2 max-w-md mx-auto w-full">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-green-400">Plank Timer</h1>
          <StreakBadge streak={streak} />
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          aria-label="設定を開く"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path strokeLinecap="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </header>

      {/* グリーティング（idle時のみ） */}
      {isIdle && (
        <div className="px-4 pb-1 max-w-md mx-auto w-full">
          <p className="text-gray-300 text-sm font-medium">{greeting.text}</p>
          <p className="text-gray-500 text-xs">{greeting.sub}</p>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col items-center px-4 gap-6 pb-28 max-w-md mx-auto w-full mt-4">
        {/* プログレスリング */}
        <ProgressRing
          remainingSeconds={remainingSeconds}
          progress={progress}
          isWarning={isWarning}
          targetSeconds={targetSeconds}
        />

        {/* コントロール */}
        <TimerControls
          state={state}
          actualSeconds={actualSeconds}
          targetSeconds={targetSeconds}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onSave={handleSaveRecord}
        />

        {/* idle時: 今日の目標カード + プリセット */}
        {isIdle && (
          <div className="w-full space-y-4">
            {/* スマートゴール提案 */}
            {showSuggestion && (
              <div className="relative">
                <GoalSuggestionCard
                  suggestion={suggestion}
                  currentTarget={targetSeconds}
                  onApply={handleApplySuggestion}
                />
                <button
                  onClick={() => setShowSuggestion(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-400 p-1"
                  aria-label="閉じる"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path d="M12 4L4 12M4 4l8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

            {/* プリセット選択 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-xs">目標時間を選ぶ</p>
                {!showSuggestion && (
                  <button
                    onClick={() => setShowSuggestion(true)}
                    className="text-xs text-green-500 hover:text-green-400 transition-colors"
                  >
                    おすすめを見る
                  </button>
                )}
              </div>
              <PresetSelector
                targetSeconds={targetSeconds}
                onSelect={setTargetSeconds}
              />
            </div>
          </div>
        )}
      </main>

      {/* 保存完了トースト */}
      {savedMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-xl shadow-green-900/40 animate-fade-in-out whitespace-nowrap z-50">
          ✓ 記録を保存しました
        </div>
      )}

      {/* 設定モーダル */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClearData={() => {}}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
