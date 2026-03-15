"use client";

import { useState } from "react";
import { Calendar } from "@/components/History/Calendar";
import { DailyDetail } from "@/components/History/DailyDetail";
import { useRecords } from "@/hooks/useRecords";
import { groupByDate } from "@/lib/stats";

export default function HistoryPage() {
  const { records } = useRecords();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    now.toISOString().split("T")[0]
  );

  const grouped = groupByDate(records);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const selectedRecords = selectedDate ? (grouped[selectedDate] || []) : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="px-4 pt-safe pt-4 pb-2 max-w-md mx-auto w-full">
        <h1 className="text-lg font-bold text-green-400">履歴</h1>
      </header>

      <main className="flex-1 flex flex-col px-4 gap-4 pb-24 max-w-md mx-auto w-full">
        <Calendar
          records={records}
          year={year}
          month={month}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {selectedDate && (
          <DailyDetail
            date={selectedDate}
            records={selectedRecords}
          />
        )}

        {records.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-3">🏋️</p>
              <p className="text-gray-400 font-medium">まだ記録がありません</p>
              <p className="text-gray-600 text-sm mt-1">タイマーを使ってトレーニングを始めましょう！</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
