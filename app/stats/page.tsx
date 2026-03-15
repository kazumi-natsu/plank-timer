"use client";

import { WeeklyBarChart } from "@/components/Stats/WeeklyBarChart";
import { TrendLineChart } from "@/components/Stats/TrendLineChart";
import { StreakCard } from "@/components/Stats/StreakCard";
import { useRecords } from "@/hooks/useRecords";
import {
  getCurrentWeekDailyStats,
  getLast8Weeks,
  getLongestRecord,
  getCurrentStreak,
  getLongestStreak,
  getMonthlyActiveDays,
  getDaysInMonth,
  formatSeconds,
} from "@/lib/stats";

export default function StatsPage() {
  const { records } = useRecords();
  const now = new Date();

  const weeklyData = getCurrentWeekDailyStats(records);
  const trendData = getLast8Weeks(records);
  const longestRecord = getLongestRecord(records);
  const currentStreak = getCurrentStreak(records);
  const longestStreak = getLongestStreak(records);
  const monthlyActiveDays = getMonthlyActiveDays(records, now.getFullYear(), now.getMonth() + 1);
  const daysInCurrentMonth = getDaysInMonth(now.getFullYear(), now.getMonth() + 1);

  const totalThisWeek = weeklyData.reduce((sum, d) => sum + d.totalSeconds, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="px-4 pt-safe pt-4 pb-2 max-w-md mx-auto w-full">
        <h1 className="text-lg font-bold text-green-400">統計</h1>
      </header>

      <main className="flex-1 flex flex-col px-4 gap-4 pb-24 max-w-md mx-auto w-full">
        {records.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-3">📊</p>
              <p className="text-gray-400 font-medium">まだ記録がありません</p>
              <p className="text-gray-600 text-sm mt-1">トレーニングを始めると統計が表示されます</p>
            </div>
          </div>
        ) : (
          <>
            {/* 今週サマリー */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <p className="text-gray-400 text-xs mb-1">今週の合計</p>
              <p className="text-green-400 text-3xl font-bold">{formatSeconds(totalThisWeek)}</p>
            </div>

            <WeeklyBarChart data={weeklyData} />
            <TrendLineChart data={trendData} />

            <StreakCard
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              longestSeconds={longestRecord?.actualSeconds ?? 0}
              longestDate={longestRecord?.date ?? ""}
              monthlyActiveDays={monthlyActiveDays}
              daysInMonth={daysInCurrentMonth}
            />
          </>
        )}
      </main>
    </div>
  );
}
