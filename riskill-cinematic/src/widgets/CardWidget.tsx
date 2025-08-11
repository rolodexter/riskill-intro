import type { ReactNode, KeyboardEvent, WheelEvent, MouseEvent } from "react";
import { useEffect, useRef } from "react";
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
  headerTight?: boolean; // reduce header vertical spacing
  headerDivider?: boolean; // draw a subtle divider under the header
  keyboardActivation?: boolean; // when interactive, if false, Enter/Space won't trigger the action
  onWheel?: (e: WheelEvent<HTMLDivElement>) => void; // optional wheel handler for scroll-to-cycle widgets
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void; // optional key handler (e.g., Arrow cycle)
  chrome?: "default" | "none"; // when "none", render full-bleed surface without header/padding
  ariaLabel?: string; // optional accessible name override for interactive card
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
  headerTight = false,
  headerDivider = false,
  keyboardActivation = true,
  onWheel,
  onKeyDown,
  chrome = "default",
  ariaLabel,
}: CardProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Native wheel listener in capture phase to pre-empt page scroll when hovering the card
  useEffect(() => {
    if (!interactive || !onWheel) return;
    const el = rootRef.current;
    if (!el) return;
    const handler = (ev: globalThis.WheelEvent) => {
      // Forward to consumer; they will decide whether to preventDefault()
      try {
        (onWheel as unknown as (e: any) => void)(ev);
      } catch {}
    };
    el.addEventListener("wheel", handler as EventListener, { passive: false, capture: true } as AddEventListenerOptions);
    return () => {
      el.removeEventListener("wheel", handler as EventListener, { capture: true } as any);
    };
  }, [interactive, onWheel]);
  const content = (
    chrome === "none" ? (
      <div
        className={
          "card-root relative overflow-hidden z-0 rounded-2xl border border-white/5 bg-[rgb(15_23_42/var(--rk-card-alpha,0.70))] " +
          "md:backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,.42)] group h-[172px] sm:h-[188px] " +
          "transition-shadow duration-150 ease-out hover:shadow-[0_10px_36px_rgba(0,0,0,.5)] " +
          className
        }
      >
        {/* static sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sheen opacity-15 z-0" />
        {/* gradient edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] via-transparent to-white/[0.02] z-0" />
        {/* inner shadow for subtle depth */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-inner shadow-black/20 z-0" />

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
          "card-root relative overflow-hidden z-0 h-full rounded-2xl border border-white/5 bg-[rgb(15_23_42/var(--rk-card-alpha,0.70))] " +
          "p-4 lg:p-5 " +
          "md:backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,.42)] group " +
          "transition-shadow duration-150 ease-out hover:shadow-[0_10px_36px_rgba(0,0,0,.5)] " +
          className
        }
      >
        {/* static sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sheen opacity-15 z-0" />
        {/* gradient edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] via-transparent to-white/[0.02] z-0" />
        {/* inner shadow for subtle depth */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-inner shadow-black/20 z-0" />

        {(title || actions) && (
          <div
            className={`card-header relative z-10 ${headerHeight ? "flex items-center" : (headerTight ? "pt-0.5 pb-1 min-h-[36px]" : "pt-1 pb-2 min-h-[44px]")}`}
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
            {headerDivider && !headerHeight && (
              <div className="pointer-events-none absolute left-3 right-3 -bottom-px h-px bg-white/10" aria-hidden />
            )}
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
      ref={rootRef}
      role="button"
      aria-label={ariaLabel ?? (title ? `${title} card` : "Card")}
      tabIndex={0}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        // Ignore if a nested handler already consumed it
        if ((e as any).defaultPrevented) return;
        const t = e.target as HTMLElement | null;
        if (t && t.closest && t.closest('[data-disclosure]')) return;
        onPrimaryAction?.();
      }}
      onKeyDown={(e) => {
        // custom handler first so widget logic can intercept keys (e.g., ArrowLeft/Right, Enter)
        if (onKeyDown) onKeyDown(e);
        if (!onPrimaryAction) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (keyboardActivation) onPrimaryAction();
        }
      }}
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
