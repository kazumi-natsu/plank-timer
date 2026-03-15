"use client";

import { PlankRecord } from "@/types";
import { groupByDate } from "@/lib/stats";

interface CalendarProps {
  records: PlankRecord[];
  year: number;
  month: number;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function getHeatColor(totalSeconds: number): string {
  if (totalSeconds === 0) return "bg-gray-800";
  if (totalSeconds < 60) return "bg-green-900";
  if (totalSeconds < 120) return "bg-green-700";
  if (totalSeconds < 180) return "bg-green-500";
  return "bg-green-400";
}

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export function Calendar({ records, year, month, selectedDate, onSelectDate, onPrevMonth, onNextMonth }: CalendarProps) {
  const grouped = groupByDate(records);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
        >
          ‹
        </button>
        <h2 className="text-white font-bold text-lg">
          {year}年{month}月
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
        >
          ›
        </button>
      </div>

      {/* 曜日ラベル */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayRecords = grouped[dateStr] || [];
          const totalSeconds = dayRecords.reduce((sum, r) => sum + r.actualSeconds, 0);
          const heatColor = getHeatColor(totalSeconds);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const dayOfWeek = (firstDay + day - 1) % 7;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                transition-all active:scale-95
                ${heatColor}
                ${isSelected ? "ring-2 ring-green-400 ring-offset-1 ring-offset-gray-800" : ""}
                ${isToday ? "ring-2 ring-white ring-offset-1 ring-offset-gray-800" : ""}
                ${dayOfWeek === 0 ? "text-red-300" : dayOfWeek === 6 ? "text-blue-300" : "text-gray-200"}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-xs text-gray-500">少</span>
        {["bg-gray-800", "bg-green-900", "bg-green-700", "bg-green-500", "bg-green-400"].map((c) => (
          <div key={c} className={`w-4 h-4 rounded-sm ${c} border border-gray-700`} />
        ))}
        <span className="text-xs text-gray-500">多</span>
      </div>
    </div>
  );
}
