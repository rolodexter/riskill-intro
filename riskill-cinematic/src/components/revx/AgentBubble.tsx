import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REVX_UI } from "../../content/revx";

export function AgentBubble({
  open,
  onOpen,
  onClose,
  onLearnMore,
  density,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLearnMore: () => void;
  density: "xs" | "sm" | "md" | "lg";
}) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [alignRight, setAlignRight] = useState(true);

  // Collision-aware placement on mount/update
  useLayoutEffect(() => {
    if (!open) return;
    const el = bubbleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const overflowRight = rect.right > window.innerWidth - 8;
    if (overflowRight) setAlignRight(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Notify when opened
  useEffect(() => {
    if (open) onOpen();
  }, [open, onOpen]);

  const isCompact = density === "xs" || density === "sm";
  const copy = isCompact
    ? REVX_UI.bubble.copy_compact
    : REVX_UI.bubble.copy_full;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={bubbleRef}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={
            "absolute z-20 max-w-[320px] " +
            (alignRight ? "right-3 top-11" : "left-3 top-11")
          }
          role="dialog"
          aria-modal="false"
          aria-label={REVX_UI.bubble.aria_label}
        >
          <div className="rounded-xl bg-onyx2/95 backdrop-blur-xs border border-white/10 shadow-glass p-3 md:p-4 text-xs md:text-sm text-textPri">
            <div className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-0.5 text-white/80">
                <svg viewBox="0 0 24 24" className="size-4">
                  <path d="M12 5l6 3-6 3-6-3 6-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 15l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <p className="leading-snug">
                {copy} <span className="hidden md:inline">{REVX_UI.bubble.prompt_stack}</span>
              </p>
            </div>
            <div className="flex justify-end mt-3">
              <button
                className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onLearnMore();
                }}
                aria-label={REVX_UI.bubble.learn_more}
              >
                {REVX_UI.bubble.learn_more}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
