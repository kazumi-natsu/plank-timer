import { PlankRecord } from "@/types";
import { getTodayString, getDateString } from "./stats";

export type SuggestionBadge =
  | "はじめの一歩"
  | "再開おめでとう"
  | "いい感じ"
  | "チャレンジ"
  | "記録更新ねらえる"
  | "キープ";

export type Suggestion = {
  seconds: number;
  message: string;
  badge: SuggestionBadge;
  subMessage: string;
};

function roundToFive(n: number): number {
  return Math.round(n / 5) * 5;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function getRecentRecords(records: PlankRecord[], days: number): PlankRecord[] {
  const cutoff = getDateString(new Date(Date.now() - days * 86400000));
  return records.filter((r) => r.date >= cutoff);
}

function getLastActiveDaysAgo(records: PlankRecord[]): number {
  if (records.length === 0) return Infinity;
  const today = getTodayString();
  const dates = [...new Set(records.map((r) => r.date))].sort((a, b) => b.localeCompare(a));
  const lastDate = dates[0];
  if (lastDate === today) return 0;
  const diff = (new Date(today).getTime() - new Date(lastDate).getTime()) / 86400000;
  return Math.round(diff);
}

export function getCurrentStreak(records: PlankRecord[]): number {
  if (records.length === 0) return 0;
  const dates = [...new Set(records.map((r) => r.date))].sort((a, b) => b.localeCompare(a));
  const today = getTodayString();
  const yesterday = getDateString(new Date(Date.now() - 86400000));
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    if ((prev.getTime() - curr.getTime()) / 86400000 === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getTrend(recent7: PlankRecord[]): "up" | "stable" | "down" {
  if (recent7.length < 4) return "stable";
  const sorted = [...recent7].sort((a, b) => a.date.localeCompare(b.date));
  const half = Math.floor(sorted.length / 2);
  const firstHalfAvg = sorted.slice(0, half).reduce((s, r) => s + r.actualSeconds, 0) / half;
  const secondHalfAvg = sorted.slice(half).reduce((s, r) => s + r.actualSeconds, 0) / (sorted.length - half);
  const diff = secondHalfAvg - firstHalfAvg;
  if (diff > 5) return "up";
  if (diff < -5) return "down";
  return "stable";
}

export function getSuggestion(records: PlankRecord[]): Suggestion {
  // 記録ゼロ → 初回
  if (records.length === 0) {
    return {
      seconds: 30,
      badge: "はじめの一歩",
      message: "まずは30秒から！それだけで十分すごい",
      subMessage: "完璧じゃなくていい。続けることが一番大事",
    };
  }

  const lastActiveDaysAgo = getLastActiveDaysAgo(records);
  const streak = getCurrentStreak(records);
  const recent7 = getRecentRecords(records, 7);
  const recent14 = getRecentRecords(records, 14);
  const allBest = Math.max(...records.map((r) => r.actualSeconds));

  const recentAvg =
    recent7.length > 0
      ? recent7.reduce((s, r) => s + r.actualSeconds, 0) / recent7.length
      : records.slice(-5).reduce((s, r) => s + r.actualSeconds, 0) / Math.min(5, records.length);

  const trend = getTrend(recent14);

  // 4日以上空いている → 再開モード
  if (lastActiveDaysAgo >= 4) {
    const comfortLevel = clamp(roundToFive(recentAvg * 0.8), 20, 120);
    return {
      seconds: comfortLevel,
      badge: "再開おめでとう",
      message: "お帰り！焦らず体を慣らしていこう",
      subMessage: `${comfortLevel}秒から無理なく再スタート`,
    };
  }

  // 2〜3日空き → 安定モード
  if (lastActiveDaysAgo >= 2) {
    const suggested = clamp(roundToFive(recentAvg), 20, 300);
    return {
      seconds: suggested,
      badge: "いい感じ",
      message: "ちょっと間が空いたけど大丈夫！",
      subMessage: `先週の調子を取り戻していこう（目安: ${suggested}秒）`,
    };
  }

  // ストリーク3日以上 & 向上トレンド → チャレンジ
  if (streak >= 3 && trend === "up") {
    const suggested = clamp(roundToFive(recentAvg + 10), 20, 300);
    const isNearBest = suggested >= allBest;
    if (isNearBest) {
      return {
        seconds: suggested,
        badge: "記録更新ねらえる",
        message: `自己ベスト（${allBest}秒）に並ぶかも！`,
        subMessage: `${streak}日連続の勢いで一気に更新しちゃおう`,
      };
    }
    return {
      seconds: suggested,
      badge: "チャレンジ",
      message: `${streak}日連続！この調子でもう少し伸ばそう`,
      subMessage: `昨日より約10秒アップを目標に`,
    };
  }

  // ストリーク3日以上 & 安定トレンド → キープ+少し伸ばす
  if (streak >= 3 && trend === "stable") {
    const suggested = clamp(roundToFive(recentAvg + 5), 20, 300);
    return {
      seconds: suggested,
      badge: "キープ",
      message: `${streak}日続いてる！コツコツが一番効く`,
      subMessage: `今日も${suggested}秒を目指そう`,
    };
  }

  // ダウントレンド → 回復モード
  if (trend === "down") {
    const suggested = clamp(roundToFive(recentAvg), 20, 300);
    return {
      seconds: suggested,
      badge: "いい感じ",
      message: "無理しなくていい日もある。今日は楽しくいこう",
      subMessage: `最近の調子に合わせて${suggested}秒から`,
    };
  }

  // デフォルト: 直近平均を提案
  const suggested = clamp(roundToFive(recentAvg + 5), 20, 300);
  return {
    seconds: suggested,
    badge: "いい感じ",
    message: "今日も一緒にがんばろう",
    subMessage: `${suggested}秒を目標に`,
  };
}

export function getGreeting(): { text: string; sub: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 10) {
    return {
      text: "おはようございます！",
      sub: "朝のプランクで一日をスタートしよう",
    };
  }
  if (h >= 10 && h < 14) {
    return {
      text: "こんにちは！",
      sub: "ランチ前のひと息に体幹トレーニング",
    };
  }
  if (h >= 14 && h < 18) {
    return {
      text: "午後もがんばってる！",
      sub: "少し動いて気分転換しよう",
    };
  }
  if (h >= 18 && h < 22) {
    return {
      text: "お疲れ様です！",
      sub: "一日の締めにプランクで整えよう",
    };
  }
  return {
    text: "遅くまでお疲れ様！",
    sub: "今日もよく動いた。少しだけがんばろう",
  };
}

export function getCompletionMessage(actualSeconds: number, targetSeconds: number): {
  headline: string;
  body: string;
} {
  const rate = actualSeconds / targetSeconds;

  if (rate >= 1.0) {
    return {
      headline: "目標クリア！さすがです",
      body: `${actualSeconds}秒やり切った。今日もちゃんと自分に勝てたね`,
    };
  }
  if (rate >= 0.7) {
    return {
      headline: "よくがんばった！",
      body: `${actualSeconds}秒だって十分すごい。継続が一番の力になるよ`,
    };
  }
  return {
    headline: "今日もやれた！",
    body: `${actualSeconds}秒スタート。ゼロよりずっといい。明日も来てね`,
  };
}
