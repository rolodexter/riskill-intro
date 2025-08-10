import { useEffect, useRef, useState } from "react";

export type Density = "xs" | "sm" | "md" | "lg";

export function useResizeDensity() {
  const ref = useRef<HTMLDivElement>(null);
  const [bp, setBp] = useState<Density>("md");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setBp(w < 360 ? "xs" : w < 560 ? "sm" : w < 880 ? "md" : "lg");
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, bp } as const;
}
