"use client";

import { formatTime } from "@/lib/stats";

interface ProgressRingProps {
  remainingSeconds: number;
  targetSeconds: number;
  progress: number;
  isWarning: boolean;
  size?: number;
}

export function ProgressRing({ remainingSeconds, targetSeconds, progress, isWarning, size = 268 }: ProgressRingProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const trackColor = "#1f2937";
  const activeColor = isWarning ? "#f97316" : "#22c55e";
  const glowColor = isWarning ? "rgba(249,115,22,0.25)" : "rgba(34,197,94,0.2)";

  const pct = Math.round(progress * 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 背景グロー */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
      >
        {/* トラック */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* プログレス */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease" }}
        />
      </svg>

      {/* 中央の時間表示 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span
          className={`text-5xl font-bold tabular-nums transition-colors duration-300 ${
            isWarning ? "text-orange-400" : "text-white"
          }`}
        >
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-gray-500 text-xs tabular-nums">
          目標 {formatTime(targetSeconds)} · {pct}%
        </span>
      </div>
    </div>
  );
}
