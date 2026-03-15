"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TimerState } from "@/types";

interface UseTimerOptions {
  targetSeconds: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export function useTimer({ targetSeconds, soundEnabled, vibrationEnabled }: UseTimerOptions) {
  const [state, setState] = useState<TimerState>("idle");
  const [remainingMs, setRemainingMs] = useState(targetSeconds * 1000);

  const startTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(targetSeconds * 1000);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stateRef = useRef<TimerState>("idle");
  const soundEnabledRef = useRef(soundEnabled);
  const vibrationEnabledRef = useRef(vibrationEnabled);

  soundEnabledRef.current = soundEnabled;
  vibrationEnabledRef.current = vibrationEnabled;
  stateRef.current = state;

  const playCompletionSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.6);
    } catch {
      // AudioContext非対応環境では無視
    }
  }, []);

  const vibrate = useCallback(() => {
    if (!vibrationEnabledRef.current) return;
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  }, []);

  const stopTick = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startTick = useCallback((targetMs: number) => {
    const tick = () => {
      if (startTimeRef.current === null) return;
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = targetMs - elapsed;

      if (remaining <= 0) {
        setRemainingMs(0);
        setState("completed");
        playCompletionSound();
        vibrate();
        return;
      }

      setRemainingMs(remaining);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [playCompletionSound, vibrate]);

  // targetSecondsが変わったらidle状態でリセット
  useEffect(() => {
    if (stateRef.current === "idle") {
      const ms = targetSeconds * 1000;
      setRemainingMs(ms);
      pausedRemainingRef.current = ms;
    }
  }, [targetSeconds]);

  const start = useCallback(() => {
    if (stateRef.current !== "idle" && stateRef.current !== "paused") return;
    startTimeRef.current = performance.now();
    setState("running");
    startTick(pausedRemainingRef.current);
  }, [startTick]);

  const pause = useCallback(() => {
    if (stateRef.current !== "running") return;
    stopTick();
    setRemainingMs((prev) => {
      pausedRemainingRef.current = prev;
      return prev;
    });
    setState("paused");
  }, [stopTick]);

  const reset = useCallback(() => {
    stopTick();
    startTimeRef.current = null;
    const ms = targetSeconds * 1000;
    pausedRemainingRef.current = ms;
    setRemainingMs(ms);
    setState("idle");
  }, [targetSeconds, stopTick]);

  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const progress = 1 - remainingMs / (targetSeconds * 1000);
  const isWarning = remainingSeconds <= 10 && state === "running";
  const actualSeconds = targetSeconds - Math.floor(remainingMs / 1000);

  return {
    state,
    remainingSeconds,
    remainingMs,
    actualSeconds: Math.max(0, actualSeconds),
    progress: Math.min(1, Math.max(0, progress)),
    isWarning,
    start,
    pause,
    reset,
  };
}
