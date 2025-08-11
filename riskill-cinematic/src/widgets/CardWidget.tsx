import type { ReactNode, KeyboardEvent, WheelEvent } from "react";
import { motion } from "framer-motion";

export type CardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  status?: "idle" | "loading" | "error" | "success";
  interactive?: boolean;
  onPrimaryAction?: () => void;
  hoverLift?: boolean; // enable hover translate/scale; disable to avoid new stacking context
  headerHeight?: number; // optional fixed header height in px; content area will fill the rest
  keyboardActivation?: boolean; // when interactive, if false, Enter/Space won't trigger the action
  onWheel?: (e: WheelEvent<HTMLDivElement>) => void; // optional wheel handler for scroll-to-cycle widgets
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void; // optional key handler (e.g., Arrow cycle)
  chrome?: "default" | "none"; // when "none", render full-bleed surface without header/padding
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
  hoverLift = true,
  headerHeight,
  keyboardActivation = true,
  onWheel,
  onKeyDown,
  chrome = "default",
}: CardProps) {
  const content = (
    chrome === "none" ? (
      <div
        className={
          "card-root relative overflow-hidden z-0 rounded-2xl border border-white/10 bg-white/5 md:bg-white/6 " +
          "md:backdrop-blur-xl shadow-glass group h-[172px] sm:h-[188px] " +
          className
        }
      >
        {/* static sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sheen opacity-15 z-0" />

        <div className="card-content absolute inset-0 z-10">
          {status === "loading" ? (
            <div className="h-full bg-white/5" />
          ) : status === "error" ? (
            <div className="m-3 text-sm text-red-300">Something went wrong.</div>
          ) : (
            children
          )}
        </div>

        {footer && (
          <div className="absolute bottom-2 left-3 right-3 text-xs text-textSec/80">{footer}</div>
        )}

        {/* focus ring indicator */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-focus-within:ring-2 ring-accent/40 transition-shadow" />
      </div>
    ) : (
      <div
        className={
          "card-root relative overflow-hidden z-0 h-full rounded-2xl border border-white/10 bg-white/5 md:bg-white/6 " +
          "p-4 lg:p-5 " +
          "md:backdrop-blur-xl shadow-glass group " +
          className
        }
      >
        {/* static sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sheen opacity-15 z-0" />

        {(title || actions) && (
          <div
            className={`card-header relative z-10 ${headerHeight ? "flex items-center" : "pt-1 pb-2 min-h-[44px]"}`}
            style={headerHeight ? { height: headerHeight } : undefined}
          >
            <div className="pr-10">
              {title && <div className="text-sm font-medium">{title}</div>}
              {subtitle && <div className="text-xs text-textSec">{subtitle}</div>}
            </div>
            {/* Quick actions: absolute cluster in top-right */}
            <div className="absolute top-2 right-2 z-30 opacity-0 max-[480px]:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 flex items-center gap-2 flex-wrap">
              {actions}
            </div>
          </div>
        )}

        <div
          className="card-content relative z-10"
          style={headerHeight ? { height: `calc(100% - ${headerHeight}px)` } : undefined}
        >
          {status === "loading" ? (
            <div className="h-24 bg-white/5 rounded" />
          ) : status === "error" ? (
            <div className="text-sm text-red-300">Something went wrong.</div>
          ) : (
            children
          )}
        </div>

        {footer && (
          <div className="pt-2 text-xs text-textSec/80">{footer}</div>
        )}

        {/* focus ring indicator */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-focus-within:ring-2 ring-accent/40 transition-shadow" />
      </div>
    )
  );

  if (!interactive) return content;

  return (
    <motion.div
      role="button"
      aria-label={title ? `${title} card` : "Card"}
      tabIndex={0}
      onClick={onPrimaryAction}
      onKeyDown={(e) => {
        // custom handler first so widget logic can intercept keys (e.g., ArrowLeft/Right, Enter)
        if (onKeyDown) onKeyDown(e);
        if (!onPrimaryAction) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (keyboardActivation) onPrimaryAction();
        }
      }}
      onWheel={onWheel}
      className="w-full text-left rounded-2xl focus:outline-none"
      initial={false}
      whileHover={hoverLift ? { y: -2, scale: 1.01 } : undefined}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {content}
    </motion.div>
  );
}
