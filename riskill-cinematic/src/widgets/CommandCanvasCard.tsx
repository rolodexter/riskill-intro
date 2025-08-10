import CardWidget from "./CardWidget";
import { useResizeDensity } from "./useResizeDensity";

export default function CommandCanvasCard() {
  const { ref, bp } = useResizeDensity();
  const padX = bp === "xs" ? "px-3" : bp === "sm" ? "px-3.5" : bp === "md" ? "px-4" : "px-5";
  const padY = bp === "xs" ? "py-2" : bp === "sm" ? "py-2.5" : bp === "md" ? "py-3" : "py-3";
  const text = bp === "xs" ? "text-[13px]" : bp === "sm" ? "text-[14px]" : "text-[15px]";
  return (
    <div ref={ref}>
      <CardWidget title="Command Canvas" subtitle={bp === "xs" ? undefined : "Ask / Act"} interactive onPrimaryAction={() => {}}>
        <div className="space-y-3">
          <input
            placeholder="Ask Riskill…"
            className={`w-full ${padX} ${padY} ${text} rounded-lg bg-white/6 border border-white/10 outline-none focus:ring-2 ring-accent/40`}
          />
          <div className="rounded-lg bg-white/5 border border-white/10 aspect-video" />
        </div>
      </CardWidget>
    </div>
  );
}
