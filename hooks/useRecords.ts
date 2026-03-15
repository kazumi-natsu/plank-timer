"use client";

import { useState, useEffect, useCallback } from "react";
import { PlankRecord } from "@/types";
import { getRecords, saveRecord, deleteAllRecords } from "@/lib/storage";

export function useRecords() {
  const [records, setRecords] = useState<PlankRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const addRecord = useCallback((record: PlankRecord) => {
    saveRecord(record);
    setRecords(getRecords());
  }, []);

  const clearRecords = useCallback(() => {
    deleteAllRecords();
    setRecords([]);
  }, []);

  const refreshRecords = useCallback(() => {
    setRecords(getRecords());
  }, []);

  return { records, addRecord, clearRecords, refreshRecords };
}
