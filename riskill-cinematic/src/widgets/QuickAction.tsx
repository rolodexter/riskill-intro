import type { ReactNode } from "react";

export function QuickAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="size-10 p-2 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10 active:scale-95 transition"
      aria-label={label}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
