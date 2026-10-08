'use client';

import { useEffect, useState } from 'react';

/** Seconds until [until] (ISO time), updated every second; 0 once it has passed. */
export function useSecondsLeft(until: string): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return Math.max(0, Math.ceil((new Date(until).getTime() - now) / 1000));
}

/** 95 → "1:35" */
export function formatSeconds(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
