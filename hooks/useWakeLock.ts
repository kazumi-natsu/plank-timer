"use client";

import { useEffect, useRef } from "react";

export function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;

    const request = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // Wake Lock非対応環境では無視
      }
    };

    const release = async () => {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };

    if (active) {
      request();
    } else {
      release();
    }

    return () => {
      release();
    };
  }, [active]);
}
