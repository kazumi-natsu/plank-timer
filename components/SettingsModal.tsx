"use client";

import { useState } from "react";
import { Settings } from "@/types";
import { exportRecords } from "@/lib/storage";

interface SettingsModalProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
  onClearData: () => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onUpdate, onClearData, onClose }: SettingsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = () => {
    const data = exportRecords();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plank_records_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteConfirm = () => {
    onClearData();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto">
        {/* ハンドル */}
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">設定</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* デフォルト目標時間 */}
          <section>
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3">タイマー設定</h3>
            <div className="bg-gray-800 rounded-2xl p-4 space-y-4">
              <div>
                <label className="text-white text-sm font-medium block mb-2">
                  デフォルト目標時間
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={5}
                    value={settings.defaultTargetSeconds}
                    onChange={(e) => onUpdate({ defaultTargetSeconds: parseInt(e.target.value) })}
                    className="flex-1 accent-green-500"
                  />
                  <span className="text-green-400 font-bold tabular-nums w-14 text-right">
                    {settings.defaultTargetSeconds}秒
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">レストタイマー</p>
                  <p className="text-gray-500 text-xs">完了後に自動で開始</p>
                </div>
                <button
                  onClick={() => onUpdate({ restEnabled: !settings.restEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.restEnabled ? "bg-green-500" : "bg-gray-600"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${settings.restEnabled ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              {settings.restEnabled && (
                <div>
                  <label className="text-white text-sm font-medium block mb-2">レスト時間</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={5}
                      value={settings.restSeconds}
                      onChange={(e) => onUpdate({ restSeconds: parseInt(e.target.value) })}
                      className="flex-1 accent-green-500"
                    />
                    <span className="text-green-400 font-bold tabular-nums w-14 text-right">
                      {settings.restSeconds}秒
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 通知設定 */}
          <section>
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3">通知</h3>
            <div className="bg-gray-800 rounded-2xl divide-y divide-gray-700">
              {[
                { key: "soundEnabled" as const, label: "効果音", desc: "完了時に音を鳴らす" },
                { key: "vibrationEnabled" as const, label: "バイブレーション", desc: "完了時に振動する" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-gray-500 text-xs">{desc}</p>
                  </div>
                  <button
                    onClick={() => onUpdate({ [key]: !settings[key] })}
                    className={`w-12 h-6 rounded-full transition-colors ${settings[key] ? "bg-green-500" : "bg-gray-600"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${settings[key] ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 表示設定 */}
          <section>
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3">表示</h3>
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">ダークモード</p>
                  <p className="text-gray-500 text-xs">画面の明るさを抑える</p>
                </div>
                <button
                  onClick={() => onUpdate({ darkMode: !settings.darkMode })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.darkMode ? "bg-green-500" : "bg-gray-600"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${settings.darkMode ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </section>

          {/* データ管理 */}
          <section>
            <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3">データ</h3>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full bg-gray-800 text-white rounded-2xl p-4 text-left hover:bg-gray-700 transition-colors"
              >
                <p className="font-medium text-sm">データをエクスポート</p>
                <p className="text-gray-500 text-xs mt-0.5">JSONファイルとして保存</p>
              </button>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-gray-800 text-red-400 rounded-2xl p-4 text-left hover:bg-gray-700 transition-colors"
                >
                  <p className="font-medium text-sm">全データを削除</p>
                  <p className="text-gray-500 text-xs mt-0.5">すべての記録を削除します</p>
                </button>
              ) : (
                <div className="bg-red-950/50 border border-red-800 rounded-2xl p-4">
                  <p className="text-red-400 font-medium text-sm mb-3">本当に削除しますか？</p>
                  <p className="text-gray-400 text-xs mb-4">この操作は取り消せません。</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-700 text-white rounded-xl py-2 text-sm font-medium"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="flex-1 bg-red-600 text-white rounded-xl py-2 text-sm font-medium"
                    >
                      削除する
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
