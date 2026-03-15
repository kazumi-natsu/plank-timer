"use client";

import { useState } from "react";

const PRESETS = [30, 60, 90, 120];

interface PresetSelectorProps {
  targetSeconds: number;
  onSelect: (seconds: number) => void;
  disabled?: boolean;
}

export function PresetSelector({ targetSeconds, onSelect, disabled }: PresetSelectorProps) {
  const [customValue, setCustomValue] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const isCustom = !PRESETS.includes(targetSeconds);

  const handleCustomSubmit = () => {
    const val = parseInt(customValue, 10);
    if (!isNaN(val) && val > 0 && val <= 3600) {
      onSelect(val);
      setShowCustom(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {PRESETS.map((sec) => (
        <button
          key={sec}
          onClick={() => {
            onSelect(sec);
            setShowCustom(false);
          }}
          disabled={disabled}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            targetSeconds === sec && !isCustom
              ? "bg-green-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {sec}秒
        </button>
      ))}
      <button
        onClick={() => setShowCustom(!showCustom)}
        disabled={disabled}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isCustom || showCustom
            ? "bg-green-500 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        カスタム
      </button>

      {showCustom && (
        <div className="w-full flex gap-2 mt-1">
          <input
            type="number"
            min={5}
            max={3600}
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="秒数を入力"
            className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
          />
          <button
            onClick={handleCustomSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
          >
            設定
          </button>
        </div>
      )}
    </div>
  );
}
