import { useMemo, useState } from "react";
import CardWidget from "./CardWidget";
import { QuickAction } from "./QuickAction";
import { useResizeDensity } from "./useResizeDensity";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { AgentBubble } from "../components/revx/AgentBubble";
import { FocusOverlay } from "../components/revx/FocusOverlay";
import { StackCarousel } from "../components/revx/StackCarousel";
import { emit } from "../utils/telemetry";
import { REVX_UI } from "../content/revx";

export default function RevenuePulse() {
  const { ref, bp } = useResizeDensity();
  const numberCls =
    bp === "xs" ? "text-[20px]" : bp === "sm" ? "text-[22px]" : bp === "md" ? "text-2xl" : "text-3xl";
  const sparkW = bp === "xs" ? "w-24" : bp === "sm" ? "w-28" : bp === "md" ? "w-32" : "w-36";
  const revx = useFeatureFlag("revx");
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const deviceClass = bp === "lg" ? "desktop" : bp === "md" ? "tablet" : "mobile";
  const placeholderMRR = useMemo(() => 312420, []);
  const onLearnMore = () => {
    setOverlayOpen(true);
    emit("revx.learn_more", { deviceClass, density: bp });
    emit("revx.overlay_open", { deviceClass, density: bp });
  };
  const onCtaClick = () => {
    emit("revx.cta_click", { deviceClass, density: bp });
  };
  return (
    <div ref={ref} className={bubbleOpen ? "relative z-40" : undefined}>
      <CardWidget
        title="Revenue"
        subtitle={bp === "xs" ? undefined : "Last 24h"}
        interactive
        onPrimaryAction={() => emit("revenue.detail_open", { deviceClass, density: bp })}
        actions={
          <>
            <QuickAction label="Drill in" onClick={() => emit("revenue.drill", { deviceClass, density: bp })}>↘︎</QuickAction>
            <QuickAction label="Export" onClick={() => emit("revenue.export", { deviceClass, density: bp })}>⤓</QuickAction>
            {revx && (
              <QuickAction label={REVX_UI.actions.explore_stack} onClick={() => onLearnMore()}>
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 text-white/80"
                  aria-hidden="true"
                >
                  <path d="M12 5l6 3-6 3-6-3 6-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 15l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </QuickAction>
            )}
            {revx && (
              <button
                type="button"
                aria-label={REVX_UI.actions.bubble_toggle_aria}
                className="size-7 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10"
                aria-expanded={bubbleOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !bubbleOpen;
                  setBubbleOpen(next);
                  if (next) emit("revx.bubble_open", { deviceClass, density: bp });
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setBubbleOpen(true);
                }}
                title={REVX_UI.actions.bubble_toggle_title}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 text-white/80"
                  aria-hidden="true"
                >
                  <path d="M12 5l6 3-6 3-6-3 6-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 15l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </>
        }
      >
        <div className="relative">
          <div className="flex items-end justify-between">
            <div className={`${numberCls} font-semibold tabular-nums`}>
              {placeholderMRR.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
            </div>
            <div className={`h-10 ${sparkW} rounded bg-white/5`} />
          </div>
          {revx && (
            <>
              {bubbleOpen && (
                <div
                  className="absolute inset-0 z-10"
                  aria-hidden
                  onClick={(e) => {
                    e.stopPropagation();
                    setBubbleOpen(false);
                  }}
                />
              )}
              <AgentBubble
                open={bubbleOpen}
                onOpen={() => setBubbleOpen(true)}
                onClose={() => setBubbleOpen(false)}
                onLearnMore={() => {
                  setBubbleOpen(false);
                  onLearnMore();
                }}
                density={bp}
              />
            <FocusOverlay
              title={REVX_UI.overlay.title}
              isOpen={overlayOpen}
              onClose={() => {
                setOverlayOpen(false);
                emit("revx.overlay_close", { deviceClass, density: bp });
              }}
              allowBlur={false}
              ctaLabel={REVX_UI.overlay.cta_label}
              onCta={onCtaClick}
            >
              <StackCarousel
                onSlideChange={(i) => emit("revx.slide_change", { deviceClass, density: bp, slideIndex: i })}
              />
            </FocusOverlay>
          </>
        )}
        </div>
      </CardWidget>
    </div>
  );
}
