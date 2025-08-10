import CardWidget from "./CardWidget";
import { useResizeDensity } from "./useResizeDensity";

export default function AgentActivity() {
  const { ref, bp } = useResizeDensity();
  const numberCls =
    bp === "xs" ? "text-[20px]" : bp === "sm" ? "text-[22px]" : bp === "md" ? "text-2xl" : "text-3xl";
  const meterW = bp === "xs" ? "w-20" : bp === "sm" ? "w-24" : bp === "md" ? "w-28" : "w-32";

  return (
    <div ref={ref}>
      <CardWidget title="Agent Activity" subtitle="Online">
        <div className="flex items-center justify-between">
          <span className={`${numberCls} font-semibold tabular-nums`}>—</span>
          <div className={`h-4 ${meterW} rounded bg-white/5`} />
        </div>
      </CardWidget>
    </div>
  );
}
