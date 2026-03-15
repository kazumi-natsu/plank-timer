"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeeklyBarChartProps {
  data: { label: string; totalSeconds: number }[];
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    minutes: Math.round(d.totalSeconds / 60 * 10) / 10,
  }));

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <h3 className="text-white font-bold mb-3">今週の記録（日別）</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} unit="分" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            formatter={(value) => [`${value}分`, "合計時間"]}
          />
          <Bar dataKey="minutes" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
