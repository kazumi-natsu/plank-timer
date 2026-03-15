"use client";

import { PlankRecord } from "@/types";
import { formatSeconds } from "@/lib/stats";

interface DailyDetailProps {
  date: string;
  records: PlankRecord[];
}

export function DailyDetail({ date, records }: DailyDetailProps) {
  if (records.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-4 text-center text-gray-500">
        <p className="text-sm">この日の記録はありません</p>
      </div>
    );
  }

  const totalSeconds = records.reduce((sum, r) => sum + r.actualSeconds, 0);
  const [y, m, d] = date.split("-");

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold">
          {y}年{m}月{d}日
        </h3>
        <div className="text-right">
          <p className="text-green-400 font-bold">{formatSeconds(totalSeconds)}</p>
          <p className="text-gray-400 text-xs">{records.length}セット</p>
        </div>
      </div>

      <div className="space-y-2">
        {records.map((record, index) => {
          const achievementRate = Math.round((record.actualSeconds / record.targetSeconds) * 100);
          return (
            <div key={record.id} className="bg-gray-700/50 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">セット {index + 1}</p>
                <p className="text-gray-500 text-xs">目標: {record.targetSeconds}秒</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold tabular-nums">{record.actualSeconds}秒</p>
                <p className={`text-xs font-medium ${achievementRate >= 100 ? "text-green-400" : "text-yellow-400"}`}>
                  達成率 {achievementRate}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
