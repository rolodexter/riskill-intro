import { useEffect, useMemo, useState } from "react";

export function useFeatureFlag(key: string) {
  const [enabled, setEnabled] = useState(false);

  const value = useMemo(() => {
    if (typeof window === "undefined") return false;
    const search = window.location.search || "";
    const hash = window.location.hash || "";

    // Primary: URLSearchParams (supports presence-only and value pairs)
    const params = new URLSearchParams(search);
    if (params.has(key)) {
      const v = params.get(key);
      // Presence-only (?flag) or truthy values enable; explicit 0/false disable
      if (v === null || v === "" || v === undefined) return true;
      const norm = String(v).toLowerCase();
      if (norm === "0" || norm === "false") return false;
      if (norm === "1" || norm === "true") return true;
      // Any other value: treat as presence toggle ON
      return true;
    }

    // Fallbacks: raw string checks to be robust to odd encodings/rewrites
    const raw = `${search}${hash}`.toLowerCase();
    if (raw.includes(`${key}=1`) || raw.includes(`${key}=true`) || raw.includes(`?${key}`) || raw.includes(`&${key}`)) {
      return true;
    }
    if (raw.includes(`${key}=0`) || raw.includes(`${key}=false`)) {
      return false;
    }

    return false;
  }, [key]);

  useEffect(() => setEnabled(Boolean(value)), [value]);
  return enabled;
}
