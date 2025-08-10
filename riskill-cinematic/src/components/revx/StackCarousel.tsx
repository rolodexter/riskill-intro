import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { emit } from "../../utils/telemetry";

type SlideMeta = {
  key: string;
  title: string;
  tone: "neutral" | "blue" | "purple" | "amber" | "emerald";
};

const slides: SlideMeta[] = [
  { key: "inputs", title: "Raw Inputs", tone: "neutral" },
  { key: "llm", title: "Language • LLM", tone: "blue" },
  { key: "vision", title: "Vision", tone: "purple" },
  { key: "symbolic", title: "Symbolic Logic", tone: "amber" },
  { key: "synthesis", title: "Synthesis", tone: "emerald" },
];

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
    emit("revx.slide_change", { index, slide: slides[index].key }, { sampleRate: 0.5 });
  }, [index, onSlideChange]);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  };
  const next = () => {
    setDirection(1);
    setIndex((i) => Math.min(slides.length - 1, i + 1));
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
      <div className="relative z-10 flex items-center justify-between mb-3">
        <h3 className="text-base md:text-lg font-medium">{slides[index].title}</h3>
        <div className="flex items-center gap-2">
          <button className="size-9 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10" onClick={prev} aria-label="Previous" disabled={index===0}>←</button>
          <button className="size-9 rounded-lg bg-white/6 border border-white/10 hover:bg-white/10" onClick={next} aria-label="Next" disabled={index===slides.length-1}>→</button>
        </div>
      </div>

      {/* Segmented progress tracker */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between gap-1">
          {slides.map((s, i) => {
            const active = i === index;
            const passed = i < index;
            const tone = toneStyles[s.tone];
            return (
              <motion.div
                key={s.key}
                className={`h-1.5 rounded ${passed || active ? tone.bar : 'bg-white/10'}`}
                style={{ width: `${100 / slides.length}%` }}
                initial={false}
                animate={{ scaleY: active ? 1.3 : 1, filter: active ? 'brightness(1.2)' : 'none' }}
                transition={{ duration: 0.18 }}
              />
            );
          })}
        </div>
      </div>

      {/* Body grid: content + reserved AgentBubble slot; avatar floats in corner */}
      <div className="relative">
        {/* Agent pulse avatar (visual anchor) */}
        <AgentPulse tone={slides[index].tone} className="absolute right-0 -top-4 md:-top-6 z-20" />

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
                <SlidePlaceholder index={index} tone={slides[index].tone} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Reserved AgentBubble slot (persistent) */}
          <div className="hidden md:block">
            <div className="sticky top-2 h-[140px] rounded-xl border border-white/10 bg-onyx2/80 backdrop-blur-xs" aria-label="Agent bubble placeholder" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Visual placeholder content per slide ---
function SlidePlaceholder({ index, tone }: { index: number; tone: SlideMeta["tone"]; }) {
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
      <div className="text-xs md:text-sm text-textSec">OCR snippets (redacted) flowing in…</div>
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

function SynthesisPreview({ tone }: { tone: SlideMeta["tone"]; }) {
  const target = Math.floor(290000 + Math.random() * 50000);
  return (
    <div className="flex items-center justify-between">
      <div className="text-textSec text-xs md:text-sm">MRR (placeholder)</div>
      <TickerNumber value={target} tone={tone} />
    </div>
  );
}

// --- Agent Pulse Avatar ---
function AgentPulse({ tone, className = "" }: { tone: SlideMeta["tone"]; className?: string }) {
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
function TickerNumber({ value, tone }: { value: number; tone: SlideMeta["tone"]; }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `$${Math.round(v).toLocaleString()}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.8, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [value, mv]);
  const color = tone === "blue" ? "text-blue-300" : tone === "purple" ? "text-purple-300" : tone === "amber" ? "text-amber-200" : tone === "emerald" ? "text-emerald-200" : "text-white/90";
  return <motion.span className={`text-lg md:text-xl font-semibold tabular-nums ${color}`}>{text}</motion.span>;
}
