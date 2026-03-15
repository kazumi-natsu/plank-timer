"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings } from "@/types";
import { getSettings, saveSettings, defaultSettings } from "@/lib/storage";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
