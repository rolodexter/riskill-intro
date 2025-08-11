import { useRef, useCallback } from "react";

export function useLongPress(cb: () => void, ms = 450) {
  const t = useRef<number | null>(null);
  const start = useCallback(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(cb, ms);
  }, [cb, ms]);
  const clear = useCallback(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = null;
  }, []);
  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onTouchEnd: clear,
    onTouchCancel: clear,
  } as const;
}

export const isCoarsePointer = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches;
