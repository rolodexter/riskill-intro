 

export type KPIIconName = "revenue" | "ops" | "risk" | "agent";
export function KPIIcon({ name, className = "size-5" }: { name: KPIIconName; className?: string }) {
  const common = "fill-none stroke-current";
  switch (name) {
    case "revenue":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path className={common} strokeWidth="1.5" strokeLinecap="round" d="M4 16l4-4 3 3 7-7" />
          <path className={common} strokeWidth="1.5" d="M4 20h16" />
        </svg>
      );
    case "ops":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle className={common} cx="12" cy="12" r="6" strokeWidth="1.5" />
          <path className={common} strokeWidth="1.5" strokeLinecap="round" d="M12 8v4l3 2" />
        </svg>
      );
    case "risk":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path className={common} strokeWidth="1.5" d="M12 3l9 18H3l9-18z" />
          <path className={common} strokeWidth="1.5" d="M12 9v5" />
          <circle className={common} cx="12" cy="17" r=".8" strokeWidth="1.5" />
        </svg>
      );
    case "agent":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle className={common} cx="12" cy="8" r="3.5" strokeWidth="1.5" />
          <path className={common} strokeWidth="1.5" d="M4.5 20a7.5 7.5 0 0115 0" />
        </svg>
      );
  }
}

export type TrendDir = "up" | "down" | "flat";
export function TrendIcon({ dir, className = "size-4" }: { dir: TrendDir; className?: string }) {
  const common = "fill-none stroke-current";
  if (dir === "up")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path className={common} strokeWidth="1.5" strokeLinecap="round" d="M4 14l6-6 4 4 6-6" />
      </svg>
    );
  if (dir === "down")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path className={common} strokeWidth="1.5" strokeLinecap="round" d="M4 10l6 6 4-4 6 6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path className={common} strokeWidth="1.5" strokeLinecap="round" d="M4 12h16" />
    </svg>
  );
}
