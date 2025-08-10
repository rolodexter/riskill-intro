import CardWidget from "./CardWidget";
import { useResizeDensity } from "./useResizeDensity";

export default function OpsHealth() {
  const { ref, bp } = useResizeDensity();
  const numberCls =
    bp === "xs" ? "text-[20px]" : bp === "sm" ? "text-[22px]" : bp === "md" ? "text-2xl" : "text-3xl";
  const dialSize = bp === "xs" ? "h-8 w-8" : bp === "sm" ? "h-9 w-9" : bp === "md" ? "h-10 w-10" : "h-11 w-11";

  return (
    <div ref={ref}>
      <CardWidget title="Ops Health" subtitle="Score">
        <div className="flex items-center justify-between">
          <div className={`${dialSize} rounded-full bg-white/5 border border-white/10`} />
          <div className={`${numberCls} font-semibold tabular-nums`}>—</div>
        </div>
      </CardWidget>
    </div>
  );
}
