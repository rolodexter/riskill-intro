import { useEffect, useMemo, useState } from "react";

export function useFeatureFlag(key: string) {
  const [enabled, setEnabled] = useState(false);
  const value = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.has(key) || window.location.search.includes(`${key}=1`) || window.location.hash.includes(`${key}=1`);
  }, [key]);
  useEffect(() => setEnabled(!!value), [value]);
  return enabled;
}
