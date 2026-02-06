"use client";

import { useEffect, useRef, useState } from "react";

const EXAM_DURATION_SECONDS = 330 * 60;

export function useTimer(startedAtMs: number | null) {
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_DURATION_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!startedAtMs) return;

    function tick() {
      const elapsed = Math.floor((Date.now() - startedAtMs!) / 1000);
      const remaining = Math.max(EXAM_DURATION_SECONDS - elapsed, 0);
      setRemainingSeconds(remaining);
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startedAtMs]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isWarning = remainingSeconds <= 30 * 60;
  const isTimeUp = remainingSeconds === 0;

  return { remainingSeconds, formatted, isWarning, isTimeUp };
}
