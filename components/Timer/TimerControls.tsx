"use client";

import { TimerState } from "@/types";
import { getCompletionMessage } from "@/lib/goalSuggestion";

interface TimerControlsProps {
  state: TimerState;
  actualSeconds: number;
  targetSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSave: () => void;
}

export function TimerControls({ state, actualSeconds, targetSeconds, onStart, onPause, onReset, onSave }: TimerControlsProps) {
  if (state === "completed") {
    const { headline, body } = getCompletionMessage(actualSeconds, targetSeconds);
    const rate = actualSeconds / targetSeconds;
    const isPerfect = rate >= 1.0;

    return (
      <div className="flex flex-col items-center gap-4 w-full">
        {/* 完了メッセージ */}
        <div className={`relative w-full rounded-2xl p-4 text-center overflow-hidden ${isPerfect ? "bg-gradient-to-br from-green-900/60 to-emerald-900/40 border border-green-700/40" : "bg-gray-800/80 border border-gray-700/40"}`}>
          {isPerfect && (
            <div className="sparkle-container absolute inset-0 pointer-events-none" aria-hidden="true">
              {[...Array(6)].map((_, i) => (
                <span key={i} className={`sparkle sparkle-${i + 1}`} />
              ))}
            </div>
          )}
          <p className={`text-lg font-bold mb-1 ${isPerfect ? "text-green-300" : "text-white"}`}>
            {isPerfect ? "🎉 " : ""}{headline}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
        </div>

        <button
          onClick={onSave}
          className="w-full max-w-xs bg-green-500 text-white py-4 rounded-2xl text-base font-bold hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/20"
        >
          記録を保存する
        </button>
        <button
          onClick={onReset}
          className="w-full max-w-xs bg-gray-800 text-gray-400 py-3 rounded-2xl text-sm font-medium hover:bg-gray-700 active:scale-95 transition-all"
        >
          記録せずにリセット
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      {state === "idle" && (
        <button
          onClick={onStart}
          className="w-20 h-20 bg-green-500 text-white rounded-full text-base font-bold hover:bg-green-600 active:scale-95 transition-all shadow-xl shadow-green-500/30"
        >
          開始
        </button>
      )}
      {state === "running" && (
        <>
          <button
            onClick={onReset}
            className="w-14 h-14 bg-gray-800 text-gray-400 rounded-full text-xs font-medium hover:bg-gray-700 active:scale-95 transition-all border border-gray-700"
          >
            リセット
          </button>
          <button
            onClick={onPause}
            className="w-20 h-20 bg-yellow-500 text-white rounded-full text-sm font-bold hover:bg-yellow-600 active:scale-95 transition-all shadow-xl shadow-yellow-500/30"
          >
            一時<br />停止
          </button>
        </>
      )}
      {state === "paused" && (
        <>
          <button
            onClick={onReset}
            className="w-14 h-14 bg-gray-800 text-gray-400 rounded-full text-xs font-medium hover:bg-gray-700 active:scale-95 transition-all border border-gray-700"
          >
            リセット
          </button>
          <button
            onClick={onStart}
            className="w-20 h-20 bg-green-500 text-white rounded-full text-base font-bold hover:bg-green-600 active:scale-95 transition-all shadow-xl shadow-green-500/30"
          >
            再開
          </button>
        </>
      )}
    </div>
  );
}
