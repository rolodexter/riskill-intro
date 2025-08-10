import type { ReactNode } from "react";
import { motion } from "framer-motion";

export type CardProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  status?: "idle" | "loading" | "error" | "success";
  interactive?: boolean;
  onPrimaryAction?: () => void;
};

export default function CardWidget({
  title,
  subtitle,
  actions,
  footer,
  children,
  className = "",
  status = "idle",
  interactive = false,
  onPrimaryAction,
}: CardProps) {
  const content = (
    <div
      className={
        "relative rounded-2xl border border-white/10 bg-white/5 md:bg-white/6 " +
        "backdrop-blur-xs md:backdrop-blur-xl shadow-glass group " +
        className
      }
    >
      {/* static sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sheen opacity-15" />

      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            {title && <div className="text-sm font-medium">{title}</div>}
            {subtitle && <div className="text-xs text-textSec">{subtitle}</div>}
          </div>
          {/* Quick actions: visible on hover/focus */}
          <div className="opacity-0 max-[480px]:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 flex gap-1">
            {actions}
          </div>
        </div>
      )}

      <div className="px-4 pb-4">
        {status === "loading" ? (
          <div className="h-24 bg-white/5 rounded" />
        ) : status === "error" ? (
          <div className="text-sm text-red-300">Something went wrong.</div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div className="px-4 pb-4 pt-2 text-xs text-textSec/80">{footer}</div>
      )}

      {/* focus ring indicator */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-focus-within:ring-2 ring-accent/40 transition-shadow" />
    </div>
  );

  if (!interactive) return content;

  return (
    <motion.button
      type="button"
      onClick={onPrimaryAction}
      className="w-full text-left rounded-2xl focus:outline-none"
      initial={false}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {content}
    </motion.button>
  );
}
