import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function FocusOverlay({
  title = "Details",
  isOpen,
  onClose,
  children,
  allowBlur = false,
}: {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  allowBlur?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // scroll lock
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // inert background
    const root = document.getElementById("root");
    if (root) {
      root.setAttribute("aria-hidden", "true");
      (root as HTMLElement).setAttribute("inert", "");
    }
    // focus save
    lastActive.current = document.activeElement;
    // focus to overlay
    const t = setTimeout(() => {
      overlayRef.current?.focus();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // very small focus trap
      if (e.key === "Tab") {
        const container = overlayRef.current;
        if (!container) return;
        const focusables = Array.from(container.querySelectorAll<HTMLElement>(
          'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
        )).filter((el) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) {
          e.preventDefault();
          container.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      if (root) {
        root.removeAttribute("aria-hidden");
        root.removeAttribute("inert");
      }
      document.removeEventListener("keydown", onKey);
      // restore focus
      const el = lastActive.current as HTMLElement | null;
      el?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdropSupports =
    typeof CSS !== "undefined" && typeof CSS.supports === "function"
      ? CSS.supports("backdrop-filter", "blur(6px)")
      : false;
  const backdropCls = allowBlur && backdropSupports
    ? "bg-black/40 backdrop-blur-sm"
    : "bg-black/60"; // opacity-only fallback

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropCls}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-[92vw] md:w-[80vw] lg:w-[60vw] max-h-[86vh] rounded-2xl bg-onyx2 border border-white/10 shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-medium">{title}</h2>
          <button onClick={onClose} className="size-9 rounded-lg bg-white/6 hover:bg-white/10" aria-label="Close">✕</button>
        </div>
        <div
          ref={overlayRef}
          tabIndex={-1}
          className="outline-none"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
