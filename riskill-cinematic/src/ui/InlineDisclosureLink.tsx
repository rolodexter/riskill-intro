import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useLongPress, isCoarsePointer } from "./useLongPress";
import { GLOSSARY, type GlossaryKey } from "../glossary/registry";
import { emit } from "../utils/telemetry";
import { pub } from "../widgets/bus";
import { messengerHandoff } from "../utils/messenger";

export type InlineDisclosureLinkProps = {
  children: React.ReactNode;
  glossaryKey: GlossaryKey;
  placement?: "top-right" | "bottom-right";
  className?: string;
  ariaLabel?: string;
  // Standardized messenger handoff fields
  faceId?: string;
  handoffSource?: string; // default: 'disclosure-inline'
  handoffMeta?: Record<string, unknown>;
};

export default function InlineDisclosureLink({ children, glossaryKey, placement = "top-right", className, ariaLabel, faceId, handoffSource = "disclosure-inline", handoffMeta }: InlineDisclosureLinkProps) {
  const item = GLOSSARY[glossaryKey];
  const [openTip, setOpenTip] = useState(false);
  const [hoveringTip, setHoveringTip] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const linkRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  function track(kind: "tooltip" | "sheet", how: "hover" | "click" | "longpress" | "focus") {
    const payload = { kind, how, key: glossaryKey } as const;
    try { emit("disclosure.open", payload); } catch {}
    try { pub("disclosure.open", payload); } catch {}
  }
  function trackClose(kind: "tooltip" | "sheet", why: string) {
    const payload = { kind, why, key: glossaryKey } as const;
    try { emit("disclosure.close", payload); } catch {}
    try { pub("disclosure.close", payload); } catch {}
  }

  // Compute viewport-safe tooltip position after open
  useLayoutEffect(() => {
    if (!openTip || !linkRef.current) return;
    const pad = 12; // viewport padding
    const w = 280; // tooltip width
    const el = linkRef.current.getBoundingClientRect();
    let left = placement.includes("right") ? el.right - w : el.left;
    let top = placement.startsWith("top") ? el.top - 8 : el.bottom + 8;
    requestAnimationFrame(() => {
      const h = tipRef.current?.getBoundingClientRect().height ?? 0;
      if (placement.startsWith("top") && top - h < pad) top = el.bottom + 8; // flip down
      if (!placement.startsWith("top") && top + h > window.innerHeight - pad) top = Math.max(pad, el.top - h - 8);
      left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
      setPos({ top, left });
    });
  }, [openTip, placement]);

  // Close tooltip on scroll/resize to avoid stale positions
  useEffect(() => {
    if (!openTip) return;
    const close = () => {
      const tipWasOpen = openTip;
      setOpenTip(false); setHoveringTip(false);
      if (tipWasOpen) trackClose("tooltip", "viewport_change");
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [openTip]);

  // Long-press opens sheet on touch; click toggles sheet on coarse pointers
  const lp = useLongPress(() => {
    setOpenTip(false);
    // Route to Messenger instead of opening an inline sheet
    messengerHandoff({
      source: handoffSource || "disclosure-inline",
      intent: "discuss",
      faceId,
      title: item.title,
      narrative: item.detail?.[0] || undefined,
      anchorEl: linkRef.current || undefined,
      meta: { glossaryKey, ...(handoffMeta || {}) },
    });
    track("sheet", "longpress");
  });
  const swallow = (e: SyntheticEvent) => { e.preventDefault(); e.stopPropagation(); };

  // Singleton exclusivity across app scope (module-level state)
  // mirrored from Disclosure.tsx pattern
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyGlobal = globalThis as any;
  if (anyGlobal.__rk_closeInlineDisclosureLast == null) anyGlobal.__rk_closeInlineDisclosureLast = null as null | (() => void);
  const getCloseLast = () => (anyGlobal.__rk_closeInlineDisclosureLast as null | (() => void));
  const setCloseLast = (fn: null | (() => void)) => { anyGlobal.__rk_closeInlineDisclosureLast = fn; };

  const openTipExclusive = () => {
    getCloseLast()?.();
    setOpenTip(true);
    setCloseLast(() => () => setOpenTip(false));
  };

  const handleClick = (e: ReactMouseEvent) => {
    swallow(e);
    // Open Messenger directly; no local sheet
    messengerHandoff({
      source: handoffSource || "disclosure-inline",
      intent: "discuss",
      faceId,
      title: item.title,
      narrative: item.detail?.[0] || undefined,
      anchorEl: linkRef.current || undefined,
      meta: { glossaryKey, ...(handoffMeta || {}) },
    });
    track("sheet", "click");
  };
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      swallow(e);
      messengerHandoff({
        source: handoffSource || "disclosure-inline",
        intent: "discuss",
        faceId,
        title: item.title,
        narrative: item.detail?.[0] || undefined,
        anchorEl: linkRef.current || undefined,
        meta: { glossaryKey, ...(handoffMeta || {}) },
      });
      track("sheet", "click");
    }
  };

  return (
    <span className={className} data-disclosure>
      <span
        ref={linkRef}
        role="link"
        tabIndex={0}
        aria-label={ariaLabel ?? (item ? `About: ${item.title}` : undefined)}
        className="rk-link inline-flex items-center underline underline-offset-2 decoration-white/25 hover:decoration-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
        onMouseDown={swallow}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => { if (!isCoarsePointer()) { openTipExclusive(); track("tooltip", "hover"); } }}
        onMouseLeave={() => { if (!hoveringTip) { setOpenTip(false); trackClose("tooltip", "link_leave"); } }}
        onFocus={() => { setOpenTip(true); track("tooltip", "focus"); }}
        onBlur={() => { if (!hoveringTip) { setOpenTip(false); trackClose("tooltip", "blur"); } }}
        onPointerDown={(e) => { swallow(e); lp.onPointerDown?.(); }}
        onPointerUp={(e) => { swallow(e); lp.onPointerUp?.(); }}
        onPointerLeave={(e) => { swallow(e); lp.onPointerLeave?.(); }}
        onTouchEnd={(e) => { swallow(e); lp.onTouchEnd?.(); }}
        onTouchCancel={(e) => { swallow(e); lp.onTouchCancel?.(); }}
      >
        {children}
      </span>

      {/* Portaled, clamped tooltip that stays open while hovered */}
      {openTip && pos && createPortal(
        <motion.div
          id={id}
          ref={tipRef}
          role="tooltip"
          style={{ position: "fixed", top: pos.top, left: pos.left, width: 280, zIndex: 100000 }}
          className="rounded-lg bg-black/90 text-white text-xs p-2 shadow-xl pointer-events-auto cursor-pointer hover:bg-white/5 hover:ring-1 hover:ring-white/20"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={reduce ? { duration: 0.12 } : { type: "tween", duration: 0.16 }}
          onMouseEnter={() => setHoveringTip(true)}
          onMouseLeave={() => { setHoveringTip(false); setOpenTip(false); trackClose("tooltip", "tip_leave"); }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenTip(false); messengerHandoff({ source: handoffSource || "disclosure-inline", intent: "discuss", faceId, title: item.title, narrative: item.detail?.[0] || undefined, anchorEl: linkRef.current || undefined, meta: { glossaryKey, ...(handoffMeta || {}) }, }); track("sheet", "click"); trackClose("tooltip", "promote_to_messenger"); }}
        >
          <div className="font-medium mb-0.5">{item.title}</div>
          <div className="opacity-80">{item.quick}</div>
          {/* Entire tooltip surface is clickable; no explicit link */}
        </motion.div>,
        (typeof document !== "undefined" ? (document.querySelector("#dashboard-overlay") || document.body) : undefined) as Element
      )}

      {/* Inline sheet deprecated in favor of Messenger handoff */}
    </span>
  );
}
