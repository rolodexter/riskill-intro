import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { emit } from "../../utils/telemetry";
import { REVX_STAGES, REVX_UI } from "../../content/revx";
import type { RevxTone } from "../../content/revx";

type Stage = typeof REVX_STAGES[number];
const stages: Stage[] = REVX_STAGES;

export function StackCarousel({
  onSlideChange,
}: {
  onSlideChange?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward (left), -1 = back (right)
  const startX = useRef<number | null>(null);

  useEffect(() => {
    onSlideChange?.(index);
    // lightweight sampled telemetry (no PII)
    emit("revx.slide_change", { index, slide: stages[index].id }, { sampleRate: 0.5 });
  }, [index, onSlideChange]);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  };
  const next = () => {
    setDirection(1);
    setIndex((i) => Math.min(stages.length - 1, i + 1));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
    }
    startX.current = null;
  };

  const toneStyles = useMemo(() => ({
    neutral: {
      glow: "shadow-white/10",
      ring: "ring-white/10",
      bar: "bg-white/12",
    },
    blue: {
      glow: "shadow-blue-400/30",
      ring: "ring-blue-400/40",
      bar: "bg-blue-400/60",
    },
    purple: {
      glow: "shadow-purple-400/30",
      ring: "ring-purple-400/40",
      bar: "bg-purple-400/60",
    },
    amber: {
      glow: "shadow-amber-300/30",
      ring: "ring-amber-300/40",
      bar: "bg-amber-300/70",
    },
    emerald: {
      glow: "shadow-emerald-300/30",
      ring: "ring-emerald-300/40",
      bar: "bg-emerald-300/70",
    },
  } as const), []);

  return (
    <div className="p-4 md:p-6" onKeyDown={onKeyDown} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Header + controls */}
      <div className="relative z-10 mb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-medium flex items-center gap-2">
            <StageIcon name={stages[index].icon} />
            {stages[index].label}
          </h3>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10" onClick={prev} aria-label={REVX_UI.carousel.prev_label} disabled={index===0}>←</button>
            <button className="size-9 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10" onClick={next} aria-label={REVX_UI.carousel.next_label} disabled={index===stages.length-1}>→</button>
          </div>
        </div>
        {stages[index].copy?.xs && (
          <div className="text-[11px] md:text-xs text-textSec mt-1">{stages[index].copy?.xs}</div>
        )}
      </div>

      {/* Segmented progress tracker (clickable) */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center gap-1 py-2" role="tablist" aria-label={REVX_UI.carousel.tracker_aria_label}>
          {stages.map((s, i) => {
            const active = i === index;
            const passed = i < index;
            const tone = toneStyles[s.tone];
            const go = () => {
              if (i === index) return;
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            };
            return (
              <button
                key={s.id}
                type="button"
                className="group relative h-6 flex-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                onClick={go}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }}
                aria-label={s.label}
                aria-current={active ? "step" : undefined}
                role="tab"
              >
                <motion.span
                  className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded ${passed || active ? tone.bar : 'bg-white/10'}`}
                  initial={false}
                  animate={{ scaleY: active ? 1.3 : 1, filter: active ? 'brightness(1.2)' : 'none' }}
                  transition={{ duration: 0.18 }}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Body grid: content + reserved AgentBubble slot; avatar floats in corner */}
      <div className="relative">
        {/* Agent pulse avatar (visual anchor) */}
        <AgentPulse tone={stages[index].tone} className="absolute right-0 -top-4 md:-top-6 z-20" />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 items-stretch">
          {/* Slide content with directional transitions */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/3">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, x: direction === 1 ? 28 : -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 1 ? -28 : 28 }}
                transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                className="p-3 md:p-4"
              >
                <SlidePlaceholder index={index} tone={stages[index].tone} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Reserved AgentBubble slot (persistent) */}
          <div className="hidden md:block">
            <div className="sticky top-2 h-[140px] rounded-xl border border-white/10 bg-onyx2/80 backdrop-blur-xs" aria-label={REVX_UI.carousel.agent_placeholder_aria} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Visual placeholder content per slide ---
function SlidePlaceholder({ index, tone }: { index: number; tone: RevxTone; }) {
  if (index === 0) return <InputsList />;
  if (index === 1) return <LLMPreview />;
  if (index === 2) return <VisionPreview />;
  if (index === 3) return <SymbolicPreview />;
  return <SynthesisPreview tone={tone} />;
}

function InputsList() {
  const rows = Array.from({ length: 5 }).map((_, i) => ({ id: `TX-${1200 + i}`, amt: (Math.random() * 900 + 100).toFixed(2) }));
  return (
    <div className="text-xs md:text-sm text-textSec">
      <div className="grid grid-cols-[1fr_auto] gap-2 font-mono">
        {rows.map((r) => (
          <div key={r.id} className="contents">
            <div className="truncate">{r.id}</div>
            <div className="text-right tabular-nums">${r.amt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LLMPreview() {
  const sample = `{"section":"Revenue","notes":["Parsed 12 PDFs","Extracted tables","Validated totals" ]}`;
  return (
    <div className="text-xs md:text-sm">
      <div className="h-28 overflow-hidden rounded border border-white/10 bg-black/20">
        <motion.pre
          className="m-0 p-2 text-[11px] md:text-xs text-textSec whitespace-pre-wrap"
          initial={{ y: 10, opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {sample}
        </motion.pre>
      </div>
    </div>
  );
}

function VisionPreview() {
  return (
    <div className="flex items-center gap-3">
      <div className="size-16 rounded-lg bg-gradient-to-b from-purple-500/30 to-purple-300/20 border border-white/10" />
      <div className="text-xs md:text-sm text-textSec">{REVX_UI.carousel.vision_text}</div>
    </div>
  );
}

function SymbolicPreview() {
  return (
    <div className="text-xs md:text-sm text-textSec">
      <div className="flex items-center gap-3">
        <div className="h-10 flex-1 rounded bg-white/6" />
        <div className="h-10 w-24 rounded bg-white/6" />
      </div>
    </div>
  );
}

function SynthesisPreview({ tone }: { tone: RevxTone; }) {
  const target = Math.floor(290000 + Math.random() * 50000);
  return (
    <div className="flex items-center justify-between">
      <div className="text-textSec text-xs md:text-sm">{REVX_UI.carousel.synthesis_label}</div>
      <TickerNumber value={target} tone={tone} />
    </div>
  );
}

// --- Agent Pulse Avatar ---
function AgentPulse({ tone, className = "" }: { tone: RevxTone; className?: string }) {
  const color = tone === "blue" ? "ring-blue-400/60 shadow-blue-400/30" :
    tone === "purple" ? "ring-purple-400/60 shadow-purple-400/30" :
    tone === "amber" ? "ring-amber-300/70 shadow-amber-300/30" :
    tone === "emerald" ? "ring-emerald-300/70 shadow-emerald-300/30" :
    "ring-white/20 shadow-white/10";
  return (
    <motion.span
      aria-hidden
      className={`block size-6 md:size-7 rounded-full bg-white/10 border border-white/10 ring-2 ${color} shadow-lg ${className}`}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// --- Animated number ticker ---
function TickerNumber({ value, tone }: { value: number; tone: RevxTone; }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `$${Math.round(v).toLocaleString()}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [value, mv]);
  const color = tone === "blue" ? "text-blue-300" : tone === "purple" ? "text-purple-300" : tone === "amber" ? "text-amber-200" : tone === "emerald" ? "text-emerald-200" : "text-white/90";
  return <motion.span className={`text-lg md:text-xl font-semibold tabular-nums ${color}`}>{text}</motion.span>;
}

// --- Minimal micro-icons for stages ---
function StageIcon({ name, className = "size-4 text-white/80" }: { name: "layers" | "chip" | "eye" | "logic" | "synthesis"; className?: string }) {
  if (name === "layers") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path d="M12 5l6 3-6 3-6-3 6-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 15l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (name === "chip") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <rect x="7" y="7" width="10" height="10" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3v4M12 21v-4M3 12h4M21 12h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "eye") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    );
  }
  if (name === "logic") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path d="M4 8h8a4 4 0 010 8H4M16 12h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // synthesis
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4 16l6-8 4 6 6-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
