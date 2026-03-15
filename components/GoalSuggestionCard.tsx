"use client";

import { Suggestion, SuggestionBadge } from "@/lib/goalSuggestion";

const BADGE_STYLES: Record<SuggestionBadge, string> = {
  "はじめの一歩": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "再開おめでとう": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "いい感じ": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "キープ": "bg-green-500/20 text-green-300 border-green-500/30",
  "チャレンジ": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "記録更新ねらえる": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

const BADGE_ICONS: Record<SuggestionBadge, string> = {
  "はじめの一歩": "✨",
  "再開おめでとう": "🌱",
  "いい感じ": "💪",
  "キープ": "🔥",
  "チャレンジ": "⚡",
  "記録更新ねらえる": "🏆",
};

interface GoalSuggestionCardProps {
  suggestion: Suggestion;
  currentTarget: number;
  onApply: (seconds: number) => void;
}

export function GoalSuggestionCard({ suggestion, currentTarget, onApply }: GoalSuggestionCardProps) {
  const isApplied = currentTarget === suggestion.seconds;

  return (
    <div className="w-full bg-gradient-to-br from-gray-800 to-gray-800/60 rounded-2xl p-4 border border-gray-700/50">
      {/* バッジ */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${BADGE_STYLES[suggestion.badge]}`}
        >
          <span>{BADGE_ICONS[suggestion.badge]}</span>
          {suggestion.badge}
        </span>
        <span className="text-gray-500 text-xs">今日のおすすめ</span>
      </div>

      {/* メッセージ */}
      <p className="text-white font-semibold text-sm mb-1">{suggestion.message}</p>
      <p className="text-gray-400 text-xs mb-4">{suggestion.subMessage}</p>

      {/* 目標秒数 + 適用ボタン */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-green-400 text-3xl font-bold tabular-nums">{suggestion.seconds}</span>
          <span className="text-gray-400 text-sm">秒</span>
        </div>

        {isApplied ? (
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            適用済み
          </span>
        ) : (
          <button
            onClick={() => onApply(suggestion.seconds)}
            className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 active:scale-95 transition-all shadow-md shadow-green-500/20"
          >
            この目標にする
          </button>
        )}
      </div>
    </div>
  );
}
