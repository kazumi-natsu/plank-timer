"use client";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  longestSeconds: number;
  longestDate: string;
  monthlyActiveDays: number;
  daysInMonth: number;
}

export function StreakCard({ currentStreak, longestStreak, longestSeconds, longestDate, monthlyActiveDays, daysInMonth }: StreakCardProps) {
  const formatLongestDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [y, m, d] = dateStr.split("-");
    return `${y}年${m}月${d}日`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-800 rounded-2xl p-4 col-span-2">
        <p className="text-gray-400 text-xs mb-1">連続実施ストリーク</p>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-gray-500 text-xs">現在</p>
            <p className="text-green-400 text-4xl font-bold tabular-nums">{currentStreak}<span className="text-lg ml-1">日</span></p>
          </div>
          <div className="pb-1">
            <p className="text-gray-500 text-xs">最長</p>
            <p className="text-white text-2xl font-bold tabular-nums">{longestStreak}<span className="text-sm ml-1">日</span></p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <p className="text-gray-400 text-xs mb-1">最長記録</p>
        <p className="text-green-400 text-2xl font-bold tabular-nums">{longestSeconds}<span className="text-sm ml-1">秒</span></p>
        <p className="text-gray-500 text-xs mt-1">{formatLongestDate(longestDate)}</p>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4">
        <p className="text-gray-400 text-xs mb-1">今月の実施日数</p>
        <p className="text-green-400 text-2xl font-bold tabular-nums">{monthlyActiveDays}<span className="text-gray-500 text-sm">/{daysInMonth}日</span></p>
        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${(monthlyActiveDays / daysInMonth) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
